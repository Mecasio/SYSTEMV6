-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 18, 2025 at 08:56 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `enrollment`
--

-- --------------------------------------------------------

--
-- Table structure for table `active_school_year_table`
--

CREATE TABLE `active_school_year_table` (
  `id` int(11) NOT NULL,
  `year_id` int(11) DEFAULT NULL,
  `semester_id` int(11) DEFAULT NULL,
  `astatus` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `active_school_year_table`
--

INSERT INTO `active_school_year_table` (`id`, `year_id`, `semester_id`, `astatus`, `active`) VALUES
(1, 4, 1, 0, 0),
(2, 9, 2, 0, 1),
(3, 9, 1, 0, 0),
(4, 10, 2, 1, 1),
(6, 4, 2, 0, 0),
(8, 12, 2, 0, 0),
(9, 3, 2, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `course_table`
--

CREATE TABLE `course_table` (
  `course_id` int(11) NOT NULL,
  `course_code` varchar(100) DEFAULT NULL,
  `course_description` varchar(255) DEFAULT NULL,
  `course_unit` int(11) DEFAULT NULL,
  `lab_unit` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_table`
--

INSERT INTO `course_table` (`course_id`, `course_code`, `course_description`, `course_unit`, `lab_unit`) VALUES
(1, 'GEREADPH', 'Readings in Philippine History', 3, 0),
(2, 'GEUNDETS', 'Understanding the Self', 3, 0),
(3, 'GEARTAPP', 'Art Appreciation', 3, 0),
(4, 'GEPURPCO', 'Purposive Communication', 3, 0),
(5, 'GEKOMFIL', 'Kontekstwalisadong Komunikasyon sa Filipino', 3, 0),
(6, 'INTCOMLC', 'Introduction to Computing (Lecture)', 2, 0),
(7, 'INTCOMLB', 'Introduction to Computing (Laboratory)', 0, 1),
(8, 'FPROGLEC', 'Computer Programming 1 (Lecture)', 2, 0),
(9, 'FPROGLAB', 'Computer Programming 1 (Laboratory)', 0, 1),
(10, 'GEPEMOVE', 'Movement Enhancement', 2, 0),
(11, 'NSTPCTS1', 'National Service Training Program 1', 3, 0),
(12, 'GEMATHMW', 'Mathematics in the Modern World', 3, 0),
(13, 'GESCIETS', 'Science, Technology and Society', 3, 0),
(14, 'GEFILDIS', 'Filipino sa Iba’t-Ibang Disiplina', 3, 0),
(15, 'GEPANIPI', 'Panitikan sa Pilipinas', 3, 0),
(16, 'IPROGLEC', 'Computer Programming 2 (Lecture)', 2, 0),
(17, 'IPROGLAB', 'Computer Programming 2 (Laboratory)', 0, 1),
(18, 'DISCMATH', 'Discrete Mathematics', 3, 0),
(19, 'DBMSLEC1', 'Database Management System 1 (Lecture)', 2, 0),
(20, 'DBMSLAB1', 'Database Management System 1 (Laboratory)', 0, 1),
(21, 'GEPEFITE', 'Fitness Exercise', 2, 0),
(22, 'NSTPCTS2', 'National Service Training Program 2', 3, 0),
(23, 'GEETHICS', 'Ethics', 3, 0),
(24, 'DSALGLEC', 'Data Structures and Algorithm 1 (Lecture)', 2, 0),
(25, 'DSALGLAB', 'Data Structures and Algorithm 1 (Laboratory)', 0, 1),
(26, 'INFMGTLC', 'Information Management (Lecture)', 2, 0),
(27, 'INFMGTLB', 'Information Management (Laboratory)', 0, 1),
(28, 'PTECHLEC', 'Platform Technologies (Lecture)', 2, 0),
(29, 'PTECHLAB', 'Platform Technologies (Laboratory)', 0, 1),
(30, 'WEBDVLC1', 'Web Development 1 (Lecture)', 2, 0),
(31, 'WEBDVLB1', 'Web Development 1 (Laboratory)', 0, 1),
(32, 'BUSANALY', 'Business Analytics', 3, 0),
(33, 'GEPEHEF1', 'Physical Activity Towards Health and Fitness 1', 2, 0),
(34, 'GEELECCP', 'Communicative Proficiency in Business Writing', 3, 0),
(35, 'DBMSLEC2', 'Database Management System 2 (Lecture)', 2, 0),
(36, 'DBMSLAB2', 'Database Management System 2 (Laboratory)', 0, 1),
(37, 'INTHCILC', 'Introduction to Human-Computer Interaction (Lecture)', 2, 0),
(38, 'INTHCILB', 'Introduction to Human-Computer Interaction (Laboratory)', 0, 1),
(39, 'NETWKLC1', 'Networking 1 (Lecture)', 2, 0),
(40, 'NETWKLB1', 'Networking 1 (Laboratory)', 0, 1),
(41, 'WEBDVLC2', 'Web Development 2 (Lecture)', 2, 0),
(42, 'WEBDVLB2', 'Web Development 2 (Laboratory)', 0, 1),
(43, 'IPATLEC1', 'Integrative Programming and Technologies 1 (Lecture)', 2, 0),
(44, 'IPATLAB1', 'Integrative Programming and Technologies 1 (Laboratory)', 0, 1),
(45, 'GEPEHEF2', 'Physical Activity Towards Health and Fitness 2', 2, 0),
(46, 'GEELECDS', 'Practical Data Science', 3, 0),
(47, 'WEBDVLC3', 'Web Development 3 (Lecture)', 2, 0),
(48, 'WEBDVLB3', 'Web Development 3 (Laboratory)', 0, 1),
(49, 'MMDIALEC', 'Multimedia (Lecture)', 2, 0),
(50, 'MMDIALAB', 'Multimedia (Laboratory)', 0, 1),
(51, 'SYSARCH1', 'Systems Integration and Architecture 1 (Lecture)', 2, 0),
(52, 'SYSARLB1', 'Systems Integration and Architecture 1 (Laboratory)', 0, 1),
(53, 'APDEVLEC', 'Application Development and Emerging Tech (Lecture)', 2, 0),
(54, 'APDEVLAB', 'Application Development and Emerging Tech (Lab)', 0, 1),
(55, 'NETWKLC2', 'Networking 2 (Lecture)', 2, 0),
(56, 'NETWKLB2', 'Networking 2 (Laboratory)', 0, 1),
(57, 'GELIFEWR', 'Life and Works of Rizal', 3, 0),
(58, 'GEELECES', 'Environmental Science', 3, 0),
(59, 'QUANMETH', 'Quantitative Methods', 3, 0),
(60, 'ITTHESI1', 'Research 1', 3, 0),
(61, 'MOBAPLEC', 'Mobile App Development (Lecture)', 2, 0),
(62, 'MOBAPLAB', 'Mobile App Development (Laboratory)', 0, 1),
(63, 'OOPRGLEC', 'Object-Oriented Programming (Lecture)', 2, 0),
(64, 'OOPRGLAB', 'Object-Oriented Programming (Laboratory)', 0, 1),
(65, 'IAASLEC1', 'Information Assurance and Security 1 (Lecture)', 2, 0),
(66, 'IAASLAB1', 'Information Assurance and Security 1 (Laboratory)', 0, 1),
(67, 'GECONTWO', 'Contemporary World', 3, 0),
(68, 'SYSARCH2', 'Systems Integration and Architecture 2 (Lecture)', 2, 0),
(69, 'SYSARLB2', 'Systems Integration and Architecture 2 (Laboratory)', 0, 1),
(70, 'ITTHESI2', 'Research 2 (Lecture)', 2, 0),
(71, 'ITTHESL2', 'Research 2 (Laboratory)', 0, 1),
(72, 'IAASLEC2', 'Information Assurance and Security 2 (Lecture)', 2, 0),
(73, 'IAASLAB2', 'Information Assurance and Security 2 (Laboratory)', 0, 1),
(74, 'SYSADMLC', 'Systems Administration and Maintenance (Lecture)', 2, 0),
(75, 'SYSADMLB', 'Systems Administration and Maintenance (Laboratory)', 0, 1),
(76, 'SPISSUES', 'Social and Professional Issues', 3, 0),
(77, 'ITINTERN', 'Practicum / Internship', 10, 0),
(78, 'GELIFEWR', 'Life And Work of Rizal', 2, 0),
(79, 'GELIFEWR', 'Life And Work of Rizal', 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `curriculum_table`
--

CREATE TABLE `curriculum_table` (
  `curriculum_id` int(11) NOT NULL,
  `year_id` int(11) DEFAULT NULL,
  `program_id` int(11) DEFAULT NULL,
  `lock_status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `curriculum_table`
--

INSERT INTO `curriculum_table` (`curriculum_id`, `year_id`, `program_id`, `lock_status`) VALUES
(1, 1, 14, 0),
(2, 2, 14, 0),
(3, 3, 14, 0),
(4, 4, 14, 0),
(5, 9, 14, 0),
(6, 10, 14, 0),
(7, 2, 6, 0);

-- --------------------------------------------------------

--
-- Table structure for table `dprtmnt_curriculum_table`
--

CREATE TABLE `dprtmnt_curriculum_table` (
  `dprtmnt_curriculum_id` int(11) NOT NULL,
  `dprtmnt_id` int(11) DEFAULT NULL,
  `curriculum_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dprtmnt_curriculum_table`
--

INSERT INTO `dprtmnt_curriculum_table` (`dprtmnt_curriculum_id`, `dprtmnt_id`, `curriculum_id`) VALUES
(1, 5, 1),
(2, 5, 2),
(3, 5, 3),
(4, 5, 4),
(5, 5, 5),
(6, 5, 6);

-- --------------------------------------------------------

--
-- Table structure for table `dprtmnt_profs_table`
--

CREATE TABLE `dprtmnt_profs_table` (
  `dprtmnt_profs_id` int(11) NOT NULL,
  `dprtmnt_id` int(11) DEFAULT NULL,
  `prof_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dprtmnt_profs_table`
--

INSERT INTO `dprtmnt_profs_table` (`dprtmnt_profs_id`, `dprtmnt_id`, `prof_id`) VALUES
(1, 5, 38),
(2, 5, 5),
(3, 5, 9),
(4, 5, 13),
(5, 5, 14),
(6, 5, 16),
(7, 5, 19),
(8, 5, 40),
(9, 5, 31),
(10, 5, 32),
(11, 5, 33),
(12, 5, 34),
(13, 5, 35),
(14, 5, 36),
(15, 5, 37),
(16, 2, 2),
(17, 2, 3),
(18, 2, 4),
(19, 2, 6),
(20, 2, 7),
(21, 2, 8),
(22, 2, 10),
(23, 2, 11),
(24, 2, 12),
(25, 2, 15),
(26, 2, 17),
(27, 2, 18),
(28, 2, 20),
(29, 2, 21),
(30, 2, 22),
(31, 2, 23),
(32, 2, 24),
(33, 2, 25),
(34, 2, 26),
(35, 2, 27),
(36, 2, 29),
(37, 2, 30);

-- --------------------------------------------------------

--
-- Table structure for table `dprtmnt_room_table`
--

CREATE TABLE `dprtmnt_room_table` (
  `dprtmnt_room_id` int(11) NOT NULL,
  `dprtmnt_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `lock_status` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dprtmnt_room_table`
--

INSERT INTO `dprtmnt_room_table` (`dprtmnt_room_id`, `dprtmnt_id`, `room_id`, `lock_status`) VALUES
(3, 5, 3, 0),
(4, 5, 4, 0),
(5, 5, 5, 0),
(10, 1, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `dprtmnt_section_table`
--

CREATE TABLE `dprtmnt_section_table` (
  `id` int(11) NOT NULL,
  `curriculum_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `dsstat` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dprtmnt_section_table`
--

INSERT INTO `dprtmnt_section_table` (`id`, `curriculum_id`, `section_id`, `dsstat`) VALUES
(1, 1, 1, 0),
(2, 1, 2, 0),
(3, 1, 3, 0),
(4, 1, 4, 0),
(5, 1, 6, 0),
(6, 1, 7, 0),
(7, 1, 8, 0),
(8, 1, 9, 0),
(9, 1, 10, 0),
(10, 1, 11, 0),
(11, 1, 12, 0),
(12, 7, 6, 0);

-- --------------------------------------------------------

--
-- Table structure for table `dprtmnt_table`
--

CREATE TABLE `dprtmnt_table` (
  `dprtmnt_id` int(11) NOT NULL,
  `dprtmnt_name` varchar(255) DEFAULT NULL,
  `dprtmnt_code` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dprtmnt_table`
--

INSERT INTO `dprtmnt_table` (`dprtmnt_id`, `dprtmnt_name`, `dprtmnt_code`) VALUES
(1, 'College of Architecture and Fine Arts', 'CAFA'),
(2, 'College of Arts and Sciences', 'CAS'),
(3, 'College of Business and Public Administration', 'CBPA'),
(4, 'College of Criminal Justice Education', 'CCJE'),
(5, 'College of Computing Studies', 'CCS'),
(6, 'College of Education', 'CED'),
(7, 'College of Engineering', 'CEN'),
(8, 'College of Hospitality and Tourism Management', 'CHTM'),
(9, 'College of Industrial Technology', 'CIT'),
(10, 'sadasda', '1232asd');

-- --------------------------------------------------------

--
-- Table structure for table `enrolled_subject`
--

CREATE TABLE `enrolled_subject` (
  `id` int(11) NOT NULL,
  `student_number` int(11) NOT NULL,
  `curriculum_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `active_school_year_id` int(11) DEFAULT NULL,
  `midterm` int(11) NOT NULL,
  `finals` int(11) NOT NULL,
  `final_grade` int(11) NOT NULL,
  `en_remarks` int(11) NOT NULL,
  `department_section_id` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `period_status`
--

CREATE TABLE `period_status` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `period_status`
--

INSERT INTO `period_status` (`id`, `description`, `status`) VALUES
(1, 'Midterm', 0),
(2, 'Finals', 1);

-- --------------------------------------------------------

--
-- Table structure for table `person_prof_table`
--

CREATE TABLE `person_prof_table` (
  `person_id` int(11) NOT NULL,
  `bachelor` varchar(255) DEFAULT NULL,
  `master` varchar(255) DEFAULT NULL,
  `doctor` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `person_prof_table`
--

INSERT INTO `person_prof_table` (`person_id`, `bachelor`, `master`, `doctor`) VALUES
(40, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `person_status_table`
--

CREATE TABLE `person_status_table` (
  `id` int(11) NOT NULL,
  `person_id` int(11) DEFAULT NULL,
  `exam_status` int(11) DEFAULT NULL,
  `requirements` int(11) DEFAULT NULL,
  `residency` int(11) DEFAULT NULL,
  `student_registration_status` int(11) DEFAULT NULL,
  `exam_result` int(11) DEFAULT NULL,
  `hs_ave` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `person_status_table`
--

INSERT INTO `person_status_table` (`id`, `person_id`, `exam_status`, `requirements`, `residency`, `student_registration_status`, `exam_result`, `hs_ave`) VALUES
(1, 1, 1, 1, 1, 1, 85, 89.5),
(2, 2, 0, 1, 0, 1, 70, 78),
(3, 4, 0, 0, 0, 1, 0, 0),
(4, 3, 0, 0, 0, 0, 0, 0),
(5, 5, 0, 0, 0, 0, 0, 0),
(6, 6, 0, 0, 0, 0, 0, 0),
(7, 7, 0, 0, 0, 0, 0, 0),
(8, 8, 0, 0, 0, 0, 0, 0),
(9, 9, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `person_table`
--

CREATE TABLE `person_table` (
  `person_id` int(11) NOT NULL,
  `profile_img` varchar(150) NOT NULL,
  `campus` int(11) DEFAULT NULL,
  `academicProgram` varchar(100) DEFAULT NULL,
  `classifiedAs` varchar(50) DEFAULT NULL,
  `program` varchar(100) DEFAULT NULL,
  `program2` varchar(100) DEFAULT NULL,
  `program3` varchar(100) DEFAULT NULL,
  `yearLevel` varchar(30) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `extension` varchar(10) DEFAULT NULL,
  `nickname` varchar(50) DEFAULT NULL,
  `height` varchar(10) DEFAULT NULL,
  `weight` varchar(10) DEFAULT NULL,
  `lrnNumber` varchar(20) DEFAULT NULL,
  `gender` varchar(11) DEFAULT NULL,
  `pwdType` varchar(50) DEFAULT NULL,
  `pwdId` varchar(50) DEFAULT NULL,
  `birthOfDate` varchar(50) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `birthPlace` varchar(255) DEFAULT NULL,
  `languageDialectSpoken` varchar(255) DEFAULT NULL,
  `citizenship` varchar(50) DEFAULT NULL,
  `religion` varchar(50) DEFAULT NULL,
  `civilStatus` varchar(50) DEFAULT NULL,
  `tribeEthnicGroup` varchar(50) DEFAULT NULL,
  `otherEthnicGroup` varchar(50) NOT NULL,
  `cellphoneNumber` varchar(20) DEFAULT NULL,
  `emailAddress` varchar(100) DEFAULT NULL,
  `telephoneNumber` varchar(20) DEFAULT NULL,
  `facebookAccount` varchar(255) DEFAULT NULL,
  `presentStreet` varchar(255) DEFAULT NULL,
  `presentBarangay` varchar(100) DEFAULT NULL,
  `presentZipCode` varchar(10) DEFAULT NULL,
  `presentRegion` varchar(100) DEFAULT NULL,
  `presentProvince` varchar(100) DEFAULT NULL,
  `presentMunicipality` varchar(100) DEFAULT NULL,
  `presentDswdHouseholdNumber` varchar(50) DEFAULT NULL,
  `permanentStreet` varchar(255) DEFAULT NULL,
  `permanentBarangay` varchar(100) DEFAULT NULL,
  `permanentZipCode` varchar(10) DEFAULT NULL,
  `permanentRegion` varchar(75) DEFAULT NULL,
  `permanentProvince` varchar(75) DEFAULT NULL,
  `permanentMunicipality` varchar(75) DEFAULT NULL,
  `permanentDswdHouseholdNumber` varchar(50) DEFAULT NULL,
  `solo_parent` varchar(5) DEFAULT NULL,
  `father_deceased` varchar(5) DEFAULT NULL,
  `father_family_name` varchar(100) DEFAULT NULL,
  `father_given_name` varchar(100) DEFAULT NULL,
  `father_middle_name` varchar(100) DEFAULT NULL,
  `father_ext` varchar(10) DEFAULT NULL,
  `father_nickname` varchar(50) DEFAULT NULL,
  `father_education_level` varchar(100) DEFAULT NULL,
  `father_last_school` varchar(100) DEFAULT NULL,
  `father_course` varchar(100) DEFAULT NULL,
  `father_year_graduated` varchar(10) DEFAULT NULL,
  `father_school_address` varchar(255) DEFAULT NULL,
  `father_contact` varchar(20) DEFAULT NULL,
  `father_occupation` varchar(100) DEFAULT NULL,
  `father_employer` varchar(100) DEFAULT NULL,
  `father_income` varchar(20) DEFAULT NULL,
  `father_email` varchar(100) DEFAULT NULL,
  `mother_deceased` varchar(5) DEFAULT NULL,
  `mother_family_name` varchar(100) DEFAULT NULL,
  `mother_given_name` varchar(100) DEFAULT NULL,
  `mother_middle_name` varchar(100) DEFAULT NULL,
  `mother_nickname` varchar(50) DEFAULT NULL,
  `mother_education_level` varchar(100) DEFAULT NULL,
  `mother_last_school` varchar(100) DEFAULT NULL,
  `mother_course` varchar(100) DEFAULT NULL,
  `mother_year_graduated` varchar(10) DEFAULT NULL,
  `mother_school_address` varchar(255) DEFAULT NULL,
  `mother_contact` varchar(20) DEFAULT NULL,
  `mother_occupation` varchar(100) DEFAULT NULL,
  `mother_employer` varchar(100) DEFAULT NULL,
  `mother_income` varchar(20) DEFAULT NULL,
  `mother_email` varchar(100) DEFAULT NULL,
  `guardian` varchar(100) DEFAULT NULL,
  `guardian_family_name` varchar(100) DEFAULT NULL,
  `guardian_given_name` varchar(100) DEFAULT NULL,
  `guardian_middle_name` varchar(100) DEFAULT NULL,
  `guardian_ext` varchar(20) DEFAULT NULL,
  `guardian_nickname` varchar(50) DEFAULT NULL,
  `guardian_address` varchar(255) DEFAULT NULL,
  `guardian_contact` varchar(20) DEFAULT NULL,
  `guardian_email` varchar(100) DEFAULT NULL,
  `annual_income` varchar(50) DEFAULT NULL,
  `schoolLevel` varchar(50) DEFAULT NULL,
  `schoolLastAttended` varchar(100) DEFAULT NULL,
  `schoolAddress` varchar(255) DEFAULT NULL,
  `courseProgram` varchar(100) DEFAULT NULL,
  `honor` varchar(100) DEFAULT NULL,
  `generalAverage` decimal(5,2) DEFAULT NULL,
  `yearGraduated` int(11) DEFAULT NULL,
  `strand` varchar(100) DEFAULT NULL,
  `cough` int(11) DEFAULT NULL,
  `colds` int(11) DEFAULT NULL,
  `fever` int(11) DEFAULT NULL,
  `asthma` int(11) DEFAULT NULL,
  `faintingSpells` int(11) DEFAULT NULL,
  `heartDisease` int(11) DEFAULT NULL,
  `tuberculosis` int(11) DEFAULT NULL,
  `frequentHeadaches` int(11) DEFAULT NULL,
  `hernia` int(11) DEFAULT NULL,
  `chronicCough` int(11) DEFAULT NULL,
  `headNeckInjury` int(11) DEFAULT NULL,
  `hiv` int(11) DEFAULT NULL,
  `highBloodPressure` int(11) DEFAULT NULL,
  `diabetesMellitus` int(11) DEFAULT NULL,
  `allergies` int(11) DEFAULT NULL,
  `cancer` int(11) DEFAULT NULL,
  `smokingCigarette` int(11) DEFAULT NULL,
  `alcoholDrinking` int(11) DEFAULT NULL,
  `hospitalized` int(11) DEFAULT NULL,
  `hospitalizationDetails` varchar(255) DEFAULT NULL,
  `medications` varchar(255) DEFAULT NULL,
  `hadCovid` int(11) DEFAULT NULL,
  `covidDate` varchar(50) DEFAULT NULL,
  `vaccine1Brand` varchar(50) DEFAULT NULL,
  `vaccine1Date` varchar(50) DEFAULT NULL,
  `vaccine2Brand` varchar(50) DEFAULT NULL,
  `vaccine2Date` varchar(50) DEFAULT NULL,
  `booster1Brand` varchar(50) DEFAULT NULL,
  `booster1Date` varchar(50) DEFAULT NULL,
  `booster2Brand` varchar(50) DEFAULT NULL,
  `booster2Date` varchar(50) DEFAULT NULL,
  `chestXray` varchar(100) DEFAULT NULL,
  `cbc` varchar(100) DEFAULT NULL,
  `urinalysis` varchar(100) DEFAULT NULL,
  `otherworkups` varchar(255) DEFAULT NULL,
  `symptomsToday` int(11) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `termsOfAgreement` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `person_table`
--

INSERT INTO `person_table` (`person_id`, `profile_img`, `campus`, `academicProgram`, `classifiedAs`, `program`, `program2`, `program3`, `yearLevel`, `first_name`, `middle_name`, `last_name`, `extension`, `nickname`, `height`, `weight`, `lrnNumber`, `gender`, `pwdType`, `pwdId`, `birthOfDate`, `age`, `birthPlace`, `languageDialectSpoken`, `citizenship`, `religion`, `civilStatus`, `tribeEthnicGroup`, `otherEthnicGroup`, `cellphoneNumber`, `emailAddress`, `telephoneNumber`, `facebookAccount`, `presentStreet`, `presentBarangay`, `presentZipCode`, `presentRegion`, `presentProvince`, `presentMunicipality`, `presentDswdHouseholdNumber`, `permanentStreet`, `permanentBarangay`, `permanentZipCode`, `permanentRegion`, `permanentProvince`, `permanentMunicipality`, `permanentDswdHouseholdNumber`, `solo_parent`, `father_deceased`, `father_family_name`, `father_given_name`, `father_middle_name`, `father_ext`, `father_nickname`, `father_education_level`, `father_last_school`, `father_course`, `father_year_graduated`, `father_school_address`, `father_contact`, `father_occupation`, `father_employer`, `father_income`, `father_email`, `mother_deceased`, `mother_family_name`, `mother_given_name`, `mother_middle_name`, `mother_nickname`, `mother_education_level`, `mother_last_school`, `mother_course`, `mother_year_graduated`, `mother_school_address`, `mother_contact`, `mother_occupation`, `mother_employer`, `mother_income`, `mother_email`, `guardian`, `guardian_family_name`, `guardian_given_name`, `guardian_middle_name`, `guardian_ext`, `guardian_nickname`, `guardian_address`, `guardian_contact`, `guardian_email`, `annual_income`, `schoolLevel`, `schoolLastAttended`, `schoolAddress`, `courseProgram`, `honor`, `generalAverage`, `yearGraduated`, `strand`, `cough`, `colds`, `fever`, `asthma`, `faintingSpells`, `heartDisease`, `tuberculosis`, `frequentHeadaches`, `hernia`, `chronicCough`, `headNeckInjury`, `hiv`, `highBloodPressure`, `diabetesMellitus`, `allergies`, `cancer`, `smokingCigarette`, `alcoholDrinking`, `hospitalized`, `hospitalizationDetails`, `medications`, `hadCovid`, `covidDate`, `vaccine1Brand`, `vaccine1Date`, `vaccine2Brand`, `vaccine2Date`, `booster1Brand`, `booster1Date`, `booster2Brand`, `booster2Date`, `chestXray`, `cbc`, `urinalysis`, `otherworkups`, `symptomsToday`, `remarks`, `termsOfAgreement`) VALUES
(1, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'James', 'Mendoza', 'Fernandez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'John', 'Bord', 'Doe', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Ayan', 'Gan', 'Mandogra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Sheila', 'Gonsales', 'Rodriguez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Aira', 'Lorainne', 'Torres', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Nick', 'Sazon', 'Nick', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Genny', 'Didal', 'Ciruela', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Lloyd Cedrick', 'Pacheco', 'Dela Cruz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Elhize', 'Elineth', 'Arcano', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `prof_table`
--

CREATE TABLE `prof_table` (
  `prof_id` int(11) NOT NULL,
  `person_id` int(11) DEFAULT NULL,
  `profile_image` varchar(255) NOT NULL,
  `fname` varchar(100) DEFAULT NULL,
  `mname` varchar(100) DEFAULT NULL,
  `lname` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0 CHECK (`status` in (0,1)),
  `role` enum('applicant','faculty','superadmin') NOT NULL DEFAULT 'faculty'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prof_table`
--

INSERT INTO `prof_table` (`prof_id`, `person_id`, `profile_image`, `fname`, `mname`, `lname`, `email`, `password`, `status`, `role`) VALUES
(1, NULL, '', 'Hazel', 'Fogata', 'Anuncio', 'hazel.anuncio@earist.edu.ph', 'ANUNCIO', 0, 'faculty'),
(2, NULL, '', 'Eleazar', 'B.', 'Bernales', 'eleazar.bernales@earist.edu.ph', 'BERNALES', 0, 'faculty'),
(3, NULL, '', 'Lester', 'Dela Cruz', 'Bernardino', 'lester.bernardino@earist.edu.ph', 'BERNARDINO', 0, 'faculty'),
(4, NULL, '', 'Carlito', '', 'Biares', 'carlito.biares@earist.edu.ph', 'BIARES', 0, 'faculty'),
(5, NULL, '', 'James Darryl', 'Dela Cruz', 'Bungay', 'james.bungay@earist.edu.ph', 'BUNGAY', 0, 'faculty'),
(6, NULL, '', 'Renz Angelo', 'De Vera', 'Cadaoas', 'renz.cadaoas@earist.edu.ph', 'CADAOAS', 0, 'faculty'),
(7, NULL, '', 'Nerissa', 'Bugarin', 'Capili', 'nerissa.capili@earist.edu.ph', 'CAPILI', 0, 'faculty'),
(8, NULL, '', 'Romeo', 'B.', 'Capucao', 'romeo.capucao@earist.edu.ph', 'CAPUCAO', 0, 'faculty'),
(9, NULL, '', 'Ernanie', 'Molina', 'Carlos', 'ernanie.carlos@earist.edu.ph', 'CARLOS', 0, 'faculty'),
(10, NULL, '', 'Harold', 'Aspa', 'Casimira', 'harold.casimira@earist.edu.ph', 'CASIMIRA', 0, 'faculty'),
(11, NULL, '', 'Rosel', 'Ortiz', 'Cipriano', 'rosel.cipriano@earist.edu.ph', 'CIPRIANO', 0, 'faculty'),
(12, NULL, '', 'JANCHLOE', 'M', 'DUYAN', 'janchloe.duyan@earist.edu.ph', 'DUYAN', 0, 'faculty'),
(13, NULL, '', 'Arlene', 'Peña', 'Evangelista', 'arlene.evangelista@earist.edu.ph', 'EVANGELISTA', 0, 'faculty'),
(14, NULL, '', 'Joevelyn', 'Waje', 'Fajardo', 'joevelyn.fajardo@earist.edu.ph', 'FAJARDO', 0, 'faculty'),
(15, NULL, '', 'Dennis', 'Berboso', 'Gonzales', 'dennis.gonzales@earist.edu.ph', 'GONZALES', 0, 'faculty'),
(16, NULL, '', 'Merlita', 'Cruz', 'Latip', 'merlita.latip@earist.edu.ph', 'LATIP', 0, 'faculty'),
(17, NULL, '', 'Reeneir', 'Ramos', 'Ledesma', 'reeneir.ledesma@earist.edu.ph', 'LEDESMA', 0, 'faculty'),
(18, NULL, '', 'Dennis', 'Dela Peña', 'Mangubat', 'dennis.mangubat@earist.edu.ph', 'MANGUBAT', 0, 'faculty'),
(19, NULL, '', 'Sheila Marie', 'Mobo', 'Matias', 'sheila.matias@earist.edu.ph', 'MATIAS', 0, 'faculty'),
(20, NULL, '', 'Joseph', 'Tarrayo', 'Moraca', 'joseph.moraca@earist.edu.ph', 'MORACA', 0, 'faculty'),
(21, NULL, '', 'Ruth Lareza', 'Aguilar', 'Morales', 'ruth.morales@earist.edu.ph', 'MORALES', 0, 'faculty'),
(22, NULL, '', 'Mark Kenneth', 'Barnobal', 'Nicart', 'mark.nicart@earist.edu.ph', 'NICART', 0, 'faculty'),
(23, NULL, '', 'Rodora', 'Tanglao', 'Oliveros', 'rodora.oliveros@earist.edu.ph', 'OLIVEROS', 0, 'faculty'),
(24, NULL, '', 'Abigail', 'J.', 'Purificacion', 'abigail.purificacion@earist.edu.ph', 'PURIFICACION', 0, 'faculty'),
(25, NULL, '', 'Raynald', 'C', 'Redondo', 'raynald.redondo@earist.edu.ph', 'REDONDO', 0, 'faculty'),
(26, NULL, '', 'Hiromi', '', 'Rivas', 'hiromi.rivas@earist.edu.ph', 'RIVAS', 0, 'faculty'),
(27, NULL, '', 'Eula Luz Jasmine Dioneo', '', 'Sandoval', 'eula.sandoval@earist.edu.ph', 'SANDOVAL', 0, 'faculty'),
(28, NULL, '', 'Al', 'Ferrer', 'Santiago', 'al.santiago@earist.edu.ph', 'SANTIAGO', 0, 'faculty'),
(29, NULL, '', 'Larex', 'Bartolome', 'Tagalog', 'larex.tagalog@earist.edu.ph', 'TAGALOG', 0, 'faculty'),
(30, NULL, '', 'Jayson', 'D.', 'Tolentino', 'jayson.tolentino@earist.edu.ph', 'TOLENTINO', 0, 'faculty'),
(31, NULL, '', 'Edmund Sinagub', '', 'Almazan', 'edmund.almazan@earist.edu.ph', 'ALMAZAN', 0, 'faculty'),
(32, NULL, '', 'Jesus', 'de los Santos', 'Paguigan', 'jesus.paguigan@earist.edu.ph', 'PAGUIGAN', 0, 'faculty'),
(33, NULL, '', 'Kathleen', '', 'Dimaano', 'kathleen.dimaano@earist.edu.ph', 'DIMAANO', 0, 'faculty'),
(34, NULL, '', 'Charlene', '', 'Ronda', 'charlene.ronda@earist.edu.ph', 'RONDA', 0, 'faculty'),
(35, NULL, '', 'Maria Jasmine', '', 'Macasil', 'jasmine.macasil@earist.edu.ph', 'MACASIL', 0, 'faculty'),
(36, NULL, '', 'Jefferson', '', 'Costales', 'jefferson.costales@earist.edu.ph', 'COSTALES', 0, 'faculty'),
(37, NULL, '', 'Arjo', '', 'Ladia', 'arjo.ladia@earist.edu.ph', 'LADIA', 0, 'faculty'),
(38, NULL, '', 'Arden', 'Bandoja', 'Mecasio', 'mecasio.a.bsinfotech@gmail.com', '$2b$10$HDvYDcPjc/1ig8JUuhx2lOB5leRv8dQG7LHO80lFGfRZMLtq9dWGO', 0, 'faculty'),
(39, NULL, '', 'Arden', 'Bandoja', 'Mecasio', 'ardengreat@gmail.com', '$2b$10$nHOkhd698/eXi85aPi0Fr.tOzzUMu2v1ygXeV8gGklbtxDswV3cTC', 0, 'faculty'),
(40, 40, '1747334186445-178655052.jpg', 'Freddie', 'Bandoja', 'LLove', 'FreddieLlove@gmail.com', '$2b$10$AxO64DiHq.EB9yNAqq9qROkcmVCvn8/.QDvMA8baOUM9aDIXw9SlO', 0, 'faculty');

-- --------------------------------------------------------

--
-- Table structure for table `program_table`
--

CREATE TABLE `program_table` (
  `program_id` int(11) NOT NULL,
  `program_description` varchar(255) DEFAULT NULL,
  `program_code` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_table`
--

INSERT INTO `program_table` (`program_id`, `program_description`, `program_code`) VALUES
(1, 'Bachelor of Science in Architecture', 'BS ARCHI.'),
(2, 'Bachelor of Science in Interior Design', 'BSID'),
(3, 'Bachelor in Fine Arts Major in Painting', 'BFA-PAINT'),
(4, 'Bachelor in Fine Arts Major in Visual Communication', 'BFA-VISCOM'),
(5, 'Bachelor of Science in Applied Physics with Computer Science Emphasis', 'BSAP'),
(6, 'Bachelor of Science in Psychology', 'BSPSYCH'),
(7, 'Bachelor of Science in Mathematics', 'BSMATH'),
(8, 'Bachelor of Science in Business Administration Major in Marketing Management', 'BSBA-MM'),
(9, 'Bachelor of Science in Business Administration Major in HR Development Management', 'BSBA-HRDM'),
(10, 'Bachelor of Science in Entrepreneurship', 'BSEM'),
(11, 'Bachelor of Science in Office Administration', 'BSOA'),
(12, 'Bachelor of Science in Criminology', 'BSCRIM'),
(13, 'Bachelor of Science in Computer Science', 'BSCS'),
(14, 'Bachelor of Science in Information Technology', 'BS INFOTECH'),
(15, 'Bachelor in Secondary Education Major in Science', 'BSE-SCI'),
(16, 'Bachelor in Secondary Education Major in Mathematics', 'BSE-MATH'),
(17, 'Bachelor in Secondary Education Major in Filipino', 'BSE-FIL'),
(18, 'Bachelor in Special Needs Education', 'BSNEd'),
(19, 'Bachelor in Technology and Livelihood Education Major in Home Economics', 'BTLE-HE'),
(20, 'Bachelor in Technology and Livelihood Education Major in Industrial Arts', 'BTLE-IA'),
(21, 'Professional Education Subjects (TCP)', 'TCP'),
(22, 'Bachelor in Public Administration', 'BPA'),
(23, 'Bachelor of Science in Chemical Engineering', 'BSCHE'),
(24, 'Bachelor of Science in Civil Engineering', 'BSCE'),
(25, 'Bachelor of Science in Electrical Engineering', 'BSEE'),
(26, 'Bachelor of Science in Electronics and Communication Engineering', 'BSECE'),
(27, 'Bachelor of Science in Mechanical Engineering', 'BSME'),
(28, 'Bachelor of Science in Computer Engineering', 'BSCOE'),
(29, 'Bachelor of Science in Tourism Management', 'BST'),
(30, 'Bachelor of Science in Hospitality Management', 'BSHM'),
(31, 'Bachelor of Science in Industrial Technology Major in Automotive Technology', 'BSIT-AUTO'),
(32, 'Bachelor of Science in Industrial Technology Major in Electrical Technology', 'BSIT-ELEC'),
(33, 'Bachelor of Science in Industrial Technology Major in Electronics Technology', 'BSIT-ET'),
(34, 'Bachelor of Science in Industrial Technology Major in Food Technology', 'BSIT-FOOD'),
(35, 'Bachelor of Science in Industrial Technology Major in Fashion and Apparel Technology', 'BSIT-FASHION'),
(36, 'Bachelor of Science in Industrial Technology Major in Industrial Chemistry', 'BSIT-CHEM'),
(37, 'Bachelor of Science in Industrial Technology Major in Drafting Technology', 'BSIT-DRAFT'),
(38, 'Bachelor of Science in Industrial Technology Major in Machine Shop Technology', 'BSIT-MECH'),
(39, 'Bachelor of Science in Industrial Technology Major in Refrigeration and Air Conditioning', 'BSIT-RAC'),
(40, 'Bachelor of Science Major in Chemical Engineering', 'BSCE'),
(41, 'Bachelor of Science Major in Fine Arts', 'BSFA');

-- --------------------------------------------------------

--
-- Table structure for table `program_tagging_table`
--

CREATE TABLE `program_tagging_table` (
  `program_tagging_id` int(11) NOT NULL,
  `curriculum_id` int(11) DEFAULT NULL,
  `year_level_id` int(11) DEFAULT NULL,
  `semester_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_tagging_table`
--

INSERT INTO `program_tagging_table` (`program_tagging_id`, `curriculum_id`, `year_level_id`, `semester_id`, `course_id`) VALUES
(1, 1, 1, 1, 1),
(2, 1, 1, 1, 2),
(3, 1, 1, 1, 3),
(4, 1, 1, 1, 4),
(5, 1, 1, 1, 5),
(6, 1, 1, 1, 6),
(7, 1, 1, 1, 7),
(8, 1, 1, 1, 8),
(9, 1, 1, 1, 9),
(10, 1, 1, 1, 10),
(11, 1, 1, 1, 11),
(12, 1, 1, 2, 12),
(13, 1, 1, 2, 13),
(14, 1, 1, 2, 14),
(15, 1, 1, 2, 15),
(16, 1, 1, 2, 16),
(17, 1, 1, 2, 17),
(18, 1, 1, 2, 18),
(19, 1, 1, 2, 19),
(20, 1, 1, 2, 20),
(21, 1, 1, 2, 21),
(22, 1, 1, 2, 22),
(23, 1, 2, 1, 23),
(24, 1, 2, 1, 24),
(25, 1, 2, 1, 25),
(26, 1, 2, 1, 26),
(27, 1, 2, 1, 27),
(28, 1, 2, 1, 28),
(29, 1, 2, 1, 29),
(30, 1, 2, 1, 30),
(31, 1, 2, 1, 31),
(32, 1, 2, 1, 32),
(33, 1, 2, 1, 33),
(34, 1, 2, 2, 34),
(35, 1, 2, 2, 35),
(36, 1, 2, 2, 36),
(37, 1, 2, 2, 37),
(38, 1, 2, 2, 38),
(39, 1, 2, 2, 39),
(40, 1, 2, 2, 40),
(41, 1, 2, 2, 41),
(42, 1, 2, 2, 42),
(43, 1, 2, 2, 43),
(44, 1, 2, 2, 44),
(45, 1, 2, 2, 45),
(46, 1, 3, 1, 46),
(47, 1, 3, 1, 47),
(48, 1, 3, 1, 48),
(49, 1, 3, 1, 49),
(50, 1, 3, 1, 50),
(51, 1, 3, 1, 51),
(52, 1, 3, 1, 52),
(53, 1, 3, 1, 53),
(54, 1, 3, 1, 54),
(55, 1, 3, 1, 55),
(56, 1, 3, 1, 56),
(57, 1, 3, 2, 57),
(58, 1, 3, 2, 58),
(59, 1, 3, 2, 59),
(60, 1, 3, 2, 60),
(61, 1, 3, 2, 61),
(62, 1, 3, 2, 62),
(63, 1, 3, 2, 63),
(64, 1, 3, 2, 64),
(65, 1, 3, 2, 65),
(66, 1, 3, 2, 66),
(67, 1, 4, 1, 67),
(68, 1, 4, 1, 68),
(69, 1, 4, 1, 69),
(70, 1, 4, 1, 70),
(71, 1, 4, 1, 71),
(72, 1, 4, 1, 72),
(73, 1, 4, 1, 73),
(74, 1, 4, 1, 74),
(75, 1, 4, 1, 75),
(76, 1, 4, 1, 76),
(77, 1, 4, 2, 77),
(78, 2, 3, 2, 71);

-- --------------------------------------------------------

--
-- Table structure for table `requirements_table`
--

CREATE TABLE `requirements_table` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requirements_table`
--

INSERT INTO `requirements_table` (`id`, `description`) VALUES
(1, 'Original and Photocopy of high school report card (form 138) duly signed by the school Principal and/or Registrar'),
(2, 'Original and Photocopy of Certificate of Good Moral Character'),
(3, 'Original and Photocopy of NSO Birth Certificate'),
(5, 'Certification from School Principal and/or Registrar with School\'s dry seal that no copy of applicant\'s form 137 has been sent to other College or University');

-- --------------------------------------------------------

--
-- Table structure for table `requirement_uploads`
--

CREATE TABLE `requirement_uploads` (
  `upload_id` int(11) NOT NULL,
  `requirements_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `room_day_table`
--

CREATE TABLE `room_day_table` (
  `id` int(11) NOT NULL,
  `description` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_day_table`
--

INSERT INTO `room_day_table` (`id`, `description`) VALUES
(1, 'SUN'),
(2, 'MON'),
(3, 'TUE'),
(4, 'WED'),
(5, 'THU'),
(6, 'FRI'),
(7, 'SAT');

-- --------------------------------------------------------

--
-- Table structure for table `room_table`
--

CREATE TABLE `room_table` (
  `room_id` int(11) NOT NULL,
  `room_description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_table`
--

INSERT INTO `room_table` (`room_id`, `room_description`) VALUES
(1, 'CCS Room 201'),
(2, 'CCS Room 202'),
(3, 'CCS Room 301'),
(4, 'CCS Room 302'),
(5, 'CCS Room 303'),
(11, 'CSS Room 203');

-- --------------------------------------------------------

--
-- Table structure for table `school_time_table`
--

CREATE TABLE `school_time_table` (
  `id` int(11) NOT NULL,
  `description` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `school_time_table`
--

INSERT INTO `school_time_table` (`id`, `description`) VALUES
(1, '07:00 AM'),
(2, '07:30 AM'),
(3, '08:00 AM'),
(4, '08:30 AM'),
(5, '09:00 AM'),
(6, '09:30 AM'),
(7, '10:00 AM'),
(8, '10:30 AM'),
(9, '11:00 AM'),
(10, '11:30 AM'),
(11, '12:00 PM'),
(12, '12:30 PM'),
(13, '01:00 PM'),
(14, '01:30 PM'),
(15, '02:00 PM'),
(16, '02:30 PM'),
(17, '03:00 PM'),
(18, '03:30 PM'),
(19, '04:00 PM'),
(20, '04:30 PM'),
(21, '05:00 PM'),
(22, '05:30 PM'),
(23, '06:00 PM'),
(24, '06:30 PM'),
(25, '07:00 PM'),
(26, '07:30 PM'),
(27, '08:00 PM'),
(28, '08:30 PM'),
(29, '09:00 PM');

-- --------------------------------------------------------

--
-- Table structure for table `section_table`
--

CREATE TABLE `section_table` (
  `id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section_table`
--

INSERT INTO `section_table` (`id`, `description`) VALUES
(1, '1A'),
(2, '1B'),
(3, '1C'),
(4, '2A'),
(5, '2B'),
(6, '2C'),
(7, '3A'),
(8, '3B'),
(9, '3C'),
(10, '4A'),
(11, '4B'),
(12, '4C'),
(14, '94');

-- --------------------------------------------------------

--
-- Table structure for table `semester_table`
--

CREATE TABLE `semester_table` (
  `semester_id` int(11) NOT NULL,
  `semester_description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `semester_table`
--

INSERT INTO `semester_table` (`semester_id`, `semester_description`) VALUES
(1, '1st Semester'),
(2, '2nd Semester'),
(3, 'Summer'),
(5, '3rd Semester');

-- --------------------------------------------------------

--
-- Table structure for table `student_counter`
--

CREATE TABLE `student_counter` (
  `id` int(11) NOT NULL,
  `que_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_counter`
--

INSERT INTO `student_counter` (`id`, `que_number`) VALUES
(1, 6),
(2, 6);

-- --------------------------------------------------------

--
-- Table structure for table `student_curriculum_table`
--

CREATE TABLE `student_curriculum_table` (
  `id` int(11) NOT NULL,
  `student_numbering_id` int(11) DEFAULT NULL,
  `curriculum_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_grade_overall_table`
--

CREATE TABLE `student_grade_overall_table` (
  `id` int(11) NOT NULL,
  `student_number` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `final_grade` decimal(2,2) NOT NULL,
  `active_school_year_id` int(11) NOT NULL,
  `remarks` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_grade_overall_table`
--

INSERT INTO `student_grade_overall_table` (`id`, `student_number`, `course_id`, `final_grade`, `active_school_year_id`, `remarks`) VALUES
(1, 224095240, 1, 0.99, 2, 1),
(2, 224091140, 2, 0.99, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `student_numbering_table`
--

CREATE TABLE `student_numbering_table` (
  `student_number` int(11) NOT NULL,
  `person_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_numbering_table`
--

INSERT INTO `student_numbering_table` (`student_number`, `person_id`) VALUES
(224095240, 1),
(224091140, 2),
(202500005, 3),
(202500006, 4);

-- --------------------------------------------------------

--
-- Table structure for table `student_status_table`
--

CREATE TABLE `student_status_table` (
  `id` int(11) NOT NULL,
  `student_number` int(11) DEFAULT NULL,
  `active_curriculum` int(11) DEFAULT NULL,
  `enrolled_status` varchar(11) DEFAULT NULL,
  `year_level_id` int(11) DEFAULT NULL,
  `active_school_year_id` int(11) DEFAULT NULL,
  `control_status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_status_table`
--

INSERT INTO `student_status_table` (`id`, `student_number`, `active_curriculum`, `enrolled_status`, `year_level_id`, `active_school_year_id`, `control_status`) VALUES
(1, 224095240, 1, '1', 1, 2, 1),
(2, 224091140, 1, '1', 1, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `time_table`
--

CREATE TABLE `time_table` (
  `id` int(11) NOT NULL,
  `room_day` int(11) DEFAULT NULL,
  `school_time_start` varchar(11) DEFAULT NULL,
  `school_time_end` varchar(11) DEFAULT NULL,
  `department_section_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `professor_id` int(11) DEFAULT NULL,
  `department_room_id` int(11) DEFAULT NULL,
  `school_year_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `time_table`
--

INSERT INTO `time_table` (`id`, `room_day`, `school_time_start`, `school_time_end`, `department_section_id`, `course_id`, `professor_id`, `department_room_id`, `school_year_id`) VALUES
(8, 2, '8:00 AM', '10:00 AM', 1, 3, 40, 3, 3),
(9, 3, '11:00 AM', '2:00 PM', 1, 20, 40, 5, 4),
(10, 5, '7:00 AM', '10:00 AM', 2, 7, 40, 4, 6),
(11, 6, '11:00 AM', '2:00 PM', 3, 5, 40, 4, 2),
(12, 6, '10:00 AM', '1:00 PM', 1, 3, 40, 4, 4);

-- --------------------------------------------------------

--
-- Table structure for table `user_accounts`
--

CREATE TABLE `user_accounts` (
  `id` int(11) NOT NULL,
  `person_id` int(11) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_accounts`
--

INSERT INTO `user_accounts` (`id`, `person_id`, `role`, `email`, `password`) VALUES
(1, 1, 'registrar', 'Ardenmecasio21@gmail.com', '$2b$10$PqmUKA45xobzdMZHx8U2/Of/YSRAgop.8FwuMCOtixY3bQNxMAGaO'),
(2, 4, 'student', 'ardenhello@gmail.com', '$2b$10$dxs3rjyLGQtPIeDpyeAUTOsViqjJWC6ZYb1uhlWSZLePjvPOj/qZ.');

-- --------------------------------------------------------

--
-- Table structure for table `year_level_table`
--

CREATE TABLE `year_level_table` (
  `year_level_id` int(11) NOT NULL,
  `year_level_description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `year_level_table`
--

INSERT INTO `year_level_table` (`year_level_id`, `year_level_description`) VALUES
(1, '1st Year'),
(2, '2nd Year'),
(3, '3rd Year'),
(4, '4th Year');

-- --------------------------------------------------------

--
-- Table structure for table `year_table`
--

CREATE TABLE `year_table` (
  `year_id` int(11) NOT NULL,
  `year_description` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `year_table`
--

INSERT INTO `year_table` (`year_id`, `year_description`, `status`) VALUES
(1, '2021', 0),
(2, '2022', 0),
(3, '2023', 0),
(4, '2024', 0),
(9, '2025', 1),
(10, '2026', 0),
(11, '2027', 0),
(12, '20028', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `active_school_year_table`
--
ALTER TABLE `active_school_year_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `year_id` (`year_id`),
  ADD KEY `semester_id` (`semester_id`);

--
-- Indexes for table `course_table`
--
ALTER TABLE `course_table`
  ADD PRIMARY KEY (`course_id`);

--
-- Indexes for table `curriculum_table`
--
ALTER TABLE `curriculum_table`
  ADD PRIMARY KEY (`curriculum_id`),
  ADD KEY `year_id` (`year_id`),
  ADD KEY `program_id` (`program_id`);

--
-- Indexes for table `dprtmnt_curriculum_table`
--
ALTER TABLE `dprtmnt_curriculum_table`
  ADD PRIMARY KEY (`dprtmnt_curriculum_id`),
  ADD KEY `dprtmnt_id` (`dprtmnt_id`),
  ADD KEY `curriculum_id` (`curriculum_id`);

--
-- Indexes for table `dprtmnt_profs_table`
--
ALTER TABLE `dprtmnt_profs_table`
  ADD PRIMARY KEY (`dprtmnt_profs_id`),
  ADD KEY `dprtmnt_id` (`dprtmnt_id`),
  ADD KEY `prof_id` (`prof_id`);

--
-- Indexes for table `dprtmnt_room_table`
--
ALTER TABLE `dprtmnt_room_table`
  ADD PRIMARY KEY (`dprtmnt_room_id`),
  ADD KEY `dprtmnt_id` (`dprtmnt_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `dprtmnt_section_table`
--
ALTER TABLE `dprtmnt_section_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `curriculum_id` (`curriculum_id`),
  ADD KEY `section_id` (`section_id`);

--
-- Indexes for table `dprtmnt_table`
--
ALTER TABLE `dprtmnt_table`
  ADD PRIMARY KEY (`dprtmnt_id`);

--
-- Indexes for table `enrolled_subject`
--
ALTER TABLE `enrolled_subject`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `period_status`
--
ALTER TABLE `period_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `person_prof_table`
--
ALTER TABLE `person_prof_table`
  ADD PRIMARY KEY (`person_id`);

--
-- Indexes for table `person_status_table`
--
ALTER TABLE `person_status_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `person_id` (`person_id`);

--
-- Indexes for table `person_table`
--
ALTER TABLE `person_table`
  ADD PRIMARY KEY (`person_id`);

--
-- Indexes for table `prof_table`
--
ALTER TABLE `prof_table`
  ADD PRIMARY KEY (`prof_id`);

--
-- Indexes for table `program_table`
--
ALTER TABLE `program_table`
  ADD PRIMARY KEY (`program_id`);

--
-- Indexes for table `time_table`
--
ALTER TABLE `time_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_accounts`
--
ALTER TABLE `user_accounts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `enrolled_subject`
--
ALTER TABLE `enrolled_subject`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `person_prof_table`
--
ALTER TABLE `person_prof_table`
  MODIFY `person_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `time_table`
--
ALTER TABLE `time_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
