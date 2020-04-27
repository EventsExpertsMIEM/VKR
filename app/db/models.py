from sqlalchemy import (Column, Integer, String, ForeignKey,
                        DateTime, Date, Time, Boolean, UniqueConstraint)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import ENUM, UUID, TEXT
from flask_login import UserMixin

from datetime import datetime
import uuid

from ..config import cfg


Base = declarative_base()


Status = ENUM('unconfirmed', 'active', 'deleted', 'banned',
              name='status')
Participation_role = ENUM('creator', 'manager', 'presenter', 'viewer',
                          name='participation_role')
Service_status = ENUM('superadmin', 'admin', 'moderator', 'user',
                      name='service_status')
Task_status = ENUM('todo', 'inprocess', 'waiting', 'done', 'deleted',
                   name='task_status')
Report_status = ENUM('unseen', 'approved', 'declined',
                     name='report_status')


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
    service_status = Column(Service_status, default='user', nullable=False)
    registration_date = Column(DateTime, default=datetime.utcnow, nullable=False)
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
