from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(50), unique = True)
    password = db.Column(db.String(80))
    
    def __repr__(self):
        return '<User {}>'.format(self.username)

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), db.ForeignKey('user.username'))
    user_status = db.Column(db.String(10), default="inactive")
    user_socket = db.Column(db.String(100), default=None)
    opponent = db.Column(db.String(50), default="player")
    player = db.Column(db.String(50), db.ForeignKey('user.username'), default=None)
    player_status = db.Column(db.String(10), default=None)
    player_socket = db.Column(db.String(100), default=None)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    updated = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Room {}>'.format(self.name)
    
class Round(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'))
    room = db.relationship("Room", backref="rounds")
    round_name = db.Column(db.String(10))
    user_choice = db.Column(db.String(10), default=None)
    player_choice = db.Column(db.String(10), default=None)
    winner = db.Column(db.String(50), default=None)

    def __repr__(self):
        return '<Round {0}, {1}>'.format(self.room_id, self.round_name)
        