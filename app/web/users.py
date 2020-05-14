from flask import (Blueprint, request, redirect, url_for,
                   render_template, jsonify, abort)
from flask_login import (login_required, login_user, logout_user, current_user)

from ..logic import users as users_logic
from ..logic import education as education_logic

import logging


bp = Blueprint('users_web', __name__)


@bp.route('/profile')
@login_required
def profile():
    education = education_logic.get_user_education(current_user.id)
    return render_template(
        '/profile.html',
        current_user=current_user,
        education=education,
    )
