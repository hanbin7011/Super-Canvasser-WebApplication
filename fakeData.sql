USE `super_canvasser` ;
-- -----------------------------------------------------
-- insert into users table
-- -----------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM `super_canvasser`.`users`;

INSERT INTO `super_canvasser`.`users` (`firstName`,`lastName`, `username`, `role`, `email`, `phone`, `password`)
VALUES ('Harry', 'Lu', 'harry', 'admin', 'harry.lu@stonybrook.edu', '6313277695', 'harrypass' );

INSERT INTO `super_canvasser`.`users` (`firstName`,`lastName`, `username`, `role`, `email`, `phone`, `password`)
VALUES ('Trung', 'Vo', 'trungvo', 'manager', 'trung.vo@stonybrook.edu', '6313277695', 'trungpass' );

INSERT INTO `super_canvasser`.`users` (`firstName`,`lastName`, `username`, `role`, `email`, `phone`, `password`)
VALUES ('Habin', 'Park', 'habinpark', 'canvasser', 'habin.park@stonybrook.edu', '6859277695', 'habinpass' );

INSERT INTO `super_canvasser`.`users` (`firstName`,`lastName`, `username`, `role`, `email`, `phone`, `password`)
VALUES ('Mike', 'Mathew', 'mikemathew', 'canvasser', 'mike.mathew@stonybrook.edu', '6313277812', 'mikepass' );

INSERT INTO `super_canvasser`.`users` (`firstName`,`lastName`, `username`, `role`, `email`, `phone`, `password`)
VALUES ('David', 'Li', 'davidli', 'canvasser', 'david.li@stonybrook.edu', '6313277812', 'davidpass' );

INSERT INTO `super_canvasser`.`users` (`firstName`,`lastName`, `username`, `role`, `email`, `phone`, `password`)
VALUES ('Thomas', 'Johnson', 'thomasjohnson', 'canvasser', 'thomas.johnson@stonybrook.edu', '6313277812', 'thomaspass' );

INSERT INTO `super_canvasser`.`users` (`firstName`,`lastName`, `username`, `role`, `email`, `phone`, `password`)
VALUES ('Tommy', 'Shock', 'tommy', 'canvasser', 'tommy.shock@stonybrook.edu', '6313277812', 'tommypass' );

INSERT INTO `super_canvasser`.`users` (`firstName`,`lastName`, `username`, `role`, `email`, `phone`, `password`)
VALUES ('Roger', 'Federer', 'rogerfed', 'manager', 'roger.federer@stonybrook.edu', '6313277812', 'rogerpass' );

INSERT INTO `super_canvasser`.`users` (`firstName`,`lastName`, `username`, `role`, `email`, `phone`, `password`)
VALUES ('Novak', 'Djokovic', 'nole', 'manager', 'novak.djokovic@stonybrook.edu', '6313277812', 'novakpass' );

INSERT INTO `super_canvasser`.`users` (`firstName`,`lastName`, `username`, `role`, `email`, `phone`, `password`)
VALUES ('Mark', 'Zuckerberge', 'mark', 'manager', 'mark.zuckerberg@stonybrook.edu', '6313277812', 'markpass' );

INSERT INTO `super_canvasser`.`users` (`firstName`,`lastName`, `username`, `role`, `email`, `phone`, `password`)
VALUES ('Bill', 'Gates', 'billgates', 'admin', 'bill.gates@stonybrook.edu', '6313277812', 'billpass' );

INSERT INTO `super_canvasser`.`users` (`firstName`,`lastName`, `username`, `role`, `email`, `phone`, `password`)
VALUES ('Scott', 'Stoller', 'scott', 'admin', 'scott.stoller@stonybrook.edu', '6313277812', 'scottpass' );

-- -----------------------------------------------------
-- insert into parameters table
-- -----------------------------------------------------
INSERT INTO `super_canvasser`.`parameters` (`dayDuration`, `visitDuration`, `avgSpeed`) VALUES (65, 15, 8.9);

-- -----------------------------------------------------
-- insert into locations table
-- -----------------------------------------------------

DELETE FROM `super_canvasser`.`locations`;

INSERT INTO `super_canvasser`.`locations` (`fullAddress`, `street`, `unit`, `city`, `state`, `zipcode`, `country`, `duration`)
VALUES ('1147 N Country Rd, Stony Brook, New York, 11790, USA',
		 '1147 N Country Rd', '', 'Stony Brook', 'New York', 11790, 'USA', 12);

