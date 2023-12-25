import base64
import json
import os
import random
from flask import make_response
from flask_restx import abort
from sqlalchemy import update
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta
from app.models.post_model import Post, Auction_post
from app.models.user_model import User
from flask_socketio import emit
from flask_mail import Mail, Message


from ..extensions import db, api


# Real-time event handlers for clients to listen for updates
# @socketio.on('connect')
# def handle_connect():
#     print('Client connected')

# @socketio.on('disconnect')
# def handle_disconnect():
#     print('Client disconnected')

# @socketio.on('post_list')  # This decorator specifies the event name
# def handle_custom_event():
#     post_list = Post.query.all()
#     serialized_post_list = [serialize_post(post) for post in post_list]
    
#     print(f'Received WebSocket event: {serialized_post_list}')
    
#     # Emit the 'post_list' event with the list of serialized posts to all connected clients
#     socketio.emit('post_list', serialized_post_list)

# @socketio.on('post_list')
# def handle_custom_event():
#     post_list = Post.query.all()
#     serialized_posts = [serialize_post(post) for post in post_list]
#     print(f'Received WebSocket event: {serialized_posts}')
    
#     # Emit the 'post_list' event with the list of serialized posts to all connected clients
#     socketio.emit('post_list', serialized_posts)

# @socketio.on('login_message')  # This decorator specifies the event name
# def handle_custom_message(message):
#     # Handle the custom message
#     print(f'Received custom message: {message}')
mail = Mail()
def create_post(payload):
    try:
        post = Post(
            reserved = payload["reserved"],
            gem_type = payload["gem_type"],
            item_type = payload["item_type"],
            color = payload["color"],
            transparency = payload["transparency"],
            shape = payload["shape"],
            weight = payload["weight"],
            origin = payload["origin"],
            price = payload["price"],
            description = payload["description"],
            # img = payload["img"],
            created_user_id = payload["created_user_id"],
            # item_code = payload["item_code"],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        print('post-=-=-> ', post)
        db.session.add(post)
        db.session.commit()
        post = Post.query.order_by(Post.id.desc()).first()

        assets_folder = "/Users/arkarmyo/Documents/jade-spark/frontend/src/assets"
        if not os.path.exists(assets_folder):
            os.makedirs(assets_folder)
        image_folder = f"/Users/arkarmyo/Documents/jade-spark/frontend/src/assets/{post.id}"

        if not os.path.exists(image_folder):
            os.makedirs(image_folder)
        post_list = []
        index = 0
        for img in payload['img']:
            image_path = os.path.join(image_folder, f"{index}.png")
            base64_string = img.split(',')[1]
            decoded_image = base64.b64decode(base64_string)
            post_list.append(f"assets/{post.id}/{index}.png")
            with open(image_path, "wb") as fh:
                fh.write(decoded_image)
            index = index + 1
        post.img = json.dumps(post_list)

        digits = "0123456789ABCDEFGHIJ"
        item_code =  f"{post.id}".join(random.choice(digits) for _ in range(6))
        post.item_code = item_code
        db.session.commit()
        return {}, 201
    except SQLAlchemyError as err:
        db.session.rollback()
        error_message = str(err)
        if "Duplicate entry" in error_message and "post.name_UNIQUE" in error_message:
            api.abort(400, error='duplicate name')
        else:
            api.abort(400, error=error_message)



    
def get_post_list():
    try:
        post_list = Post.query.all()
        for post in post_list:
            post.img = json.loads(post.img)

        # Emit the 'post_list' event with the list of serialized posts to all connected clients
        # socketio.emit('post_list', serialized_posts)
        # print('emitted the post list---> ')
        return post_list
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


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

def get_post(id):
    try:
        post = Post.query.get(id)
        if not post:
            abort(404, error="Post not found")
        return post
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def update_post(post, payload):
    try:
        post.reserved = payload["reserved"]
        if "gem_type" in payload and payload["gem_type"]:
            post.gem_type = payload["gem_type"]
        if "item_type" in payload and payload["item_type"]:
            post.item_type = payload["item_type"]
        if "color" in payload and payload["color"]:
            post.color = payload["color"]
        if "transparency" in payload and payload["transparency"]:
            post.transparency = payload["transparency"]
        if "shape" in payload and payload["shape"]:
            post.shape = payload["shape"]
        if "weight" in payload and payload["weight"]:
            post.img = payload["img"]
        if "origin" in payload and payload["origin"]:
            post.origin = payload["origin"]
        if "price" in payload and payload["price"]:
            post.price = payload["price"]
        if "description" in payload and payload["description"]:
            post.description = payload["description"]
        # if "img" in payload and payload["img"]:
        #     post.img = payload["img"]
        assets_folder = "/Users/arkarmyo/Documents/jade-spark/frontend/src/assets"
        if not os.path.exists(assets_folder):
            os.makedirs(assets_folder)
        image_folder = f"/Users/arkarmyo/Documents/jade-spark/frontend/src/assets/{post.id}"

        if not os.path.exists(image_folder):
            os.makedirs(image_folder)
        post_list = []
        index = 0
        for img in payload['img']:
            if "assets" not in img:
                image_path = os.path.join(image_folder, f"{index}.png")
                base64_string = img.split(',')[1]
                decoded_image = base64.b64decode(base64_string)
                post_list.append(f"assets/{post.id}/{index}.png")
                with open(image_path, "wb") as fh:
                    fh.write(decoded_image)
            else: 
                post_list.append(img)
            index = index + 1
        post.img = json.dumps(post_list)
        if "created_user_id" in payload and payload["created_user_id"]:
            post.created_user_id = payload["created_user_id"]
        # if "item_code" in payload and payload["item_code"]:
        #     post.item_code = payload["item_code"]
        
        db.session.commit()
        post.updated_at = datetime.utcnow()
        return {}, 201
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def delete_post(post):
    try:
        db.session.delete(post)
        db.session.commit()
        return make_response({}, 204)
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def create_auction(payload):
    try:
        auction_post = Auction_post(
            gem_type = payload["gem_type"],
            item_type = payload["item_type"],
            color = payload["color"],
            transparency = payload["transparency"],
            shape = payload["shape"],
            weight = payload["weight"],
            origin = payload["origin"],
            price = payload["price"],
            description = payload["description"],
            auction_price = payload['price'],
            winner_id = payload['winner_id'],
            created_user_id = payload["created_user_id"],
            email_done = False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        # if "img" in payload and payload["img"]:
        #     post.img = save_image(payload)
        db.session.add(auction_post)
        db.session.commit()
        # emit('new_auction', auction_post.serialize(), broadcast=True)

        auction_post = Auction_post.query.order_by(Auction_post.id.desc()).first()
        

        assets_folder = "/Users/arkarmyo/Documents/jade-spark/frontend/src/assets"
        if not os.path.exists(assets_folder):
            os.makedirs(assets_folder)
        image_folder = f"/Users/arkarmyo/Documents/jade-spark/frontend/src/assets/auction_{auction_post.id}"

        if not os.path.exists(image_folder):
            os.makedirs(image_folder)
        post_list = []
        index = 0
        for img in payload['img']:
            image_path = os.path.join(image_folder, f"{index}.png")
            base64_string = img.split(',')[1]
            decoded_image = base64.b64decode(base64_string)
            post_list.append(f"assets/auction_{auction_post.id}/{index}.png")
            print('post_list-=-=-=> ', post_list)
            with open(image_path, "wb") as fh:
                fh.write(decoded_image)
            index = index + 1
        auction_post.img = json.dumps(post_list)

        digits = "0123456789ABCDEFGHIJ"
        item_code =  f"{auction_post.id}".join(random.choice(digits) for _ in range(6))
        auction_post.item_code = item_code
        
        db.session.commit()

        return {}, 201
    except SQLAlchemyError as err:
        db.session.rollback()
        error_message = str(err)
        if "Duplicate entry" in error_message and "post.name_UNIQUE" in error_message:
            api.abort(400, error='duplicate name')
        else:
            api.abort(400, error=error_message)

# def get_auction_list():
#     try:
#         post_list_toupdate = []
#         auction_list = Auction_post.query.all()
#         print('auction_list-=-> ', auction_list)
#         one_day_ago = datetime.now() - timedelta(days=1)
#         # auction_list = Auction_post.query.filter(Auction_post.created_at >= one_day_ago).all()
#         # auction_list = Auction_post.query.all()
#         user_list = User.query.all()
#         for post in auction_list:
#             # post.img = json.loads(post.img)
#             print('each_post-=> ', post.img)
#             winner_id = post.winner_id
#             print('winner_id-=-> ', winner_id)
#             # auction_winner = User.query.filter_by(id=post.winner_id).first()
#             # print('auction_winner-=-+> ', auction_winner)
            
            
#             if not post.email_done and post.created_at < one_day_ago: 
#                 post.email_done = True
#                 # user_list.append(auction_winner)
#                 print('user_list-=-=> ', user_list)
#                 for each in user_list:

#                     # digits = "0123456789"
#                     # confirm_code =  ''.join(random.choice(digits) for _ in range(6))
#                     if each.type == 0 or each.id == winner_id:
#                         msg = Message('Confirm Your Email', sender='noreply@real.estate.com', recipients=[each.email])
#                         # msg.html = render_template('confirmation_email.html', confirm_code=confirm_code)
#                         html_content = f"""
#                         <html>
#                             <body>
#                                 <div style="text-align: center;">
#                                     <h1>Winner Decleration</h1>
#                                 </div>
#                                     <p>This mail is to inform the winner of the auction.</p> 
#                                     <p>The details of the auction are as following. </p>
#                                 <div style="
#                                 text-align: left;
#                                 width: 400px;
#                                 margin: 0 auto;
#                                 ">
#                                     <table style="
#                                     width: 100%;
#                                 ">
#                                     <tr>
#                                         <td style="font-weight: bold;">Winner ID:</td>
#                                         <td>{post.winner_id}</td>
#                                     </tr>
                                    
#                                     <tr>
#                                         <td style="font-weight: bold;">Item Id:</td>
#                                         <td>{post.id}</td>
                                        
#                                     </tr>
#                                     <tr>
#                                         <td style="font-weight: bold;">Item Code:</td>
#                                         <td>{post.item_code}</td>
                                        
#                                     </tr>
#                                     <tr>
#                                         <td style="font-weight: bold;">Winning Price:</td>
#                                         <td>{post.auction_price}</td>
#                                     </tr>
#                                 </table>
#                                 </div>
#                             </body>
#                         </html>
#                         """
#                         msg.html = html_content
#                         mail.send(msg)
#                 if post.created_at < one_day_ago:
#                     auction_list.remove(post)
#                 print('post_img-=-> ', post.img)
#         # socketio.emit('auction_list', {'auction_list': auction_list})
#         db.session.commit()
#         for post in auction_list:
#             post.img = json.loads(post.img)
#         print('final auctions-=> ', auction_list)
#         return auction_list
#     except SQLAlchemyError as err:
#         error_message = str(err)
#         api.abort(400, error=error_message)


def get_auction_list():
    print('auction list function')
    try:
        one_day_ago = datetime.now() - timedelta(days=1)
        auction_list = Auction_post.query.filter(
            Auction_post.email_done == False,
            Auction_post.created_at < one_day_ago
        ).all()

        print('first auction list0=-=-=-=-=-> ', auction_list)

        if auction_list:
            # Use SQLAlchemy's update function to set 'email_done' to True for the matching records
            stmt = (
                update(Auction_post)
                .where(
                    Auction_post.id.in_([post.id for post in auction_list])
                )
                .values(email_done=True)
            )

            db.session.execute(stmt)
            db.session.commit()

            # Now the 'email_done' field for matching records has been set to True.
            user_list = User.query.all()
            # for user in user_list:
            #     if (user.id == )
            for post in auction_list:
                # Your email sending code here...
                winner = None
                for user in user_list:
                    print('winner_id-=-> ', post.winner_id, user.id)
                    if post.winner_id == user.id:
                        winner = user
                    if user.type == 0 or user.id == post.winner_id and post.winner_id != 0:
                        msg = Message('Auction Winner', sender='noreply@real.estate.com', recipients=[user.email])
                        # msg.html = render_template('confirmation_email.html', confirm_code=confirm_code)
                        html_content = f"""
                        <html>
                            <body>
                                <div style="text-align: center;">
                                    <h1>Winner Declaration</h1>
                                </div>
                                    <p>This mail is to inform the winner of the auction.</p> 
                                    <p>The details of the auction are as following. </p>
                                <div style="
                                text-align: left;
                                width: 400px;
                                margin: 0 auto;
                                ">
                                    <table style="
                                    width: 100%;
                                ">

                                    <tr>
                                        <td style="font-weight: bold;">Winner Name:</td>
                                        <td>{winner.name}</td>
                                    </tr>

                                    <tr>
                                        <td style="font-weight: bold;">Winner Phone:</td>
                                        <td>{winner.phone}</td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="font-weight: bold;">Item Code:</td>
                                        <td>{post.item_code}</td>
                                        
                                    </tr>
                                    <tr>
                                        <td style="font-weight: bold;">Winning Price:</td>
                                        <td>{post.auction_price}</td>
                                    </tr>
                                </table>
                                </div>
                            </body>
                        </html>
                        """
                        msg.html = html_content
                        mail.send(msg)
        # auction_list = Auction_post.query.filter(Auction_post.created_at >= one_day_ago).all()
        auction_list = Auction_post.query.all()
        print('final list-=-=> ', auction_list)
        for post in auction_list:
            post.img = json.loads(post.img)
        return auction_list
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)



def get_auction(id):
    try:
        auction_post = Auction_post.query.get(id)
        if not auction_post:
            abort(404, error="Post not found")
        return auction_post
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def update_auction(post, payload):
    try:
        # post.reserved = payload["reserved"]
        if "gem_type" in payload and payload["gem_type"]:
            post.gem_type = payload["gem_type"]
        if "item_type" in payload and payload["item_type"]:
            post.item_type = payload["item_type"]
        if "color" in payload and payload["color"]:
            post.color = payload["color"]
        if "transparency" in payload and payload["transparency"]:
            post.transparency = payload["transparency"]
        if "shape" in payload and payload["shape"]:
            post.shape = payload["shape"]
        if "weight" in payload and payload["weight"]:
            post.img = payload["img"]
        if "origin" in payload and payload["origin"]:
            post.origin = payload["origin"]
        if "price" in payload and payload["price"]:
            post.price = payload["price"]
        if "description" in payload and payload["description"]:
            post.description = payload["description"]
        # if "img" in payload and payload["img"]:
        #     post.img = payload["img"]
        if "auction_price" in payload and payload["auction_price"]:
            post.auction_price = payload["auction_price"]
        if "winner_id" in payload and payload["winner_id"]:
            post.winner_id = payload["winner_id"]
        if "item_code" in payload and payload["item_code"]:
            post.item_code = payload["item_code"]
        if "created_user_id" in payload and payload["created_user_id"]:
            post.created_user_id = payload["created_user_id"]
        post.updated_at = datetime.utcnow()

        if "img" in payload and payload["img"]:
            assets_folder = "/Users/arkarmyo/Documents/jade-spark/frontend/src/assets"
            if not os.path.exists(assets_folder):
                os.makedirs(assets_folder)
            image_folder = f"/Users/arkarmyo/Documents/jade-spark/frontend/src/assets/auction_{post.id}"

            if not os.path.exists(image_folder):
                os.makedirs(image_folder)
            post_list = []
            index = 0
            print('images-=-=-=-> ', payload['img'])
            for img in payload['img']:
                print('assets-=> ',"assets" not in img)
                if "assets" not in img:
                    image_path = os.path.join(image_folder, f"{index}.png")
                    base64_string = img.split(',')[1]
                    decoded_image = base64.b64decode(base64_string)
                    post_list.append(f"assets/auction_{post.id}/{index}.png")
                    with open(image_path, "wb") as fh:
                        fh.write(decoded_image)
                else: 
                    post_list.append(img)
                index = index + 1
                post.img = json.dumps(post_list)
        db.session.commit()
        return {}, 201
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def delete_auction(post):
    try:
        db.session.delete(post)
        db.session.commit()
        return make_response({}, 204)
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def search_post(payload):
    gem_type = None
    item_type = None
    if "gem_type" in payload and payload["gem_type"]:
            gem_type = payload["gem_type"]
    if "item_type" in payload and payload["item_type"]:
            item_type = payload["item_type"]
    try:
        query = Post.query
        if gem_type:
            query = query.filter((Post.gem_type.ilike(f"%{gem_type}%") ))
        if item_type: 
            query = query.filter((Post.item_type.ilike(f"%{item_type}")))
        posts = query.all()
        for post in posts:
            post.img = json.loads(post.img)

        if not posts:
            abort(404, error="No post found with the given search criteria")

        return posts
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def search_auc_post(payload):
    print('auction search -=-=> ', payload)
    gem_type = None
    item_type = None
    if "gem_type" in payload and payload["gem_type"]:
            gem_type = payload["gem_type"]
    if "item_type" in payload and payload["item_type"]:
            item_type = payload["item_type"]
    try:
        query = Auction_post.query
        if gem_type:
            query = query.filter((Auction_post.gem_type.ilike(f"%{gem_type}%") ))
        if item_type: 
            query = query.filter((Auction_post.item_type.ilike(f"%{item_type}")))
        posts = query.all()
        for post in posts:
            post.img = json.loads(post.img)

        if not posts:
            abort(404, error="No post found with the given search criteria")
        print('auction posts===> ', posts)
        return posts
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


