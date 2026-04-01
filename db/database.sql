-- MySQL dump 10.13  Distrib 8.0.45, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: boolzip_shop
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '781120c6-0c09-11f1-b258-fa9d21cc9fb6:1-365,
b9ca4fa8-10d5-11f1-98de-ac6a1011278f:1-103';

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Classic'),(2,'Electric');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'ZIPPO10','2025-01-01','2026-12-31',10.00),(2,'WELCOME15','2025-01-01','2026-12-31',15.00),(3,'SUMMER20','2025-06-01','2025-09-01',20.00);
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `material` varchar(80) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES (1,'Brass'),(2,'Chrome'),(3,'Matte Black Steel'),(4,'Copper'),(5,'Titanium'),(6,'Gold Plated');
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletter`
--

DROP TABLE IF EXISTS `newsletter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletter`
--

LOCK TABLES `newsletter` WRITE;
/*!40000 ALTER TABLE `newsletter` DISABLE KEYS */;
INSERT INTO `newsletter` VALUES (1,'utente@test.com','2026-03-12 14:40:58'),(2,'pippo@test.com','2026-03-12 15:42:46'),(3,'giulio@test.com','2026-03-12 18:01:50'),(4,'giuliotest.com','2026-03-16 10:38:07'),(5,'luca@test.com','2026-03-16 10:42:54'),(6,'pippopallino1999@gmail.com','2026-03-16 10:55:07'),(9,'luca45@test.com','2026-03-16 12:04:46'),(10,'luca5@test.com','2026-03-16 16:26:16'),(11,'luca54444@test.com','2026-03-18 11:56:11'),(12,'luca5444356444@test.com','2026-03-18 12:12:06'),(13,'luca544435uhbu444@test.com','2026-03-18 12:14:21'),(14,'luca54443dd5uhbu444@test.com','2026-03-18 12:32:41'),(15,'luca54443dddd5uhbu444@test.com','2026-03-18 12:37:13'),(16,'luca54443dddd5dduhbu444@test.com','2026-03-18 12:37:50'),(17,'luca54443dddd5dduhddbu444@test.com','2026-03-18 12:46:41'),(18,'luca5444ss3dddd5dduhddbu444@test.com','2026-03-18 12:47:56'),(20,'mariorossi94@gmail.com','2026-03-19 11:00:03');
/*!40000 ALTER TABLE `newsletter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_product`
--

DROP TABLE IF EXISTS `order_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_product` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `quantity` int unsigned NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_product_order_id_foreign` (`order_id`),
  KEY `order_product_product_id_foreign` (`product_id`),
  CONSTRAINT `order_product_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_product_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_product`
--

