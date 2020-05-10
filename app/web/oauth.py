
from flask import Blueprint, url_for, request, make_response

import requests
import logging

import app

bp = Blueprint('oauth', __name__)


@bp.route('/vk')
def vk_oauth():
    vcunt = app.oauth.vk
    redirect_uri = url_for('oauth.vk_callback', _external=True)
    logging.info("Redirect: {}".format(redirect_uri))
    return vcunt.authorize_redirect(redirect_uri)

@bp.route('/vk/callback')
def vk_callback():
    token = app.oauth.vk.authorize_access_token()
    logging.info("Got oauth token: {}".format(token))
    resp = requests.get(
        'https://api.vk.com/method/users.get',
        params = {
            'v': '5.103',
            'access_token': token['access_token']
        }
    )
    logging.info("Got user data: {}".format(resp.json()))
    from flask import make_response
    return make_response(resp.json(), 200)