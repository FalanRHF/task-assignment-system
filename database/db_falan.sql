create table client (
  cl_uid VARCHAR(100) NOT NULL,
  cl_username VARCHAR(25) NOT NULL,
  cl_email VARCHAR(25) NOT NULL,
  cl_password VARCHAR(25) NOT NULL,
  cl_type VARCHAR(25) DEFAULT 'CLIENT'
);
-- create table client (cl_uid VARCHAR(100) NOT NULL,cl_username VARCHAR(25) NOT NULL,cl_email VARCHAR(25) NOT NULL,cl_password VARCHAR(25) NOT NULL,cl_type VARCHAR(25) DEFAULT 'CLIENT');

create table ticket (
  tc_id VARCHAR(25),
  tc_projectname VARCHAR(10),
  tc_title VARCHAR(50),
  tc_detail VARCHAR(100),
  tc_createdat VARCHAR(25)
);

--create table ticket (tc_id VARCHAR(25),tc_projectname VARCHAR(10),tc_title VARCHAR(50),tc_detail VARCHAR(100),tc_createdat VARCHAR(25));