from flask import jsonify, request, abort
import logging
import traceback


# answers

def make_ok(code, description):
    return jsonify(description=description), code


def make_4xx(code, description):
    logging.warning(str(code) + ' - [{}]'.format(description))
    return jsonify(error=description), code


def get_json():
    data = request.get_json()
    if data is None:
        abort(415, 'Expected json')
    return data


# legacy

def make_400(err):
    error = 'Incorrect request!'
    if isinstance(err, KeyError) or isinstance(err, AttributeError):
        err = 'Wrong json key(s)'
    logging.warning('400 - [{}] '.format(str(err)))
    return jsonify(error=str(err)), 400


def make_422(err):
    if isinstance(err, ValueError):
        err = 'Wrong data'
    if isinstance(err, IndexError):
        err = 'Incorrect date or time format'
    logging.warning('422 - [{}]'.format(str(err)))
    return jsonify(error=str(err)), 422


# errors handlers

def make_401(e):
    logging.warning('401 - [{}]'.format(e))
    return jsonify(error="Unauthorized"), 401


def make_404(e):
    logging.warning('404 - [{}]'.format(e.description))
    if e.description[0] == 'T':
        return jsonify(error="Unknown route"), 404
    return jsonify(error=e.description), 404


def make_405(e):
    logging.warning('405 - [{}]'.format(e))
    return jsonify(error="Wrong route method"), 405
