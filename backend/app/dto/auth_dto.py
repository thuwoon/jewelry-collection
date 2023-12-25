from flask_restx import fields
from app.extensions import api

login_input_model = api.model("LoginInput", {
    "email": fields.String,
    "password": fields.String
})

error_model = api.model("ErrorResponse", {
    "error": fields.String
})