#!/bin/bash

# пользователь postgresql
export PGUSER=""
# адрес postgresql
export PGHOST=""
# порт postgresql
export PGPORT=""
# название БД в postgresql
export PGDATABASE=""
# пароль пользователя postgresql
export PGPASSWORD=""

# порт приложения
export PORT=""

# почта супер-админа
export SUPER_ADMIN_MAIL=""
# пароль от аккаунта супер-админа
export SUPER_ADMIN_PASSWORD=""
# подтверждение регистрации по электронной почте
# 'active' для отключения подтверждения
# 'unconfirmed' для включения
export DEFAULT_USER_STATUS=""

# Уровень логгирования
export LOG_LEVEL=
# Отключать ли сторонние логгеры
export DISABLE_EXISTING_LOGGERS=