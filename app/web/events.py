from flask import (Blueprint, request, redirect, url_for,
                   render_template, jsonify, abort)
from flask_login import (login_required, login_user, logout_user,
                         login_fresh, current_user)

from . import forms
from ..logic import events as events_logic

import logging


bp = Blueprint('events_web', __name__)


@bp.route('/')
def home():
    events = events_logic.get_events(1, 20)
    return render_template(
        '_events.html',
        current_user=current_user,
        events=events,
    )


@bp.route('/create_event')
@login_required
def create_event():
    return render_template(
        '_create_event.html',
        current_user=current_user,
    )
