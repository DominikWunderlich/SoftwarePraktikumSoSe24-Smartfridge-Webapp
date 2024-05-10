-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: datenbank
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `kuehlschrankinhalt`
--

DROP TABLE IF EXISTS `kuehlschrankinhalt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kuehlschrankinhalt` (
  `kuehlschrank_id` int NOT NULL,
  `lebensmittel_id` int DEFAULT NULL,
  PRIMARY KEY (`kuehlschrank_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kuehlschrankinhalt`
--

LOCK TABLES `kuehlschrankinhalt` WRITE;
/*!40000 ALTER TABLE `kuehlschrankinhalt` DISABLE KEYS */;
INSERT INTO `kuehlschrankinhalt` VALUES (1,123);
/*!40000 ALTER TABLE `kuehlschrankinhalt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kühlschrank`
--

DROP TABLE IF EXISTS `kühlschrank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kühlschrank` (
  `kühlschrank_id` int NOT NULL,
  `wg_id` int DEFAULT NULL,
  KEY `kühlschrank_wg_id_wg_id_idx` (`wg_id`),
  CONSTRAINT `wg_id_kühlschrank_wg_id` FOREIGN KEY (`wg_id`) REFERENCES `wg` (`wg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kühlschrank`
--

LOCK TABLES `kühlschrank` WRITE;
/*!40000 ALTER TABLE `kühlschrank` DISABLE KEYS */;
/*!40000 ALTER TABLE `kühlschrank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lebensmittel`
--

DROP TABLE IF EXISTS `lebensmittel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lebensmittel` (
  `lebensmittel_id` int DEFAULT NULL,
  `lebensmittel_name` varchar(255) DEFAULT NULL,
  `masseinheit_id` int DEFAULT NULL,
  `mengenanzahl_id` int DEFAULT NULL,
  KEY `lebensmittel_id_index` (`lebensmittel_id`),
  KEY `fk_masseinheit` (`masseinheit_id`),
  KEY `fk_mengenanzahl` (`mengenanzahl_id`),
  CONSTRAINT `fk_masseinheit` FOREIGN KEY (`masseinheit_id`) REFERENCES `maßeinheit` (`masseinheit_id`),
  CONSTRAINT `fk_mengenanzahl` FOREIGN KEY (`mengenanzahl_id`) REFERENCES `mengenanzahl` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lebensmittel`
--

LOCK TABLES `lebensmittel` WRITE;
/*!40000 ALTER TABLE `lebensmittel` DISABLE KEYS */;
INSERT INTO `lebensmittel` VALUES (123,'Brot',3,2);
/*!40000 ALTER TABLE `lebensmittel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maßeinheit`
--

DROP TABLE IF EXISTS `maßeinheit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maßeinheit` (
  `masseinheit_id` int DEFAULT NULL,
  `masseinheit_name` varchar(255) DEFAULT NULL,
  `umrechnungsfaktor` decimal(10,4) DEFAULT NULL,
  KEY `masseinheit_id_index` (`masseinheit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maßeinheit`
--

LOCK TABLES `maßeinheit` WRITE;
/*!40000 ALTER TABLE `maßeinheit` DISABLE KEYS */;
INSERT INTO `maßeinheit` VALUES (3,'Gramm',10.0000);
/*!40000 ALTER TABLE `maßeinheit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mengenanzahl`
--

DROP TABLE IF EXISTS `mengenanzahl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mengenanzahl` (
  `id` int NOT NULL,
  `menge` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mengenanzahl`
--

LOCK TABLES `mengenanzahl` WRITE;
/*!40000 ALTER TABLE `mengenanzahl` DISABLE KEYS */;
INSERT INTO `mengenanzahl` VALUES (2,500.00);
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES ('hdepicfail@gmail.com','Ynos','Fezer','Michael',1,'7cdF8J7usgajVz9tGmibFCM2BbU2');
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
  `wg_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`rezept_id`),
  KEY `rezeptowner_idx` (`anzahl_portionen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rezept`
--

LOCK TABLES `rezept` WRITE;
/*!40000 ALTER TABLE `rezept` DISABLE KEYS */;
/*!40000 ALTER TABLE `rezept` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rezept_enthaelt_lebensmittel`
--

DROP TABLE IF EXISTS `rezept_enthaelt_lebensmittel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rezept_enthaelt_lebensmittel` (
  `rezept_name_fk` varchar(45) NOT NULL,
  `lebensmittel_name_fk` varchar(45) NOT NULL,
  PRIMARY KEY (`rezept_name_fk`,`lebensmittel_name_fk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rezept_enthaelt_lebensmittel`
--

LOCK TABLES `rezept_enthaelt_lebensmittel` WRITE;
/*!40000 ALTER TABLE `rezept_enthaelt_lebensmittel` DISABLE KEYS */;
/*!40000 ALTER TABLE `rezept_enthaelt_lebensmittel` ENABLE KEYS */;
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
  `wg_bewohner` varchar(255) DEFAULT NULL,
  `wg_ersteller` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`wg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wg`
--

LOCK TABLES `wg` WRITE;
/*!40000 ALTER TABLE `wg` DISABLE KEYS */;
INSERT INTO `wg` VALUES (1,'FezerWG','','hdepicfail@gmail.com');
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

-- Dump completed on 2024-05-10 14:34:22
