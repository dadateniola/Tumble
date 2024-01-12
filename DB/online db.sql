CREATE TABLE IF NOT EXISTS comments (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `video_id` int(11) UNSIGNED NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE IF NOT EXISTS histories (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `video_id` int(11) UNSIGNED NOT NULL,
  `created_at` datetime,
  `updated_at` datetime 
);

CREATE TABLE IF NOT EXISTS likes_dislikes (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `video_id` int(11) UNSIGNED NOT NULL,
  `type` enum('like','dislike') DEFAULT NULL,
  `created_at` datetime,
  `updated_at` datetime 
);

CREATE TABLE IF NOT EXISTS subscriptions (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `sub_id` int(11) UNSIGNED NOT NULL,
  `created_at` datetime,
  `updated_at` datetime 
);

CREATE TABLE IF NOT EXISTS users (
  `id` int(11) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `banner` varchar(100) DEFAULT NULL,
  `banner_position` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `created_at` datetime,
  `updated_at` datetime 
);

CREATE TABLE IF NOT EXISTS videos (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `placeholder` varchar(100) DEFAULT NULL,
  `type` enum('short','video') DEFAULT NULL,
  `created_at` datetime,
  `updated_at` datetime ,
  `description` varchar(255) DEFAULT NULL,
  `path` varchar(100) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS video_views (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `video_id` int(11) UNSIGNED NOT NULL,
  `created_at` datetime,
  `updated_at` datetime 
);

CREATE TABLE IF NOT EXISTS watch_laters (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `video_id` int(11) UNSIGNED NOT NULL,
  `created_at` datetime,
  `updated_at` datetime 
);

ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_comments_user_id` (`user_id`),
  ADD KEY `fk_comments_video_id` (`video_id`);

--
-- Indexes for table `histories`
--
ALTER TABLE `histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_histories_user_id` (`user_id`),
  ADD KEY `fk_histories_video_id` (`video_id`);

--
-- Indexes for table `likes_dislikes`
--
ALTER TABLE `likes_dislikes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_likes_dislikes_user_id` (`user_id`),
  ADD KEY `fk_likes_dislikes_video_id` (`video_id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_subscriptions_user_id` (`user_id`),
  ADD KEY `fk_subscriptions_sub_id` (`sub_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_videos_user_id` (`user_id`);

--
-- Indexes for table `video_views`
--
ALTER TABLE `video_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_video_views_user_id` (`user_id`),
  ADD KEY `fk_video_views_video_id` (`video_id`);

--
-- Indexes for table `watch_laters`
--
ALTER TABLE `watch_laters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_watch_laters_user_id` (`user_id`),
  ADD KEY `fk_watch_laters_video_id` (`video_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `histories`
--
ALTER TABLE `histories`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `likes_dislikes`
--
ALTER TABLE `likes_dislikes`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `video_views`
--
ALTER TABLE `video_views`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `watch_laters`
--
ALTER TABLE `watch_laters`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comments_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comments_video_id` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `histories`
--
ALTER TABLE `histories`
  ADD CONSTRAINT `fk_histories_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_histories_video_id` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `likes_dislikes`
--
ALTER TABLE `likes_dislikes`
  ADD CONSTRAINT `fk_likes_dislikes_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_likes_dislikes_video_id` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `fk_subscriptions_sub_id` FOREIGN KEY (`sub_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_subscriptions_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `fk_videos_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `video_views`
--
ALTER TABLE `video_views`
  ADD CONSTRAINT `fk_video_views_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_video_views_video_id` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `watch_laters`
--
ALTER TABLE `watch_laters`
  ADD CONSTRAINT `fk_watch_laters_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_watch_laters_video_id` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE;


INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `dob`, `photo`, `banner`, `banner_position`, `username`, `created_at`, `updated_at`) VALUES ('1', 'Teniola', 'Dada', 'emmatenny2004@gmail.com', 'sha1$f93b78a1$1$c79bedf4010cef3d3eebdc27d49ac241f20104b6', '2004-10-09', 'photo.jpg', 'banner.jpg', 'center', 'Dealu', '2024-01-08 20:39:19', '2024-01-08 20:39:19');

INSERT INTO `videos` (`id`, `user_id`, `name`, `placeholder`, `type`, `created_at`, `updated_at`, `description`, `path`) VALUES ('1', '1', 'Welcome to Tumble 👌', 'placeholder.png', 'video', '2024-01-08 20:49:14', '2024-01-08 20:49:14', 'Thank you for testing my first Fullstack website 🙌', 'path.mp4');

INSERT INTO `comments` (`id`, `user_id`, `video_id`, `comment`, `created_at`, `updated_at`) VALUES ('1', '1', '1', 'Hi, I am Dada Teniola, a full stack web developer open to both remote and onsite opportunities.\r\n\r\nThank you very much for testing my first every Fullstack website made entirely by me.', '2024-01-08 20:50:57', '2024-01-08 20:50:57');