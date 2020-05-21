from flask import current_app, _app_ctx_stack

from uuid import uuid4
from os.path import join, exists
from os import stat, makedirs
from os import remove as os_remove
from shutil import move, rmtree
from flask import abort

import logging

from app import cfg


class FileManager(object):
    def __init__(self, app=None, file_set_name=None):
        self.__file_set_name = file_set_name
        self.app = app
        if app is not None and file_set_name is not None:
            self.init_app(app)


    def set_file_set(self, file_set):
        self.__file_set_name = file_set


    def init_app(self, app):
        self.__file_set = cfg.FILE_UPLOADS.FILE_SETS[self.__file_set_name]
        self.__file_set.FOLDER = join(
            cfg.FILE_UPLOADS.PARENT_FOLDER,
            self.__file_set.FOLDER
        )
        self.__tmp_folder = join(
            cfg.FILE_UPLOADS.PARENT_FOLDER,
            cfg.FILE_UPLOADS.TEMP_FOLDER
        )


    def __create_folders(self):
        path = self.__file_set.FOLDER
        if not exists(path):
            logging.getLogger(__name__).debug(
                'Creating folder {}'.format(path)
            )
            makedirs(path)

        tmp_path = self.__tmp_folder

        if not exists(tmp_path):
            logging.getLogger(__name__).debug(
                'Creating folder for temporary files {}'.format(path)
            )
            makedirs(tmp_path)


    def __lazy_load(self):
        ctx = _app_ctx_stack.top
        extension_name = '{}_file_manager'.format(self.__file_set_name.lower())
        if ctx is not None:
            if not hasattr(ctx, extension_name):
                setattr(ctx, extension_name, self)
                self.__create_folders()
            return getattr(ctx, extension_name)


    def save(self, data):
        self.__lazy_load()
        file = data['file']
        size = data['size']
        file_extension = file.filename.rsplit('.', 1)[1].lower()        
        if file_extension not in self.__file_set.ALLOWED_EXTENSIONS:
            abort(415, "File extension not supported")
        if file.mimetype not in self.__file_set.ALLOWED_MIME_TYPES:
            abort(415, "File MIME-type not supported")
        if size > self.__file_set.MAX_SIZE:
            abort(413, "File size exceeds allowed limit")

        filename = str(uuid4())
        tmp_path = join(self.__tmp_folder, filename)
        file.save(tmp_path)
        size = stat(tmp_path).st_size
        logging.getLogger(__name__).debug('File size is {}'.format(size))
        if size > self.__file_set.MAX_SIZE:
            remove(tmp_path)
            abort(413, "File size exceeds allowed limit")

        new_path = join(self.__file_set.FOLDER, filename)
        move(tmp_path, new_path)
        logging.getLogger(__name__).debug(
            "Saved file [{id}] at [{path}]".format(
                id=filename,
                path=new_path
            )
        )
        return filename


    def get(self, id):
        self.__lazy_load()
        return self.__file_set.FOLDER, id


    def remove(self, filename):
        self.__lazy_load()
        path = join(self.__file_set.FOLDER, filename)
        if exists(path):
            os_remove(path)
            logging.getLogger(__name__).debug(
                "Removed file [{id}] from [{path}]".format(
                    id=filename,
                    path=path
                )
            )
        else:
            abort(404, "Report not found")


    def purge(self):
        self.__lazy_load()
        path = self.__file_set.FOLDER
        if exists(path):
            logging.getLogger(__name__).info(
                'Removing all user files from {}'.format(path)
            )
            rmtree(path)
            makedirs(path)