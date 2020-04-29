from flask import (Blueprint, request, redirect, url_for,
                   render_template, jsonify, abort)
from flask_login import (login_required, login_user, logout_user, current_user)

import logging
import traceback

from flask_wtf import FlaskForm
from wtforms import (BooleanField, StringField, PasswordField, validators,
                     TextAreaField, RadioField, IntegerField)


def web_401(e):
    print("web 401")
    return redirect(url_for('accounts_web.login'))


def web_404(e, param):
    message = "Page not found"
    if param is "ENF":
        message = "Event with this id not found"

    return render_template(
       '/_404.html',
        current_user=current_user,
        message=message,
    ), 404


class LoginForm(FlaskForm):
    mail = StringField('Mail', [validators.DataRequired()])
    password = PasswordField('Password', [validators.DataRequired()])


class RegisterForm(FlaskForm):
    mail = StringField('Email', [validators.DataRequired()])
    name = StringField('Name', [validators.DataRequired()])
    surname = StringField('Surname', [validators.DataRequired()])
    password = PasswordField('Password', [validators.DataRequired()])
    password_repeat = PasswordField('Password', [validators.DataRequired()])


class CreateEventForm(FlaskForm):
    name = StringField('Name', [validators.DataRequired()])
    sm_description = StringField('Sm_description', [validators.DataRequired()])
    description = StringField('Description', [validators.DataRequired()])
    start_date = StringField('Start_date', [validators.DataRequired()])
    end_date = StringField('End_date', [validators.DataRequired()])
    start_time = StringField('Start_time', [validators.DataRequired()])
    location = StringField('Location', [validators.DataRequired()])
    site_link = StringField('Site_link', [validators.DataRequired()])
    additional_info = StringField('Additional_info')
