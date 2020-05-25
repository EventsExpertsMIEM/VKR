from flask import Blueprint, jsonify, request, send_from_directory
from flask_login import (login_required, current_user)

from . import *
from ..logic import reports as reports_logic
from ..validation.validation import validate
from ..validation import schemas


bp = Blueprint('reports', __name__)

@bp.route('/<int:e_id>/report', methods=['POST'])
@login_required
def upload_report(e_id):
    
    if 'file' not in request.files:
        return make_4xx(403, "No file found")
    file = request.files['file']
    if file.filename == '':
        return make_4xx(403, "No file found")

    data = {
        'file': file,
        'size': int(request.headers.get('Content-Length'))
    }

    logging.getLogger(__name__).info(
        'Recieved file with content-length equal {}'.format(
            data['size']
        )
    )
    
    report_id = reports_logic.upload_report(current_user.id, e_id, data)

    return make_ok(200, report_id)


@bp.route('/report/<r_id>', methods=['GET'])
def get_report_by_id(r_id):
    path, report_id, filename = reports_logic.get_report_by_id(r_id)
    return send_from_directory(
        path,
        report_id,
        as_attachment=True,
        attachment_filename=filename
    )


@bp.route('/<int:e_id>/report', methods=['GET'])
@login_required
def get_current_user_report_for_event(e_id):
    path, report_id, filename = reports_logic.get_user_report_for_event(
        current_user.id,
        e_id
    )
    return send_from_directory(
        path,
        report_id,
        as_attachment=True,
        attachment_filename=filename
    )


@bp.route('/report/<r_id>/info', methods=['GET'])
@login_required
def get_report_info_by_id(r_id):
    return jsonify(reports_logic.get_report_info_by_id(r_id))


@bp.route('/<int:e_id>/report/info', methods=['GET'])
@login_required
def get_current_user_report_info_for_event(e_id):
    return jsonify(
        reports_logic.get_report_info_for_event(current_user.id, e_id)
    )


@bp.route('/report/<r_id>', methods=['PUT'])
@login_required
def update_report_info(r_id):
    data = validate(get_json(), schemas.report_info)
    reports_logic.update_report_info_by_id(r_id, data)
    return make_ok(200, 'Report info updated')


@bp.route('/<int:e_id>/report', methods=['PUT'])
@login_required
def update_report_info_for_event(e_id):
    data = validate(get_json(), schemas.report_info)
    reports_logic.update_report_info_for_event(current_user.id, e_id, data)
    return make_ok(200, 'Report info updated')


@bp.route('/<int:e_id>/report', methods=['DELETE'])
@login_required
def remove_current_user_report_for_event(e_id):
    reports_logic.remove_current_user_report(current_user.id, e_id)
    return make_ok(200, 'Report removed successfully')


@bp.route('/<int:e_id>/report/all', methods=['GET'])
def get_reports_for_event(e_id):
    return jsonify(reports_logic.get_reports_for_event(e_id))

#################################### ADMIN ####################################


@bp.route('/<int:e_id>/management/reports/all', methods=['GET'])
@login_required
def get_all_reports_for_event(e_id):
    return jsonify(reports_logic.get_all_reports_for_event(e_id, current_user.id))


@bp.route('report/<r_id>/approve', methods=['POST'])
@login_required
def approve_report(r_id):
    reports_logic.approve_report(r_id, current_user.id)
    return make_ok(200, 'Report approved')


@bp.route('report/<r_id>/decline', methods=['POST'])
@login_required
def decline_report(r_id):
    reports_logic.decline_report(r_id, current_user.id)
    return make_ok(200, 'Report declined')

# def get_reports(e_id):
#     if not current_user.is_authenticated or current_user.service_status is 'user':
#         return jsonify(reports_logic.get_reports_for_event(e_id))
#     else:
#         return jsonify(reports_logic.get_report_for_event_admin(e_id))

# @bp.route('/report/all', methods=['GET'])
# @login_required
# def get_all_reports():
#     if current_user.service_status is 'user':
#         return make_4xx(403, "No rights")
#     return jsonify(reports_logic.get_all_reports())

# @bp.route('/<int:e_id>/report/all', methods=['GET'])
# def get_reports(e_id):
#     if not current_user.is_authenticated or current_user.service_status is 'user':
#         return jsonify(reports_logic.get_reports_for_event(e_id))
#     else:
#         return jsonify(reports_logic.get_report_for_event_admin(e_id))