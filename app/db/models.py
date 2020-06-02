from sqlalchemy import (Column, Integer, String, ForeignKey, DateTime,
                        Date, Time, Boolean, UniqueConstraint, Table, inspect)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import ENUM, UUID, TEXT
from sqlalchemy.orm import relationship
from flask_login import UserMixin

from datetime import datetime
import uuid

from ..config import cfg


Base = declarative_base()


Status = ENUM('unconfirmed', 'active', 'deleted', 'banned',
              name='status')
Event_status = ENUM('active', 'closed', 'archived', 'deleted',
                    name='event_status')
Participation_role = ENUM('creator', 'manager', 'presenter', 'viewer',
                          name='participation_role')
Service_status = ENUM('superadmin', 'admin', 'moderator', 'user',
                      name='service_status')
Task_status = ENUM('todo', 'inprocess', 'waiting', 'done', 'failed', 'deleted',
                   name='task_status')
Report_status = ENUM('unseen', 'approved', 'declined',
                     name='report_status')
Account_type = ENUM('standart', 'oauth', name='account_type_enum')


def result_as_dict(obj):
    return {c.key: getattr(obj, c.key)
        for c in inspect(obj).mapper.column_attrs}

class User(Base, UserMixin):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    status = Column(Status, default=cfg.DEFAULT_USER_STATUS,
                            nullable=False)
    confirmation_link = Column(String, nullable=False)
    cookie_id = Column(UUID(as_uuid=True), default=uuid.uuid4,
                       unique=True, nullable=False)
    # primary info
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    password = Column(TEXT, nullable=False)
    account_type = Column(Account_type, nullable=False)
    service_status = Column(Service_status, default='user', nullable=False)
    registration_date = Column(DateTime, default=datetime.utcnow,
                                nullable=False)
    disable_date = Column(DateTime, nullable=True)
    # secondary info
    phone = Column(String, nullable=True)
    organization = Column(String, nullable=True)
    position = Column(String, nullable=True)
    country = Column(String, nullable=True)
    town = Column(String, nullable=True)
    birth = Column(Date, nullable=True)
    sex = Column(String, nullable=True)
    bio = Column(TEXT, nullable=True)

    def get_id(self):
        return self.cookie_id


class Event(Base):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True)
    status = Column(Event_status, default='active', nullable=False)
    views = Column(Integer, default=0, nullable=False)

    name = Column(String, nullable=False)
    sm_description = Column(String, nullable=False)
    description = Column(String, nullable=False)

    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)

    location = Column(String, nullable=False)
    site_link = Column(String, nullable=False)

    additional_info = Column(TEXT, nullable=False)
    guests_info = Column(TEXT, nullable=True)

class Report(Base):

    __tablename__ = 'reports'

    id = Column(String, primary_key=True)
    name = Column(String, nullable=True)
    original_filename = Column(String, nullable=False)
    event_id = Column(Integer, ForeignKey('events.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    uploaded_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    last_updated = Column(DateTime, nullable=True, onupdate=datetime.utcnow)
    presenter_description = Column(TEXT, nullable=True)
    report_description = Column(TEXT, nullable=True)
    report_status = Column(Report_status, nullable=True, default='unseen')

class Participation(Base):
    __tablename__ = 'participations'

    id = Column(Integer, primary_key=True)
    e_id = Column(Integer, ForeignKey('events.id'), nullable=False)
    u_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    participation_role = Column(Participation_role, default='viewer',
                            nullable=False)
    participation_date = Column(DateTime, nullable=False, default=datetime.utcnow)


class ETask(Base):
    __tablename__ = 'etasks'

    id = Column(Integer, primary_key=True)
    e_id = Column(Integer, ForeignKey('events.id'), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    deadline = Column(Date, nullable=True)
    status = Column(Task_status, default='todo', nullable=False)


class Education(Base):
    __tablename__ = 'education'

    id = Column(Integer, primary_key=True)
    country = Column(String, nullable=True)
    city = Column(String, nullable=True)
    university = Column(String, nullable=True)
    department = Column(String, nullable=True)
    program = Column(String, nullable=True)
    mode = Column(String, nullable=True)
    status = Column(String, nullable=True)
    graduation_year = Column(Integer, nullable=True)
    is_main = Column(Boolean, default=False, nullable=True)
    u_id = Column(Integer, ForeignKey('users.id'), nullable=True)


r_events_tags = Table(
    'r_events_tags',
    Base.metadata,
    Column('event_id', Integer, ForeignKey('events.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)

class Tag(Base):
    __tablename__ = 'tags'

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)

    events = relationship('Event', secondary=r_events_tags, lazy='dynamic')