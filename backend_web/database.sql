CREATE DATABASE smetask;

CREATE TABLE task(
    ta_id SERIAL PRIMARY KEY,
    ta_title VARCHAR(255) NOT NULL,
    ta_description VARCHAR(255) NOT NULL,
    ta_assignTo VARCHAR(255) NOT NULL,
    ta_createdat DATE NOT NULL,
    ta_status VARCHAR(255) NOT NULL,
    ta_duedate DATE NOT NULL,
    ta_fileUrl VARCHAR(255)
);