INSERT INTO `super_canvasser`.`locations` (`fullAddress`, `street`, `unit`, `city`, `state`, `zipcode`, `country`, `duration`)
VALUES ('318 Wynn Ln, Port Jefferson, New York, 11777, USA',
		 '318 Wynn Ln', '', 'Port Jefferson', 'New York', 11777, 'USA', 25);

INSERT INTO `super_canvasser`.`locations` (`fullAddress`, `street`, `unit`, `city`, `state`, `zipcode`, `country`, `duration`)
VALUES ('521 Lake Ave, St James, New York, 11780, USA',
		 '521 Lake Ave', '', 'St James', 'New York', 11780, 'USA', 15);

INSERT INTO `super_canvasser`.`locations` (`fullAddress`, `street`, `unit`, `city`, `state`, `zipcode`, `country`, `duration`)
VALUES ('526 Main St, Islip, New York, 11751, USA',
		 '526 Main St', '', 'Islip', 'New York', 11751, 'USA', 10);

INSERT INTO `super_canvasser`.`locations` (`fullAddress`, `street`, `unit`, `city`, `state`, `zipcode`, `country`, `duration`)
VALUES ('75 Washington Pl, New York, New York, 10011, USA',
		 '75 Washington Pl', '', 'Stony Brook', 'New York', 10011, 'USA', 5);

INSERT INTO `super_canvasser`.`locations` (`fullAddress`, `street`, `unit`, `city`, `state`, `zipcode`, `country`, `duration`)
VALUES ('313 Smith Haven Mall, Lake Grove, New York, 11755, USA',
		 '313 Smith Haven Mall', '', 'Lake Grove', 'New York', 11755, 'USA', 10);

INSERT INTO `super_canvasser`.`locations` (`fullAddress`, `street`, `unit`, `city`, `state`, `zipcode`, `country`, `duration`)
VALUES ('15 Hollow Rd, Stony Brook, New York, 11790, USA',
		 '15 Hollow Rd', '', 'Stony Brook', 'New York', 11790, 'USA', 20);

INSERT INTO `super_canvasser`.`locations` (`fullAddress`, `street`, `unit`, `city`, `state`, `zipcode`, `country`, `duration`)
VALUES ('100 Nicolls Rd, Stony Brook, New York, 11790, USA',
		 '100 Nicolls Rd', '', 'Stony Brook', 'New York', 11790, 'USA', 10);

INSERT INTO `super_canvasser`.`locations` (`fullAddress`, `street`, `unit`, `city`, `state`, `zipcode`, `country`, `duration`)
VALUES ('75 Arlington St, Boston, Massachusetts, 02116, USA',
		 '75 Arlington St', '', 'Boston', 'Massachusetts', 02116, 'USA', 5);

INSERT INTO `super_canvasser`.`locations` (`fullAddress`, `street`, `unit`, `city`, `state`, `zipcode`, `country`, `duration`)
VALUES ('1704 Washington St, Boston, Massachusetts, 02118, USA',
		 '1704 Washington St', '', 'Boston', 'Massachusetts', 02118, 'USA', 15);

INSERT INTO `super_canvasser`.`locations` (`fullAddress`, `street`, `unit`, `city`, `state`, `zipcode`, `country`, `duration`)
VALUES ('383 Congress St, Boston, Massachusetts, 02210, USA',
		 '383 Congress St', '', 'Boston', 'Massachusetts', 02210, 'USA', 15);

INSERT INTO `super_canvasser`.`locations` (`fullAddress`, `street`, `unit`, `city`, `state`, `zipcode`, `country`, `duration`)
VALUES ('3 N Square, Boston, Massachusetts, 02113, USA',
		 '3 N Square', '', 'Boston', 'Massachusetts', 02113, 'USA', 20);

INSERT INTO `super_canvasser`.`locations` (`fullAddress`, `street`, `unit`, `city`, `state`, `zipcode`, `country`, `duration`)
VALUES ('150 Eastbrook Rd, Smoketown, PA, 17576, USA',
		 '150 Eastbrook Rd', '', 'Smoketown', 'PA', 17576, 'USA', 15);

INSERT INTO `super_canvasser`.`locations` (`fullAddress`, `street`, `unit`, `city`, `state`, `zipcode`, `country`, `duration`)
VALUES ('15 S Main St, New Hope, PA, 18938, USA',
		 '15 S Main St', '', 'New Hope', 'PA', 18938, 'USA', 30);

-- -----------------------------------------------------
-- insert into questions table
-- -----------------------------------------------------

DELETE FROM `super_canvasser`.`questions`;

