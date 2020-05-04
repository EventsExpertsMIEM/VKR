from schema import Schema, Use

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

reset_password = Schema(
    {
        'email': Use(str)
    }, ignore_extra_keys=True
)