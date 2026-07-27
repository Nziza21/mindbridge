-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: mindbridge_db
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.22.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `resources`
--

DROP TABLE IF EXISTS `resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resources` (
  `resource_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `description` text,
  `url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`resource_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resources`
--

LOCK TABLES `resources` WRITE;
/*!40000 ALTER TABLE `resources` DISABLE KEYS */;
INSERT INTO `resources` VALUES (7,'Managing Exam Stress','article','stress','Practical tips for staying calm during exam season.','https://www.helpguide.org/articles/stress/stress-management.htm','2026-07-27 04:49:23'),(8,'Understanding Anxiety','video','anxiety','A short guide explaining what anxiety is and how it shows up.','https://www.helpguide.org/articles/anxiety/anxiety-disorders-and-anxiety-attacks.htm','2026-07-27 04:49:23'),(9,'Mindfulness for Students','article','mindfulness','Simple steps to start a mindfulness practice as a student.','https://www.helpguide.org/articles/mental-health/building-better-mental-health.htm','2026-07-27 04:49:23'),(10,'Coping with Depression','article','depression','Signs to watch for and where to get support.','https://www.helpguide.org/articles/depression/depression-symptoms-and-warning-signs.htm','2026-07-27 04:49:23'),(11,'Breathing Exercise for Anxiety','article','stress','A guided breathing technique for stressful moments.','https://www.helpguide.org/articles/anxiety/how-to-stop-worrying.htm','2026-07-27 04:49:23'),(12,'Building Healthy Friendships','article','social','Tips for building and maintaining healthy friendships at university.','https://www.helpguide.org/articles/relationships-communication/making-good-friends.htm','2026-07-27 04:49:23'),(13,'How to Sleep Better as a Student','article','sleep','Tips for improving sleep quality during stressful academic periods.','https://www.helpguide.org/articles/sleep/getting-better-sleep.htm','2026-07-27 04:51:45'),(14,'Managing Academic Pressure','article','academics','How to handle academic stress and stay motivated.','https://www.helpguide.org/articles/stress/burnout-prevention-and-recovery.htm','2026-07-27 04:51:45');
/*!40000 ALTER TABLE `resources` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-27  8:39:57
