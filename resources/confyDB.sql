-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema confydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `confydb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `confydb` ;

-- -----------------------------------------------------
-- Table `confydb`.`group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `confydb`.`group` (
  `group_pk` INT UNSIGNED NOT NULL AUTO_INCREMENT,  -- Changed
  `group_name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`group_pk`))  -- Changed
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `confydb`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `confydb`.`user` (
  `user_pk` INT UNSIGNED NOT NULL AUTO_INCREMENT,  -- Changed
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(50) NOT NULL,
  `profile_url` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `is_meeting_alert_on` TINYINT(1) NOT NULL DEFAULT '1',
  `is_group_alert_on` TINYINT(1) NOT NULL DEFAULT '1',
  `is_push_alert_on` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`user_pk`),  -- Changed
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `confydb`.`groupinvitations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `confydb`.`groupinvitations` (
  `groupinvitations_pk` INT UNSIGNED NOT NULL AUTO_INCREMENT,  -- Changed
  `group_id` INT UNSIGNED NOT NULL,
  `invitor_id` INT UNSIGNED NOT NULL,
  `invitee_email` VARCHAR(255) NOT NULL,
  `status` ENUM('PENDING', 'ACCEPTED', 'DECLINED') NOT NULL DEFAULT 'PENDING',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expired_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`groupinvitations_pk`),  -- Changed
  INDEX `group_id` (`group_id` ASC) VISIBLE,
  INDEX `invitor_id` (`invitor_id` ASC) VISIBLE,
  CONSTRAINT `groupinvitations_ibfk_1`
    FOREIGN KEY (`group_id`)
    REFERENCES `confydb`.`group` (`group_pk`)  -- Changed
    ON DELETE CASCADE,
  CONSTRAINT `groupinvitations_ibfk_2`
    FOREIGN KEY (`invitor_id`)
    REFERENCES `confydb`.`user` (`user_pk`)  -- Changed
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `confydb`.`meeting`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `confydb`.`meeting` (
  `meeting_pk` INT UNSIGNED NOT NULL AUTO_INCREMENT,  -- Changed
  `meeting_uuid` VARCHAR(100) NOT NULL,
  `meeting_name` VARCHAR(100) NOT NULL,
  `started_at` TIMESTAMP NULL DEFAULT NULL,
  `ended_at` TIMESTAMP NULL DEFAULT NULL,
  `hostId` INT UNSIGNED NOT NULL,
  `group_id` INT UNSIGNED NOT NULL,
  `is_online` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`meeting_pk`),  -- Changed
  UNIQUE INDEX `meeting_uuid` (`meeting_uuid` ASC) VISIBLE,
  INDEX `hostId` (`hostId` ASC) VISIBLE,
  INDEX `group_id` (`group_id` ASC) VISIBLE,
  CONSTRAINT `meeting_ibfk_1`
    FOREIGN KEY (`hostId`)
    REFERENCES `confydb`.`user` (`user_pk`)  -- Changed
    ON DELETE CASCADE,
  CONSTRAINT `meeting_ibfk_2`
    FOREIGN KEY (`group_id`)
    REFERENCES `confydb`.`group` (`group_pk`)  -- Changed
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `confydb`.`notifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `confydb`.`notifications` (
  `notifications_pk` INT UNSIGNED NOT NULL AUTO_INCREMENT,  -- Changed
  `user_id` INT UNSIGNED NOT NULL,
  `type` ENUM('INVITE_ACCEPTED', 'MEETING_STARTED', 'OTHER') NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT '0',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notifications_pk`),  -- Changed
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `notifications_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `confydb`.`user` (`user_pk`)  -- Changed
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `confydb`.`sentence`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `confydb`.`sentence` (
  `sentence_pk` INT UNSIGNED NOT NULL AUTO_INCREMENT,  -- Changed
  `meeting_id` INT UNSIGNED NOT NULL,
  `speaker` VARCHAR(255) NOT NULL,
  `content` VARCHAR(1000) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`sentence_pk`),  -- Changed
  INDEX `meeting_id` (`meeting_id` ASC) VISIBLE,
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `sentence_ibfk_1`
    FOREIGN KEY (`meeting_id`)
    REFERENCES `confydb`.`meeting` (`meeting_pk`)  -- Changed
    ON DELETE CASCADE,
  CONSTRAINT `sentence_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `confydb`.`user` (`user_pk`)  -- Changed
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `confydb`.`summary`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `confydb`.`summary` (
  `summary_pk` INT UNSIGNED NOT NULL AUTO_INCREMENT,  -- Changed
  `text_summary` TEXT NULL DEFAULT NULL,
  `visual_summary` JSON NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `meeting_id` INT UNSIGNED NOT NULL,
  `visual_type` ENUM('Tree', 'Bubble', 'Fishbone') NOT NULL,
  `modified_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `summary_image_path` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`summary_pk`),  -- Changed
  INDEX `meeting_id` (`meeting_id` ASC) VISIBLE,
  CONSTRAINT `summary_ibfk_1`
    FOREIGN KEY (`meeting_id`)
    REFERENCES `confydb`.`meeting` (`meeting_pk`)  -- Changed
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `confydb`.`usergroup`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `confydb`.`usergroup` (
  `usergroup_pk` INT UNSIGNED NOT NULL AUTO_INCREMENT,  -- Changed
  `user_id` INT UNSIGNED NOT NULL,
  `group_id` INT UNSIGNED NOT NULL,
  `joined_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `left_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`usergroup_pk`),  -- Changed
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `group_id` (`group_id` ASC) VISIBLE,
  CONSTRAINT `usergroup_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `confydb`.`user` (`user_pk`)  -- Changed
    ON DELETE CASCADE,
  CONSTRAINT `usergroup_ibfk_2`
    FOREIGN KEY (`group_id`)
    REFERENCES `confydb`.`group` (`group_pk`)  -- Changed
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `confydb`.`usermeeting`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `confydb`.`usermeeting` (
  `usermeeting_pk` INT UNSIGNED NOT NULL AUTO_INCREMENT,  -- Changed
  `meeting_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `is_mvp` TINYINT(1) NULL DEFAULT NULL,
  `joined_at` TIMESTAMP NULL DEFAULT NULL,
  `left_at` TIMESTAMP NULL DEFAULT NULL,
  `is_participant` TINYINT(1) NOT NULL DEFAULT '0',
  `deleted_at` TIMESTAMP NOT NULL,
  `bookmarked_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`usermeeting_pk`),  -- Changed
  INDEX `meeting_id` (`meeting_id` ASC) VISIBLE,
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `usermeeting_ibfk_2`
    FOREIGN KEY (`meeting_id`)
    REFERENCES `confydb`.`meeting` (`meeting_pk`)  -- Changed
    ON DELETE CASCADE,
  CONSTRAINT `usermeeting_ibfk_3`
    FOREIGN KEY (`user_id`)
    REFERENCES `confydb`.`user` (`user_pk`)  -- Changed
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;