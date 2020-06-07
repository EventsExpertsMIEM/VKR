from flask import Blueprint, jsonify, request
from flask_login import login_required

from . import *
from ..logic import tags as tag_logic
from ..validation import schemas
from ..validation.validation import validate

bp = Blueprint('tags', __name__)

@bp.route('/all', methods=['GET'])
def get_all_tags():
    return jsonify(tag_logic.get_all_tags())

@bp.route('/', methods=['POST'])
def add_tag():
    data = validate(get_json(), schemas.tag)
    tag_logic.add_tag(data)
    return make_ok(201, 'Tag created')

@bp.route('/<int:tag_id>', methods=['PUT'])
def update_tag(tag_id):
    data = validate(get_json(), schemas.tag)
    tag_logic.update_tag(tag_id, data)
    return make_ok(200, 'Tag updated')

@bp.route('/<int:tag_id>', methods=['DELETE'])
def delete_tag(tag_id):
    tag_logic.delete_tag(tag_id)
    return make_ok(200, 'Tag deleted')