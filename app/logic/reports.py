import app
from ..config import cfg
from ..db import *

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
            logging.getLogger(__name__).debug(report.id)
            app.reports_file_manager.remove(report.id)
            s.delete(report)
        report_id = app.reports_file_manager.save(data)
        report = Report(
            id = report_id,
            event_id = e_id,
            user_id = u_id,
            original_filename= data['file'].filename
        )
        s.add(report)
    logging.getLogger(__name__).info(
        'User [id {u_id}] uploaded report file '
        '[{fname}] for event [id {e_id}]. '
        'Saved with id [{r_id}]'.format(
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
        return (*app.reports_file_manager.get(report.id), report.original_filename)


def get_user_report_for_event(u_id, e_id):
    with get_session() as s:
        
        report = s.query(Report).filter(
            Report.user_id == u_id,
            Report.event_id == e_id
        ).one_or_none()

        if report is None:
            abort(404, 'Report not found')

        return (*app.reports_file_manager.get(report.id), report.original_filename)


def get_report_info_by_id(r_id):
    with get_session() as s:
        report = s.query(Report).get(r_id)
        if report is None:
            abort(404, 'No report found')
        return result_as_dict(report)


def get_report_info_for_event(u_id, e_id):
    with get_session() as s:
        report = s.query(Report).filter(
            Report.user_id == u_id,
            Report.event_id == e_id
        ).one_or_none()
        if report is None:
            abort(404, 'No report found')
        return result_as_dict(report)


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


def remove_current_user_report(u_id, e_id):
    with get_session() as s:
        report = s.query(Report).filter(
            Report.event_id == e_id,
            Report.user_id == u_id
        ).one_or_none()
        if report is None:
            abort(404, 'No report found')
        app.reports_file_manager.remove(report.id)
        s.delete(report)
        logging.getLogger(__name__).info(
            'User [id {u_id}] deleted report [id {r_id}]'
            'from event [id {e_id}]'.format(
                u_id = u_id,
                r_id = report.id,
                e_id = e_id
            )
        )


def get_reports_for_event(e_id):
    with get_session() as s:
        query = s.query(Report, User).filter(
            Report.event_id == e_id,
            Report.user_id == User.id,
            Report.report_status == 'approved'
        ).all()


        result = []
        for report, user in query:
            dict_report = result_as_dict(report)
            dict_report['user'] = {
                "email": user.email,
                "id": user.id,
                "name": user.name,
                "surname": user.surname,
            }
            result.append(dict_report)

        return result


#################################### ADMIN ####################################


def get_all_reports_for_event(e_id, u_id):
    with get_session() as s:
        creator = s.query(Participation).filter(
            Participation.e_id == e_id,
            Participation.u_id == u_id
        ).one_or_none()
        if creator.participation_role != 'creator':
            abort(403, 'No rights')
        result = s.query(Report, User).filter(
            Report.user_id == User.id,
            Report.event_id == e_id
        ).all()
        return [
            {
                'id': r.id,
                'name': r.name,
                'filename': r.original_filename,
                'status': r.report_status,
                'report_description': r.report_description,
                'presenter_description': r.presenter_description,
                'author': {
                    'email': u.email,
                    'name': u.name,
                    'surname': u.surname
                }
            } for r,u in result
        ]

def approve_report(r_id, u_id):
    with get_session() as s:
        report = s.query(Report).get(r_id)
        if not report:
            abort(404, "Report not found")
        
        creator = s.query(Participation).filter(
            Participation.e_id == report.event_id,
            Participation.participation_role == 'creator'
        ).one_or_none()

        if creator.u_id != u_id:
            abort(403, 'No rights')

        report.report_status = 'approved'

        logging.getLogger(__name__).info(
            'Report [id {r_id}] approved'.format(
                r_id = r_id
            )
        )


def decline_report(r_id, u_id):
    with get_session() as s:
        report = s.query(Report).get(r_id)
        if not report:
            abort(404, "Report not found")
        
        creator = s.query(Participation).filter(
            Participation.e_id == report.event_id,
            Participation.participation_role == 'creator'
        ).one_or_none()

        if creator.u_id != u_id:
            abort(403, 'No rights')

        report.report_status = 'declined'

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