from flask import (Blueprint, request, redirect, url_for,
                   render_template, jsonify, abort)
from flask_login import (login_required, login_user, logout_user, current_user)

from . import *
from ..logic import events as events_logic

import logging


bp = Blueprint('events_web', __name__)


@bp.route('/')
def home():
    events = events_logic.get_events()
    return render_template(
        '/_events.html',
        current_user=current_user,
        events=events,
    )


@bp.route('/create_event')
@login_required
def create_event():
    form = CreateEventForm(request.form)
    return render_template(
        '/_create_event.html',
        form=form,
        current_user=current_user,
    )


@bp.route('/event/<string:e_id>')
def event(e_id):
    event = events_logic.get_event_info(e_id)

    return render_template(
        '/_event.html',
        event=event,
        current_user=current_user,
    )
