from schema import Schema, Use
from datetime import date, time

login = Schema(
    {
        'email': Use(str),
        'password': Use(str)
    }, ignore_extra_keys=True
)

register = Schema(
    {
        'email': Use(str),
        'password': Use(str),
        'name': Use(str),
        'surname': Use(str)
    }, ignore_extra_keys=True
)

change_password = Schema(
    {
        'old_password': Use(str),
        'new_password': Use(str)
    }, ignore_extra_keys=True
)

password = Schema(
    {
        'password': Use(str)
    }, ignore_extra_keys=True
)

reset_password = Schema(
    {
        'email': Use(str)
    }, ignore_extra_keys=True
)

event_create = Schema(
    {
        'name': Use(str),
        'sm_description': Use(str),
        'description': Use(str),
        'location': Use(str),
        'site_link': Use(str),
        'additional_info': Use(str),
        'start_date': Use(date.fromisoformat, error="start_date - invalid format"),
        'end_date': Use(date.fromisoformat, error="end_date - invalid format"),
        'start_time': Use(time.fromisoformat, error="start_time - invalid format"),
    }
)