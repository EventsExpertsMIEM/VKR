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


def get_event_info(e_id):
    with get_session() as s:
        event = s.query(Event, Participation, User).filter(
                Event.id == e_id,
                Participation.e_id == Event.id,
                Event.status == 'active',
                Participation.u_id == User.id,
                Participation.participation_role == 'creator'
        ).first()

        if not event:
            abort(404, 'No event with this id')

        return {
            "creator_email": event.User.email,
            "phone": event.User.phone,
            "name": event.Event.name,
            "sm_description": event.Event.sm_description,
            "description": event.Event.description,
            "start_date": event.Event.start_date.isoformat(),
            "end_date": event.Event.end_date.isoformat(),
            "start_time": event.Event.start_time.isoformat(),
            "location": event.Event.location,
            "site_link": event.Event.site_link,
            "additional_info": event.Event.additional_info
        }


def get_events(offset="", size=""):
    result = []
    with get_session() as s:
        events = s.query(Event).filter(Event.status == 'active').order_by(desc(Event.start_date))
        if offset and size:
            offset = int(offset)
            size = int(size)
            if offset < 0 or size < 1:
                abort(422, 'Offset or size has wrong values')
            events = events.slice(offset, offset+size)
        elif not offset and not size:
            events = events.all()
        else:
            abort(400, 'Wrong query string arg')

        for event in events:
            result.append({
                'id': event.id,
                'name': event.name,
                'sm_description': event.sm_description,
                'start_date': event.start_date.isoformat(),
                'end_date': event.end_date.isoformat(),
                'start_time': event.start_time.isoformat(),
                'location': event.location,
                'site_link': event.site_link
            })
    return result


def create_event(u_id, data):
    start_date = data['start_date'].split('-')
    date_start = date(int(start_date[0]), int(start_date[1]), int(start_date[2]))
    end_date = data['end_date'].split('-')
    date_end = date(int(end_date[0]), int(end_date[1]), int(end_date[2]))
    start_time = data['start_time'].split(':')
    time_start = time(int(start_time[0]), int(start_time[1]), 0, 0, timezone.utc)
    
    with get_session() as s:
        event = Event(name=data['name'], sm_description=data['sm_description'],
                      description=data['description'], start_date=date_start,
                      end_date=date_end, start_time=time_start,
                      location=data['location'], site_link=data['site_link'],
                      additional_info=data['additional_info'])
        s.add(event)
        s.flush()
        s.refresh(event)
        participation = Participation(e_id=event.id, u_id=u_id,
                                      participation_role='creator')
        s.add(participation)

        logging.info('Creating event [{}] [{}] [{}] [{}]'.format(data['name'],
                                                                 date_start,
                                                                 date_end,
                                                                 start_time))
        return event.id
