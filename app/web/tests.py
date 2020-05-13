from flask import (Blueprint, request, redirect, url_for,
                   render_template, jsonify, abort)
from flask_login import (login_required, login_user, logout_user, current_user)

import logging
from ..mails import send_confirm_email


bp = Blueprint('tests_web', __name__)


@bp.route('/test1')
def test1():
    return render_template(
        '/test.html',
        current_user=current_user
    )


@bp.route('/get_html')
def get_html():
    return render_template(
        '/get_html.html', kek="kekkekekekekek"
    )


@bp.route('/get_html2')
def get_html2():
    return render_template(
        '/get_html2.html', kek="tttttttttttttttttttttt"
    )
