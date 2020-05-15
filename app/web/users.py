from flask import (Blueprint, request, redirect, url_for,
                   render_template, jsonify, abort)
from flask_login import (login_required, login_user, logout_user, current_user)

from ..logic import users as users_logic

import logging

bp = Blueprint('users_web', __name__)


@bp.route('/profile')
@login_required
def profile():
    return render_template(
        '/profile.html',
        current_user=current_user,
        events = {
            'viewer': users_logic.get_user_events_by_role(
                current_user.id, 'viewer',
                0, 10
            ),
            'presenter': users_logic.get_user_events_by_role(
                current_user.id, 'presenter',
                0, 10
            ),
            'manager': users_logic.get_user_events_by_role(
                current_user.id, 'manager',
                0, 10
            ),
            'creator': users_logic.get_user_events_by_role(
                current_user.id, 'creator',
                0, 10
            ),
        }
    )
