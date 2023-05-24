CREATE DATABASE IF NOT EXISTS tumbleextra;

USE tumbleextra;

CREATE TABLE IF NOT EXISTS comments (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `video_id` int(11) UNSIGNED NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
);

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `video_id`, `comment`, `created_at`, `updated_at`) VALUES
(1, 2, 8, 'wonderful model\nwish i could model like this😊', '2023-03-31 13:48:24', '2023-03-31 13:48:24'),
(3, 6, 8, 'i love the art and texture in the face, AMAZING WORK👌', '2023-03-31 14:16:01', '2023-03-31 14:16:01'),
(4, 5, 8, 'magnificent work comrade, can you teach me', '2023-03-31 14:51:46', '2023-03-31 14:51:46'),
(8, 3, 9, 'hope this one suites you guys', '2023-04-01 22:41:43', '2023-04-01 22:41:43'),
(9, 3, 10, 'made this when i was out site seeing', '2023-04-01 22:42:16', '2023-04-01 22:42:16'),
(10, 2, 12, 'looks wonderful', '2023-04-10 21:42:13', '2023-04-10 21:42:13'),
(11, 6, 10, 'wondeful artwork', '2023-04-10 21:43:51', '2023-04-10 21:43:51'),
(12, 3, 8, 'notice the attention to details👌', '2023-04-11 22:43:42', '2023-04-11 22:43:42'),
(13, 4, 8, 'this is an exceptional work of art\ni admire you comrade', '2023-04-11 22:44:25', '2023-04-11 22:44:25'),
(14, 5, 8, 'not bad man, came back to admire it', '2023-04-11 22:46:09', '2023-04-11 22:46:09'),
(15, 4, 3, 'how come no one is commenting on this work of art', '2023-04-11 22:58:00', '2023-04-11 22:58:00');

-- --------------------------------------------------------

--
-- Table structure for table `histories`
--

CREATE TABLE IF NOT EXISTS histories (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `video_id` int(11) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
);

--
-- Dumping data for table `histories`
--

INSERT INTO `histories` (`id`, `user_id`, `video_id`, `created_at`, `updated_at`) VALUES
(1, 2, 8, '2023-04-02 21:04:36', '2023-04-02 21:04:36'),
(2, 3, 8, '2023-04-02 21:11:56', '2023-04-02 21:11:56'),
(3, 7, 3, '2023-04-02 22:43:02', '2023-04-02 22:43:02'),
(4, 7, 11, '2023-04-02 22:44:54', '2023-04-02 22:44:54'),
(5, 7, 12, '2023-04-02 22:45:47', '2023-04-02 22:45:47'),
(6, 2, 3, '2023-04-03 17:23:05', '2023-04-03 17:23:05'),
(7, 2, 11, '2023-04-03 17:23:19', '2023-04-03 17:23:19'),
(8, 2, 12, '2023-04-03 17:23:27', '2023-04-03 17:23:27'),
(9, 2, 9, '2023-04-03 17:23:34', '2023-04-03 17:23:34'),
(10, 2, 10, '2023-04-03 17:23:42', '2023-04-03 17:23:42'),
(11, 6, 10, '2023-04-10 21:43:43', '2023-04-10 21:43:43'),
(12, 6, 9, '2023-04-10 21:44:00', '2023-04-10 21:44:00'),
(13, 3, 3, '2023-04-11 18:15:54', '2023-04-11 18:15:54'),
(14, 4, 8, '2023-04-11 18:33:12', '2023-04-11 18:33:12'),
(15, 5, 8, '2023-04-11 18:33:18', '2023-04-11 18:33:18'),
(16, 6, 8, '2023-04-11 18:33:29', '2023-04-11 18:33:29'),
(17, 4, 3, '2023-04-11 22:57:45', '2023-04-11 22:57:45'),
(18, 4, 11, '2023-04-11 22:58:47', '2023-04-11 22:58:47'),
(19, 4, 10, '2023-04-11 22:58:59', '2023-04-11 22:58:59'),
(20, 7, 4, '2023-05-02 18:05:15', '2023-05-02 18:05:15'),
(21, 7, 8, '2023-05-02 18:06:32', '2023-05-02 18:06:32'),
(22, 2, 4, '2023-05-08 20:39:43', '2023-05-08 20:39:43'),
(23, 2, 14, '2023-05-08 21:24:45', '2023-05-08 21:24:45');

