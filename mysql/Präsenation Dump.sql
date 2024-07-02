-- MySQL dump 10.13  Distrib 8.0.36, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: datenbank
-- ------------------------------------------------------
-- Server version	8.3.0

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

--
-- Table structure for table `kuehlschrank`
--

DROP TABLE IF EXISTS `kuehlschrank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kuehlschrank` (
  `kuehlschrank_id` int NOT NULL,
  `wg_id` int DEFAULT NULL,
  PRIMARY KEY (`kuehlschrank_id`),
  KEY `kühlschrank_wg_id_wg_id_idx` (`wg_id`),
  CONSTRAINT `wg_id_kühlschrank_wg_id` FOREIGN KEY (`wg_id`) REFERENCES `wg` (`wg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kuehlschrank`
--

LOCK TABLES `kuehlschrank` WRITE;
/*!40000 ALTER TABLE `kuehlschrank` DISABLE KEYS */;
INSERT INTO `kuehlschrank` VALUES (1,1);
/*!40000 ALTER TABLE `kuehlschrank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lebensmittel`
--

DROP TABLE IF EXISTS `lebensmittel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lebensmittel` (
  `lebensmittel_id` int NOT NULL,
  `lebensmittel_name` varchar(255) DEFAULT NULL,
  `masseinheit_id` int DEFAULT NULL,
  `mengenanzahl_id` int DEFAULT NULL,
  `kuehlschrank_id` int DEFAULT NULL,
  `rezept_id` int DEFAULT NULL,
  PRIMARY KEY (`lebensmittel_id`),
  KEY `lebensmittel_id_index` (`lebensmittel_id`),
  KEY `fk_masseinheit` (`masseinheit_id`),
  KEY `fk_mengenanzahl` (`mengenanzahl_id`),
  KEY `fk_kuehlschrank_idx` (`kuehlschrank_id`),
  KEY `fk_rezept_idx` (`rezept_id`),
  CONSTRAINT `kuehlschrank_fk` FOREIGN KEY (`kuehlschrank_id`) REFERENCES `kuehlschrank` (`kuehlschrank_id`),
  CONSTRAINT `masseinheit_fk` FOREIGN KEY (`masseinheit_id`) REFERENCES `masseinheit` (`masseinheit_id`),
  CONSTRAINT `mengenanzahl_fk` FOREIGN KEY (`mengenanzahl_id`) REFERENCES `mengenanzahl` (`id`),
  CONSTRAINT `rezept_fk` FOREIGN KEY (`rezept_id`) REFERENCES `rezept` (`rezept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lebensmittel`
--

LOCK TABLES `lebensmittel` WRITE;
/*!40000 ALTER TABLE `lebensmittel` DISABLE KEYS */;
INSERT INTO `lebensmittel` VALUES (1,'hackfleisch',3,1,NULL,1),(2,'tomatensauce',5,2,NULL,1),(3,'pasta',3,2,NULL,1),(4,'eier',13,3,NULL,2),(5,'nutella',3,4,NULL,2),(6,'mehl',3,5,NULL,2),(7,'backpulver',8,6,NULL,2),(8,'hackfleisch',7,7,1,NULL),(9,'tomatensauce',1,7,1,NULL),(10,'pasta',2,7,1,NULL),(11,'eier',13,8,1,NULL),(12,'nutella',8,9,1,NULL),(13,'mehl',2,10,1,NULL),(14,'backpulver',3,11,1,NULL),(15,'sushireis',2,7,1,NULL),(16,'lachs',3,1,1,NULL),(17,'algenblätter',8,12,1,NULL),(18,'kaviar',3,13,1,NULL);
/*!40000 ALTER TABLE `lebensmittel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `masseinheit`
--

DROP TABLE IF EXISTS `masseinheit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `masseinheit` (
  `masseinheit_id` int DEFAULT NULL,
  `masseinheit_name` varchar(255) DEFAULT NULL,
  `umrechnungsfaktor` decimal(10,4) DEFAULT NULL,
  KEY `masseinheit_id_index` (`masseinheit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masseinheit`
--

LOCK TABLES `masseinheit` WRITE;
/*!40000 ALTER TABLE `masseinheit` DISABLE KEYS */;
INSERT INTO `masseinheit` VALUES (1,'liter',1000.0000),(2,'kilogramm',1000.0000),(3,'gramm',1.0000),(4,'l',1000.0000),(5,'milliliter',1.0000),(6,'ml',1.0000),(7,'kg',1000.0000),(8,'gr',1.0000),(9,'unzen',28.3495),(10,'oz',3495.0000),(11,'pfund',453.5920),(12,'lb',453.5920),(13,'stück',50.0000);
/*!40000 ALTER TABLE `masseinheit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mengenanzahl`
--

DROP TABLE IF EXISTS `mengenanzahl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mengenanzahl` (
  `id` int NOT NULL,
  `menge` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mengenanzahl`
--

LOCK TABLES `mengenanzahl` WRITE;
/*!40000 ALTER TABLE `mengenanzahl` DISABLE KEYS */;
INSERT INTO `mengenanzahl` VALUES (1,400),(2,500),(3,5),(4,100),(5,250),(6,20),(7,1),(8,10),(9,800),(10,1.5),(11,30),(12,200),(13,50);
/*!40000 ALTER TABLE `mengenanzahl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `email` varchar(45) DEFAULT NULL,
  `benutzername` varchar(45) DEFAULT NULL,
  `nachname` varchar(45) DEFAULT NULL,
  `vorname` varchar(45) DEFAULT NULL,
  `id` int NOT NULL,
  `google_id` varchar(45) DEFAULT NULL,
  `wg_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `wg_id_idx` (`wg_id`),
  CONSTRAINT `wg_id` FOREIGN KEY (`wg_id`) REFERENCES `wg` (`wg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES ('justin36480@gmail.com','justin','ugwu','justin',1,'8I2uMBeP42gAUDaErZhJnFE7NT92',NULL),('startjeff34@gmail.com','jeff stark','stark','jeff',2,'17rCsIxVYGWFQVh3EntUbqcYT4x1',1);
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rezept`
--

DROP TABLE IF EXISTS `rezept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rezept` (
  `rezept_name` varchar(45) DEFAULT NULL,
  `anzahl_portionen` varchar(45) DEFAULT NULL,
  `rezept_ersteller` varchar(45) DEFAULT NULL,
  `rezept_id` int NOT NULL,
  `wg_id` int DEFAULT NULL,
  `rezept_anleitung` text,
  PRIMARY KEY (`rezept_id`),
  KEY `rezeptowner_idx` (`anzahl_portionen`),
  KEY `fk_rezept_wg` (`wg_id`),
  CONSTRAINT `fk_rezept_wg` FOREIGN KEY (`wg_id`) REFERENCES `wg` (`wg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rezept`
--

LOCK TABLES `rezept` WRITE;
/*!40000 ALTER TABLE `rezept` DISABLE KEYS */;
INSERT INTO `rezept` VALUES ('Bolognese','2','startjeff34@gmail.com',1,1,'min 2h köcheln lassen.'),('Waffeln','2','startjeff34@gmail.com',2,1,'Nutella in den Teig mischen.');
/*!40000 ALTER TABLE `rezept` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wg`
--

DROP TABLE IF EXISTS `wg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wg` (
  `wg_id` int NOT NULL,
  `wg_name` varchar(255) DEFAULT NULL,
  `wg_ersteller` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`wg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wg`
--

LOCK TABLES `wg` WRITE;
/*!40000 ALTER TABLE `wg` DISABLE KEYS */;
INSERT INTO `wg` VALUES (1,'Feuersee WG','startjeff34@gmail.com');
/*!40000 ALTER TABLE `wg` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-02 15:49:27