LOCK TABLES `order_product` WRITE;
/*!40000 ALTER TABLE `order_product` DISABLE KEYS */;
INSERT INTO `order_product` VALUES (1,1,1,1,29.90),(2,1,2,2,27.90),(4,3,7,1,129.90),(5,1,2,1,29.90),(6,1,5,2,19.90),(7,2,3,1,49.90),(8,2,7,1,39.90),(9,3,4,2,24.90),(10,4,1,1,59.90),(11,4,6,1,34.90),(12,5,2,3,29.90),(13,6,8,1,79.90),(14,6,3,2,49.90),(15,7,5,1,19.90),(16,8,4,2,24.90),(17,8,7,1,39.90),(18,9,6,1,34.90),(19,10,2,2,29.90),(20,10,3,1,49.90),(21,11,8,1,79.90),(22,12,1,1,59.90),(23,12,5,2,19.90),(24,13,7,1,39.90),(25,13,4,1,24.90),(26,14,1,2,29.90),(27,14,9,1,31.90),(28,16,2,2,27.90),(29,16,4,1,79.90),(30,17,1,2,29.90),(31,17,3,1,34.90),(32,19,1,2,29.90),(33,19,2,1,49.50),(34,20,1,2,29.90),(35,20,2,1,32.50),(36,21,1,2,29.90),(37,22,1,2,29.90),(38,22,3,1,34.90),(39,23,1,2,29.90),(40,23,3,1,34.90),(41,24,1,2,29.90),(42,24,3,1,34.90),(43,25,5,12,39.90),(44,25,3,1,34.90),(46,27,7,1,129.90),(47,27,3,1,34.90),(50,30,7,1,129.90),(51,30,3,1,34.90),(52,31,7,1,129.90),(53,31,3,1,34.90),(54,32,7,1,129.90),(55,32,3,1,34.90),(56,33,1,2,29.90),(57,33,3,1,34.90),(58,34,1,2,29.90),(59,34,3,1,34.90),(60,35,1,2,29.90),(61,35,3,1,34.90),(62,36,1,2,29.90),(63,36,3,1,34.90),(64,37,3,1,34.90),(69,39,3,1,34.90),(70,40,5,1,39.90),(71,41,4,1,79.90),(72,42,3,1,34.90),(73,43,3,1,34.90),(76,46,5,2,39.90);
/*!40000 ALTER TABLE `order_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `session_id` varchar(255) NOT NULL,
  `created_date` timestamp NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_address` varchar(255) NOT NULL,
  `customer_lastname` varchar(100) NOT NULL,
  `customer_phone` varchar(15) NOT NULL,
  `customer_billing_address` varchar(255) NOT NULL,
  `subtotal_amount` decimal(10,2) NOT NULL,
  `discount_code` varchar(255) DEFAULT NULL,
  `discount_value` decimal(10,2) DEFAULT NULL,
  `shipping_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'sess_abc123','2026-03-06 16:48:08',89.80,'Luca','luca@email.it','Via Roma 10 Milano','Rossi','3331234567','Via Roma 10 Milano',0.00,NULL,NULL,0.00),(2,'sess_def456','2026-03-06 16:48:08',59.90,'Marco','marco@email.it','Via Garibaldi 22 Torino','Bianchi','3337654321','Via Garibaldi 22 Torino',0.00,'ZIPPO10',10.00,0.00),(3,'sess_ghi789','2026-03-06 16:48:08',129.90,'Anna','anna@email.it','Via Dante 5 Bologna','Verdi','3331112222','Via Dante 5 Bologna',0.00,NULL,NULL,0.00),(4,'sess_1002','2026-03-11 15:32:36',120.50,'Luca','luca@email.com','Via Milano 21, Torino','Bianchi','3331112222','Via Milano 21, Torino',0.00,'SCONTO10',10.00,0.00),(5,'sess_1003','2026-03-11 15:32:36',49.90,'Giulia','giulia@email.com','Via Napoli 5, Roma','Verdi','3334445555','Via Napoli 5, Roma',0.00,NULL,0.00,0.00),(6,'sess_1004','2026-03-11 15:32:36',89.00,'Marco','marco@email.com','Via Firenze 8, Bologna','Neri','3336667777','Via Firenze 8, Bologna',0.00,'SCONTO15',15.00,0.00),(7,'sess_1005','2026-03-11 15:32:36',59.90,'Anna','anna@email.com','Via Garibaldi 3, Milano','Rossi','3338889999','Via Garibaldi 3, Milano',0.00,NULL,0.00,0.00),(8,'sess_1006','2026-03-11 15:32:36',149.99,'Stefano','stefano@email.com','Via Dante 12, Firenze','Moretti','3337776666','Via Dante 12, Firenze',0.00,'SCONTO20',20.00,0.00),(9,'sess_1007','2026-03-11 15:32:36',75.50,'Chiara','chiara@email.com','Via Verdi 8, Torino','Ferrari','3335554444','Via Verdi 8, Torino',0.00,NULL,0.00,0.00),(10,'sess_1008','2026-03-11 15:32:36',99.90,'Alessio','alessio@email.com','Via Mazzini 15, Bologna','Romano','3333332222','Via Mazzini 15, Bologna',0.00,'SCONTO10',10.00,0.00),(11,'sess_1009','2026-03-11 15:32:36',39.99,'Elena','elena@email.com','Via Leopardi 6, Napoli','Costa','3331110000','Via Leopardi 6, Napoli',0.00,NULL,0.00,0.00),(12,'sess_1010','2026-03-11 15:32:36',180.00,'Matteo','matteo@email.com','Via Carducci 22, Roma','Greco','3339998888','Via Carducci 22, Roma',0.00,'SCONTO25',25.00,0.00),(13,'sess_1011','2026-03-11 15:32:36',69.90,'Sara','sara@email.com','Via Pascoli 10, Milano','Conti','3332223333','Via Pascoli 10, Milano',0.00,NULL,0.00,0.00),(14,'session_001','2026-03-11 18:03:00',59.90,'Mario','mario@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Roma 10, Milano',0.00,NULL,0.00,0.00),(15,'session_002','2026-03-12 09:36:12',89.90,'Luca','luca.bianchi@email.com','Via Milano 25, Torino','Bianchi','3495566778','Via Milano 25, Torino',0.00,'WELCOME10',10.00,0.00),(16,'session_001','2026-03-12 10:32:19',135.70,'Mario','mario@email.com','Via Milano 10','Bianchi','3331234567','Via Milano 10',0.00,NULL,NULL,0.00),(17,'session_005','2026-03-12 10:37:39',94.70,'Mario','mario@email.com','Via Roma 10','Rossi','3331234567','Via Roma 10',0.00,NULL,NULL,0.00),(18,'session_001','2026-03-12 10:48:03',0.00,'Mario','mario@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Roma 10, Milano',0.00,NULL,NULL,0.00),(19,'session_009','2026-03-12 10:54:28',109.30,'Mario','mario@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Roma 10, Milano',0.00,'SUMMER10',10.00,0.00),(20,'session_001','2026-03-12 10:57:44',92.30,'Mario','mario@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Roma 10, Milano',0.00,'SUMMER10',10.00,0.00),(21,'session_001','2026-03-12 11:25:15',109.30,'Mario','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Milano 15, Milano',0.00,'SUMMER10',10.00,0.00),(22,'session_001','2026-03-12 11:25:57',109.30,'Mario','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Milano 15, Milano',0.00,'SUMMER10',10.00,0.00),(23,'session_001','2026-03-12 11:33:04',109.30,'Mario','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Milano 15, Milano',0.00,'SUMMER10',10.00,0.00),(24,'session_001','2026-03-12 11:35:51',109.30,'Mario','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Milano 15, Milano',0.00,NULL,0.00,0.00),(25,'session_001','2026-03-12 13:43:57',528.30,'Mario','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Milano 15, Milano',0.00,'SUMMER10',10.00,0.00),(27,'session_001','2026-03-12 17:01:10',79.40,'giulio','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Milano 15, Milano',0.00,'SUMMER10',10.00,0.00),(30,'session_001','2026-03-13 08:45:52',79.40,'','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Milano 15, Milano',0.00,'SUMMER10',10.00,0.00),(31,'session_001','2026-03-13 08:46:15',0.00,'','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Milano 15, Milano',0.00,'SUMMER10',10.00,0.00),(32,'session_001','2026-03-13 08:48:29',39.90,'Antonio','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Milano 15, Milano',0.00,'SUMMER10',10.00,0.00),(33,'session_abc123','2026-03-13 10:33:32',84.70,'Mario','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Roma 10, Milano',94.70,'WELCOME10',10.00,0.00),(34,'session_abc123','2026-03-13 10:52:10',89.70,'Mario','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Roma 10, Milano',94.70,'WELCOME10',10.00,5.00),(35,'session_abc123','2026-03-13 10:56:21',89.70,'Mario','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Roma 10, Milano',94.70,'WELCOME10',10.00,5.00),(36,'session_abc123','2026-03-13 11:00:29',84.70,'Mario','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Roma 10, Milano',94.70,'WELCOME10',10.00,0.00),(37,'session_abc123','2026-03-13 11:00:41',28.89,'Mario','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Roma 10, Milano',34.90,'WELCOME10',10.00,3.99),(39,'session_abc123','2026-03-13 11:07:22',28.89,'Mario','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Roma 10, Milano',34.90,'WELCOME10',10.00,3.99),(40,'session_abc123','2026-03-18 11:20:16',33.89,'Mario','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Roma 10, Milano',39.90,'WELCOME10',10.00,3.99),(41,'session_abc123','2026-03-18 11:26:23',73.89,'Mario','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Roma 10, Milano',79.90,'WELCOME10',10.00,3.99),(42,'session_abc123','2026-03-18 11:40:24',28.89,'Mario','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Roma 10, Milano',34.90,'WELCOME10',10.00,3.99),(43,'session_abc123','2026-03-18 11:55:30',28.89,'Mario','mario.rossi@email.com','Via Roma 10, Milano','Rossi','3331234567','Via Roma 10, Milano',34.90,'WELCOME10',10.00,3.99),(46,'sess_1773914906159','2026-03-19 10:08:26',73.79,'Mario','mariorossi94@gmail.com','via regina margherita 16, 20019, Milano','Rossi','3263478541','via regina margherita 16, 20019, Milano',79.80,'zippo10',10.00,3.99);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `image_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_foreign` (`product_id`),
  CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,'Zippo-Chrome-Brushed-1.jpg'),(48,1,'Zippo-Chrome-Brushed-2.jpg'),(49,1,'Zippo-Chrome-Brushed-3.jpg'),(50,2,'Zippo-Slim-Matte-Black-1.jpg'),(51,2,'Zippo-Slim-Matte-Black-2.jpg'),(52,2,'Zippo-Slim-Matte-Black-3.jpg'),(53,3,'Zippo-Vintage-Brass-1.jpg'),(54,3,'Zippo-Vintage-Brass-2.jpg'),(55,3,'Zippo-Vintage-Brass-3.jpg'),(56,4,'Zippo-Titanium-Armor-1.jpg'),(57,4,'Zippo-Titanium-Armor-2.jpg'),(58,4,'Zippo-Titanium-Armor-3.jpg'),(59,5,'Zippo-Nautical-Tattoo-1.jpg'),(60,5,'Zippo-Nautical-Tattoo-2.jpg'),(61,5,'Zippo-Nautical-Tattoo-3.jpg'),(62,6,'Zippo-Harley-Davidson-1.jpg'),(63,6,'Zippo-Harley-Davidson-2.jpg'),(64,6,'Zippo-Harley-Davidson-3.jpg'),(65,7,'Zippo-Luxury-Gold-1.jpg'),(66,7,'Zippo-Luxury-Gold-2.jpg'),(67,7,'Zippo-Luxury-Gold-3.jpg'),(68,8,'Zippo-Vintage-Copper-1.jpg'),(69,8,'Zippo-Vintage-Copper-2.jpg'),(70,8,'Zippo-Vintage-Copper-3.jpg'),(71,9,'Zippo-Jack-Daniel\'s-1.jpg'),(72,9,'Zippo-Jack-Daniel\'s-2.jpg'),(73,9,'Zippo-Jack-Daniel\'s-3.jpg'),(74,10,'Zippo-Titanium-Black-1.jpg'),(75,10,'Zippo-Titanium-Black-2.jpg'),(76,10,'Zippo-Titanium-Black-3.jpg'),(77,11,'Zippo-Chrome-Skull-1.jpg'),(78,11,'Zippo-Chrome-Skull-2.jpg'),(79,11,'Zippo-Chrome-Skull-3.jpg'),(80,12,'Zippo-Adventure-Brass-1.jpg'),(81,12,'Zippo-Adventure-Brass-2.jpg'),(82,12,'Zippo-Adventure-Brass-3.jpg'),(83,13,'Zippo-Slim®-Iridescent-1.jpg'),(84,13,'Zippo-Slim®-Iridescent-2.jpg'),(85,13,'Zippo-Slim®-Iridescent-3.jpg'),(86,14,'Zippo-Inserto-Arc-Lighter-1.jpg'),(87,14,'Zippo-Inserto-Arc-Lighter-2.jpg'),(88,14,'Zippo-Inserto-Arc-Lighter-3.jpg');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `size_id` int unsigned NOT NULL,
  `category_id` int unsigned NOT NULL,
  `material_id` int unsigned NOT NULL,
  `name` varchar(120) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `products_size_id_foreign` (`size_id`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_material_id_foreign` (`material_id`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `products_material_id_foreign` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`),
  CONSTRAINT `products_size_id_foreign` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,2,1,2,'Zippo Classic Chrome',29.90,'Iconico accendino stile Zippo con finitura cromata lucida.','Zippo-Chrome-Brushed.jpg','zippo-classic-chrome','2026-01-15 10:00:00'),(2,1,1,3,'Zippo Matte Black',27.90,'Questo accendino antivento nero opaco è decorato con il classico logo Zippo.','Zippo-Slim-Matte-Black.jpg','zippo-matte-black','2026-01-22 11:30:00'),(3,2,1,1,'Zippo Vintage Brass',34.90,'Accendino in ottone con stile vintage retrò.','Zippo-Vintage-Brass.jpg','zippo-vintage-brass','2026-01-29 09:15:00'),(4,2,1,5,'Zippo Titanium Armor',79.90,'Accendino robusto in titanio.','Zippo-Titanium-Armor.jpg','zippo-titanium-armor','2026-02-05 14:20:00'),(5,2,1,3,'Zippo Nautical Tattoo',39.90,'Il tempo e la marea non aspettano nessuno','Zippo-Nautical-Tattoo.jpg','zippo-nautical-tattoo','2026-02-12 16:45:00'),(6,2,1,2,'Zippo Harley-Davidson®',101.00,'Stai cercando di decollare con stile? Questo accendino Street Chrome ™ Harley-Davidson® ha un emblema a sorpresa applicato. ','Zippo-Harley-Davidson.jpg','zippo-harley-davidson','2026-02-19 13:10:00'),(7,2,1,6,'Zippo Luxury Gold',129.90,'Accendino di lusso placcato oro.','Zippo-Luxury-Gold.jpg','zippo-luxury-gold','2026-02-26 18:00:00'),(8,2,1,4,'Zippo Vintage Copper',36.90,'Finitura rame vintage con patina naturale.','Zippo-Vintage-Copper.jpg','zippo-vintage-copper','2026-03-01 10:25:00'),(9,1,1,3,'Zippo Jack Daniel\'s®',31.90,'Festeggia il miglior whisky del Tennessee in circolazione con questo accendino Jack Daniel\'s®! ','Zippo-Jack-Daniel\'s.jpg','zippo-jack-daniel\'s','2026-03-03 12:40:00'),(10,2,1,5,'Zippo Titanium Black',89.90,'Questo classico accendino cromato è dotato di un rivestimento micro sottile e resistente ai graffi che permette di ottenere la finitura luminosa, nera intensa e simile a uno specchio di Zippo.','Zippo-Titanium-Black.jpg','zippo-titanium-black','2026-03-05 15:05:00'),(11,2,1,2,'Zippo Chrome Skull',44.90,'Decorazione con teschio inciso.','Zippo-Chrome-Skull.jpg','zippo-chrome-skull','2026-03-07 17:30:00'),(12,2,1,1,'Zippo Adventure Brass',37.90,'Accendino resistente per campeggio.','Zippo-Adventure-Brass.jpg','zippo-adventure-brass','2026-03-09 08:50:00'),(13,1,1,3,'Zippo Slim® Iridescent',22.90,'Zippo continua a offrire opzioni senza pari in tutti i colori dell\'arcobaleno, e il nuovo modello Slim® Iridescent non fa eccezione.','Zippo-Slim®-Iridescent.jpg','zippo-slim-iridescent','2026-03-10 19:15:00'),(14,2,2,2,'Zippo Electric Arc Insert ',49.90,'Questo inserto si accende con due potenti fasci di plasma. L\'inserto a doppio arco offre una fonte di fiamma antivento che può essere facilmente ricaricata','Zippo-Inserto-Arc-Lighter.jpg','zippo-inserto-arc-lighter','2026-03-11 09:00:00');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sizes`
--

DROP TABLE IF EXISTS `sizes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sizes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `size` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sizes`
--

LOCK TABLES `sizes` WRITE;
/*!40000 ALTER TABLE `sizes` DISABLE KEYS */;
INSERT INTO `sizes` VALUES (1,'Slim'),(2,'Standard');
/*!40000 ALTER TABLE `sizes` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-01 18:25:33
