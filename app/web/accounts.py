from flask import (Blueprint, request, redirect, url_for,
                   render_template, jsonify, abort)
from flask_login import (login_required, login_user, logout_user, current_user)

from . import *
from ..logic import accounts as accounts_logic

import logging


bp = Blueprint('accounts_web', __name__)


@bp.route('/blank')
def blank():
    return render_template(
        '/blank.html',
        current_user=current_user
    )


@bp.route('/login')
def login():
    if current_user.is_authenticated:
        return redirect(url_for('events_web.home'))
    form = LoginForm(request.form)
    return render_template('/_login.html', form=form)


@bp.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('events_web.home'))


@bp.route('/register')
def register():
    if current_user.is_authenticated:
        return redirect(url_for('events_web.home'))
    form = RegisterForm(request.form)
    return render_template('/_register.html', form=form)


@bp.route('/confirm/<string:link>')
def confirm(link):
    return render_template(
        '_confirm.html',
    )


@bp.route('/reset_password')
def reset_password():
    if current_user.is_authenticated:
        return redirect(url_for('events_web.home'))
    form = ResetForm(request.form)
    return render_template('/_reset_password.html', form=form)
