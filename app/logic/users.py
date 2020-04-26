from ..config import cfg
from ..db import *
from .. import util
import logging

from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc

from flask import abort
from datetime import datetime
import requests
import os
import nanoid


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

        events = s.query(Participation, Event).filter(
                Participation.e_id == Event.id,
                Participation.u_id == u_id,
                Participation.participation_role == role
        ).order_by(desc(Event.start_date))

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

        for participant, event in events:
            result.append({
                'id': event.id,
                'name': event.name,
                'status': event.status,
                'start_date': event.start_date.isoformat()
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
            getattr(user, arg)
            if arg in ['email', 'password', 'id', 'status', 'confirmation_link', 'cookie_id', 'service_status', 'registration_date', 'disable_date']:
                abort(400, "Can't change this field(s)")
            if arg is 'birth':
                birth = data[arg].split('-')
                birth_date = date(int(birth[0]), int(birth[1]), int(birth[2]))
                setattr(user, arg, birth_date)
            else:
                setattr(user, arg, data[arg])


# админка

def get_users(offset, size):
    result = []
    with get_session() as s:
        users = s.query(User)
        if offset and size:
            offset = int(offset)
            size = int(size)
            if offset < 0 or size < 1:
                abort(422, 'Offset or size has wrong values')
            users = users.slice(offset, offset+size)
        elif not offset and not size:
            users = users.all()
        else:
            abort(400, 'Wrong query string arg')
        for user in users:
            result.append({
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'surname': user.surname,
                'service_status': user.service_status,
                'status': user.status
            })
    return result
