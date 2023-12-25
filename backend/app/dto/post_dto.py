from flask_restx import fields
from app.extensions import api

post_model = api.model("Post", {
    "id" : fields.Integer,
    "reserved": fields.Boolean,
    "gem_type": fields.String,
    "item_type": fields.String,
    "color": fields.String,
    "transparency": fields.String,
    "shape": fields.String,
    "weight": fields.String,
    "origin": fields.String,
    "price": fields.String,
    "description" : fields.String,
    "img": fields.List(fields.String),
    "created_user_id": fields.Integer,
    "item_code" : fields.String,
    "created_at": fields.DateTime(dt_format='iso8601'),
    "updated_at": fields.DateTime(dt_format='iso8601')
})

post_input_model = api.model("PostInput", {
    "id" : fields.Integer,
    "reserved": fields.Boolean,
    "gem_type": fields.String,
    "item_type": fields.String,
    "color": fields.String,
    "transparency": fields.String,
    "shape": fields.String,
    "weight": fields.String,
    "origin": fields.String,
    "price": fields.String,
    "description" : fields.String,
    "img" : fields.String,
    "created_user_id": fields.Integer,
})

auction_model = api.model("PostInput", {
    "id" : fields.Integer,
    "reserved": fields.Boolean,
    "gem_type": fields.String,
    "item_type": fields.String,
    "color": fields.String,
    "transparency": fields.String,
    "shape": fields.String,
    "weight": fields.String,
    "origin": fields.String,
    "price": fields.Integer,
    "description" : fields.String,
    "img": fields.List(fields.String),
    "auction_price": fields.Integer,
    "winner_id": fields.Integer,
    "created_user_id": fields.Integer,
    "item_code" : fields.String,
    "created_at": fields.DateTime(dt_format='iso8601'),
    "email_done": fields.Boolean
})

post_search_model = api.model("PostSearchInput", {
    "text": fields.String,
})