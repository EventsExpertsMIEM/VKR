from types import SimpleNamespace
import os

from app import logging_config


cfg = SimpleNamespace()


def _get_db_connection_string():
    db_connection_string = os.getenv('DB_CONNECTION_STRING')
    if db_connection_string:
        return db_connection_string
    return 'postgresql://{PGUSER}:{PGPASSWORD}@{PGHOST}:{PGPORT}/{PGDATABASE}'.format(**os.environ)

def _get_number(env):
    return int(os.getenv(env))


cfg.CSRF_ENABLED = False if os.getenv('DISABLE_CSRF') else True
cfg.SECRET_KEY = os.getenv('SECRET_KEY', os.urandom(24))
cfg.HOST = os.getenv('HOST_ADDR', '0.0.0.0')
cfg.PORT = int(os.getenv('PORT', '8080'))
cfg.DB_CONNECTION_STRING = _get_db_connection_string()
cfg.RUNTIME_FOLDER = os.path.dirname(os.path.abspath(__file__))
cfg.SCRIPTS_FOLDER = os.getenv('SCRIPT_FOLDER', '{}/scripts'.format(cfg.RUNTIME_FOLDER))

cfg.SUPER_ADMIN_MAIL = os.getenv('SUPER_ADMIN_MAIL')
cfg.SUPER_ADMIN_PASSWORD = os.getenv('SUPER_ADMIN_PASSWORD')
cfg.DEFAULT_USER_STATUS = os.getenv('DEFAULT_USER_STATUS')

cfg.LOG_LEVEL = logging_config.LOG_LEVEL
cfg.LOGGING = logging_config.LOGGING
cfg.DISABLE_EXISTING_LOGGERS = logging_config.DISABLE_EXISTING_LOGGERS
