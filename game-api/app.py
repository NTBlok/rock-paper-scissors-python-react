import os

from api import app_factory, socketio


app = app_factory()



if __name__ == "__main__":
    socketio.run(app, port=5000)
