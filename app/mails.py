import logging
from flask_mail import Message
import app
from .config import cfg

import os
import datetime
import traceback


def log_file_email_errors(e):
    if not os.path.exists('send_email_errors.txt'):
        file = open('send_email_errors.txt', 'w')
        file.close()

    with open('send_email_errors.txt', 'a+') as f:
        f.write(datetime.datetime.now().isoformat())
        f.write('\n')
        f.write(traceback.format_exc())
        f.write('\n')


def send_confirm_email(email, link):
    try:
        msg = Message(
            body = cfg.SITE_ADDR + '/confirm/' + link,
            subject = 'Congress Events confirmation link',
            recipients = [email]
        )
        app.mail.send(msg)
        logging.info('Sending confirmation message to ' + email)
    except Exception as e:
        log_file_email_errors(e)


def send_reset_email(email, new_password):
    try:
        msg = Message(
            body = 'Your new password - ' + new_password,
            subject = 'Congress Events password reset',
            recipients = [email]
        )
        app.mail.send(msg)
        logging.info('Sending password reset message to ' + email)
    except Exception as e:
        log_file_email_errors(e)


def send_500_email(e, error):
    try:
        msg = Message(
            body = error,
            subject = 'Congress Events 500 server error',
            recipients = [cfg.SUPER_ADMIN_MAIL]
        )
        app.mail.send(msg)
        logging.info('Sending 500 error message')
    except Exception as e:
        log_file_email_errors(e)
