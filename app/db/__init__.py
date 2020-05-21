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
    logging.getLogger(__name__).info('Dropping existing tables')
    try:
        Base.metadata.reflect(_engine)
        Base.metadata.drop_all(_engine)
    except Exception as e:
        logging.getLogger(__name__).info(
            'Failed to drop tables.\n{}'.format(str(e))
        )
    logging.getLogger(__name__).info('Creating tables')
    Base.metadata.create_all(_engine)
    logging.getLogger(__name__).info('Tables was created')
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
    cfg.SUPER_ADMIN_PASSWORD = ""
    logging.getLogger(__name__).info(
        'Default user with mail [' + cfg.SUPER_ADMIN_MAIL + '] was created'
    )
    if cfg.LOG_LEVEL <= 10:
        add_test_data()

def add_test_data():
    from ..logic import accounts as accounts_logic
    from ..logic import events as events_logic
    from datetime import datetime, timedelta

    logging.getLogger(__name__).info('Filling database with test data')

    for i in range(1,4):
        accounts_logic.register_user(
            email='test{}@test'.format(i),
            password='123',
            name='User{}'.format(i),
            surname='Surname{}'.format(i),
        )

    for i in range(1,13):
        events_logic.create_event(i % 4 + 1, {
            'name': 'Event {}'.format(i),
            'sm_description': 'Test short description {}'.format(i),
            'description': 'Test description {}'.format(i),
            'location': 'Test location {}'.format(i),
            'site_link': 'http://www.example.com/{}'.format(i),
            'additional_info': 'Additional info {}'.format(i),
            'start_date': datetime.today(),
            'end_date': datetime.today() + timedelta(days=10),
            'start_time': datetime.now().time()
        })

    for i in range(1,13):
        events_logic.join_event((i + 1) % 4 + 1, i, {
            'role': 'viewer'
        })
        events_logic.join_event((i + 2) % 4 + 1, i, {
            'role': 'presenter'
        })
