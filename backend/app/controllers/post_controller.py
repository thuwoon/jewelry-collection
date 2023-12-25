from flask_restx import Resource, Namespace, abort

from ..dto.post_dto import post_model, post_input_model, auction_model, post_search_model
from ..services.auth_service import token_required

from ..models.post_model import Post, Auction_post
from ..services.post_service import create_auction, create_post, delete_auction, get_auction, get_post, get_post_list, search_auc_post, update_auction, update_post, delete_post, get_auction_list, search_post
from ..extensions import socketio

ns = Namespace("post")


@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('login_message')  # This decorator specifies the event name
def handle_custom_message(message):
    # Handle the custom message
    print(f'Received custom message: {message}')

@socketio.on('custom_event')
def handle_custom_event():
    post_list = get_post_list()
    serialized_post_list = [serialize_post(post) for post in post_list]
    print('Received custom event:', serialized_post_list)


def serialize_post(post):
    post = {
            'id': post.id,
            'reserved': post.reserved,
            'gem_type': post.gem_type,
            'item_type': post.item_type,
            'color': post.color,
            'transparency': post.transparency,
            'shape': post.shape,
            'weight': post.weight,
            'origin': post.origin,
            'price': post.price,
            'description': post.description,
            'img': post.img,
            'created_user_id': post.created_user_id,
            # item_code = payload["item_code"],
            'created_at': post.created_at.isoformat(),
            'updated_at': post.updated_at.isoformat()
    }
    # print('post0=-=-> ', post)
    return post

# @ns.route("/hello")
# class Hello(Resource):
#     def get(self):
#         return {"hello": "restx"}


# @ns.route("/images/<filename>")
# class GetImage(Resource):
#     def get(self, filename):
#         print("image-=-=-==> ", filename)
#         # current_dir = os.path.dirname(os.path.abspath(__file__))
#         # assets_folder = os.path.join(current_dir, '..', 'services', 'assets')
#         assets_folder  = "/Users/arkarmyo/Documents/real_estate_system/backend/app/services/assets/"
#         image_directory = os.path.join(assets_folder, filename)
#         print("image-=-=-==> ", image_directory)
#         return send_from_directory(image_directory, filename)


@ns.route("")
class PostCreate(Resource):
    @ns.expect(post_input_model)
    @ns.marshal_with(post_model)
    def post(self):
        payload = ns.payload
        return create_post(payload)
    

@ns.route("/list")
class PostListApi(Resource):
    # @token_required
    @ns.marshal_list_with(post_model)
    def get(self):
        return get_post_list()
    

@ns.route("/<int:id>")
class PostAPI(Resource):
    @ns.marshal_with(post_model)
    def get(self, id):
        post = Post.query.get(id)
        if not post:
            abort(404, error="post not found")
        return get_post(id)

    @ns.expect(post_input_model)
    @ns.marshal_with(post_model)
    def put(self, id):
        post = Post.query.get(id)
        if not post:
            abort(404, error="post not found")
        payload = ns.payload
        return update_post(post, payload)

    def delete(self, id):
        post = Post.query.get(id)
        if not post:
            abort(404, error="post not found")
        return delete_post(post)
    
@ns.route("/auction")
class AuctionCreate(Resource):
    @ns.expect(auction_model)
    @ns.marshal_with(auction_model)
    def post(self):
        payload = ns.payload
        return create_auction(payload)


@ns.route("/auction/list")
class PostListApi(Resource):
    # @token_required
    @ns.marshal_list_with(auction_model)
    def get(self):
        return get_auction_list()


@ns.route("/auction/<int:id>")
class AuctionAPI(Resource):
    @ns.marshal_with(auction_model)
    def get(self, id):
        auction_post = Auction_post.query.get(id)
        if not auction_post:
            abort(404, error="post not found")
        return get_auction(id)

    @ns.expect(auction_model)
    @ns.marshal_with(auction_model)
    def put(self, id):
        auction_post = Auction_post.query.get(id)
        if not auction_post:
            abort(404, error="post not found")
        payload = ns.payload
        return update_auction(auction_post, payload)

    def delete(self, id):
        auction_post = Auction_post.query.get(id)
        if not auction_post:
            abort(404, error="post not found")
        return delete_auction(auction_post)
    

@ns.route("/search")
class PostSearchApi(Resource):
    @ns.expect(post_search_model)
    @ns.marshal_list_with(post_model)
    def post(self):
        payload = ns.payload
        return search_post(payload)
    

@ns.route("/auction/search")
class PostSearchApi(Resource):
    @ns.expect(post_search_model)
    @ns.marshal_list_with(auction_model)
    def post(self):
        payload = ns.payload
        return search_auc_post(payload)