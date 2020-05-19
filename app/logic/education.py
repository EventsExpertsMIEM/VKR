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


def create_user_education(u_id, data):
    with get_session() as s:
        user = s.query(User).filter(
                User.id == u_id,
                User.status == 'active',
        ).one_or_none()

        if not user:
            abort(404, 'No user with this id')

        edu = Education(country=data['country'],
                        city=data['city'],
                        university=data['university'],
                        department=data['department'],
                        program=data['program'],
                        mode=data['mode'],
                        status=data['status'],
                        graduation_year=data['graduation_year'],
                        u_id=u_id)
        s.add(edu)
        s.flush()
        s.refresh(edu)
        return edu.id


def delete_user_education(u_id, edu_id):
    with get_session() as s:
        user = s.query(User).filter(
                User.id == u_id,
                User.status == 'active',
        ).one_or_none()

        if not user:
            abort(404, 'No user with this id')

        edu_exists = s.query(Education).filter(
                Education.id == edu_id
        ).one_or_none()

        if not edu_exists:
            abort(404, 'No education fact for thin user with this id')

        s.delete(edu_exists)


def get_user_education(u_id):
    result = []
    with get_session() as s:
        user = s.query(User).filter(
                User.id == u_id,
                User.status == 'active',
        ).one_or_none()

        if not user:
            abort(404, 'No user with this id')

        education = s.query(Education).filter(
                Education.u_id == u_id
        ).all()

        for edu in education:
            result.append({
                'id': edu.id,
                'country': edu.country,
                'city': edu.city,
                'university': edu.university,
                'department': edu.department,
                'program': edu.program,
                'mode': edu.mode,
                'status': edu.status,
                'graduation_year': edu.graduation_year
            })
    return result
