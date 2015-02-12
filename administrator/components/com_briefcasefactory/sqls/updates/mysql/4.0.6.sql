ALTER TABLE `#__briefcasefactory_users` ADD `notification_file_upload_other_user` tinyint(1) NOT NULL AFTER `notification_group`;
INSERT INTO `#__briefcasefactory_notifications` (`type`, `lang_code`, `subject`, `body`, `published`) VALUES ('file_upload_for_other_user', '*', 'A new file has been uploaded to your Briefcase', '<p>Hello {{ receiver_username }}!</p>\r\n<p>A new file (<a href=\"{{ file_link }}\">{{ file_name }}</a>) has been uploaded by {{ uploader_username }} to your Briefcase on {{ date }}!</p>\r\n<p>Regards,</p>\r\n<p>Briefcase Factory Team!</p>', '1');