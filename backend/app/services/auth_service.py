from flask_restx import abort
from sqlalchemy.exc import SQLAlchemyError
from app.models.user_model import User
from ..extensions import db, api

from functools import wraps
import jwt
from flask import request, abort, current_app

from ..config import SECRET_KEY
from datetime import datetime, timedelta


def login(payload):
    try:
        userData = User(
            email=payload["email"],
            password=payload["password"]
        )
        user = db.session.query(User).filter(
            User.email == userData.email, User.password == userData.password).first()
        if not user:
            abort(404, "User not found")
        else:
            expiration_time = datetime.utcnow() + timedelta(days=3)
            user.token = jwt.encode(
                {"id": user.id, "exp": expiration_time},
                SECRET_KEY,
                algorithm="HS256"
            )
        return user
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers.get("Authorization")
        if not token:
            return {
                "message": "Authentication Token is missing!",
                "data": None,
                "error": "Unauthorized"
            }, 401
        try:
            data = jwt.decode(
                token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            print('tokenData 0-0-> ', data)
            userId = data["id"]
            current_user = User.query.get(userId)

            if current_user is None:
                return {
                    "message": "Invalid Authentication token!",
                    "data": None,
                    "error": "Unauthorized"
                }, 401
        except Exception as e:
            return {
                "message": "Something went wrong",
                "data": None,
                "error": str(e)
            }, 500

        return f(*args, **kwargs)

    return decorated
