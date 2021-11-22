create table client (
  cl_uid VARCHAR(100) NOT NULL,
  cl_username VARCHAR(25) NOT NULL,
  cl_fullname VARCHAR(25) NOT NULL,
  cl_email VARCHAR(25) NOT NULL,
  cl_curpj VARCHAR(10),
  cl_pjcode text[]
);
-- create table client (cl_uid VARCHAR(100) NOT NULL,cl_username VARCHAR(25) NOT NULL,cl_fullname VARCHAR(25) NOT NULL,cl_email VARCHAR(25) NOT NULL,cl_curpj VARCHAR(10),cl_pjcode text[]);
create table users (
  us_uid VARCHAR(100) NOT NULL,
  us_type VARCHAR(25) NOT NULL
);
-- create table users (us_uid VARCHAR(100) NOT NULL,us_type VARCHAR(25) NOT NULL);

create table ticket (
  tc_id VARCHAR(25),
  tc_pjcode VARCHAR(10),
  tc_title VARCHAR(50),
  tc_detail VARCHAR(100),
  tc_createdat VARCHAR(25),
  tc_status VARCHAR(15) DEFAULT 'PENDING'
);

--create table ticket (tc_id VARCHAR(25),tc_projectname VARCHAR(10),tc_title VARCHAR(50),tc_detail VARCHAR(100),tc_createdat VARCHAR(25),tc_status VARCHAR(15) DEFAULT 'PENDING');

insert into ticket(tc_id,tc_pjcode,tc_title,tc_detail,tc_createdat,tc_status) values('AHLAMI2021100401','AHLAMI','TITLE','DETAIL','20211004125800','PENDING');

insert into ticket(tc_id,tc_pjcode,tc_title,tc_detail,tc_createdat,tc_status) values('AHLAMI2021100402','AHLAMI','TITLE2','DETAIL2','20211004130000','PENDING');