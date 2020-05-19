from argparse import ArgumentParser
import bcrypt
import logging
import logging.config

import app
from app import db
from app.config import cfg
from os.path import join, exists
from os import makedirs

logging.config.dictConfig(cfg.LOGGING)

if cfg.DISABLE_EXISTING_LOGGERS:
    log_level = 100
else:
    log_level = cfg.LOG_LEVEL

for name, logger in logging.root.manager.loggerDict.items():
    dot = name.rfind('.', 0, len(name[0]) - 1)
    if dot == -1:
        if not isinstance(logger, logging.PlaceHolder) and name not in cfg.LOGGING['loggers']:
            logger.setLevel(log_level)

for K, V in cfg.FILE_UPLOADS.FILE_SETS.items():
    path = join(cfg.FILE_UPLOADS.PARENT_FOLDER, V.FOLDER)
    if not exists(path):
        logging.getLogger(__name__).debug('Creating folder {}'.format(path))
        makedirs(path)
    cfg.FILE_UPLOADS.FILE_SETS[K].FOLDER = path

tmp_path = join(cfg.FILE_UPLOADS.PARENT_FOLDER, cfg.FILE_UPLOADS.TEMP_FOLDER)

if not exists(tmp_path):
    logging.getLogger(__name__).debug(
        'Creating folder for temporary files {}'.format(path)
    )
    makedirs(tmp_path)
cfg.FILE_UPLOADS.TEMP_FOLDER = tmp_path

def main():

    if cfg.LOG_LEVEL <= 10:
        import logging_tree
        logging_tree.printout()
        import pprint
        pp = pprint.PrettyPrinter()
        pp.pprint(cfg)

    parser = ArgumentParser(description='Events Project service')

    parser.add_argument('--create-tables', action='store_true',
                        dest='create_tables',
                        help='Creates data base tables before launch.')

    args = parser.parse_args()
    
    if args.create_tables:
        pw = bcrypt.hashpw(str(cfg.SUPER_ADMIN_PASSWORD).encode('utf-8'), bcrypt.gensalt())
        db.create_tables(pw.decode('utf-8'))
    cfg.SUPER_ADMIN_PASSWORD = ""

    logging.info('Starting server')
    logging.info('IP: ' + cfg.HOST + '  PORT: ' + str(cfg.PORT))
    app.run()


if __name__ == '__main__':
    main()
