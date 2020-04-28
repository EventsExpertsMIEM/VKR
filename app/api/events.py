from flask import Blueprint, jsonify, request, abort, send_from_directory
from flask_login import (login_required, login_user, logout_user, current_user)

from . import *
from ..logic import events as events_logic


bp = Blueprint('events', __name__)


@bp.route('/<int:e_id>', methods=['GET'])
def event_by_id(e_id):
    if current_user.is_authenticated:
        return jsonify(part=events_logic.check_participation(current_user.id, e_id),
                       event=events_logic.get_event_info(e_id))
    else:
        return jsonify(part='not joined',
                       event=events_logic.get_event_info(e_id))


@bp.route('/', methods=['POST'], strict_slashes=False)
@login_required
def create_event():
    data = get_json()
    last_id = events_logic.create_event(current_user.id, data)
    return make_ok(201, str(last_id))


@bp.route('/all', methods=['GET'])
def events():
    offset = request.args.get("offset", "")
    size = request.args.get("size", "")
    return jsonify(events_logic.get_events(offset, size))
