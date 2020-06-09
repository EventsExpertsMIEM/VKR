from ..config import cfg
from ..db import *

import logging

from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc, or_

from flask import abort
from datetime import date, time, timezone
import requests
import os
import nanoid
import json

def update_event_status(event):
    now = datetime.utcnow().date()
    if event.start_date > now:
        event.status = 'active'
    elif event.start_date < now and event.end_date > now:
        event.status = 'closed'
    elif event.end_date < now:
        event.status = 'archived'
    return event

def get_event_info(e_id):
    with get_session() as s:
        result = s.query(Event, Participation, User).filter(
                Event.id == e_id,
                Participation.e_id == Event.id,
                Event.status != 'deleted',
                Participation.u_id == User.id,
                Participation.participation_role == 'creator'
        ).first()

        if not result:
            abort(404, 'No event with this id')

        event = update_event_status(result.Event)


        return {
            "id": e_id,
            "creator_email": result.User.email,
            # "phone": result.User.phone, Чего блять? Ты опять выходишь на связь, мудило?
            "name": event.name,
            "sm_description": event.sm_description,
            "description": event.description,
            "start_date": event.start_date.isoformat(),
            "end_date": event.end_date.isoformat(),
            "start_time": event.start_time.isoformat(),
            "location": event.location,
            "site_link": event.site_link,
            "additional_info": event.additional_info,
            "status": event.status,
            'tags': [ t.name for t in event.tags.all() ]
        }


def get_events(offset=None, size=None):

    try:
        if offset is not None:
            offset=int(offset)
        if size is not None:
            size=int(size)
    except:
        abort(400, 'Offset and size must be integers')

    with get_session() as s:
        events = s.query(
            Event
        ).filter(
            Event.status != 'deleted'
        ).order_by(
            desc(Event.start_date)
        )


        if offset is not None and size is not None:
            if offset < 0 or size < 1:
                abort(422, 'Offset or size has wrong values')
            events = events.slice(offset, offset+size)
        elif offset is not None:
            events = events.offset(offset)
        elif size is not None:
            events = events.limit(size)
        elif offset is None and size is None:
            events = events.all()
        else:
            abort(400, 'Wrong query string arg')

        return [
            {
                'id': event.id,
                'name': event.name,
                'sm_description': event.sm_description,
                'start_date': event.start_date.isoformat(),
                'end_date': event.end_date.isoformat(),
                'start_time': event.start_time.isoformat(),
                'location': event.location,
                'site_link': event.site_link,
                "status": event.status,
                'tags': [ t.name for t in event.tags.all() ]
            } for event in [update_event_status(event) for event in events]
        ]

def search(name, tags):
    if tags is not None:
        tags = json.loads(tags)
    with get_session() as s:
        query = s.query(Event)

        logging.getLogger(__name__).debug(
            '\n\tName: {}\n\tTags: {}'.format(name, tags)
        )
        
        if name is not None:
            query = query.filter(
                Event.name.ilike( # big butts and i cannot lie
                    '%{}%'.format(name.lower()) # you other brothers can't deny
                )
            )

        if tags is not None:
            query = query.filter(Event.tags.any(Tag.name.in_(tags)))

        events = query.order_by(Event.start_date).all()
        
        if len(events) == 0:
            abort(404, 'Nothing found')

        return [
            {
                'id': event.id,
                'name': event.name,
                'sm_description': event.sm_description,
                'start_date': event.start_date.isoformat(),
                'end_date': event.end_date.isoformat(),
                'start_time': event.start_time.isoformat(),
                'location': event.location,
                'site_link': event.site_link,
                "status": event.status,
                'tags': [ t.name for t in event.tags.all() ]
            } for event in [update_event_status(event) for event in events]
        ]

def create_event(u_id, data):
    with get_session() as s:
        if data['start_date'] > data['end_date']:
            abort(400, 'Incorrect dates')
        tags = []
        try:
            tags = [ s.query(Tag).filter(Tag.name == x).one() for x in data['tags']]
        except:
            abort(400, 'Invalid tags')
        event = Event(
            name=data['name'],
            sm_description=data['sm_description'],
            description=data['description'],
            start_date=data['start_date'],
            end_date=data['end_date'],
            start_time=data['start_time'],
            location=data['location'],
            site_link=data['site_link'],
            additional_info=data['additional_info']
        )

        event.tags = tags

        s.add(event)
        s.flush()
        s.refresh(event)
        participation = Participation(e_id=event.id, u_id=u_id,
                                        participation_role='creator')
        s.add(participation)

        logging.getLogger(__name__).info(
            'Creating event\n\tName: [{}]\n\tStart: [{}]\n\tEnd: [{}]\n\t'
            'Start time: [{}]'.format(
                data['name'],
                data['start_date'],
                data['end_date'],
                data['start_time']
            )
        )
        return event.id


# NEW

