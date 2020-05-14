from flask import Blueprint, jsonify, request, abort
from flask_login import (login_required, login_user, logout_user, current_user)


from . import *
from ..logic import education as education_logic
from ..validation.validation import validate
from ..validation import schemas

bp = Blueprint('education', __name__)


# i think it's really wtf but stay for rest api
@bp.route('/levels', methods=['GET'])
@login_required
def edu_levels():
    return jsonify(['бакалавриат', 'магистратура', 'специалитет', 'аспиратнура',
             'ассистентура'])


# temporary deprecated
#@bp.route('/areas', methods=['GET'])
#@login_required
#def edu_areas():
#    areas = users_logic.get_higher_education_areas()
#    return jsonify(areas)


@bp.route('/programmes/<string:level>', methods=['GET'])
@login_required
def edu_programmes(level):
    programmes = education_logic.get_higher_education_programmes(level)
    return jsonify(programmes)


@bp.route('/', methods=['POST'], strict_slashes=False)
@login_required
def create_edu():
    data = get_json()
    id = education_logic.create_user_education(current_user.id, data)
    return make_ok(201, str(id))


@bp.route('/<int:edu_id>/delete', methods=['GET'])
@login_required
def delete_edu_by_id(edu_id):
    education_logic.delete_user_education(current_user.id, edu_id)
    return make_ok(200, 'Successfully deleted')


@bp.route('/', methods=['GET'], strict_slashes=False)
@login_required
def get_edu():
    return jsonify(education_logic.get_user_education(current_user.id))