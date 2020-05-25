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


# NEW


def create_task(e_id, data):
    with get_session() as s:
        event = s.query(Event).get(e_id)
        if not event or event.status not in ['active', 'closed']:
            abort(404, 'No event with this id')

        task = ETask(
            e_id=e_id,
            name=data['name'],
            description=data['description'],
            deadline=data['deadline']
        )
        s.add(task)


def delete_task(t_id):
    with get_session() as s:

        task = s.query(ETask).get(t_id)

        if not task or task.status == 'deleted':
            abort(404, 'No task with this id')

        task.status = 'deleted'


def move_task(e_id, t_id, status):
    with get_session() as s:
        event = s.query(Event).get(e_id)
        if not event or event.status == 'deleted':
            abort(404, 'No event with this id')

        task = s.query(ETask).filter(
                ETask.id == t_id,
                ETask.e_id == e_id
        ).one_or_none()

        if not task or task.status == 'deleted':
            abort(404, 'No task with this id')
        if task.status == status:
            abort(409, 'Task already have this status')

        task.status = status


def get_tasks(e_id):
    with get_session() as s:
        event = s.query(Event).get(e_id)
        if not event or event.status == 'deleted':
            abort(404, 'No event with this id')

        tasks = s.query(ETask).filter(
                ETask.status != 'deleted',
                ETask.e_id == e_id
        ).all()

        return [
            {
                'id': task.id,
                'name': task.name,
                'description': task.description,
                'deadline':
                    task.deadline.isoformat() if task.deadline is not None
                    else None,
                'status': task.status
            } for task in tasks
        ]


def update_task(t_id, data):
    with get_session() as s:
        task = s.query(ETask).get(t_id)

        if not task or task.status == 'deleted':
            abort(404, 'No task with this id')

        for arg in data.keys():
            setattr(task, arg, data[arg])
