ALTER TABLE `inventory`
ADD `type` varchar(255) COLLATE 'utf8_general_ci' NOT NULL;

ALTER TABLE `sessions`
ADD `action_on_dead` varchar(255) COLLATE 'utf8_general_ci' NULL AFTER `is_route`;