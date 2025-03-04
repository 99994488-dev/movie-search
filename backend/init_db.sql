-- 创建数据库
CREATE DATABASE IF NOT EXISTS movie CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE movie;

-- 创建用户表
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    is_member BOOLEAN DEFAULT FALSE,
    membership_expiry DATETIME
);

-- 检查kg表是否存在，如果不存在则创建
CREATE TABLE IF NOT EXISTS kg (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    dir VARCHAR(100),
    imdb VARCHAR(20) UNIQUE,
    size VARCHAR(50),
    PageUrl VARCHAR(200),
    year INT
);

-- 创建电影表
CREATE TABLE IF NOT EXISTS movie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tt_id VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    director VARCHAR(100),
    year INT,
    imdb_link VARCHAR(200),
    description TEXT
);

-- 创建一些示例数据
INSERT INTO movie (tt_id, title, director, year, imdb_link, description) VALUES
('tt0111161', '肖申克的救赎', '弗兰克·德拉邦特', 1994, 'https://www.imdb.com/title/tt0111161/', '两个被囚禁的人找到慰藉和最终的救赎。'),
('tt0468569', '黑暗骑士', '克里斯托弗·诺兰', 2008, 'https://www.imdb.com/title/tt0468569/', '当小丑威胁要摧毁哥谭市时，蝙蝠侠必须面对他最大的心理和身体挑战。'),
('tt0109830', '阿甘正传', '罗伯特·泽米吉斯', 1994, 'https://www.imdb.com/title/tt0109830/', '阿甘的一生充满了偶然和巧合，但他始终保持着善良和纯真。'); 