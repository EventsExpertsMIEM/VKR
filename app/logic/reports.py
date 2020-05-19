from ..config import cfg
from ..db import *
from .file_storage import reports_manager

from flask import abort
import logging


def upload_report(u_id, e_id, data):
    with get_session() as s:
        event = s.query(Event).get(e_id)
        if not event or event.status == 'deleted':
            abort(404, 'No event with this id')
        participation = s.query(Participation).filter(
            Participation.u_id == u_id,
            Participation.e_id == e_id,
            Participation.participation_role == 'presenter'
        ).one_or_none()

        if not participation:
            abort(424, 'User must join event as presenter before uploading!')

        report = s.query(Report).filter(
            Report.event_id == e_id,
            Report.user_id == u_id
        ).one_or_none()
        if report is not None:
            reports_manager.remove(report.id)
            s.delete(report)
        report_id = reports_manager.save(data)
        report = Report(
            id = report_id,
            event_id = e_id,
            user_id = u_id,
            original_filename= data['file'].filename
        )
        s.add(report)
    logging.getLogger(__name__).info(
        'User [id {u_id}] uploaded report file '
        '[{fname}] for event [id {e_id}].'
        'Saved [id {r_id}]'.format(
            u_id = u_id,
            e_id = e_id,
            fname = report.original_filename,
            r_id = report.id
        )
    )
    return report_id


def get_report_by_id(r_id):
    with get_session() as s:
        report = s.query(Report).get(r_id)
        if report is None:
            abort(404, 'Report not found')
        return (*reports_manager.get(report.id), report.original_filename)


def get_user_report_for_event(u_id, e_id):
    with get_session() as s:
        
        report = s.query(Report).filter(
            Report.user_id == u_id,
            Report.event_id == e_id
        ).one_or_none()

        if report is None:
            abort(404, 'Report not found')

        return (*reports_manager.get(report.id), report.original_filename)


def get_report_info_by_id(r_id):
    with get_session() as s:
        report = s.query(Report).get(r_id)
        if report is None:
            abort(404, 'No report found')
        return {
            c.name:
                str(getattr(report, c.name)) for c in report.__table__.columns
        }


def get_report_info_for_event(u_id, e_id):
    with get_session() as s:
        report = s.query(Report).filter(
            Report.user_id == u_id,
            Report.event_id == e_id
        ).one_or_none()
        if report is None:
            abort(404, 'No report found')
        return {
            c.name:
                str(getattr(report, c.name)) for c in report.__table__.columns
        }


def update_report_info_by_id(r_id, data):
    with get_session() as s:
        report = s.query(Report).get(r_id)

        if report is None:
            abort(404, 'Report not found')
        
        for attr in data.keys():
            setattr(report, attr, data[attr])
    logging.getLogger(__name__).info(
        'Report [ id {r_id} ] updated with following data:\n\t{data}'
            .format(r_id=r_id, data=data)
    )


def update_report_info_for_event(u_id, e_id, data):
    with get_session() as s:
        report = s.query(Report).filter(
                Report.user_id == u_id,
                Report.event_id == e_id
            ).one_or_none()
        if report is None:
            abort(404, 'Report not found')
        
        for attr in data.keys():
            setattr(report, attr, data[attr])
    logging.getLogger(__name__).info(
        'Report [ id {r_id} ] updated with following data:\n\t{data}'
            .format(r_id=report.id, data=data)
    )


def remove_user_report(u_id, e_id):
    with get_session() as s:
        report = s.query(Report).filter(
            Report.event_id == e_id,
            Report.user_id == u_id
        ).one_or_none()
        if report is None:
            abort(404, 'No report found')
        reports_manager.remove(report.id)
        logging.getLogger(__name__).info(
            'User [id {u_id}] deleted report [id {r_id}]'
            'from event [id {e_id}]'.format(
                u_id = u_id,
                r_id = report.id,
                e_id = e_id
            )
        )


#################################### ADMIN ####################################


def approve_report(r_id):
    with get_session() as s:
        report = s.query(Report).get(r_id)
        if not report:
            abort(404, "Report not found")
        
        report.report_status = 'approved'

        logging.getLogger(__name__).info(
            'Report [id {r_id}] approved'.format(
                r_id = r_id
            )
        )


def decline_report(r_id):
    with get_session() as s:
        participation = s.query(Participation).filter(
            Participation.report_id == r_id,
        ).one_or_none()
        if not participation:
            abort(404, "Report not found")
        
        participation.report_status = 'declined'

        logging.getLogger(__name__).info(
            'Report [id {r_id}] declined'.format(
                r_id = r_id
            )
        )


# def get_all_reports():
#     with get_session() as s:
#         return list(
#                 map(
#                 lambda r: {
#                     "event_id": r.e_id,
#                     "user_id": r.u_id,
#                     "report_id": r.report_id,
#                     "name": r.report_name,
#                     "last_update": r.last_updated,
#                     "status": r.report_status
#                 },
#                 s.query(Participation).add_columns(
#                     Participation.e_id,
#                     Participation.u_id,
#                     Participation.report_name,
#                     Participation.report_name,
#                     Participation.last_updated,
#                     Participation.report_status,
#                     Participation.report_id,
#                 ).filter(
#                     Participation.report_id != None
#                 ).all()
#             )
#         )

# def get_reports_for_event(e_id):
#     with get_session() as s:
#         event = s.query(Event).get(e_id)
#         if not event or event.status == 'deleted':
#             abort(404, 'No event with this id')
#         participations = s.query(Participation).filter(
#             Participation.e_id == e_id,
#             Participation.participation_role == 'presenter',
#             Participation.report_status == 'approved'
#         ).all()
#         if len(participations) == 0 :
#             abort(404, 'No participants found')
#         if all(
#             participation.report_id == None for participation in participations
#         ):
#             abort(404, 'No reports found')
        
#         return list(
#             map(
#                 lambda p: {
#                     'report_id': p.report_id,
#                     'report_name': p.report_name,
#                     'last_updated': p.last_updated,
#                 },
#                 participations
#             )
#         )

# def get_report_for_event_admin(e_id):
#     with get_session() as s:
#         event = s.query(Event).get(e_id)
#         if not event or event.status == 'deleted':
#             abort(404, 'No event with this id')
#         participations = s.query(Participation).filter(
#             Participation.e_id == e_id,
#             Participation.participation_role == 'presenter' 
#         ).all()
#         if len(participations) == 0:
#             abort(404, 'No participants founde')
#         if all(
#             participation.report_id == None for participation in participations
#         ):
#             abort(404, 'No reports found')
        
#         return list(
#             map(
#                 lambda p: {
#                     'report_id': p.report_id,
#                     'report_name': p.report_name,
#                     'last_updated': p.last_updated,
#                     'status': p.report_status
#                 },
#                 participations
#             )
#         )