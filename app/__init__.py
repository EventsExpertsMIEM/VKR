from .logic.accounts import user_loader
from .config import cfg

from .web import (accounts as accounts_web,
                  events as events_web,
                  users as users_web
                  )
from .api import (accounts as accounts_api,
                  events as events_api,
                  users as users_api,
                  reports as reports_api,
                  tasks as tasks_api)

from .errors import add_error_handlers, on_json_loading_failed
from .logic.file_storage import FileManager

from flask import Flask, Request
from flask_login import LoginManager
from flask_mail import Mail
from gevent.pywsgi import WSGIServer
from gevent import monkey

import logging
import logging.config
import sys

monkey.patch_all(ssl=cfg.SSL_ENABLED)

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

app.register_blueprint(accounts_api.bp, url_prefix='/api')
app.register_blueprint(events_api.bp, url_prefix='/api/event')
app.register_blueprint(users_api.bp, url_prefix='/api/user')
app.register_blueprint(tasks_api.bp, url_prefix='/api/event')
app.register_blueprint(reports_api.bp, url_prefix='/api/event')

add_error_handlers(app)
Request.on_json_loading_failed = on_json_loading_failed

mail = Mail(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.user_loader(user_loader)

reports_file_manager = FileManager()
reports_file_manager.set_file_set('REPORTS')
reports_file_manager.init_app(app)
# avatars_file_manager = FileManager(app, 'AVATARS')

def run(purge_files=False):
    if purge_files:
        logging.debug('Purging files')
        reports_file_manager.purge()
    logger = None
    if cfg.DISABLE_EXISTING_LOGGERS is False:
        logger = logging.getLogger('gevent')
    if cfg.LOGGING['loggers']['gevent'] is not None:
        logger = logging.getLogger('gevent')
    if cfg.SSL_ENABLED:
        logging.debug('SSL enabled\n\tCertfile: {}\n\tKeyfile: {}'.format(
            cfg.SSL_CERT, cfg.SSL_KEY
        ))
        http_server = WSGIServer(
            (cfg.HOST, cfg.PORT),
            app,
            # log = logger,
            error_log = logger,
            certfile=cfg.SSL_CERT,
            keyfile=cfg.SSL_KEY
        )
    else:
        logging.debug('SSL disabled')
        http_server = WSGIServer(
            (cfg.HOST, cfg.PORT),
            app,
            # log = logger,
            error_log = logger
        )
    logging.info('Started server')
    http_server.serve_forever()
