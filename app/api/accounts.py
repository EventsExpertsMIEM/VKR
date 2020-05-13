from flask import Blueprint, jsonify, request, abort
from flask_login import (login_required, login_user, logout_user, current_user)


from . import *
from ..logic import accounts as accounts_logic
from ..validation.validation import validate
from ..validation import schemas

bp = Blueprint('accounts', __name__)


@bp.route('/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return make_4xx(409, 'User is currently authenticated')

    data = validate(get_json(), schemas.login)
    logging.debug(data)
    user = accounts_logic.pre_login(data['email'], data['password'])
    login_user(user)
    return make_ok(200, 'User was logined')


@bp.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return make_ok(200, 'User was logouted')


@bp.route('/register', methods=['POST'])
def register():
    if current_user.is_authenticated:
        return make_4xx(409, 'User is currently authenticated')

    data = validate(get_json(), schemas.register)
    logging.debug(data)
    accounts_logic.register_user(data['email'], data['name'],
                                 data['surname'], data['password'])
    return make_ok(201, 'User was registered')


@bp.route('/confirm/<link>', methods=['GET'])
def confirm(link):
    accounts_logic.confirm_user(link)
    return make_ok(200, 'User was confirmed')


@bp.route('/reset_password', methods=['POST'])
def reset_password():
    data = validate(get_json(), schemas.reset_password)
    logging.debug(data)
    accounts_logic.reset_password(data['email'])
    return make_ok(200, 'Successfully reset password - see new in your email')


# NEW

@bp.route('/change_password', methods=['POST'])
@login_required #@fresh_login_required
def change_password():
    data = get_json()
    user = accounts_logic.change_password(current_user.id,
                                          data['old_password'],
                                          data['new_password'])
    login_user(user)
    return make_ok(200, 'Password has beed changed')


@bp.route('/close_all_sessions', methods=['POST'])
@login_required #@fresh_login_required
def close_all_sessions():
    data = get_json()
    user = accounts_logic.close_all_sessions(current_user.id, data['password'])
    login_user(user)
    return make_ok(200, 'Logout from all other sessions')


@bp.route('/delete', methods=['POST'])
@login_required #@fresh_login_required
def self_delete():
    data = get_json()
    accounts_logic.self_delete(current_user.id, data['password'])
    logout_user()
    return make_ok(200, 'Successfully delete account')


@bp.route('/status', methods=['GET'])
def user_status():
    is_auth = current_user.is_authenticated

    status = dict(is_logged_in=is_auth)
    if is_auth:
        status['info'] = {
            'id': current_user.id,
            'email': current_user.email,
            'name': current_user.name,
            'surname': current_user.surname,
            'service_status': current_user.service_status
        }

    return jsonify(status)


@bp.route('/user/<int:u_id>/ban', methods=['GET'])
@login_required
def ban_user_by_id(u_id):
    if current_user.service_status == 'user':
        return make_4xx(403, "No rights")
    accounts_logic.ban_user(u_id)
    return make_ok(200, 'Successfully baned this user')


@bp.route('/user/<int:u_id>/role/admin', methods=['GET'])
@login_required
def change_privileges_to_admin_by_id(u_id):
    if current_user.service_status != 'superadmin':
        return make_4xx(403, "No rights")
    role=request.path[request.path.rfind('/') + 1:]
    accounts_logic.change_privileges(u_id, role)
    return make_ok(200, 'Successfully changed privilegy of user')


@bp.route('/user/<int:u_id>/role/moderator', methods=['GET'])
@bp.route('/user/<int:u_id>/role/user', methods=['GET'])
@login_required
def change_privileges_by_id(u_id):
    if current_user.service_status not in ['superadmin', 'admin']:
        return make_4xx(403, "No rights")
    role=request.path[request.path.rfind('/') + 1:]
    accounts_logic.change_privileges(u_id, role)
    return make_ok(200, 'Successfully changed privilegy of user')
