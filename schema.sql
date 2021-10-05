Database: Questions

-- DROP DATABASE IF EXISTS "Questions";

CREATE DATABASE Questions
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'Questions'
--
-- ---

DROP TABLE IF EXISTS "Questions";

CREATE TABLE "Questions" (
  question_id SERIAL,
  question_body VARCHAR(1000) NULL DEFAULT NULL,
  question_date VARCHAR(20) NULL DEFAULT NULL,
  asker_name VARCHAR(60) NULL DEFAULT NULL,
  asker_email VARCHAR(100) NULL DEFAULT NULL,
  question_helpfulness INTEGER NULL DEFAULT NULL,
  reported BOOLEAN NULL DEFAULT NULL,
  product_id INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (question_id)
);

-- ---
-- Table 'Answers'
--
-- ---

DROP TABLE IF EXISTS "Answers";

CREATE TABLE "Answers" (
  answer_id SERIAL,
  question_id INTEGER NULL DEFAULT NULL,
  body VARCHAR(1000) NULL DEFAULT NULL,
  date VARCHAR(30) NULL DEFAULT NULL,
  answerer_name VARCHAR(60) NULL DEFAULT NULL,
  answerer_email VARCHAR(100) NULL DEFAULT NULL,
  helpfulness INTEGER NULL DEFAULT NULL,
  reported BOOLEAN NULL DEFAULT NULL,
  PRIMARY KEY (answer_id)
);

-- ---
-- Table 'Photos'
--
-- ---

DROP TABLE IF EXISTS "Photos";

CREATE TABLE "Photos" (
  id SERIAL,
  answer_id INTEGER NULL DEFAULT NULL,
  url VARCHAR(1000) NULL DEFAULT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE "Answers" ADD FOREIGN KEY (question_id) REFERENCES "Questions" (question_id);
ALTER TABLE "Photos" ADD FOREIGN KEY (answer_id) REFERENCES "Answers" (answer_id);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `Questions` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Answers` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Photos` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `Questions` (`question_id`,`question_body`,`question_date`,`asker_name`,`question_helpfulness`,`reported`,`answers`,`product_id`) VALUES
-- ('','','','','','','','');
-- INSERT INTO `Answers` (`answer_id`,`question_id`,`body`,`date`,`answerer_name`,`helpfulness`) VALUES
-- ('','','','','','');
-- INSERT INTO `Photos` (`id`,`answer_id`,`url`) VALUES
-- ('','','');
-- Copy Statements

COPY "Questions"(question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
FROM '/Users/lawrenceasun/project-catwalk-questions-answers-service/questions.csv'
DELIMITER ','
CSV HEADER;

COPY "Answers"(answer_id, question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
FROM '/Users/lawrenceasun/project-catwalk-questions-answers-service/answers.csv'
DELIMITER ','
CSV HEADER;

COPY "Photos"(id, answer_id, url)
FROM '/Users/lawrenceasun/project-catwalk-questions-answers-service/answers_photos.csv'
DELIMITER ','
CSV HEADER;

CREATE INDEX answers_id ON "Answers"(answer_id);
CREATE INDEX questions_id ON "Questions"(question_id, product_id);
CREATE INDEX photos_id ON "Photos"(id, answer_id);

	  SELECT
	  "Questions".question_id,
	  "Questions".question_body,
	  "Questions".question_date,
	  "Questions".asker_name,
	  "Questions".question_helpfulness,
	  "Questions".reported,
	  COALESCE(a.answers, '{}'::json)
	  FROM "Questions" LEFT JOIN (SELECT "Answers".question_id,
		json_object_agg("Answers".answer_id, json_build_object(
		'id', "Answers".answer_id,
        'body', "Answers".body,
        'date', "Answers".date,
        'answerer_name', "Answers".answerer_name,
        'helpfulness', "Answers".helpfulness,
        'photos', ARRAY[]::json[])) AS answers
		FROM "Answers"
		GROUP BY "Answers".question_id) AS a
	  ON "Questions".question_id IN (a.question_id)
	  WHERE "Questions".product_id = 1
	  ORDER BY "Questions".question_helpfulness DESC
	  LIMIT 6


    ////////////////////////////////////////////////
