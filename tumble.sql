CREATE DATABASE IF NOT EXISTS tumble;

USE tumble;

CREATE TABLE IF NOT EXISTS users (
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `dob` DATE NOT NULL,
    `phone` VARCHAR(20) UNIQUE NOT NULL,
    `photo` VARCHAR(100),
    `banner` VARCHAR(100),
    `banner_position` VARCHAR(100),
    `username` VARCHAR(100) UNIQUE,
    `created_at` DATETIME DEFAULT NOW(),
    `updated_at` DATETIME DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE IF NOT EXISTS videos (
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT(11) UNSIGNED NOT NULL,
    `name` VARCHAR(255),
    `placeholder` VARCHAR(100),
    `description` VARCHAR(255),
    `type` ENUM("short", "video"),
    `path` VARCHAR(100),
    CONSTRAINT fk_videos_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    `created_at` DATETIME DEFAULT NOW(),
    `updated_at` DATETIME DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT(11) UNSIGNED NOT NULL,
    `sub_id` INT(11) UNSIGNED NOT NULL,
    CONSTRAINT fk_subscriptions_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_subscriptions_sub_id FOREIGN KEY (sub_id) REFERENCES users(id) ON DELETE CASCADE,
    `created_at` DATETIME DEFAULT NOW(),
    `updated_at` DATETIME DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE IF NOT EXISTS watch_laters (
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT(11) UNSIGNED NOT NULL,
    `video_id` INT(11) UNSIGNED NOT NULL,
    CONSTRAINT fk_watch_laters_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_watch_laters_video_id FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    `created_at` DATETIME DEFAULT NOW(),
    `updated_at` DATETIME DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE IF NOT EXISTS histories (
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT(11) UNSIGNED NOT NULL,
    `video_id` INT(11) UNSIGNED NOT NULL,
    CONSTRAINT fk_histories_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_histories_video_id FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    `created_at` DATETIME DEFAULT NOW(),
    `updated_at` DATETIME DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE IF NOT EXISTS comments (
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT(11) UNSIGNED NOT NULL,
    `video_id` INT(11) UNSIGNED NOT NULL,
    `comment` VARCHAR(255),
    CONSTRAINT fk_comments_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_video_id FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    `created_at` DATETIME DEFAULT NOW(),
    `updated_at` DATETIME DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE IF NOT EXISTS likes_dislikes (
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT(11) UNSIGNED NOT NULL,
    `video_id` INT(11) UNSIGNED NOT NULL,
    `type` ENUM("like", "dislike"),
    CONSTRAINT fk_likes_dislikes_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_likes_dislikes_video_id FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    `created_at` DATETIME DEFAULT NOW(),
    `updated_at` DATETIME DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE IF NOT EXISTS video_views (
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT(11) UNSIGNED NOT NULL,
    `video_id` INT(11) UNSIGNED NOT NULL,
    CONSTRAINT fk_video_views_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_video_views_video_id FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    `created_at` DATETIME DEFAULT NOW(),
    `updated_at` DATETIME DEFAULT NOW() ON UPDATE NOW()
);