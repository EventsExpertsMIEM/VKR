from .logic.accounts import user_loader
from .config import cfg

from .web import (accounts as accounts_web,
                  events as events_web,
                  users as users_web,
                  tests as tests_web,
                  oauth as ouath_web)
from .api import (accounts as accounts_api,
                  events as events_api,
                  users as users_api,
                  tasks as tasks_api)

from .errors import add_error_handlers, on_json_loading_failed

from flask import Flask, Request
from flask_login import LoginManager
from flask_mail import Mail
from gevent.pywsgi import WSGIServer
from gevent import monkey

from authlib.integrations.flask_client import OAuth

import logging
import logging.config
import sys


app = Flask(__name__)
app.config.update(
    TEMPLATES_AUTO_RELOAD=True,
    CSRF_ENABLED=cfg.CSRF_ENABLED,
    SECRET_KEY=cfg.SECRET_KEY,
    MAIL_SERVER=cfg.MAIL_SERVER,
    MAIL_PORT = cfg.MAIL_PORT,
    MAIL_USERNAME = cfg.MAIL_USERNAME,
    MAIL_PASSWORD = cfg.MAIL_PASSWORD,
    MAIL_DEFAULT_SENDER = cfg.MAIL_DEFAULT_SENDER,
    MAIL_USE_SSL = True,
)

app.register_blueprint(accounts_web.bp)
app.register_blueprint(events_web.bp)
app.register_blueprint(users_web.bp)

app.register_blueprint(tests_web.bp)

app.register_blueprint(accounts_api.bp, url_prefix='/api')
app.register_blueprint(events_api.bp, url_prefix='/api/event')
app.register_blueprint(users_api.bp, url_prefix='/api/user')
app.register_blueprint(tasks_api.bp, url_prefix='/api/event')
app.register_blueprint(ouath_web.bp, url_prefix='/oauth')

add_error_handlers(app)
Request.on_json_loading_failed = on_json_loading_failed

mail = Mail(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.user_loader(user_loader)

oauth = OAuth(app)

oauth.register(
    name='vk',
    client_id='7457845',
    client_secret=cfg.VK_CLIENT_SECRET,
    access_token_url='https://oauth.vk.com/access_token',
    access_token_params=None,
    authorize_url='https://oauth.vk.com/authorize',
    authorize_params=None,
    api_base_url='https://oauth.vk.com/',
    client_kwargs={
        'token_endpoint_auth_method': 'client_secret_post',
        'scope': '4194304' # 4194304 == email
    },
)

def run():
    monkey.patch_all(ssl=False)
    logger = None
    if cfg.DISABLE_EXISTING_LOGGERS is False:
        logger = logging.getLogger('gevent')
    if cfg.LOGGING['loggers']['gevent'] is not None:
        logger = logging.getLogger('gevent')
    http_server = WSGIServer(
        (cfg.HOST, cfg.PORT),
        app,
        # log = logger,
        error_log = logger
    )
    logging.info('Started server')
    # from logging_tree import printout
    # printout()
    http_server.serve_forever()
