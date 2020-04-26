from flask import Blueprint, jsonify, request, make_response
from flask_login import (login_required, login_user, logout_user,
                         login_fresh, current_user)

import bcrypt

from . import *
from ..logic import users as users_logic


bp = Blueprint('users', __name__, url_prefix='/user')


@bp.route('/', methods=['GET'])
@login_required
def user():
    return jsonify(users_logic.get_user_info(current_user.id))


@bp.route('/', methods=['PUT'])
@login_required
def update_profile():
    data = get_json()
    users_logic.update_profile(current_user.id, data)
    return make_ok(200, 'Profile info successfully updated')


@bp.route('/events/creator', methods=['GET'])
@bp.route('/events/manager', methods=['GET'])
@bp.route('/events/presenter', methods=['GET'])
@bp.route('/events/viewer', methods=['GET'])
@login_required
def user_events():
    role=request.path[request.path.rfind('/') + 1:]
    offset = request.args.get("offset", "")
    size = request.args.get("size", "")
    return jsonify(users_logic.get_user_events_by_role(current_user.id,
                                                       role, offset, size)
    )


# админка

@bp.route('/all', methods=['GET'])
@login_required
def users_all():
    if current_user.service_status is 'user':
        return make_4xx(403, "No rights")
    offset = request.args.get("offset", "")
    size = request.args.get("size", "")
    return jsonify(users_logic.get_users(offset, size))


@bp.route('/<int:u_id>', methods=['GET'])
@login_required
def user_by_id(u_id):
    if current_user.service_status is 'user':
        return make_4xx(403, "No rights")
    return jsonify(users_logic.get_user_info(u_id))


@bp.route('/<int:u_id>/events/creator', methods=['GET'])
@bp.route('/<int:u_id>/events/manager', methods=['GET'])
@bp.route('/<int:u_id>/events/presenter', methods=['GET'])
@bp.route('/<int:u_id>/events/viewer', methods=['GET'])
@login_required
def user_by_id_events(u_id):
    if current_user.service_status is 'user':
        return make_4xx(403, "No rights")
    role=request.path[request.path.rfind('/') + 1:]
    offset = request.args.get("offset", "")
    size = request.args.get("size", "")
    return jsonify(users_logic.get_user_events_by_role(u_id, role, offset, size))
