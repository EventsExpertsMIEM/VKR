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

        edu_exists = s.query(Education).filter(
                Education.level_id == data['level'],
                Education.programme_id == data['programme'],
                Education.university == data['university'],
                Education.end_year == data['end_year'],
                Education.town == data['town'],
                Education.u_id == u_id
        ).one_or_none()

        if edu_exists:
            abort(409, 'This education fact is already exists')
        edu = Education(level_id=data['level'],
                        programme_id=data['programme'],
                        university=data['university'],
                        end_year=data['end_year'],
                        town=data['town'],
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

        education = s.query(Education, Higher_education_programme).filter(
                Education.u_id == u_id,
                Higher_education_programme.level == Education.level_id,
                Higher_education_programme.id == Education.programme_id,
        ).all()

        for edu, prog in education:
            result.append({
                'id': edu.id,
                'level': edu.level_id,
                'programme': edu.programme_id,
                'name': prog.name,
                'university': edu.university,
                'end_year': edu.end_year,
                'town': edu.town
            })
    return result


# temporary deprecated
#def get_higher_education_areas():
#    result = []
#    with get_session() as s:
#        areas = s.query(Higher_education_area).all()
#        for area in areas:
#            result.append({
#                'id': area.id,
#                'name': area.name
#            })
#    return result


def get_higher_education_programmes(level):
    result = []
    with get_session() as s:
        programmes = None
        if level == 'all':
            programmes = s.query(Higher_education_programme).all()
        elif level in ['бакалавриат', 'магистратура', 'специалитет', 'аспиратнура', 'ассистентура']:
            programmes = s.query(Higher_education_programme).filter(
                    Higher_education_programme.level == level
            ).all()
        else:
            abort(404, 'education level not found')
        for programme in programmes:
            data = {
                'id': programme.id,
                'name': programme.name
            }
            if level == 'all':
                data['level'] = programme.level
            result.append(data)
    return result
