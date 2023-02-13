from flask_marshmallow import Marshmallow
from api.models import db, Room, User, Round

ma = Marshmallow()

class UserSchema(ma.SQLAlchemySchema):
    class Meta:
      model = User
      load_instance = True
      sqla_session = db.session
    
    id = ma.auto_field()
    username = ma.auto_field()
    password = ma.auto_field()

class RoomSchema(ma.SQLAlchemySchema):
    class Meta:
      model = Room
      load_instance = True
      sqla_session = db.session
    
    id = ma.auto_field()
    username = ma.auto_field()
    user_status = ma.auto_field()
    user_socket = ma.auto_field()
    opponent = ma.auto_field()
    player = ma.auto_field()
    player_status = ma.auto_field()
    player_socket = ma.auto_field()
    created = ma.auto_field()
    updated = ma.auto_field()
    rounds = ma.auto_field()
    
class RoundSchema(ma.SQLAlchemySchema):
    class Meta:
      model = Round
      load_instance = True
      sqla_session = db.session
      
    id = ma.auto_field()
    room_id = ma.auto_field()
    round_name = ma.auto_field()
    user_choice = ma.auto_field()
    player_choice = ma.auto_field()
    winner = ma.auto_field()
    
    
round_schema = RoundSchema()
rounds_schema = RoundSchema(many=True)
user_schema = UserSchema()
room_schema = RoomSchema()