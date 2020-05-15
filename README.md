# EventsProj repo
Это репозиторий с кодом бекенд сервиса, который предоставляет пользователям:
*   Просматривать мероприятия,
*   Создавать мероприятия,
*   Регистрироватсья и принимать участие в мероприятиях,
*   Отслеживать задачи по подготовке мероприятий,
*   Выполнять модерацию докладов.

## Структура репозитория:
*   В **app** лежит код самого сервиса
    *   **api** - REST API
    *   **db** - структура и взаимодействие с бд
    *   **logic** - внутрення логика
    *   **static** - статические файлы для страниц
    *   **templates** - шаблоны страниц для jinja2
    *   **web** - url и логика для браузера
    *   `__init__` - инициализация flask и модулей
    *   `congig` - конфиг для всего сервера
    *   `errors` - обработка ошибок
    *   `logging_config` - конфиг логгеров сервера
    *   `mails` - почта
*   `main` - запуск сервера
*   `requirements.txt` - необходимые pip пакеты
*   `setup.sh` - шаблон файла инициализации конфига в переменные окружения

## Используемые технологии:
*   Основа - [Python3](https://www.python.org/)
*   СУБД - [PostgreSQL](https://www.postgresql.org/)
*   Связь с БД - [SQLAlchemy](https://www.sqlalchemy.org/)
*   Web-framework - [Flask](http://flask.pocoo.org/)
*   Web-интерфейс - [Bootstrap](https://getbootstrap.com/) 

## Установка и настройка:
За этим обращаться к [этому человеку](https://github.com/mvalkhimovich) или в инструкцию для линуха в 19288

## ToDo:
*   **Лев**:
    - Валидатор json и query string
    - OAuth
    - [ ] Допилить загрузку файлов и хранилище
*   **Маша**:
    - Допилить страницу пользовательской инфы
    - [x] Сделать изменение пароля, удаление аккаунта и выход из всех сессий
    - [ ] Страница создания мероприятия
    - [ ] Страница мероприятия
    - [ ] Страница настроек мероприятия
        - [ ] Назначение манагера
        - [ ] Изменение инфы о мероприятии
        - [ ] Модерация докладов
        - [ ] Управление задачами по мероприятию
    - [ ] Участие в мероприятии с загрузкой файла доклада
    - [ ] Страница получения информации о мероприятии для гостей
    - [ ] Вывод информации о мероприятиях в профиле
    - [ ] Образование в профиле
*   **Глобально**:
    - Дока на GH-pages уже по этой репе (на основе 19288 страницы)
    - ИСПРАВИТЬ 404 НА РУЧКАХ, КОТОРЫЕ СОДЕРЖАТ В СЕБЕ ID (ЧТОБЫ ОТВЕТ БЫЛ В ВИДЕ "ПОЛЬЗОВАТЕЛЬ/ИВЕНТ/Т.Д. С ТАКИМ ID НЕ НАЙДЕН") - СЕЙЧАС НОРМ ТОЛЬКО WEB EVENT/ID И API/EDU/ID/DELETE - ВСЁ ОСТАЛЬНОЕ ВОЗВРАЩАЕТ НЕТ ПУТИ
    - [ ] Стянуть из 19289 тэги
    - [ ] Сделать подписку на теги и рассылку
    - [ ] Добавить образование

## Done:
- [x]   Информация о пользователе с api для его редактирования
- [x]   api по созданию и управлению мероприятиями, мэнэджерами и задачами
- [x]   api админка с просмотром информации о пользователях, списках, возможностях изменять привелегии, баны
- [x]   api логика по аккаунтам - авторизация, пароли, сессии
- [x]   Модуль почты на подтверждение писем, на сброс пароля и на оповещение о 500
