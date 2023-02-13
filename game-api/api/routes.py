from datetime import datetime
import json
from flask import Blueprint, make_response
from api.models import db, User, Room, Round
from api.resources import room_schema, user_schema, round_schema, rounds_schema
from flask_cors import cross_origin
from flask import jsonify
from flask import request
from flask_jwt_extended import create_access_token, current_user, unset_jwt_cookies, get_jwt
# from flask_jwt_extended import current_user
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash, check_password_hash

main = Blueprint('main', __name__)

jwt = JWTManager()


@main.route("/health-check")
def health_check():
    return {"success": True}
    
@main.route("/", methods=["GET"])
def base():
    return """
    <body>
    <ul>
      <li><a href="http://localhost:5000/rounds">rounds</a></li>
    </ul>
    </body>
    """


@main.route("/register", methods=["POST"])
def register():
    data = request.get_json(force=True)
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user:
        user = User(
            username=username,
            password=generate_password_hash(password)
        )
        db.session.add(user)
        db.session.commit()
        # return make_response('Successfully registered.', 201)
        return {"message": "Successfully registered.", "user": user.id}
    else:
        return {"message": 'User already exists. Please Log in.', "user": None}


@jwt.user_identity_loader
def user_identity_lookup(user):
    return user


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(username=identity).one_or_none()


@main.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(datetime.timezone.utc)
        target_timestamp = datetime.timestamp(
            now + datetime.timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response


@main.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if not user:
        return {"message": "User does not exist"}

    if check_password_hash(user.password, password):
        access_token = create_access_token(identity=username)
        return {"message": "Successfully logged in.", "user": user.id, "token": access_token}

    return {"message": "Wrong password"}


@main.route("/who_am_i", methods=["GET"])
@jwt_required()
def protected():
    user = User.query.filter_by(username=current_user.username).first()
    result = user_schema.dump(user)
    return {"user": {
        "id": result["id"],
        "username": result["username"],
        "rooms": result["rooms"]
    }}


@jwt_required()
@cross_origin({"origins": ['localhost', '127.0.0.1']})
@main.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "Logout successful."})
    unset_jwt_cookies(response)
    return response

# @jwt_required()


@main.route("/room", methods=["POST"])
def room():
    data = request.get_json(force=True)
    username = data.get('username')
    opponent = data.get('opponent')

    room = Room(username=username,
                opponent=opponent
                )
    db.session.add(room)
    db.session.commit()
    return {"message": "Room created.", "room": room.id}

# @jwt_required()
@main.route("/room/<int:room_id>", methods=["GET"])
def get_room(room_id):
    room_id = int(room_id)
    room = Room.query.get(room_id)
    if not room:
        return {"message": "Room does not exist"}
      
    result = room_schema.dump(room)
    return {
            "id": result["id"],
            "player1": result["username"],
            "player1socket": result["user_socket"],
            "player1status": result["user_status"],
            "player2": result["player"],
            "player2socket": result["player_socket"],
            "player2status": result["player_status"]
            }

@main.route("/room/<int:room_id>", methods=["PATCH"])
def update_player(room_id):
    room_id = int(room_id)
    room = Room.query.get(room_id)
    if not room:
        return {"message": "Room does not exist"}

    data = request.get_json(force=True)
    username = data.get('username')
    status = data.get('status', None)
    room_socket = data.get('roomSocket', None)

    message = ""
    room.updated = datetime.utcnow()
    if (room.username != username) and (room.player is None):
        room.player = username
        message = "Player added to room."
    elif (room.username != username):
        if status:
            room.player_status = status
            message = "Player status updated."
        if room_socket:
            room.player_socket = room_socket
            message = message + "Player socket updated."
    else:
        if status:
            room.user_status = status
            message = "User status updated."
        if room_socket:
            room.user_socket = room_socket
            message = message + "User socket updated."

    db.session.add(room)
    db.session.commit()
    return {"message": message,
            "room": room.id,
            "player1": room.username,
            "player1_status": room.user_status,
            "player1_socket": room.user_socket,
            "player2": room.player,
            "player2_status": room.player_status,
            "player2_socket": room.player_socket
            }

@main.route("/rounds", methods=["GET"])
def rounds():
    all_rounds = Round.query.all()
    rounds_sch = rounds_schema.dump(all_rounds)
    rounds = []
    for round in rounds_sch:
        result = {}
        result["id"] = round["id"]
        result["room_id"] = round["room_id"]
        result["round_name"] = round["round_name"]
        result["user_choice"] = round["user_choice"]
        result["player_choice"] = round["player_choice"]
        result["winner"] = round["winner"]
        rounds.append(result)
    return json.dumps(rounds)

@main.route("/rounds/<int:room_id>", methods=["GET"])
def room_rounds(room_id):
    all_rounds = Round.query.filter(Round.room_id == room_id).all()
    rounds_sch = rounds_schema.dump(all_rounds)
    rounds = []
    for round in rounds_sch:
        result = {}
        result["id"] = round["id"]
        result["round_name"] = round["round_name"]
        result["user_choice"] = round["user_choice"]
        result["player_choice"] = round["player_choice"]
        result["winner"] = round["winner"]
        rounds.append(result)
    return json.dumps(rounds)
    
@main.route("/wins/<int:room_id>", methods=["GET"])
def room_wins(room_id):
    all_rounds = Round.query.filter(Round.room_id == room_id).all()
    rounds_sch = rounds_schema.dump(all_rounds)
    user_wins = []
    player_wins = []
    for round in rounds_sch:
        if round["winner"] == "1": user_wins.append(round)
        if round["winner"] == "2": player_wins.append(round)
    
    user = len(user_wins)
    player = len(player_wins)
    return {"player1": user, "player2": player}

# @jwt_required()
# @cross_origin({"origins": ['localhost', '127.0.0.1']})
# @main.route("/room/<int:room_id>", methods=["GET"])
# def room(room_id):
#     room = Room.query.get(room_id)
#     result = room_schema.dump(room)
#     return {"room": result}
