from flask import abort

from ..db import get_session, Tag, result_as_dict

def get_all_tags():
    with get_session() as s:
        return [result_as_dict(t) for t in s.query(Tag).all()]

def add_tag(data):
    name = data['name']
    with get_session() as s:
        if s.query(Tag).filter_by(name=name).first():
            abort(409, 'Tag with this name already exists')

        tag = Tag(name=name)
        s.add(tag)

def update_tag(tag_id, data):
    with get_session() as s:
        tag = s.query(Tag).get(tag_id)
        if tag is None:
            abort(404, 'Tag not found!')
        if s.query(Tag).filter(Tag.name == data['name']).first() is not None:
            abort(409, 'Tag with this name already exists')
        tag.name = data['name']

def delete_tag(tag_id):
    with get_session() as s:
        tag = s.query(Tag).get(tag_id)
        if tag is None:
            abort(404, 'Tag not found!')
        tag.events = []
        s.delete(tag)