DROP TABLE IF EXISTS poll;
CREATE TABLE poll
(
    poll_id integer primary key AUTOINCREMENT,
    question text NOT NULL
);

DROP TABLE IF EXISTS poll_option;
CREATE TABLE poll_option
(
    option_id integer primary key AUTOINCREMENT,
    poll_id int NOT NULL,
    option text NOT NULL
);

DROP TABLE IF EXISTS poll_vote;
CREATE TABLE poll_vote
(
    vote_id integer primary key AUTOINCREMENT,
    poll_id integer NOT NULL,
    option_id integer NOT NULL,
    date string NOT NULL,
    ip_address text NOT NULL
);