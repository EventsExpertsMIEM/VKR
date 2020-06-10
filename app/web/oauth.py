
from flask import Blueprint, url_for, request, redirect, jsonify
from flask_login import login_user, current_user

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


@bp.route('/vk/link')
def vk_link():
    vcunt = app.oauth.vk
    redirect_uri = url_for('oauth.vk_link_callback', _external=True)
    return vcunt.authorize_redirect(redirect_uri)

@bp.route('/vk/link/callback')
def vk_link_callback():
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
    accounts_logic.add_oauth_info(current_user.email, token['user_id'], 'vk')
    return redirect(url_for('users_web.profile'))


@bp.route('google/register')
def google_register():
    google = app.oauth.google
    redirect_uri = url_for('oauth.google_register_callback', _external=True)
    logging.debug(redirect_uri)
    return google.authorize_redirect(redirect_uri)


@bp.route('google/register/callback')
def google_register_callback():
    token = app.oauth.google.authorize_access_token()
    logging.getLogger(__name__).debug("Register: got oauth token: {}".format(token))
    resp = requests.get(
         'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
        headers = {
            'Authorization': 'Bearer {}'.format(token['access_token'])
        }
    ).json()
    logging.getLogger(__name__).debug("Google user info: {}".format(resp))
    accounts_logic.register_oauth_user(
        resp['email'],
        resp['given_name'],
        resp['family_name'],
        resp['id'],
        'google'
    )
    return redirect(url_for('oauth.google_login'))

@bp.route('google/login')
def google_login():
    google = app.oauth.google
    redirect_uri = url_for('oauth.google_login_callback', _external=True)
    return google.authorize_redirect(redirect_uri)


@bp.route('google/login/callback')
def google_login_callback():
    token = app.oauth.google.authorize_access_token()
    resp = requests.get(
         'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
        headers = {
            'Authorization': 'Bearer {}'.format(token['access_token'])
        }
    ).json()
    logging.getLogger(__name__).debug("Login: got oauth token: {}".format(token))
    user = accounts_logic.oauth_pre_login(resp['id'])
    login_user(user)
    return redirect(url_for('events_web.home'))

    

@bp.route('/google/link')
def google_link():
    google = app.oauth.google
    redirect_uri = url_for('oauth.google_link_callback', _external=True)
    return google.authorize_redirect(redirect_uri)


@bp.route('/google/link/callback')
def google_link_callback():
    token = app.oauth.google.authorize_access_token()
    logging.getLogger(__name__).debug("Register: got oauth token: {}".format(token))
    resp = requests.get(
         'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
        headers = {
            'Authorization': 'Bearer {}'.format(token['access_token'])
        }
    ).json()
    logging.getLogger(__name__).debug("Google user info: {}".format(resp))
    accounts_logic.add_oauth_info(current_user.email, resp['id'], 'google')
    return redirect(url_for('users_web.profile'))
