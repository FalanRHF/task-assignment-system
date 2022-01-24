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

create table kpi (
  kp_id VARCHAR(6) NOT NULL,
  kp_year VARCHAR(4) NOT NULL,
  kp_month VARCHAR(2) NOT NULl,
  kp_data VARCHAR
)

create table kpi (
  kp_id VARCHAR(6) NOT NULL,
  kp_data JSON,
  kp_emname VARCHAR(25),
  kp_emscore DECIMAL
);

INSERT INTO kpi (kp_id, kp_data, kp_emname, kp_emscore) VALUES ('202111', '[{"employee":"IZZATUL HUSNA","score":"18.0"},{"employee":"NUR FARINA","score":"17.5"},{"employee":"WAN AINA","score":"0"},{"employee":"SYASYA AINA","score":"0"}]', 'IZZATUL HUSNA', 18.0);
INSERT INTO kpi (kp_id, kp_data, kp_emname, kp_emscore) VALUES ('202111', '[{"employee":"IZZATUL HUSNA","score":"18.0"},{"employee":"NUR FARINA","score":"17.5"},{"employee":"WAN AINA","score":"0"},{"employee":"SYASYA AINA","score":"0"}]', 'NUR FARINA', 17.5);
INSERT INTO kpi (kp_id, kp_data, kp_emname, kp_emscore) VALUES ('202111', '[{"employee":"IZZATUL HUSNA","score":"18.0"},{"employee":"NUR FARINA","score":"17.5"},{"employee":"WAN AINA","score":"0"},{"employee":"SYASYA AINA","score":"0"}]', 'WAN AINA', 0);
INSERT INTO kpi (kp_id, kp_data, kp_emname, kp_emscore) VALUES ('202111', '[{"employee":"IZZATUL HUSNA","score":"18.0"},{"employee":"NUR FARINA","score":"17.5"},{"employee":"WAN AINA","score":"0"},{"employee":"SYASYA AINA","score":"0"}]', 'SYASYA AINA', 0);
