from ..config import cfg
from ..db import *
import logging

from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc

from flask import abort
import bcrypt

from .. import mails

from datetime import datetime
import requests
import os
import nanoid
import uuid


def user_loader(uc_id):
    with get_session() as s:
        return s.query(User).filter(
                User.cookie_id == uc_id,
                User.status == 'active'
        ).one_or_none()


def pre_login(email, password):
    with get_session() as s:
        user = s.query(User).filter(
                User.email == email
        ).one_or_none()

        if not user:
            abort(404, 'Invalid user')
        if user.status == 'banned':
            abort(409, 'Trying to login banned user')
        if user.status == 'deleted':
            abort(404, 'Invalid user')
        if user.status == 'unconfirmed':
            abort(409, 'Trying to login unconfirmed user')

        pw = str(password).encode('utf-8')
        upw = str(user.password).encode('utf-8')
        if not bcrypt.checkpw(pw, upw):
            abort(422, 'Invalid password')
        return user


def register_user(email, name, surname, password, service_status='user'):
    with get_session() as s:
        user = s.query(User).filter(
                User.email == email
        ).one_or_none()

        if email == "" or name == "" or surname == "" or password == "":
            abort(422, "Wrong data")

        # checking unique link
        confirmation_link = ''
        while True:
            confirmation_link = nanoid.generate(size=50)
            exists = s.query(User).filter(
                    User.confirmation_link == confirmation_link
            ).one_or_none()
            if not exists:
                break

        pw = bcrypt.hashpw(str(password).encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        if user:
            if user.status == 'deleted':
                user.password = pw
                user.name = name
                user.surname = surname
                user.status = cfg.DEFAULT_USER_STATUS
                user.confirmation_link = confirmation_link
                user.service_status = service_status
                user.registration_date = datetime.utcnow()
                user.disable_date = None
                user.account_type = 'standart'
            elif user.status == 'banned':
                abort(409, 'User with this email was banned')
            else:
                abort(409, 'Trying to register existing user')
        else:
            user = User(email=email, name=name,
                        surname=surname, password=pw,
                        service_status=service_status,
                        confirmation_link=confirmation_link,
                        account_type='standart')
            s.add(user)
        if cfg.DEFAULT_USER_STATUS == 'unconfirmed':
            mails.send_confirm_email(email, confirmation_link)
        logging.info('Registering new user [{}]'.format(email))

def register_oauth_user(email, name, surname, oauth_id, oauth_type):
    with get_session() as s: # TODO: Validation, error checks, cleanup
        user = s.query(User).filter(
            User.email == email
        ).one_or_none()

        if (email == "" or name == "" or surname == ""
                or oauth_id == "" or oauth_type == ""):
            abort(422, "Wrong data")

        # checking unique link
        confirmation_link = ''
        while True:
            confirmation_link = nanoid.generate(size=50)
            exists = s.query(User).filter(
                    User.confirmation_link == confirmation_link
            ).one_or_none()
            if not exists:
                break

        service_status = 'user'

        if user:
            if user.status == 'deleted':
                user.name = name
                user.surname = surname
                user.status = cfg.DEFAULT_USER_STATUS
                user.confirmation_link = confirmation_link
                user.service_status = service_status
                user.registration_date = datetime.utcnow()
                user.disable_date = None
                user.account_type = 'oauth'
            elif user.status == 'banned':
                abort(409, 'User with this email was banned')
            else:
                abort(409, 'Trying to register existing user')
        else:
            user = User(email=email, name=name,
                        surname=surname, service_status=service_status,
                        confirmation_link=confirmation_link,
                        account_type='oauth')
            s.add(user)
    add_oauth_info(email, oauth_id, oauth_type)
    if cfg.DEFAULT_USER_STATUS == 'unconfirmed':
        mails.send_confirm_email(email, confirmation_link)
    logging.info('Registering new user [{}]'.format(email))

def add_oauth_info(email, oath_id, oauth_type):
    logging.debug('ADD_OAUTH_INFO: Email: {}\nID: {}\nType: {}'
        .format(email, oath_id, oauth_type)
    )
    with get_session() as s:
        user = s.query(User).filter(
            User.email == email
        ).one_or_none()
        if not user:
            abort(404, 'Something\'s wrong')
        oauth_info = OauthInfo(user_id=user.id, oauth_type=oauth_type, 
            oauth_id=oath_id
        )
        s.add(oauth_info)

def confirm_user(confirmation_link):
    with get_session() as s:
        user = s.query(User).filter(
                User.confirmation_link == confirmation_link
        ).one_or_none()
        if not user:
            abort(404, 'No user with this confirmation link')
        if user.status != 'unconfirmed':
            abort(409, "User is currently confirmed by this link or can't be confirmed")
        user.status = 'active'
        logging.info('User [{}] is confirmed'.format(user.email))


def reset_password(email):
    with get_session() as s:
        user = s.query(User).filter(
                User.email == email,
                User.status == 'active'
        ).one_or_none()
        
        if not user:
            abort(404, 'Invalid user')
        
        new_password = nanoid.generate(size=20)
        npw = bcrypt.hashpw(str(new_password).encode('utf-8'), bcrypt.gensalt())
        user.password = npw.decode('utf-8')
        user.cookie_id = uuid.uuid4()
        mails.send_reset_email(email, new_password)
