from flask import (Blueprint, request, redirect, url_for,
                   render_template, jsonify, abort)
from flask_login import (login_required, login_user, logout_user, current_user)

import logging
from ..mails import send_confirm_email


bp = Blueprint('tests_web', __name__)


@bp.route('/test1')
def test1():
    send_confirm_email("kek@kek.kek", "link")
    return render_template(
        '/blank.html',
        current_user=current_user
    )
