from ..config import cfg
from ..db import *

import logging

from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc

from flask import abort
from datetime import date, time, timezone
import requests
import os
import nanoid

# NEW

def get_user_info(u_id):
    with get_session() as s:
        user = s.query(User).get(u_id)
        if not user:
            abort(404, 'No user with this id')

        birth = None
        if user.birth is not None:
            birth = user.birth.isoformat()

        return {
            "email": user.email,
            "name": user.name,
            "surname": user.surname,
            "service_status": user.service_status,
            "phone": user.phone,
            "organization": user.organization,
            "position": user.position,
            "country": user.country,
            "town": user.town,
            "bio": user.bio,
            "birth": birth,
            "sex": user.sex,
        }


def get_user_events_by_role(u_id, role, offset, size):
    result = []
    with get_session() as s:
        user = s.query(User).get(u_id)
        if not user:
            abort(404, 'No user with this id')

        events = None

        if role == 'presenter':
            events = s.query(
                Participation,
                Event,
                Report
            ).join(
                Event,
                Event.id == Participation.e_id
            ).outerjoin(
                Report,
                Report.event_id == Event.id
            ).filter(
                    Participation.u_id == u_id,
                    Participation.participation_role == role
            ).order_by(desc(Event.start_date))
        else:
            events = s.query(Participation, Event).filter(
                    Participation.e_id == Event.id,
                    Participation.u_id == u_id,
                    Participation.participation_role == role
            ).order_by(desc(Event.start_date))

        if offset is not None and size is not None:
            offset = int(offset)
            size = int(size)
            if offset < 0 or size < 1:
                abort(422, 'Offset or size has wrong values')
            events = events.slice(offset, offset+size)
        elif not offset and not size:
            events = events.all()
        else:
            abort(400, 'Wrong query string arg')

        if role == 'presenter':
            for participant, event, report in events:
                report_dict = None
                if report is not None:
                    report_dict = {
                        'id': report.id,
                        'filename': report.original_filename,
                        'uploaded_at': report.uploaded_at,
                        'last_updated': report.last_updated,
                        'presenter_description': report.presenter_description,
                        'report_description': report.report_description,
                        'report_status': report.report_status
                    }
                result.append({
                    'id': event.id,
                    'name': event.name,
                    'status': event.status,
                    'start_date': event.start_date.isoformat(),
                    'end_date': event.end_date.isoformat(),
                    'location': event.location,
                    'report': report_dict
                })
        else:
            for participant, event in events:
                result.append({
                    'id': event.id,
                    'name': event.name,
                    'status': event.status,
                    'start_date': event.start_date.isoformat(),
                    'end_date': event.end_date.isoformat(),
                    'location': event.location
                })
    return result


def update_profile(u_id, data):
    with get_session() as s:
        user = s.query(User).filter(
                User.id == u_id,
                User.status == 'active',
        ).one_or_none()

        if not user:
            abort(404, 'No user with this id')
        for arg in data.keys():
            setattr(user, arg, data[arg])


# админка

def get_users(offset=None, size=None):

    try:
        if offset is not None:
            offset=int(offset)
        if size is not None:
            size=int(size)
    except:
        abort(400, 'Offset and size must be integers')

    logging.getLogger(__name__).debug("Offset: {}\tSize: {}".format(offset, size))

    with get_session() as s:
        users = s.query(User)
        if offset is not None and size is not None:
            if offset < 0 or size < 1:
                abort(422, 'Offset or size has wrong values')
            users = users.slice(offset, offset+size)
        elif offset is not None:
            users = users.offset(offset)
        elif size is not None:
            users = users.limit(size)
        elif offset is None and size is None:
            users = users.all()
        else:
            abort(400, 'Wrong query string arg')

        return [
            {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'surname': user.surname,
                'service_status': user.service_status,
                'status': user.status
            } for user in users
        ]