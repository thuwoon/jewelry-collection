from flask_restx import Resource, Namespace

from ..dto.auth_dto import login_input_model
from ..dto.user_dto import user_model
from ..dto.error_dto import error_model
from ..extensions import api
from ..services.auth_service import login

authorizations = {
    "jsonWebToken": {
        "type": "apiKey",
        "in": "header",
        "name": "Authorization"
    }
}

ns = Namespace("login")


@ns.route("")
class PostCreate(Resource):
    @ns.expect(login_input_model)
    @ns.marshal_with(user_model)
    @api.response(400, "Bad Request", error_model)
    @api.response(404, "User not found", error_model)
    def post(self):
        payload = ns.payload
        return login(payload)

