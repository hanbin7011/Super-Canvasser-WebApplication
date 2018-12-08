DROP SCHEMA IF EXISTS `super_canvasser` ;
CREATE SCHEMA IF NOT EXISTS `super_canvasser` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
USE `super_canvasser` ;

/*
----- users table -------
*/

DROP TABLE IF EXISTS `super_canvasser`.`users` ;

CREATE  TABLE IF NOT EXISTS `super_canvasser`.`users` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
	`firstName` VARCHAR(45) NOT NULL ,
	`lastName` VARCHAR(45) NOT NULL ,
	`username` VARCHAR(45) NOT NULL,
	`role` VARCHAR(50) NOT NULL ,
	`email` VARCHAR(45) NOT NULL ,
	`phone` VARCHAR(45) NOT NULL ,
	`password` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB;

/*
-------- parameters table ---------
*/

DROP TABLE IF EXISTS `super_canvasser`.`parameters` ;

CREATE TABLE IF NOT EXISTS `super_canvasser`.`parameters` (
	`dayDuration` INT UNSIGNED ,
	`visitDuration` INT UNSIGNED ,
	`avgSpeed` FLOAT
) ENGINE = InnoDB;

/*
----- locations table -------
*/

DROP TABLE IF EXISTS `super_canvasser`.`locations` ;

CREATE  TABLE IF NOT EXISTS `super_canvasser`.`locations` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
	`fullAddress` VARCHAR(500) NOT NULL ,
	`street` VARCHAR(100) NOT NULL ,
	`unit` VARCHAR(100) ,
	`city` VARCHAR(50) NOT NULL ,
	`state` VARCHAR(50) NOT NULL ,
	`zipcode` INT NOT NULL ,
	`country` VARCHAR(50) NOT NULL ,
	`duration` INT ,
	`rate` FLOAT ,
	`note` VARCHAR(500) ,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB;

/*
----- questions table -------
*/

DROP TABLE IF EXISTS `super_canvasser`.`questions` ;

CREATE  TABLE IF NOT EXISTS `super_canvasser`.`questions` (
	`locationId` INT UNSIGNED NOT NULL ,
	`question` VARCHAR(500) NOT NULL ,
	`answer` VARCHAR(500) NOT NULL ,
	FOREIGN KEY (`locationId`) REFERENCES `super_canvasser`.`locations`(`id`)
	ON DELETE CASCADE
) ENGINE = InnoDB;

/*
----- tasks table -------
*/

DROP TABLE IF EXISTS `super_canvasser`.`tasks` ;

CREATE  TABLE IF NOT EXISTS `super_canvasser`.`tasks` (
	`id` INT UNSIGNED NOT NULL ,
	`locationId` INT UNSIGNED NOT NULL ,
	FOREIGN KEY (`locationId`) REFERENCES `super_canvasser`.`locations`(`id`)
	ON DELETE CASCADE
) ENGINE = InnoDB;

/*
----- assignments table -------
*/

DROP TABLE IF EXISTS `super_canvasser`.`assignments` ;

CREATE  TABLE IF NOT EXISTS `super_canvasser`.`assignments` (
	`userId` INT UNSIGNED NOT NULL ,
	`date` INT UNSIGNED NOT NULL ,
	`month` INT UNSIGNED NOT NULL ,
	`year` INT UNSIGNED NOT NULL ,
	`taskId` INT UNSIGNED ,
	FOREIGN KEY (`userId`) REFERENCES `super_canvasser`.`users`(`id`)
	ON DELETE CASCADE
) ENGINE = InnoDB;