-- --------------------------------------------------------

--
-- Table structure for table `likes_dislikes`
--

CREATE TABLE IF NOT EXISTS likes_dislikes (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `video_id` int(11) UNSIGNED NOT NULL,
  `type` enum('like','dislike') DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
);

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE IF NOT EXISTS subscriptions (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `sub_id` int(11) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
);

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `user_id`, `sub_id`, `created_at`, `updated_at`) VALUES
(7, 5, 2, '2023-03-30 12:26:13', '2023-03-30 12:26:13'),
(13, 5, 3, '2023-03-31 14:55:26', '2023-03-31 14:55:26'),
(14, 7, 3, '2023-03-31 15:57:30', '2023-03-31 15:57:30'),
(15, 7, 2, '2023-03-31 15:57:46', '2023-03-31 15:57:46'),
(16, 2, 3, '2023-04-02 21:30:45', '2023-04-02 21:30:45'),
(17, 7, 4, '2023-04-02 22:45:40', '2023-04-02 22:45:40');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS users (
  `id` int(11) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `phone` varchar(20) NOT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `banner` varchar(100) DEFAULT NULL,
  `banner_position` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
);

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `dob`, `phone`, `photo`, `banner`, `banner_position`, `username`, `created_at`, `updated_at`) VALUES
(2, 'Emmanuel', 'tenny', 'emmatenny2004@gmail.com', 'sha1$745c1e7c$1$598809af6cf132c165d2ac0ccae51b7d265330f8', '2023-03-02', '08123456789', 'sha1$4d2c35f3$1$e53732c112efbac49f9fe9a627290f14aed9e7a1.jpg', 'sha1$d793796d$1$c6e7aa0fa0d19d100825bbb7b387262e60700f5a.png', 'top', 'dealu', '2023-03-22 14:20:02', '2023-03-23 22:55:55'),
(3, 'David', 'Comrade', 'david@gmail.com', 'sha1$f8422fce$1$6eaa598b8f31542c2c46a8adbd2176be7a3535be', '2023-03-01', '08055916649', 'sha1$127720a8$1$c71fbbbc4d2015fcbb0c51e0414020f02ea9873a.jpg', 'sha1$66c7ca88$1$80f90d2ee2ed5fae11e5ce67d29d2c44c8a9772c.jpg', 'center', 'david', '2023-03-29 19:57:34', '2023-03-29 19:57:34'),
(4, 'michael', 'john', 'michael@gmail.com', 'sha1$dfb68c53$1$332aa5abeeac65cffcdd48c1da735617e7876e69', '2023-03-04', '09011123445', 'sha1$4d221511$1$c46c2b1f7401e978fbcf4117e3b4e8a132537085.jpg', 'sha1$425f5742$1$a48467ade9f5bf1d7a1b803d12aea64a4aff70ca.jpg', 'top', 'mikel', '2023-03-29 21:49:34', '2023-03-29 21:49:34'),
(5, 'john', 'doe', 'johndoe@gmail.com', 'sha1$a0beaa9f$1$36085935e4b5b209227b95f92228253b71e9f395', '2023-03-04', '09052513369', 'sha1$85dd793e$1$606ea723a93c4d712561d82445f6e3ea056f5353.png', 'sha1$866f7907$1$13f76d6e507949227258f8574810a331bd42408e.jpg', 'top', 'john', '2023-03-29 23:32:06', '2023-03-29 23:32:06'),
(6, 'daniel', 'adebayo', 'daniel@gmail.com', 'sha1$aaa6e99f$1$aca0e053f9e08f266a2d1607814dcf44a3c6bf88', '2023-03-01', '09037187820', NULL, NULL, NULL, NULL, '2023-03-31 14:02:52', '2023-03-31 14:02:52'),
(7, 'Pelumi', 'Boy', 'pelumiprecious2008@gmail.com', 'sha1$1479f18f$1$2b82d23d1afe7f9d67e8eee283677d4188635734', '2023-03-01', '09012345678', NULL, NULL, NULL, NULL, '2023-03-31 15:56:24', '2023-03-31 15:56:24');

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE IF NOT EXISTS videos (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `placeholder` varchar(100) DEFAULT NULL,
  `type` enum('short','video') DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `description` varchar(255) DEFAULT NULL,
  `path` varchar(100) DEFAULT NULL
);

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `user_id`, `name`, `placeholder`, `type`, `created_at`, `updated_at`, `description`, `path`) VALUES
(3, 2, 'Mclaren', 'sha1$2b1b7e7e$1$a32960966332d9ba10f40f2fded47ec06a5e7a18.jpg', 'video', '2023-03-24 20:56:01', '2023-03-24 20:56:01', 'a mclaren car', 'sha1$dd13a243$1$685cd534b7ebeebfdcd61cfb2776b9b73c5982c3.mp4'),
(4, 2, 'cameleon', 'sha1$dee12063$1$a357c57780927a93f41dba3853d59b2b79eb9e0c.jpg', 'video', '2023-03-25 12:38:28', '2023-03-25 12:38:28', 'a green cameleon', 'sha1$27975926$1$cfacc4af1f211846388a9e304ff9cb68787328f5.mp4'),
(5, 2, 'Pixel art', 'sha1$c51d182f$1$56ad5b1a4787a55dd84dab8566e1538792250fcf.jpg', 'video', '2023-03-25 13:33:26', '2023-03-25 13:33:26', 'Enjoy this wonderful work made by me', 'sha1$9824da36$1$6b264674040fd897d4c4b0afe7d78eb82ce4e615.mp4'),
(6, 2, 'Glables', 'sha1$360ee789$1$79609980b5a071cc6ec02f5aea8d289fcee72583.jpeg', 'short', '2023-03-25 13:37:26', '2023-03-25 13:37:26', 'Abstract patterns', 'sha1$55c027b1$1$c642f1ae9b37dbe1ba5dd71eafb76cfe5df94d20.mp4'),
(7, 2, 'Ranni', 'sha1$1b621aa4$1$cf29e167609fdf32dc59b03e658ad189b58c1b97.jpg', 'short', '2023-03-25 13:39:30', '2023-03-25 13:39:30', 'Ranni moon princess', 'sha1$bf1ac3c2$1$009ff20b2b246c839767174ba484759aea11e24e.mp4'),
(8, 3, 'female head', 'sha1$38c2d997$1$e6b916ff193824010e116280f80420ddcdcc1acf.png', 'video', '2023-03-29 20:01:03', '2023-03-29 20:01:03', '3d modelled head', 'sha1$4c6abcfb$1$355c8da9efe2cc7c3981270f9aeb3d78affda1f2.mp4'),
(9, 3, 'spongebob ', 'sha1$71477d7f$1$6a6a28e980eacf9517117a86b22d507ea837f72a.jpg', 'video', '2023-03-29 21:47:33', '2023-03-29 21:47:33', 'spongebob , squidwar, and patrick houses', 'sha1$3c8c36fe$1$191ca7381e894070f1718f4314221b04058dcdd1.mp4'),
(10, 3, 'peace', 'sha1$813162a7$1$14dc5eb5606b5852c27707f438e11789dc72b883.jpeg', 'video', '2023-03-29 21:48:32', '2023-03-29 21:48:32', 'peaceful view', 'sha1$d112b3e8$1$342a24c23f5e5c27b859bb501d8714cbdb702b0e.mp4'),
(11, 4, 'anime girl', 'sha1$de6bfe83$1$de7b0cae8a459919d8627a46771980931f1aa3fe.png', 'video', '2023-03-29 21:51:16', '2023-03-29 21:51:16', 'anime girl on beach', 'sha1$308c85f8$1$14d35b54185e8e8585b0968cf9c74fdd75bb2db3.mp4'),
(12, 4, 'duck on water', 'sha1$30d2784d$1$65ecef9d76f07c3806a9d0e98997f94591907714.jpg', 'video', '2023-03-29 21:53:07', '2023-03-29 21:53:07', 'sunshine on such a majestic animal', 'sha1$afe04a6c$1$f767b49b114523560869179c53c9de1ced6c7d89.mp4'),
(13, 3, 'wave', 'sha1$0272ad49$1$fe3fad4bf6d483810d4c8c92b8673345056ebbf1.jpg', 'short', '2023-03-29 22:06:33', '2023-03-29 22:06:33', 'magneficient wave', 'sha1$c18a8471$1$eb954d31bcaa2a69ee2ba2935fee1176452bb993.mp4'),
(14, 2, 'violinist', 'sha1$b115f92f$1$10d815530b65fb8badeeecca9dbbf4ce790b805c.jpg', 'video', '2023-05-08 21:24:39', '2023-05-08 21:24:39', 'beautiful violinist', 'sha1$54d8fd82$1$1dad3b4300dace147f56618f2c6da885dcad1e43.mp4');