INSERT INTO `super_canvasser`.`questions` (`locationId`, `question`, `answer`)
VALUES (1, 'In a few sentences, tell us how do you like this product and how you would like us to improve in future?',
				"Overall, this product is really good. I'd love to purchase some more in future." );

INSERT INTO `super_canvasser`.`questions` (`locationId`, `question`, `answer`)
VALUES (2, 'Do you know other products other than this product?',
				'Yes, I have a collection of these products bought from different stores.');

INSERT INTO `super_canvasser`.`questions` (`locationId`, `question`, `answer`)
VALUES (3, 'On the scale of 10, how do you rate this product?',
				'Awesome!!!! I would give a rate of 5.0.');

INSERT INTO `super_canvasser`.`questions` (`locationId`, `question`, `answer`)
VALUES (2, 'How do you like this product?',
				"It's pretty good, I hope to see its further improvement.");

INSERT INTO `super_canvasser`.`questions` (`locationId`, `question`, `answer`)
VALUES (1, 'On the scale of 10, how do you rate this product?',
				'Ahh ok, I would give it a 4.5.');

INSERT INTO `super_canvasser`.`questions` (`locationId`, `question`, `answer`)
VALUES (3, 'How do you like this product?', 'Good enough!!!');

-- -----------------------------------------------------
-- insert into tasks table
-- -----------------------------------------------------
INSERT INTO `super_canvasser`.`tasks` (`id`, `locationId`)
VALUES (1, 1);

INSERT INTO `super_canvasser`.`tasks` (`id`, `locationId`)
VALUES (1, 2);

INSERT INTO `super_canvasser`.`tasks` (`id`, `locationId`)
VALUES (1, 13);

INSERT INTO `super_canvasser`.`tasks` (`id`, `locationId`)
VALUES (1, 14);

INSERT INTO `super_canvasser`.`tasks` (`id`, `locationId`)
VALUES (2, 3);

INSERT INTO `super_canvasser`.`tasks` (`id`, `locationId`)
VALUES (2, 4);

INSERT INTO `super_canvasser`.`tasks` (`id`, `locationId`)
VALUES (3, 5);

INSERT INTO `super_canvasser`.`tasks` (`id`, `locationId`)
VALUES (3, 6);

INSERT INTO `super_canvasser`.`tasks` (`id`, `locationId`)
VALUES (4, 7);

INSERT INTO `super_canvasser`.`tasks` (`id`, `locationId`)
VALUES (4, 8);

INSERT INTO `super_canvasser`.`tasks` (`id`, `locationId`)
VALUES (5, 9);

INSERT INTO `super_canvasser`.`tasks` (`id`, `locationId`)
VALUES (5, 10);

INSERT INTO `super_canvasser`.`tasks` (`id`, `locationId`)
VALUES (6, 11);

INSERT INTO `super_canvasser`.`tasks` (`id`, `locationId`)
VALUES (6, 12);


-- -----------------------------------------------------
-- insert into assignments table
-- -----------------------------------------------------

-- DELETE FROM `super_canvasser`.`assignments`;

-- INSERT INTO `super_canvasser`.`assignments` (`userId`, `date`, `month`, `year`, `taskId`)
-- VALUES (3, 31, 10, 2018, 1);

-- INSERT INTO `super_canvasser`.`assignments` (`userId`, `date`, `month`, `year`, `taskId`)
-- VALUES (3, 22, 10, 2018, 2);

-- INSERT INTO `super_canvasser`.`assignments` (`userId`, `date`, `month`, `year`)
-- VALUES (3, 12, 05, 2018);

-- INSERT INTO `super_canvasser`.`assignments` (`userId`, `date`, `month`, `year`)
-- VALUES (3, 12, 02, 2018);

-- INSERT INTO `super_canvasser`.`assignments` (`userId`, `date`, `month`, `year`)
-- VALUES (4, 09, 10, 2018);

-- INSERT INTO `super_canvasser`.`assignments` (`userId`, `date`, `month`, `year`)
-- VALUES (4, 13, 08, 2018);

-- INSERT INTO `super_canvasser`.`assignments` (`userId`, `date`, `month`, `year`)
-- VALUES (4, 24, 08, 2018);

-- INSERT INTO `super_canvasser`.`assignments` (`userId`, `date`, `month`, `year`, `taskId`)
-- VALUES (4, 15, 07, 2018, 3);

-- INSERT INTO `super_canvasser`.`assignments` (`userId`, `date`, `month`, `year`, `taskId`)
-- VALUES (4, 04, 08, 2018, 4);