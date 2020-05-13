from schema import Schema, Use, And, Optional, Hook, SchemaForbiddenKeyError
from datetime import date, time

class Forbidden(Hook):
    def __init__(self, *args, **kwargs):
        kwargs["handler"] = self._default_function
        super(Forbidden, self).__init__(*args, **kwargs)

    def _default_function(self, nkey, data, error):
        raise SchemaForbiddenKeyError(
            'Forbidden key encountered: {} in {}'.format(nkey, data),
            self._error
        )

class unknownKey(Hook):
    def __init__(self, *args, **kwargs):
        kwargs["handler"] = self._default_function
        super(unknownKey, self).__init__(*args, **kwargs)

    def _default_function(self, nkey, data, error):
        raise SchemaForbiddenKeyError(
            'Unknown key encountered: {} in {}'.format(nkey, data),
            '{}: {}'.format(self._error, nkey)
        )

login = Schema(
    {
        'email': Use(str),
        'password': Use(str)
    },
    ignore_extra_keys=True
)

register = Schema(
    {
        'email': Use(str),
        'password': Use(str),
        'name': Use(str),
        'surname': Use(str)
    },
    ignore_extra_keys=True
)

change_password = Schema(
    {
        'old_password': Use(str),
        'new_password': Use(str)
    },
    ignore_extra_keys=True
)

password = Schema(
    {
        'password': Use(str)
    },
    ignore_extra_keys=True
)

reset_password = Schema(
    {
        'email': Use(str)
    },
    ignore_extra_keys=True
)

event_create = Schema(
    {
        'name': Use(str),
        'sm_description': Use(str),
        'description': Use(str),
        'location': Use(str),
        'site_link': Use(str),
        'additional_info': Use(str),
        'start_date': Use(
            date.fromisoformat,
            error="start_date - invalid format"
        ),
        'end_date': Use(
            date.fromisoformat,
            error="end_date - invalid format"
        ),
        'start_time': Use(
            time.fromisoformat,
            error="start_time - invalid format"
        ),
    },
    ignore_extra_keys=True
)

event_update = Schema(
    {
        Forbidden('id', error='Cannot change event id!'): object,
        Forbidden('status', error='Cannot change event status!'): object,
        Forbidden('views', error='Cannot change event views!'): object,
        Optional('start_date'): Use(
            date.fromisoformat,
            error="start_date - invalid format"
        ),
        Optional('end_date'): Use(
            date.fromisoformat,
            error="end_date - invalid format"
        ),
        Optional('start_time'): Use(
            time.fromisoformat,
            error="start_time - invalid format"
        ),
        Optional('name'): Use(str),
        Optional('description'): Use(str),
        Optional('sm_description'): Use(str),
        Optional('location'): Use(str),
        Optional('site_link'): Use(str),
        Optional('additional_info'): Use(str),
        unknownKey(str, error='Unknown key detected'): object
    }
)

event_add_manager = Schema(
    {
        'email': Use(str)
    }, ignore_extra_keys=True
)

event_join = Schema(
    {
        'role': And(
            Use(str),
            lambda x: x in ('presenter', 'viewer'),
            error='Invalid role'
        ),
        Optional('presenter_description'): Use(str),
        Optional('report_description'): Use(str)
    },
    ignore_extra_keys=True
)

event_join_presenter = Schema(
    {
        'role': 'presenter',
        'presenter_description': Use(str),
        'report_description': Use(str),
    },
    ignore_extra_keys=True
)