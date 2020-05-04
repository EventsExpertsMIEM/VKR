import logging
from flask import abort
from schema import (SchemaError, SchemaMissingKeyError, SchemaForbiddenKeyError,
                    SchemaWrongKeyError)

import pprint

pp = pprint.PrettyPrinter().pprint

def validate(data, validation_schema):
    delNone = lambda x: [i for i in x if i is not None]
    try:
        return validation_schema.validate(data)

    except SchemaMissingKeyError as e:
        pp(e)
        for err in e.errors:
            logging.debug('\tError: {}'.format(err))
        for err in e.autos:
            logging.debug('\tAutos: {}'.format(err))
        abort(422, '\n'.join(delNone(e.autos)))

    except SchemaForbiddenKeyError as e:
        pp(e)
        for err in e.errors:
            logging.debug('\tError: {}'.format(err))
        for err in e.autos:
            logging.debug('\tAutos: {}'.format(err))
        abort(422, '\n'.join(delNone(e.errors)))

    except SchemaWrongKeyError as e:
        pp(e)
        for err in e.errors:
            logging.debug('\tError: {}'.format(err))
        for err in e.autos:
            logging.debug('\tAutos: {}'.format(err))
        abort(422, '\n'.join(delNone(e.errors)))

    except SchemaError as e:
        pp(e)
        for err in e.errors:
            logging.debug('\tError: {}'.format(err))
        for err in e.autos:
            logging.debug('\tAutos: {}'.format(err))
        abort(422, '\n'.join(delNone(e.errors)))