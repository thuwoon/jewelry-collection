from flask_mail import Mail, Message
import os
from flask import Flask

from .extensions import api, db, jwt, socketio
# from .controllers.resources import ns as resources_ns
from .controllers.user_controller import ns as user_ns
from .controllers.post_controller import ns as post_ns
from .controllers.auth_controller import ns as login_ns
from flask_cors import CORS
from .config import Mail_config


from .config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS, SECRET_KEY

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = SQLALCHEMY_TRACK_MODIFICATIONS
    app.config['SECRET_KEY'] = SECRET_KEY

    app.config.from_object(Mail_config)
    Mail(app)

    api.init_app(app)
    db.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")


    # api.add_namespace(resources_ns)
    api.add_namespace(user_ns)
    api.add_namespace(post_ns)
    api.add_namespace(login_ns)

    return app