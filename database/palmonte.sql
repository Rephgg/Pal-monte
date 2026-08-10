-- MySQL dump 10.13  Distrib 9.7.2, for Win64 (x86_64)
--
-- Host: localhost    Database: palmonte
-- ------------------------------------------------------
-- Server version	9.7.2

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
-- Current Database: `palmonte`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `palmonte` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `palmonte`;

--
-- Table structure for table `asistencia_evento`
--

DROP TABLE IF EXISTS `asistencia_evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencia_evento` (
  `id_usuario` int NOT NULL,
  `id_evento` int NOT NULL,
  `fecha_inscripcion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmado` tinyint(1) NOT NULL DEFAULT '0',
  `asistio` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_usuario`,`id_evento`),
  KEY `fk_asistencia_evento` (`id_evento`),
  CONSTRAINT `fk_asistencia_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_asistencia_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencia_evento`
--

LOCK TABLES `asistencia_evento` WRITE;
/*!40000 ALTER TABLE `asistencia_evento` DISABLE KEYS */;
INSERT INTO `asistencia_evento` VALUES (1,1,'2026-08-10 14:37:48',1,1),(1,2,'2026-08-10 14:37:48',1,0),(1,3,'2026-08-10 14:37:48',1,1),(2,1,'2026-08-10 14:37:48',1,1),(2,3,'2026-08-10 14:37:48',0,0),(3,1,'2026-08-10 14:37:48',1,1),(3,2,'2026-08-10 14:37:48',1,1),(3,3,'2026-08-10 14:37:48',1,1),(4,1,'2026-08-10 14:37:48',1,0),(4,4,'2026-08-10 14:37:48',1,0),(5,1,'2026-08-10 14:37:48',1,1),(5,2,'2026-08-10 14:37:48',1,1),(5,5,'2026-08-10 14:37:48',1,0);
/*!40000 ALTER TABLE `asistencia_evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comercio`
--

DROP TABLE IF EXISTS `comercio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comercio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('taller','tienda','cafe','restaurante') COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coordenadas` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `horario` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'default_commerce.png',
  `calificacion` decimal(2,1) NOT NULL DEFAULT '0.0',
  `verificado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_comercio_tipo` (`tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comercio`
--

LOCK TABLES `comercio` WRITE;
/*!40000 ALTER TABLE `comercio` DISABLE KEYS */;
INSERT INTO `comercio` VALUES (1,'Bicicletería El Pedal','taller','Calle 10 #5-30, Ibagué','4.4389,-75.2323','3216549870','Lun-Sáb 8am-6pm','default_commerce.png',0.0,1),(2,'Café Ciclista','cafe','Carrera 3 #8-45, Centro','4.4400,-75.2300','3104567890','Mar-Dom 7am-8pm','default_commerce.png',0.0,1),(3,'Taller La Montaña','taller','Vía al Combeima km 5','4.4600,-75.2100','3157891234','Lun-Dom 9am-5pm','default_commerce.png',0.0,1),(4,'Tienda Bikes & More','tienda','Calle 15 #7-20, Centro','4.4420,-75.2280','3123456789','Lun-Sáb 9am-7pm','default_commerce.png',0.0,1),(5,'Restaurante El Pedal','restaurante','Vía al Combeima km 8','4.4650,-75.2050','3189876543','Sáb-Dom 8am-4pm','default_commerce.png',0.0,0),(6,'Café Montaña','cafe','Parque Principal, Zona Centro','4.4450,-75.2350','3109876543','Lun-Dom 6am-6pm','default_commerce.png',0.0,1);
/*!40000 ALTER TABLE `comercio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento`
--

DROP TABLE IF EXISTS `evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `lugar` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cupo_max` int NOT NULL,
  `cupo_actual` int NOT NULL DEFAULT '0',
  `id_organizador` int DEFAULT NULL,
  `imagen` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'default_event.png',
  `cancelado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_evento_fecha` (`fecha`),
  KEY `fk_evento_organizador` (`id_organizador`),
  CONSTRAINT `fk_evento_organizador` FOREIGN KEY (`id_organizador`) REFERENCES `usuario` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento`
--

LOCK TABLES `evento` WRITE;
/*!40000 ALTER TABLE `evento` DISABLE KEYS */;
INSERT INTO `evento` VALUES (1,'Rodada dominical','Rodada recreativa por el centro de Ibagué. Ritmo suave, apta para toda la familia.','2026-08-22','10:00:00','Plaza de Bolívar',50,24,3,'default_event.png',0),(2,'Carrera de montaña','Competencia de MTB por el cañón del Combeima.','2026-09-13','08:00:00','Cañón del Combeima',100,56,3,'default_event.png',0),(3,'Taller de mecánica básica','Aprende a reparar pinchazos, ajustar frenos y cambios.','2026-08-27','18:00:00','Bicicletería El Pedal',20,12,3,'default_event.png',0),(4,'Ciclo paseo nocturno','Recorrido nocturno por las calles del centro.','2026-09-05','19:00:00','Parque Centenario',80,38,3,'default_event.png',0),(5,'Rodada familiar','Paseo tranquilo para ciclistas de todas las edades.','2026-09-19','09:00:00','Parque Deportivo',60,15,3,'default_event.png',0),(6,'Competencia de descenso','Carrera de descenso en la zona del Combeima.','2026-10-04','14:00:00','Cañón del Combeima',40,8,3,'default_event.png',0);
/*!40000 ALTER TABLE `evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorito`
--

DROP TABLE IF EXISTS `favorito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorito` (
  `id_usuario` int NOT NULL,
  `id_ruta` int NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`,`id_ruta`),
  KEY `fk_favorito_ruta` (`id_ruta`),
  CONSTRAINT `fk_favorito_ruta` FOREIGN KEY (`id_ruta`) REFERENCES `ruta` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_favorito_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorito`
--

LOCK TABLES `favorito` WRITE;
/*!40000 ALTER TABLE `favorito` DISABLE KEYS */;
INSERT INTO `favorito` VALUES (1,1,'2026-08-10 14:37:48'),(1,2,'2026-08-10 14:37:48'),(1,3,'2026-08-10 14:37:48'),(2,2,'2026-08-10 14:37:48'),(2,4,'2026-08-10 14:37:48'),(3,1,'2026-08-10 14:37:48'),(3,3,'2026-08-10 14:37:48'),(3,6,'2026-08-10 14:37:48'),(4,2,'2026-08-10 14:37:48'),(4,5,'2026-08-10 14:37:48');
/*!40000 ALTER TABLE `favorito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil`
--

DROP TABLE IF EXISTS `perfil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfil` (
  `id_usuario` int NOT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'default_avatar.png',
  `km_recorridos` decimal(10,2) NOT NULL DEFAULT '0.00',
  `nivel_ciclista` enum('principiante','intermedio','avanzado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'principiante',
  `rol` enum('ciclista','organizador','administrador') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ciclista',
  PRIMARY KEY (`id_usuario`),
  CONSTRAINT `fk_perfil_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil`
--

LOCK TABLES `perfil` WRITE;
/*!40000 ALTER TABLE `perfil` DISABLE KEYS */;
INSERT INTO `perfil` VALUES (1,'carlos.jpg',156.50,'intermedio','ciclista'),(2,'mariana.jpg',51.90,'principiante','ciclista'),(3,'andres.jpg',520.80,'avanzado','organizador'),(4,'laura.jpg',89.30,'principiante','ciclista'),(5,'pedro.jpg',1250.00,'avanzado','administrador'),(9,'default_avatar.png',0.00,'principiante','ciclista');
/*!40000 ALTER TABLE `perfil` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resena`
--

DROP TABLE IF EXISTS `resena`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resena` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_ruta` int DEFAULT NULL,
  `id_comercio` int DEFAULT NULL,
  `comentario` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `calificacion` tinyint NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_resena_fecha` (`fecha`),
  KEY `fk_resena_usuario` (`id_usuario`),
  KEY `fk_resena_ruta` (`id_ruta`),
  KEY `fk_resena_comercio` (`id_comercio`),
  CONSTRAINT `fk_resena_comercio` FOREIGN KEY (`id_comercio`) REFERENCES `comercio` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_resena_ruta` FOREIGN KEY (`id_ruta`) REFERENCES `ruta` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_resena_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_resena_calificacion` CHECK ((`calificacion` between 1 and 5)),
  CONSTRAINT `chk_resena_tipo` CHECK ((((`id_ruta` is not null) and (`id_comercio` is null)) or ((`id_ruta` is null) and (`id_comercio` is not null))))
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resena`
--

LOCK TABLES `resena` WRITE;
/*!40000 ALTER TABLE `resena` DISABLE KEYS */;
INSERT INTO `resena` VALUES (1,1,1,NULL,'Excelente ruta, muy recomendada. Las vistas son espectaculares.',5,'2026-08-10 14:37:48'),(2,2,2,NULL,'Perfecta para principiantes, muy tranquila y segura.',4,'2026-08-10 14:37:48'),(3,3,3,NULL,'Ruta exigente pero hermosa. Volveré pronto.',5,'2026-08-10 14:37:48'),(4,4,2,NULL,'Muy bonita, la recomiendo para hacer en familia.',4,'2026-08-10 14:37:48'),(5,5,1,NULL,'La mejor ruta de Ibagué, sin duda.',5,'2026-08-10 14:37:48'),(6,1,3,NULL,'Muy dura, no la recomiendo para principiantes.',3,'2026-08-10 14:37:48'),(7,1,NULL,1,'Excelente servicio, muy atentos y rápidos.',5,'2026-08-10 14:37:48'),(8,2,NULL,2,'El mejor café después de una rodada.',5,'2026-08-10 14:37:48'),(9,3,NULL,1,'Me arreglaron la bici en minutos, muy profesionales.',5,'2026-08-10 14:37:48'),(10,4,NULL,3,'Buen taller, pero los precios son un poco altos.',4,'2026-08-10 14:37:48'),(11,5,NULL,2,'Ambiente muy agradable, volveré.',5,'2026-08-10 14:37:48'),(12,1,NULL,4,'Buena variedad de repuestos, precios competitivos.',4,'2026-08-10 14:37:48'),(13,2,NULL,3,'Queda un poco retirado, pero el servicio es bueno.',4,'2026-08-10 14:37:48');
/*!40000 ALTER TABLE `resena` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ruta`
--

DROP TABLE IF EXISTS `ruta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ruta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `distancia_km` decimal(5,2) NOT NULL,
  `dificultad` enum('baja','media','alta') COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_bici` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiempo_estimado` decimal(4,2) DEFAULT NULL,
  `coordenadas` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zona` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `elevacion` int DEFAULT NULL,
  `superficie` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'mixta',
  `imagen` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'default_route.png',
  `gpx_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ruta_dificultad` (`dificultad`),
  KEY `idx_ruta_zona` (`zona`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ruta`
--

LOCK TABLES `ruta` WRITE;
/*!40000 ALTER TABLE `ruta` DISABLE KEYS */;
INSERT INTO `ruta` VALUES (1,'Ruta del Combeima','Hermosa ruta que recorre el cañón del Combeima, con vistas espectaculares del río y la montaña.',12.50,'media','Montaña',2.50,'4.4389,-75.2323','Combeima',450,'mixta','default_route.png',NULL),(2,'Bosque del Centro','Recorrido por el bosque del centro de Ibagué, rodeado de naturaleza y con poco tráfico.',8.20,'baja','Carrera',1.50,'4.4500,-75.2400','Centro',120,'asfalto','default_route.png',NULL),(3,'Cañón del Combeima','Ruta exigente para ciclistas avanzados que buscan desafíos.',15.80,'alta','Montaña',3.50,'4.4600,-75.2100','Combeima',850,'grava','default_route.png',NULL),(4,'Mirador de la Palma','Ruta que termina en un mirador con vista panorámica de toda la ciudad.',10.30,'media','Híbrida',2.20,'4.4450,-75.2350','Noroccidente',380,'mixta','default_route.png',NULL),(5,'Vuelta al Lago','Paseo familiar alrededor del lago, sin dificultades técnicas.',6.70,'baja','Cualquiera',1.20,'4.4300,-75.2450','Sur',50,'asfalto','default_route.png',NULL),(6,'Cerro Pan de Azúcar','Subida exigente al cerro Pan de Azúcar, una de las rutas más duras de Ibagué.',14.20,'alta','Montaña',3.00,'4.4700,-75.2000','Oriente',720,'tierra','default_route.png',NULL);
/*!40000 ALTER TABLE `ruta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ruta_realizada`
--

DROP TABLE IF EXISTS `ruta_realizada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ruta_realizada` (
  `id_usuario` int NOT NULL,
  `id_ruta` int NOT NULL,
  `fecha` date NOT NULL,
  `tiempo_real` decimal(4,2) DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id_usuario`,`id_ruta`,`fecha`),
  KEY `fk_realizada_ruta` (`id_ruta`),
  CONSTRAINT `fk_realizada_ruta` FOREIGN KEY (`id_ruta`) REFERENCES `ruta` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_realizada_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ruta_realizada`
--

LOCK TABLES `ruta_realizada` WRITE;
/*!40000 ALTER TABLE `ruta_realizada` DISABLE KEYS */;
INSERT INTO `ruta_realizada` VALUES (1,1,'2026-04-10',2.50,'Ruta muy bonita, el clima acompañó todo el camino'),(1,2,'2026-04-15',1.30,'Fácil y rápida, recomendada para principiantes'),(2,2,'2026-04-12',1.60,'Me encantó, la próxima iré con más tiempo'),(3,1,'2026-04-05',2.20,'Muy buen ritmo, superé mi marca'),(3,3,'2026-04-08',3.80,'Exigente pero valió la pena, hermosas vistas'),(3,6,'2026-04-18',3.20,'Subida dura, pero la vista en la cima es espectacular'),(4,2,'2026-04-14',1.40,'Primera ruta, me gustó mucho'),(5,1,'2026-04-01',2.30,'Excelente ruta para empezar el mes'),(5,3,'2026-04-20',3.50,'Siempre es un reto, pero me encanta');
/*!40000 ALTER TABLE `ruta_realizada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_usuario_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Carlos Rodríguez','carlos@email.com','$2b$12$VtBkqe75g7dPFHPJb7cVT.MN3uN9bcl/Sw6jFvA9wL7s.ErFfaMXO','1990-05-15','3216549870','2026-08-10 14:37:48',1),(2,'Mariana L├│pez','mariana@email.com','$2b$12$VtBkqe75g7dPFHPJb7cVT.MN3uN9bcl/Sw6jFvA9wL7s.ErFfaMXO','1992-08-20','3104567890','2026-08-10 14:37:48',1),(3,'Andrés Ramírez','andres@email.com','$2b$12$VtBkqe75g7dPFHPJb7cVT.MN3uN9bcl/Sw6jFvA9wL7s.ErFfaMXO','1988-03-10','3157891234','2026-08-10 14:37:48',1),(4,'Laura Méndez','laura@email.com','$2b$12$VtBkqe75g7dPFHPJb7cVT.MN3uN9bcl/Sw6jFvA9wL7s.ErFfaMXO','1995-11-25','3187654321','2026-08-10 14:37:48',1),(5,'Pedro Sánchez','pedro@email.com','$2b$12$VtBkqe75g7dPFHPJb7cVT.MN3uN9bcl/Sw6jFvA9wL7s.ErFfaMXO','1985-07-12','3123456789','2026-08-10 14:37:48',1),(9,'777pro','juan77@gmail.com','$2b$12$an1tr83aTTxGsuXWmvtxn.JcBkzJ6FYwUicd7MWmVeCJQx8Vaxg2u',NULL,'123123','2026-08-10 15:17:19',1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-10 15:21:12
