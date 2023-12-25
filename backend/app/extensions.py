from flask_sqlalchemy import SQLAlchemy 
from flask_restx import Api
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO

api = Api()
db = SQLAlchemy()
jwt = JWTManager()
socketio = SocketIO()