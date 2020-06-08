
from flask import Blueprint, url_for, request, redirect
from flask_login import login_user

import requests
import logging

import app

from ..logic import accounts as accounts_logic

bp = Blueprint('oauth', __name__)


@bp.route('/vk/register')
def vk_register():
    vcunt = app.oauth.vk
    redirect_uri = url_for('oauth.vk_register_callback', _external=True)
    return vcunt.authorize_redirect(redirect_uri)

@bp.route('/vk/register/callback')
def vk_register_callback():
    token = app.oauth.vk.authorize_access_token()
    logging.info("Register: got oauth token: {}".format(token))
    resp = requests.get(
        'https://api.vk.com/method/users.get',
        params = {
            'v': '5.103',
            'access_token': token['access_token']
        }
    ).json()['response'][0] # TODO: Error checks, cleanup
    logging.info("Got user data: {}".format(resp))
    accounts_logic.register_oauth_user(token['email'], resp['first_name'],
        resp['last_name'], token['user_id'], 'vk'
    )
    return redirect(url_for('oauth.vk_login'))

@bp.route('/vk/login')
def vk_login():
    vcunt = app.oauth.vk
    redirect_uri = url_for('oauth.vk_login_callback', _external=True)
    return vcunt.authorize_redirect(redirect_uri)

@bp.route('/vk/login/callback')
def vk_login_callback():
    token = app.oauth.vk.authorize_access_token()
    logging.info("Login: got oauth token: {}".format(token))
    user = accounts_logic.oauth_pre_login(token['user_id'])
    login_user(user)
    return redirect(url_for('events_web.home'))
