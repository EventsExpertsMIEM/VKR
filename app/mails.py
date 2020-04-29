import logging
from flask_mail import Message
import app
from .config import cfg


def send_confirm_email(email, link):

    msg = Message(
        body = '{}"/confirm/"{}'.format(cfg.SITE_ADDR, link),
        subject = 'Congress Events confirmation link',
        recipients = [email],
    )

    logging.info('Sending confirmation message to ' + email)

    app.mail.send(msg)


def send_reset_email(email, new_password):

    msg = Message(
        body = 'Your new password - '.format(new_password),
        subject = 'Congress Events password reset',
        recipients = [email]
    )

    logging.info('Sending password reset message to ' + email)

    app.mail.send(msg)


def send_500_email(e, error):

    msg = Message(
        body = error,
        subject = 'Congress Events 500 server error',
        recipients = [cfg.SUPER_ADMIN_MAIL],
    )

    logging.info('Sending 500 error message')

    app.mail.send(msg)
