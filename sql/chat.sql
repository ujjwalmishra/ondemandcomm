SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE SCHEMA IF NOT EXISTS `chats` DEFAULT CHARACTER SET utf8 DEFAULT COLLATE UTF8_GENERAL_CI ;

-- -----------------------------------------------------
-- Table `chats`.`chat_user`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `chats`.`chat_user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `handle` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
  )
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `chats`.`chat_agent`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `chats`.`chat_agent` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `handle` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
  )
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `chats`.`chat_session`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `chats`.`chat_session` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  PRIMARY KEY (`id`),
  `user_id` INT UNSIGNED NOT NULL,
  `agent_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  CONSTRAINT `fk_chat_user`
    FOREIGN KEY (`user_id` )
    REFERENCES `chats`.`chat_user` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_chat_agent`
    FOREIGN KEY (`agent_id` )
    REFERENCES `chats`.`chat_agent` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
  )
ENGINE = InnoDB;

CREATE  TABLE IF NOT EXISTS `chats`.`chat_pairs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  PRIMARY KEY (`id`),
  `user_id` INT UNSIGNED NOT NULL,
  `agent_id` INT UNSIGNED NOT NULL,
  `user_line` TEXT NOT NULL,
  `agent_line` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  CONSTRAINT `fk_chat_user_pair`
    FOREIGN KEY (`user_id` )
    REFERENCES `chats`.`chat_user` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_chat_agent_pair`
    FOREIGN KEY (`agent_id` )
    REFERENCES `chats`.`chat_agent` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
  )
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;