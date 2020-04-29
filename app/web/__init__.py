from flask import (Blueprint, request, redirect, url_for,
                   render_template, jsonify, abort)
from flask_login import (login_required, login_user, logout_user, current_user)

import logging
import traceback


def web_401(e):
    print("web 401")
    return redirect(url_for('accounts_web.login'))


def web_404(e, param):
    message = "Route not found"
    if param is "ENF":
        message = "Event with this id not found"

    return render_template(
       '/_404.html',
        current_user=current_user,
        message=message,
    ), 404
