import random
from flask import make_response, render_template

from flask_restx import abort
import jwt
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta
from app.models.user_model import User
from ..models.user_model import Email_confirm
from ..config import SECRET_KEY

from ..extensions import db, api

from flask_mail import Mail, Message

mail = Mail()

def send_email(user):
    try:
        recipient_email = user["email"]
        digits = "0123456789"
        confirm_code =  ''.join(random.choice(digits) for _ in range(6))

        msg = Message('Confirm Your Email', sender='noreply@real.estate.com', recipients=[recipient_email])
        # msg.html = render_template('confirmation_email.html', confirm_code=confirm_code)
        html_content = f"""
        <html>
            <body>
                <div style="text-align: center;">
                    <h1>Email Confirmation</h1>
                </div>
                    <p>Thank you for signing up!</p> 
                    <p>This is your confirmation code:</p>
                <div style="text-align: center;">
                    <h2 style="font-weight: bold; font-size: 20px;
                    ">{confirm_code}</h2>
                </div>
            </body>
        </html>
        """
        msg.html = html_content
        mail.send(msg)
        existing_confirm_data = Email_confirm.query.filter_by(email=user['email']).first()

        if existing_confirm_data:
            existing_confirm_data.confirm_code = confirm_code
            db.session.commit()
        else:
            new_confirm_data = Email_confirm(email=user['email'], confirm_code=confirm_code)
            db.session.add(new_confirm_data)
            db.session.commit()
        return make_response({}, 204)
    except Exception as err:
        error_message = str(err)
        api.abort(500, error=error_message)

def send_email_forget_pw(user):
    try:
        recipient_email = user["email"]
        digits = "0123456789"
        confirm_code =  ''.join(random.choice(digits) for _ in range(6))

        msg = Message('Confirm Your Code To Change Password', sender='noreply@real.estate.com', recipients=[recipient_email])
        # msg.html = render_template('confirmation_email.html', confirm_code=confirm_code)
        html_content = f"""
        <html>
            <body>
                <div style="text-align: center;">
                    <h1>Email Confirmation To Change Password</h1>
                </div>
                    <p>This is your confirmation code:</p>
                <div style="text-align: center;">
                    <h2 style="font-weight: bold; font-size: 20px;
                    ">{confirm_code}</h2>
                </div>
            </body>
        </html>
        """
        msg.html = html_content
        mail.send(msg)
        existing_confirm_data = Email_confirm.query.filter_by(email=user['email']).first()

        if existing_confirm_data:
            existing_confirm_data.confirm_code = confirm_code
            db.session.commit()
        else:
            new_confirm_data = Email_confirm(email=user['email'], confirm_code=confirm_code)
            db.session.add(new_confirm_data)
            db.session.commit()
        return make_response({}, 204)
    except Exception as err:
        error_message = str(err)
        api.abort(500, error=error_message)

def verify_code(user):
    try:
        existing_confirm_data = Email_confirm.query.filter_by(email=user['email']).first()
        if existing_confirm_data and existing_confirm_data.confirm_code == user["confirm_code"]:
            user = User(
                name=user["name"],
                email=user["email"],
                password=user["password"],
                type=user["type"],
                address=user["address"],
                phone=user["phone"],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(user)
            db.session.delete(existing_confirm_data)
            db.session.commit()
            return user
        else:
            api.abort(400, error='invalid code')
    except SQLAlchemyError as err:
        db.session.rollback()
        error_message = str(err)
        if "Duplicate entry" in error_message and "user.email_UNIQUE" in error_message:
            api.abort(400, error='duplicate email')
        elif "Duplicate entry" in error_message and "user.name_UNIQUE" in error_message:
            api.abort(400, error='duplicate name')
        else:
            api.abort(400, error=error_message)


def verify_code_forget_pw(user):
    print('userInfo-=-=> ', user)
    try:
        existing_confirm_data = Email_confirm.query.filter_by(email=user['email']).first()
        if existing_confirm_data and existing_confirm_data.confirm_code == user["confirm_code"]:
            existing_user = User.query.filter_by(email=user["email"]).first()
            existing_user.password = user["password"]
            existing_user.updated_at = datetime.utcnow()
            db.session.delete(existing_confirm_data)
            db.session.commit()
            return user
        else:
            api.abort(400, error='invalid code')
    except SQLAlchemyError as err:
        db.session.rollback()
        error_message = str(err)
        if "Duplicate entry" in error_message and "user.email_UNIQUE" in error_message:
            api.abort(400, error='duplicate email')
        elif "Duplicate entry" in error_message and "user.name_UNIQUE" in error_message:
            api.abort(400, error='duplicate name')
        else:
            api.abort(400, error=error_message)


def create_user(payload):
    try:
        user = User(
            name=payload["name"],
            email=payload["email"],
            password=payload["password"],
            type=payload["type"],
            address=payload["address"],
            phone=payload["phone"],
            verified_at = False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.session.add(user)
        db.session.commit()
        return user
    except SQLAlchemyError as err:
        db.session.rollback()
        error_message = str(err)
        if "Duplicate entry" in error_message and "user.email_UNIQUE" in error_message:
            api.abort(400, error='duplicate email')
        elif "Duplicate entry" in error_message and "user.name_UNIQUE" in error_message:
            api.abort(400, error='duplicate name')
        else:
            api.abort(400, error=error_message)


def get_user_list():
    try:
        return User.query.all()
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def get_user(id):
    try:
        user = User.query.get(id)
        if not user:
            abort(404, error="User not found")
        return user
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def update_user(user, payload):
    try:
        if "name" in payload and payload["name"]:
            user.name = payload["name"]
        if "email" in payload and payload["email"]:
            user.email = payload["email"]
        if "password" in payload and payload["password"]:
            user.password = payload["password"]
        if "type" in payload and payload["type"]:
            user.type = payload["type"]
        if "address" in payload and payload["address"]:
            user.address = payload["address"]
        if "phone" in payload and payload["phone"]:
            user.phone = payload["phone"]
        user.updated_at = datetime.utcnow()
        db.session.commit()
        return user
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def delete_user(user):
    try:
        db.session.delete(user)
        db.session.commit()
        return make_response({}, 204)
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)
