create table users (
     username varchar(50) primary key,
     user_password varchar(100) not null
     );

CREATE table rooms(
    room_id VARCHAR(6) primary key,
     room_password varchar(100) not null,
     invite_link varchar(300) unique not null,
     read_link varchar(300) unique not null
     );

CREATE TABLE workspace(
    username varchar(50) references users(username),
    room_id char(6) references rooms(room_id),
    is_owner boolean default false,
    primary key(username, room_id)
);

CREATE table canvas(
    element_id VARCHAR(50) primary key,
    element_type varhcar(50) not null,
    properties jasonb,
    room_id varchar(6) references rooms(room_id),
    created_by varchar(50) references users(username),
    modified_by varchar(50) references users(username)

);