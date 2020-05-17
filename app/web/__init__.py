from flask import (Blueprint, request, redirect, url_for,
                   render_template, jsonify, abort)
from flask_login import (login_required, login_user, logout_user, current_user)

import logging
import traceback

from ..mails import send_500_email


def web_401(e):
    logging.warning('401 - [{}]'.format(e))
    response = redirect(url_for('accounts_web.login', next=request.path))
    return response


def web_404(e, param):
    logging.warning('404 - [{}]'.format(e.description))
    message = "Page not found"
    if param == "ENF":
        message = "Event with this id not found"

    return render_template(
       '/404.html',
        current_user=current_user,
        message=message,
    ), 404


def web_500(e):
    logging.warning('500 - [{}]'.format(e.description))
    message = traceback.format_exc()
    err = traceback.format_exc()
    send_500_email(e, err)
    return render_template(
       '/500.html',
        current_user=current_user,
        message=message,
    ), 500