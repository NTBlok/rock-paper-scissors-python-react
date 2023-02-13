
from flask import request
from api import socketio
from flask_socketio import emit, join_room, leave_room
from api.models import db, Room, Round
from api.resources import round_schema


def getRoomPlayerData(msg):
    roomId = msg.get("roomId", None)
    playerN = msg.get("playerN", None)
    players = msg.get("players", None)
    player = None
    print("server: read players ", players)
    print("server: read playerN ", playerN)
    if players and playerN:
        player = players[str(playerN)]
        print("server: player to process is: ", player)
    return roomId, player, playerN, players
  
def winningPlayerN(user_choice, player_choice):
    win = {"rock": "scissors",
            "paper": "rock",
            "scissors": "paper"
    }
    if user_choice == player_choice:
        return "0"
    elif win[user_choice] == player_choice:
        return "1"
    else:
        return "2"
      
      
@socketio.on('join-player-1')
def handleJoinPlayer1(msg):
    roomId = msg.get("roomId", None)
    if roomId:
        join_room(roomId)
    roomSocket = request.sid
    room = Room.query.get(roomId)
    room.user_status = "active"
    room.user_socket = roomSocket
    db.session.add(room)
    db.session.commit()
    emit("joined-player-1", roomSocket)
      
@socketio.on('join-player-2')
def handleJoinPlayer2(msg):
    roomId = msg.get("roomId", None)
    player2 = msg.get("player2", None)
    if roomId:
        join_room(roomId)
    roomSocket = request.sid
    room = Room.query.get(roomId)
    room.player_status = "active"
    room.player_socket = roomSocket
    db.session.add(room)
    db.session.commit()
    emit("player2-joined", roomSocket)
    emit("player2-joined", {"player2": player2}, to=room.user_socket)
      
@socketio.on("make-choice")
def make_choice(msg):
    playerN = msg.get('playerN')
    roomId = msg.get('room')
    choice = msg.get('choice')
    roundN = msg.get('round')
    round = Round.query.filter(Round.room_id == roomId, Round.round_name == roundN).first()
    
    if not round and playerN == "1":
        round = Round(room_id = roomId,
              round_name = roundN,
              user_choice = choice
              )
        db.session.add(round)
        db.session.commit()
        emit('choice-made', {
          "id": round.id,
          "message": "Waiting for player 2."
        })

    elif not round and playerN == "2":
        round = Round(room_id = roomId,
              round_name = roundN,
              player_choice = choice
              )
        db.session.add(round)
        db.session.commit()
        emit('choice-made', {
          "id": round.id,
          "message": "Waiting for player 1."
        })
        
    elif playerN == "1":
        round.user_choice = choice
        db.session.add(round)
        db.session.commit()
        emit('choice-made', {
          "id": round.id,
          "message": "Waiting for player 2."
        })
        
    elif playerN == "2":
        round.player_choice = choice
        db.session.add(round)
        db.session.commit()
        emit('choice-made', {
          "id": round.id,
          "message": "Waiting for player 1."
        })


@socketio.on("check-winner")
def make_choice(msg):    
    roomId = msg.get('room')
    roundN = msg.get('round')    
    round = Round.query.filter(Round.room_id == roomId, Round.round_name == roundN).first()
    if round.user_choice is not None and round.player_choice is not None:
        round.winner = winningPlayerN(round.user_choice, round.player_choice)
        room = Room.query.get(roomId)
        if round.winner == "0": winner_name = "No Winner" 
        elif round.winner == "1": winner_name = room.username
        elif round.winner == "2": winner_name = room.player
        msg = {
          "id": round.id,
          "player1": round.user_choice,
          "player2": round.player_choice,
          "winner": round.winner,
          "winnerName": winner_name
        }
        emit('winner-found', msg, to=room.user_socket)
        emit('winner-found', msg, to=room.player_socket)
        db.session.add(round)
        db.session.commit()
           
        
@socketio.on("playerN-reset")
def reset_opponent(msg):
    playerN = msg.get('playerN')
    roomId = msg.get('roomId')
    roundN = msg.get('roundN')
    room = Room.query.get(roomId)
    msg = {"roundN": roundN}
    if playerN == "1": emit("reset-opponent", msg, to=room.player_socket)
    else: emit("reset-opponent", msg, to=room.user_socket)
      



@socketio.on('exit')
def handleExitRoom(msg):
    print("server: server reieved 'exit' data from client ", msg)
    roomId, player, playerN, players = getRoomPlayerData(msg)
    if roomId and player:
        leave_room(roomId)
        emit("exited-player", playerN)
        print("server: player {0} exited room {1} of players: {2}".format(player, roomId,
              ",".join(["" if val is None else val for val in players.values()]))
              )


@socketio.on('join')
def handleJoinRoom(msg):
    roomId, player, playerN, players = getRoomPlayerData(msg)
    if roomId and player:
        join_room(roomId)
        roomSocket = request.sid
        emit("joined-player", {"playerN": playerN, "roomSocket": roomSocket})
        print("server: player {0} joined room {1} of players: {2}".format(player, roomId,
              ",".join(["" if val is None else val for val in players.values()]))
              )

    