-- --------------------------------------------------------

--
-- Table structure for table `video_views`
--

CREATE TABLE IF NOT EXISTS video_views (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `video_id` int(11) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
);

--
-- Dumping data for table `video_views`
--

INSERT INTO `video_views` (`id`, `user_id`, `video_id`, `created_at`, `updated_at`) VALUES
(1, 2, 8, '2023-04-02 21:04:36', '2023-04-02 21:04:36'),
(2, 3, 8, '2023-04-02 21:11:56', '2023-04-02 21:11:56'),
(3, 7, 3, '2023-04-02 22:43:02', '2023-04-02 22:43:02'),
(4, 7, 11, '2023-04-02 22:44:54', '2023-04-02 22:44:54'),
(5, 7, 12, '2023-04-02 22:45:47', '2023-04-02 22:45:47'),
(6, 2, 3, '2023-04-03 17:23:05', '2023-04-03 17:23:05'),
(7, 2, 11, '2023-04-03 17:23:19', '2023-04-03 17:23:19'),
(8, 2, 12, '2023-04-03 17:23:27', '2023-04-03 17:23:27'),
(9, 2, 9, '2023-04-03 17:23:34', '2023-04-03 17:23:34'),
(10, 2, 10, '2023-04-03 17:23:42', '2023-04-03 17:23:42'),
(11, 6, 10, '2023-04-10 21:43:43', '2023-04-10 21:43:43'),
(12, 6, 9, '2023-04-10 21:44:00', '2023-04-10 21:44:00'),
(13, 3, 3, '2023-04-11 18:15:54', '2023-04-11 18:15:54'),
(14, 4, 8, '2023-04-11 18:33:12', '2023-04-11 18:33:12'),
(15, 5, 8, '2023-04-11 18:33:18', '2023-04-11 18:33:18'),
(16, 6, 8, '2023-04-11 18:33:29', '2023-04-11 18:33:29'),
(17, 4, 3, '2023-04-11 22:57:45', '2023-04-11 22:57:45'),
(18, 4, 11, '2023-04-11 22:58:47', '2023-04-11 22:58:47'),
(19, 4, 10, '2023-04-11 22:58:59', '2023-04-11 22:58:59'),
(20, 7, 4, '2023-05-02 18:05:15', '2023-05-02 18:05:15'),
(21, 7, 8, '2023-05-02 18:06:32', '2023-05-02 18:06:32'),
(22, 2, 4, '2023-05-08 20:39:43', '2023-05-08 20:39:43'),
(23, 2, 14, '2023-05-08 21:24:45', '2023-05-08 21:24:45');

-- --------------------------------------------------------

--
-- Table structure for table `watch_laters`
--

CREATE TABLE IF NOT EXISTS watch_laters (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `video_id` int(11) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
);

--
-- Dumping data for table `watch_laters`
--

INSERT INTO `watch_laters` (`id`, `user_id`, `video_id`, `created_at`, `updated_at`) VALUES
(3, 2, 8, '2023-04-02 22:02:49', '2023-04-02 22:02:49'),
(4, 7, 12, '2023-04-02 22:46:01', '2023-04-02 22:46:01'),
(5, 6, 9, '2023-04-10 21:44:04', '2023-04-10 21:44:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
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
  ADD UNIQUE KEY `phone` (`phone`),
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
