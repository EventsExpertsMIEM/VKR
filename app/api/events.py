from flask import Blueprint, jsonify, request, abort, send_from_directory
from flask_login import (login_required, login_user, logout_user, current_user)

from . import *
from ..logic import events as events_logic
from ..validation.validation import validate
from ..validation import schemas


bp = Blueprint('events', __name__)


@bp.route('/<int:e_id>', methods=['GET'])
def event_by_id(e_id):
    if current_user.is_authenticated:
        return jsonify(
            part=events_logic.check_participation(current_user.id, e_id),
            event=events_logic.get_event_info(e_id)
        )
    else:
        return jsonify(part='not joined',
                       event=events_logic.get_event_info(e_id))


@bp.route('/', methods=['POST'], strict_slashes=False)
@login_required
def create_event():
    data = validate(get_json(), schemas.event_create)
    last_id = events_logic.create_event(current_user.id, data)
    return make_ok(201, str(last_id))


@bp.route('/all', methods=['GET'])
def events():
    offset = request.args.get("offset", None)
    size = request.args.get("size", None)
    return jsonify(events_logic.get_events(offset, size))


# NEW

@bp.route('/<int:e_id>', methods=['PUT'])
@login_required
def put_event_by_id(e_id):
    if (
        current_user.service_status == 'user' and
        events_logic.check_participation(
            current_user.id, e_id
        ) not in ['creator', 'manager']
    ):
        return make_4xx(403, "No rights")
    data = validate(get_json(), schemas.event_update)
    events_logic.update_event(e_id, data)
    return make_ok(200, 'Successfully updated')


@bp.route('/<int:e_id>', methods=['DELETE'])
@login_required
def delete_event_by_id(e_id):
    if (current_user.service_status == 'user' and
        events_logic.check_participation(current_user.id, e_id) != 'creator'):
        return make_4xx(403, "No rights")
    events_logic.delete_event(e_id)
    return make_ok(200, 'Successfully deleted')


@bp.route('/<int:e_id>/manager', methods=['GET'])
@login_required
def get_manger_for_event(e_id):
    if events_logic.check_participation(current_user.id, e_id) != 'creator':
        return make_4xx(403, "No rights")
    manager_email = events_logic.get_manager_for_event(e_id)
    return make_ok(200, manager_email)


@bp.route('/<int:e_id>/manager', methods=['POST'])
@login_required
def add_manager_to_event(e_id):
    email = validate(get_json(), schemas.event_add_manager)['email']
    if events_logic.check_participation(current_user.id, e_id) != 'creator':
        return make_4xx(403, "No rights")
    action = events_logic.add_manager(e_id, email)
    return make_ok(200, 'Successfully ' + action + ' manager')


@bp.route('/<int:e_id>/manager', methods=['DELETE']) # DA EB TVOU MAT'...
@login_required
def delete_manager_from_event(e_id):
    if events_logic.check_participation(current_user.id, e_id) != 'creator':
        return make_4xx(403, "No rights")
    action = events_logic.delete_manager(e_id)
    return make_ok(200, 'Successfully deleted manager')


@bp.route('/<int:e_id>/join', methods=['POST'])
@login_required
def join(e_id):
    data = validate(get_json(), schemas.event_join)
    events_logic.join_event(current_user.id, e_id, data)
    return make_ok(200, 'Successfully joined')

# @bp.route('/<int:e_id>/presenters', methods=['GET'])
# def presenters(e_id):
#     return jsonify(events_logic.get_presenters(e_id))

@bp.route('/<int:e_id>/participants', methods=['GET'])
@login_required
def participants(e_id):
    return jsonify(events_logic.get_participants_for_event(e_id, current_user.id))
