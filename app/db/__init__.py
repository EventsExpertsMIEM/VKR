from .models import *
from ..config import cfg
import logging

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager


_engine = create_engine(cfg.DB_CONNECTION_STRING)
_Session = sessionmaker(bind=_engine, expire_on_commit=False)


@contextmanager
def get_session():
    session = _Session()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()


def create_tables(password):
    logging.info('Dropping existing tables')
    try:
        Base.metadata.reflect(_engine)
        Base.metadata.drop_all(_engine)
    except Exception as e:
        logging.info('Failed to drop tables.\n{}'.format(str(e)))
    logging.info('Creating tables')
    Base.metadata.create_all(_engine)
    logging.info('Tables was created')
    with get_session() as s:
        root = User(
            email=cfg.SUPER_ADMIN_MAIL,
            password=password,
            name='Super',
            surname='Admin',
            service_status='superadmin',
            status='active',
            confirmation_link='none',
            account_type='standart'
        )
        s.add(root)
    logging.info('Default user with mail [' + cfg.SUPER_ADMIN_MAIL + '] was created')
