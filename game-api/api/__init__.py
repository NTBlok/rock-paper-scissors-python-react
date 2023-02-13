""" An intermediary bootstrapping file that makes factories of various reusable app components. """

import typing as t
from flask import Flask
from flask_cors import CORS
from api.config import DevConfiguration
from flask_socketio import SocketIO

socketio = SocketIO(logger=True, engineio_logger=True, cors_allowed_origins="*")

def app_factory(config: t.Optional[t.Dict[str, t.Any]] = None) -> Flask:
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(DevConfiguration)
    app.config.update(**(config or {}))
    from api.models import db
    db.init_app(app)
    from api.resources import ma
    ma.init_app(app)
    from api.routes import jwt, main
    jwt.init_app(app)
    
    app.register_blueprint(main)

    with app.app_context():
        db.create_all()
        
    import api.routes
    socketio.init_app(app)
    import api.sockets

    return app
