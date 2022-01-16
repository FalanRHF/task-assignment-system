create table client (
  cl_uid VARCHAR(100) NOT NULL,
  cl_email VARCHAR(25) NOT NULL,
  cl_fullname VARCHAR(100) NOT NULL,
  cl_phonenum VARCHAR(20),
  cl_cmcode VARCHAR(10) NOT NULL
);

--create table client ( cl_uid VARCHAR(100) NOT NULL, cl_email VARCHAR(25) NOT NULL, cl_fullname VARCHAR(100) NOT NULL, cl_phonenum VARCHAR(20), cl_cmcode VARCHAR(10) NOT NULL);

create table company (
  cm_id SERIAL,
  cm_name VARCHAR(50) NOT NULL,
  cm_code VARCHAR(10),
  cm_detail VARCHAR
);

--create table company (cm_id SERIAL,cm_name VARCHAR(50) NOT NULL,cm_code VARCHAR(10),cm_detail VARCHAR);

create table employee (
  em_uid VARCHAR(100) NOT NULL,
  em_fullname VARCHAR(25) NOT NULL,
  em_email VARCHAR(25) NOT NULL,
  em_phonenum VARCHAR(20),
  em_state VARCHAR(15) NOT NULL
);

--create table employee ( em_uid VARCHAR(100) NOT NULL, em_fullname VARCHAR(25) NOT NULL, em_email VARCHAR(25) NOT NULL, em_phonenum VARCHAR(20), em_state VARCHAR(15) NOT NULL);

create table users (
  us_uid VARCHAR(100) NOT NULL,
  us_type VARCHAR(25) NOT NULL
);
-- create table users (us_uid VARCHAR(100) NOT NULL,us_type VARCHAR(25) NOT NULL);

create table ticket (
  tc_id VARCHAR(25) NOT NULL,
  tc_cmcode VARCHAR(10) NOT NULL,
  tc_title VARCHAR(50) NOT NULL,
  tc_detail VARCHAR NOT NULL,
  tc_createdat VARCHAR(25) NOT NULL,
  tc_status VARCHAR(15) DEFAULT 'PENDING' NOT NULL,
  tc_filepath VARCHAR,
  tc_assignedto VARCHAR(50),
  tc_duedate  VARCHAR(25),
  tc_importance VARCHAR(10),
  tc_completeddate VARCHAR(25)
);

--create table ticket ( tc_id VARCHAR(25) NOT NULL, tc_cmname VARCHAR(50) NOT NULL, tc_title VARCHAR(50) NOT NULL, tc_detail VARCHAR NOT NULL, tc_createdat VARCHAR(25) NOT NULL, tc_status VARCHAR(15) DEFAULT 'PENDING' NOT NULL, tc_filepath VARCHAR, tc_assignedto VARCHAR(50), tc_duedate  VARCHAR(25), tc_importance VARCHAR(10));

insert into ticket(tc_id, tc_cmname, tc_title, tc_detail, tc_createdat) values ('id','NETSINITY SDN BHD', 'title', 'detail', 'yesterday');

SELECT tc_id,tc_title,tc_status,tc_createdat FROM ticket inner join company on tc_cmname = cm_name
where cm_code='FNXSSB' AND (tc_status = 'PENDING' OR tc_status = 'IN PROGRESS') ORDER BY tc_createdat DESC;
