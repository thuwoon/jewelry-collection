from flask_restx import fields
from app.extensions import api


error_model = api.model("ErrorResponse", {
    "error": fields.String
})