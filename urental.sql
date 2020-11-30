-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  ven. 19 juil. 2019 à 13:49
-- Version du serveur :  5.7.26
-- Version de PHP :  7.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'High tech'),
(2, 'Transport'),
(3, 'Immobilier');

DROP TABLE IF EXISTS `items`;
CREATE TABLE IF NOT EXISTS `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_owner` int(11) NOT NULL,
  `id_category` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` float NOT NULL,
  `format` varchar(255) NOT NULL,
  `caution` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `rents`;
CREATE TABLE IF NOT EXISTS `rents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hash` varchar(100) NULL,
  `id_item` int(11) NOT NULL,
  `id_renter` int(11) NOT NULL,
  `id_owner` int(11) NOT NULL,
  `start_time` date NOT NULL,
  `period` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address_ethereum` varchar(255) NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `password`) VALUES
(1, 'Baptiste', 'Louyot', 'baptiste.louyot@gmail.com', 'root'),
(2, 'Paul', 'Mussy', 'paul.mussy@gmail.com', 'root'),
(3, 'Juan Jose', 'Urrego', 'juan-jose.urrego@gmail.com', 'root');

COMMIT;
