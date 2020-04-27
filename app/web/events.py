from flask import (Blueprint, request, redirect, url_for,
                   render_template, jsonify, abort)
from flask_login import (login_required, login_user, logout_user,
                         login_fresh, current_user)

from . import forms
from ..logic import accounts as accounts_logic

import logging


bp = Blueprint('events_web', __name__)


@bp.route('/')
def home():
    return render_template(
        '_blank.html',
        current_user=current_user,
    )
