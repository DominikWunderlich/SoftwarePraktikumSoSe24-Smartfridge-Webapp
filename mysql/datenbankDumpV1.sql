CREATE DATABASE  IF NOT EXISTS `datenbank` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `datenbank`;
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
-- Table structure for table `kühlschrank`
--

DROP TABLE IF EXISTS `kühlschrank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kühlschrank` (
  `kühlschrank_id` int NOT NULL,
  PRIMARY KEY (`kühlschrank_id`)
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
  `lebensmittel_name` varchar(45) NOT NULL,
  `aggregatzustand` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`lebensmittel_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lebensmittel`
--

LOCK TABLES `lebensmittel` WRITE;
/*!40000 ALTER TABLE `lebensmittel` DISABLE KEYS */;
/*!40000 ALTER TABLE `lebensmittel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maßeinheit`
--

DROP TABLE IF EXISTS `maßeinheit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maßeinheit` (
  `maßeinheit_name` int NOT NULL,
  `menge` varchar(45) NOT NULL,
  PRIMARY KEY (`maßeinheit_name`,`menge`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maßeinheit`
--

LOCK TABLES `maßeinheit` WRITE;
/*!40000 ALTER TABLE `maßeinheit` DISABLE KEYS */;
/*!40000 ALTER TABLE `maßeinheit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `email` varchar(45) NOT NULL,
  `bernutzername` varchar(45) DEFAULT NULL,
  `nachname` varchar(45) DEFAULT NULL,
  `vorname` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rezept`
--

DROP TABLE IF EXISTS `rezept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rezept` (
  `rezeptname` varchar(45) NOT NULL,
  `rezeptowner` varchar(45) DEFAULT NULL,
  `anzahl_für_personen` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`rezeptname`),
  KEY `rezeptowner_idx` (`rezeptowner`)
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
  PRIMARY KEY (`rezept_name_fk`,`lebensmittel_name_fk`),
  KEY `lebensmittel_name_fk_idx` (`lebensmittel_name_fk`),
  CONSTRAINT `lebensmittel_name_fk` FOREIGN KEY (`lebensmittel_name_fk`) REFERENCES `lebensmittel` (`lebensmittel_name`),
  CONSTRAINT `rezept_name_fk` FOREIGN KEY (`rezept_name_fk`) REFERENCES `rezept` (`rezeptowner`)
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
  `wg_name` varchar(45) NOT NULL,
  `wg_bewohner` varchar(45) DEFAULT NULL,
  `wg_ersteller` varchar(45) DEFAULT NULL,
  `wg_id` int NOT NULL,
  PRIMARY KEY (`wg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wg`
--

LOCK TABLES `wg` WRITE;
/*!40000 ALTER TABLE `wg` DISABLE KEYS */;
INSERT INTO `wg` VALUES ('Blubland','50','Michael',2),('Test WG','55','Test Ersteller',3);
/*!40000 ALTER TABLE `wg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'datenbank'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-12 16:13:47
