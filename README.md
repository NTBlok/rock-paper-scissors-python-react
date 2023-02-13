## Rock-Paper-Scissors Python-React

A multiplayer game starter project using Socketio, a Flask api, a Sqlite database, and a React frontend.

To start the api:

```
cd game-api
venv/bin/python app.py
```

To test out the api with Postman, seed the database:

```
cd ../db
rm -r -f game.db
sqlite3 game.db
.read dump.sql
.quit
```

Clean out the database before testing the app and restart the backend:

```
rm -r -f game.db
cd ../game-api
venv/bin/python app.py
```

To start the frontend app:

```
cd ../game-app
yarn start
```