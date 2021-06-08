create table client (
  cl_uid VARCHAR(100) NOT NULL,
  cl_username VARCHAR(25) NOT NULL,
  cl_email VARCHAR(25) NOT NULL,
  cl_password VARCHAR(25) NOT NULL,
  cl_type VARCHAR(25) DEFAULT 'CLIENT'
);
-- create table client (cl_uid VARCHAR(100) NOT NULL,cl_username VARCHAR(25) NOT NULL,cl_email VARCHAR(25) NOT NULL,cl_password VARCHAR(25) NOT NULL,cl_type VARCHAR(25) DEFAULT 'CLIENT');
