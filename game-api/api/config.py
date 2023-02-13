from datetime import timedelta
import os
from dotenv import load_dotenv 

load_dotenv()
basedir = os.path.abspath(os.path.dirname(__file__))

class DevConfiguration(object):
    ENV = 'dev'
    SECRET_KEY = 'dev'
    JWT_SECRET_KEY = 'dev'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, '../../db','game.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ALLOWED_ORIGINS = ['localhost', '127.0.0.1']
    CORS_ALLOW_HEADERS = ALLOWED_ORIGINS
    DEBUG = True