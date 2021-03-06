from flask import (Blueprint, request, redirect, url_for,
                   render_template, jsonify, abort)
from flask_login import (login_required, login_user, logout_user, current_user)

from ..logic import (events as events_logic, reports as reports_logic,
                        tags as tags_logic)

import logging


bp = Blueprint('events_web', __name__)


@bp.route('/')
def home():
    events = events_logic.get_events()
    return render_template(
        '/home.html',
        current_user=current_user,
        events=events,
        tags=tags_logic.get_all_tags()
    )

@bp.route('/search')
def search():
    name = request.args.get('name')
    tags = request.args.get('tags')
    events = events_logic.search(name, tags)
    return render_template(
        'fragments/events/events.html',
        events=events,
    )


@bp.route('/create_event')
@login_required
def create_event():
    return render_template(
        '/create_event.html',
        current_user=current_user,
        tags=tags_logic.get_all_tags()
    )


@bp.route('/event/<int:e_id>')
def event(e_id):
    event = events_logic.get_event_info(e_id)
    event['reports'] = reports_logic.get_reports_for_event(e_id)
    return render_template(
        '/event.html',
        event=event,
        current_user=current_user
    )
