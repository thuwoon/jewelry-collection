import os

basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:admin123@localhost/jade_gallery'
SQLALCHEMY_TRACK_MODIFICATIONS = False

SECRET_KEY = "thisissamplesecretkey"

class Mail_config:
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USERNAME = 'example@gmail.com'
    MAIL_PASSWORD = 'helloHowAreYou'
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True