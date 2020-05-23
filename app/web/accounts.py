from flask import (Blueprint, request, redirect, url_for,
                   render_template, jsonify, abort)
from flask_login import (login_required, login_user, logout_user, current_user)

from ..logic import accounts as accounts_logic

import logging


bp = Blueprint('accounts_web', __name__)


@bp.route('/login')
def login():
    if current_user.is_authenticated:
        return redirect(url_for('events_web.home'))
    return render_template(
        '/login.html'
    )


@bp.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('events_web.home'))


@bp.route('/register')
def register():
    if current_user.is_authenticated:
        return redirect(url_for('events_web.home'))
    return render_template(
        '/register.html'
    )


@bp.route('/confirm/<string:link>')
def confirm(link):
    return render_template(
        '_confirm.html',
    )


@bp.route('/reset_password')
def reset_password():
    if current_user.is_authenticated:
        return redirect(url_for('events_web.home'))
    return render_template(
        '/password_recovery.html'
    )

@bp.route('/reset_password/success')
def reset_password():
    if current_user.is_authenticated:
        return redirect(url_for('events_web.home'))
    return render_template(
        '/password_recovery_successful.html'
    )