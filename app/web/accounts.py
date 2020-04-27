from flask import (Blueprint, request, redirect, url_for,
                   render_template, jsonify, abort)
from flask_login import (login_required, login_user, logout_user,
                         login_fresh, current_user)

from . import forms
from ..logic import accounts as accounts_logic

import logging


bp = Blueprint('accounts_web', __name__)


@bp.route('/login')
def login():
    if current_user.is_authenticated:
        return redirect(url_for('accounts_web.home'))
    form = forms.AuthForm(request.form)
    return render_template('_login.html', form=form)


@bp.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('accounts_web.home'))


@bp.route('/register')
def register():
    if current_user.is_authenticated:
        return redirect(url_for('accounts_web.home'))
    form = forms.RegisterForm(request.form)
    return render_template('_blank.html', form=form)


@bp.route('/')
def home():
    return render_template(
        '_blank.html',
        current_user=current_user,
    )
