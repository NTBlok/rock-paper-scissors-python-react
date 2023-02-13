-- (re-)generate initial db by running
-- $ rm game.db
-- $ sqlite3 game.db
-- > .read dump.sql
-- > .quit

-- PRAGMA foreign_keys=ON;
BEGIN TRANSACTION;
CREATE TABLE user (
  id integer PRIMARY KEY,
  username string,
  password string
);
INSERT INTO user VALUES(1, 'indy', 'i123');
INSERT INTO user VALUES(2, 'enzo', 'e123');
CREATE TABLE room (
    id integer PRIMARY KEY,
    username string,
    user_status string,
    user_socket string,
    opponent string,
    player string,
    player_status string,
    player_socket string,
    created datetime,
    updated datetime,
    FOREIGN KEY (username) REFERENCES user(username),
    FOREIGN KEY (player) REFERENCES user(username)
);
INSERT INTO room VALUES(1, 'indy', 'active', '123abc', 'player', 'enzo', 'active', '456xyz', '2023-02-04 18:00:00', '2023-02-04 18:00:00');
INSERT INTO room VALUES(2, 'enzo', 'active', '109aab', 'player', 'indy', 'active', '223wuv', '2023-02-04 18:00:00', '2023-02-04 18:00:00');
CREATE TABLE round (
    id integer PRIMARY KEY,
    room_id integer,
    round_name string,
    user_choice string,
    player_choice string,
    winner string,
    FOREIGN KEY (room_id) REFERENCES room(id)
);
INSERT INTO round VALUES(1, 1, 1, 'paper', 'rock', 1);
INSERT INTO round VALUES(2, 1, 2, 'paper', 'paper', 0);
INSERT INTO round VALUES(3, 1, 3, 'scissors', 'paper', 1);
INSERT INTO round VALUES(4, 1, 4, 'paper', 'scissors', 2);
INSERT INTO round VALUES(5, 2, 1, 'rock', 'scissors', 1);
INSERT INTO round VALUES(6, 2, 2, 'scissors', 'scissors', 0);
INSERT INTO round VALUES(7, 2, 3, 'scissors', 'rock', 2);
COMMIT;