def add_manager(e_id, email):
    with get_session() as s:
        event = s.query(Event).get(e_id)
        if not event or event.status == 'deleted':
            abort(404, 'No event with this id')

        user = s.query(User).filter(
                User.email == email,
                User.status == 'active'
        ).one_or_none()
        if not user:
            abort(404, 'No user with this id')

        part = s.query(Participation).filter(
                Participation.u_id == user.id,
                Participation.e_id == e_id
        ).one_or_none()
        if part:
            abort(
                409,
                'User has already joined this event as [{}]'.format(
                    part.participation_role
                )
            )

        manager = s.query(Participation).filter(
                Participation.e_id == e_id,
                Participation.participation_role == 'manager'
        ).one_or_none()
        if not manager:
            add = Participation(e_id=e_id, u_id=user.id,
                                      participation_role='manager')
            s.add(add)
            return 'added'
        else:
            if manager.u_id == user.id:
                abort(409, 'User has already added as manager')
            manager.u_id = user.id
            return 'changed'


def delete_manager(e_id):
    with get_session() as s:
        event = s.query(Event).get(e_id)
        if not event or event.status == 'deleted':
            abort(404, 'No event with this id')

        manager = s.query(Participation).filter(
                Participation.e_id == e_id,
                Participation.participation_role == 'manager'
        ).one_or_none()
        if not manager:
            abort(409, 'Event has no manager')
        s.delete(manager)

def get_manager_for_event(e_id):
    with get_session() as s:
        event = s.query(Event).get(e_id)
        if not event or event.status == 'deleted':
            abort(404, 'No event with this id')

        manager = s.query(Participation).filter(
                Participation.e_id == e_id,
                Participation.participation_role == 'manager'
        ).one_or_none()
        if manager is not None:
            user = s.query(User).get(manager.u_id)
            return user.email
        else:
            abort(404, 'No manager for this event')

def update_event(e_id, data):
    with get_session() as s:
        event = s.query(Event).get(e_id)
        if not event or event.status == 'deleted':
            abort(404, 'No event with this id')

        tags = []
        try:
            tags = [
                s.query(Tag).filter(Tag.name == x).one() for x in data['tags']
            ]
        except:
            abort(400, 'Invalid tags')

        event.tags = tags
        for arg in data.keys():
            if arg == 'tags':
                continue
            setattr(event, arg, data[arg])


def delete_event(e_id):
    with get_session() as s:
        event = s.query(Event).get(e_id)
        if not event:
            abort(404, 'No event with this id')
        if event.status == 'deleted':
            abort(409, 'Event already deleted')
        event.status = 'deleted'


def check_participation(u_id, e_id):
    with get_session() as s:
        event = s.query(Event).get(e_id)
        if not event or event.status == 'deleted':
            abort(404, 'No event with this id')

        participation = s.query(Participation).filter(
                Participation.e_id == e_id,
                Participation.u_id == u_id
        ).one_or_none()
        if participation:
            return participation.participation_role
        else:
            return 'not joined'


# def get_presenters(e_id):
#     result = []
#     with get_session() as s:
#         event = s.query(Event).get(e_id)
#         if not event or event.status == 'deleted':
#             abort(404, 'No event with this id')
#         users = s.query(User, Participation).filter(
#                 User.id == Participation.u_id,
#                 Participation.e_id == e_id,
#                 Participation.participation_role == 'presenter',
#                 Participation.report_status == 'approved'
#         ).all()

#         for user, participant in users:
#             result.append({
#                 'name': user.name,
#                 'surname': user.surname,
#                 'report': participant.report,
#                 'presenter_description': participant.presenter_description,
#                 'report_description': participant.report_description
#             })

#     return result


def join_event(u_id, e_id, data):
    with get_session() as s:
        event = s.query(Event).get(e_id)
        if not event or event.status != 'active':
            abort(404, 'No active event found')

        already_joined = s.query(Participation).filter(
                Participation.u_id == u_id,
                Participation.e_id == e_id
        ).one_or_none()

        if already_joined:
            abort(
                409,
                'User has already joined this event as [{}]'.format(
                    already_joined.participation_role
                )
            )
        role = 'viewer'
        participation = Participation(e_id=e_id, u_id=u_id,
                                      participation_role='viewer')
        if data['role'] == 'presenter':
            role = 'presenter'
            participation.participation_role = role
        s.add(participation)
        logging.getLogger(__name__).info(
            'User [id {}] joined event [id {}] as [{}]'.format(
                u_id,
                e_id,
                role
            )
        )

def get_participants_for_event(e_id, u_id):
    result = {
        'participants': []
    }
    with get_session() as s:
        event = s.query(Event).get(e_id)
        if event is None or event.status == 'deleted':
            abort(404, 'No event with this id')
        participants = s.query(Participation).filter(
            Participation.e_id == e_id,
            Participation.u_id == u_id,
            or_(
                Participation.participation_role == 'creator',
                Participation.participation_role == 'manager'
            )
        ).all()
        if u_id not in [p.u_id for p in participants]:
            abort(403, 'Forbidden')
        users = s.query(User, Participation).filter(
                User.id == Participation.u_id,
                Participation.e_id == e_id,
                or_(
                    Participation.participation_role == 'viewer',
                    Participation.participation_role == 'presenter'
                )
        ).all()

        result['event'] = {
            'id': e_id,
            'name': event.name
        }

        for user, participation in users:
            result['participants'].append(
                {
                    'email': user.email,
                    'name': user.name,
                    'surname': user.surname,
                    'role': participation.participation_role,
                    'registration_date': participation.participation_date
                }
            )

    return result