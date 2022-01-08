CREATE DATABASE smetask;

CREATE TABLE task(
    ta_id SERIAL PRIMARY KEY,
    ta_title VARCHAR(255) NOT NULL,
    ta_description VARCHAR(255) NOT NULL,
    ta_assignTo VARCHAR(255) NOT NULL,
    ta_createdat VARCHAR(14) NOT NULL,
    ta_status VARCHAR(255) NOT NULL,
    ta_duedate VARCHAR(14) NOT NULL,
    ta_fileUrl VARCHAR(255)
);

CREATE TABLE task(ta_id SERIAL PRIMARY KEY,ta_title VARCHAR(255) NOT NULL,ta_description VARCHAR(255) NOT NULL,ta_assignTo VARCHAR(255) NOT NULL,ta_createdat VARCHAR(14) NOT NULL,ta_status VARCHAR(255) NOT NULL,ta_duedate VARCHAR(14) NOT NULL,ta_fileUrl VARCHAR(255));

INSERT INTO task(ta_title,ta_description,ta_assignto,ta_createdat,ta_status,ta_duedate) VALUES('Upgrade Modem','Serba Dinamik Sdn Bhd requests to change modem to a newer model.','FADHLAN RAHIMI','20211215132500','TO DO','20211222000000');

INSERT INTO task(ta_title,ta_description,ta_assignto,ta_createdat,ta_status,ta_duedate) VALUES('WiFi Installation','Serba Dinamik Sdn Bhd requests for WiFi installation.','NIK MOHAMAD IDHAN','20211219132500','TO DO','20211225000000');

INSERT INTO task(ta_title,ta_description,ta_assignto,ta_createdat,ta_status,ta_duedate) VALUES('Terminate Contrat','Serba Dinamik Sdn Bhd requests for contract termination.','FADHLAN RAHIMI','20211220132500','TO DO','20211222000000');
