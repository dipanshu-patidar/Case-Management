-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 24, 2026 at 09:43 AM
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
-- Database: `legal-case-management`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int(11) NOT NULL,
  `matter_id` int(11) DEFAULT NULL,
  `actor_user_id` int(11) DEFAULT NULL,
  `entity_type` varchar(191) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `action` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `matter_id`, `actor_user_id`, `entity_type`, `entity_id`, `action`, `description`, `created_at`) VALUES
(1, 1, 3, 'document', 1, 'uploaded', 'Document uploaded: 1776777927144-ChatGPT_Image_Apr_17__2026__12_52_59_PM.png', '2026-04-21 13:25:27.230'),
(2, 1, 3, 'signature', 1, 'signed', 'Draft \"test\" signed by client', '2026-04-22 06:37:18.304'),
(3, 1, 1, 'matter', 1, 'status_updated', 'Matter status changed to pending', '2026-04-22 07:23:59.398'),
(4, 1, 1, 'matter', 1, 'status_updated', 'Matter status changed to active', '2026-04-22 07:24:09.065'),
(5, 1, 3, 'invoice', 1, 'paid', 'Invoice INV-2026-0001 marked paid via manual workflow', '2026-04-22 07:28:56.229'),
(6, 1, 2, 'communication', 1, 'created', 'Email log logged by Lawyer John (lawyer)', '2026-04-22 08:49:23.633'),
(7, 1, 3, 'document', 2, 'uploaded', 'Document uploaded: 1776848229802-ChatGPT_Image_Apr_17__2026__12_52_59_PM.png', '2026-04-22 08:57:09.919'),
(8, 1, 3, 'communication', 2, 'created', 'Portal message logged by Sarah Client (client)', '2026-04-22 09:22:47.818'),
(9, 1, 2, 'communication', 3, 'created', 'Note logged by Lawyer John (lawyer)', '2026-04-22 09:43:43.973'),
(10, 1, 3, 'signature', 2, 'signed', 'Draft \"test\" signed by client', '2026-04-22 09:45:47.020'),
(11, 1, 2, 'invoice', 3, 'created', 'Invoice INV-1776852260166 created for $1000', '2026-04-22 10:04:20.199'),
(12, NULL, 1, 'client', 2, 'converted_from_lead', 'Client created from Lead #2', '2026-04-22 10:10:57.464'),
(13, 2, 1, 'matter', 2, 'created', 'Matter MT-00002 created: testing', '2026-04-22 10:16:35.613'),
(14, 2, 3, 'document', 3, 'uploaded', 'Document uploaded: 1776856316740-images.jpg', '2026-04-22 11:11:56.816'),
(15, 2, 1, 'matter', 2, 'status_updated', 'Matter status changed to active', '2026-04-22 11:26:21.735'),
(16, 2, 1, 'matter', 2, 'status_updated', 'Matter status changed to pending', '2026-04-22 11:26:36.096'),
(17, 2, 1, 'matter', 2, 'status_updated', 'Matter status changed to active', '2026-04-22 11:26:37.724'),
(18, 2, 1, 'document', 4, 'uploaded', 'Document uploaded: 1776860212334-images.jpg', '2026-04-22 12:16:52.375'),
(19, 1, 1, 'invoice', 2, 'payment_received', 'Trust application of 470 to invoice INV-2026-0002. New status: paid', '2026-04-22 13:06:10.590'),
(20, 2, 1, 'invoice', 4, 'payment_received', 'Trust application of 30 to invoice INV-2026-0004. New status: partially_paid', '2026-04-22 13:07:00.550'),
(21, 2, 1, 'invoice', 4, 'payment_received', 'Trust application of 100 to invoice INV-2026-0004. New status: partially_paid', '2026-04-22 13:37:00.807'),
(22, 2, 1, 'invoice', 5, 'payment_received', 'Trust application of 5 to invoice INV-2026-0005. New status: partially_paid', '2026-04-22 13:39:57.508'),
(23, 2, 1, 'invoice', 6, 'payment_received', 'Trust application of 580 to invoice INV-2026-0006. New status: partially_paid', '2026-04-23 05:22:44.802'),
(24, 2, 1, 'invoice', 7, 'payment_received', 'Trust application of 20 to invoice INV-2026-0007. New status: due', '2026-04-23 05:33:22.011'),
(25, 2, 3, 'invoice', 4, 'paid', 'Invoice INV-2026-0004 marked paid via manual workflow', '2026-04-23 05:34:27.204'),
(26, 2, 1, 'invoice', 6, 'payment_received', 'Trust application of 200 to invoice INV-2026-0006. New status: due', '2026-04-23 05:49:54.156'),
(27, 3, 1, 'matter', 3, 'created', 'Matter MT-00003 created: test', '2026-04-23 06:41:04.736'),
(28, 3, 1, 'document', 5, 'uploaded', 'Document uploaded: 1776926499282-images.jpg', '2026-04-23 06:41:39.319'),
(29, 1, 3, 'invoice', 3, 'paid', 'Invoice INV-1776852260166 marked paid via manual workflow', '2026-04-23 06:44:11.964'),
(30, 2, 3, 'invoice', 5, 'paid', 'Invoice INV-2026-0005 marked paid via manual workflow', '2026-04-23 06:44:17.489'),
(31, 2, 3, 'invoice', 8, 'paid', 'Invoice INV-2026-0008 marked paid via manual workflow', '2026-04-23 06:44:39.185'),
(32, 1, 1, 'matter', 1, 'status_updated', 'Matter status changed to completed', '2026-04-23 07:33:49.531');

-- --------------------------------------------------------

--
-- Table structure for table `calendar_events`
--

CREATE TABLE `calendar_events` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `event_date` datetime(3) NOT NULL,
  `matter_id` int(11) DEFAULT NULL,
  `type` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `calendar_events`
--

INSERT INTO `calendar_events` (`id`, `title`, `event_date`, `matter_id`, `type`, `description`, `created_by`, `created_at`) VALUES
(1, 'test', '2026-04-22 00:00:00.000', NULL, 'custom', NULL, 1, '2026-04-22 11:06:47.787');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `full_name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `address_line_1` varchar(191) DEFAULT NULL,
  `address_line_2` varchar(191) DEFAULT NULL,
  `city` varchar(191) DEFAULT NULL,
  `state` varchar(191) DEFAULT NULL,
  `postal_code` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_portal_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `user_id`, `full_name`, `email`, `phone`, `address_line_1`, `address_line_2`, `city`, `state`, `postal_code`, `notes`, `is_portal_enabled`, `created_at`, `updated_at`) VALUES
(1, 3, 'Sarah mitchell', 'client@vktori.com', '147852841', NULL, NULL, NULL, NULL, NULL, '', 1, '2026-04-21 12:47:06.360', '2026-04-22 10:08:39.201'),
(2, NULL, 'Sample Lead', 'lead@example.com', '123-456-7890', NULL, NULL, NULL, NULL, NULL, 'Converted from lead. Original message: I need legal advice regarding my divorce.', 0, '2026-04-22 10:10:57.437', '2026-04-22 10:10:57.437'),
(3, 4, 'johnnn don', 'don@gmail.com', '147/8522522', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-04-22 10:19:05.628', '2026-04-22 10:19:05.628');

-- --------------------------------------------------------

--
-- Table structure for table `communications`
--

CREATE TABLE `communications` (
  `id` int(11) NOT NULL,
  `matter_id` int(11) NOT NULL,
  `sender_user_id` int(11) NOT NULL,
  `sender_role` enum('admin','lawyer','client') NOT NULL,
  `message_body` text NOT NULL,
  `visibility` enum('internal','client_shared','client_visible') NOT NULL DEFAULT 'internal',
  `communication_type` enum('portal_message','note','email_log','call_log','meeting_log') NOT NULL DEFAULT 'portal_message',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `communications`
--

INSERT INTO `communications` (`id`, `matter_id`, `sender_user_id`, `sender_role`, `message_body`, `visibility`, `communication_type`, `is_read`, `read_at`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'lawyer', 'To: lawyer@gmail.com\nSubject: testing\n\ntest', 'client_shared', 'email_log', 1, '2026-04-22 08:57:41.002', '2026-04-22 08:49:23.626', '2026-04-22 08:57:41.004'),
(2, 1, 3, 'client', 'Replying to: To: lawyer@gmail.com\nSubject: testing\n\nokkk', 'client_visible', 'portal_message', 1, '2026-04-22 09:23:24.427', '2026-04-22 09:22:47.792', '2026-04-22 09:23:24.428'),
(3, 1, 2, 'lawyer', 'testing\n\ntest matter', 'client_shared', 'note', 1, '2026-04-22 09:44:55.989', '2026-04-22 09:43:43.930', '2026-04-22 09:44:55.989');

-- --------------------------------------------------------

--
-- Table structure for table `conflict_checks`
--

CREATE TABLE `conflict_checks` (
  `id` int(11) NOT NULL,
  `prospective_client_name` varchar(191) NOT NULL,
  `opposing_party_name` varchar(191) NOT NULL,
  `result` varchar(191) NOT NULL,
  `matches` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`matches`)),
  `created_by_user_id` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `conflict_checks`
--

INSERT INTO `conflict_checks` (`id`, `prospective_client_name`, `opposing_party_name`, `result`, `matches`, `created_by_user_id`, `created_at`) VALUES
(1, 'fdfb', 'gb', 'no_conflict', '[]', 1, '2026-04-22 10:15:00.102');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `matter_id` int(11) NOT NULL,
  `uploaded_by_user_id` int(11) NOT NULL,
  `file_name` varchar(191) NOT NULL,
  `original_name` varchar(191) NOT NULL,
  `mime_type` varchar(191) NOT NULL,
  `file_path` varchar(191) NOT NULL,
  `file_size` int(11) NOT NULL,
  `visibility` enum('internal','client_shared','client_visible') NOT NULL DEFAULT 'internal',
  `category` varchar(191) DEFAULT NULL,
  `is_signature_required` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `folder_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `matter_id`, `uploaded_by_user_id`, `file_name`, `original_name`, `mime_type`, `file_path`, `file_size`, `visibility`, `category`, `is_signature_required`, `created_at`, `updated_at`, `folder_id`) VALUES
(1, 1, 3, '1776777927144-ChatGPT_Image_Apr_17__2026__12_52_59_PM.png', 'ChatGPT Image Apr 17, 2026, 12_52_59 PM.png', 'image/png', 'C:\\Users\\syada\\Desktop\\kiaan tech\\legal-case-management\\backend\\uploads\\documents\\1776777927144-ChatGPT_Image_Apr_17__2026__12_52_59_PM.png', 1410391, 'client_visible', 'Evidence', 0, '2026-04-21 13:25:27.216', '2026-04-21 13:25:27.216', NULL),
(2, 1, 3, '1776848229802-ChatGPT_Image_Apr_17__2026__12_52_59_PM.png', 'ChatGPT Image Apr 17, 2026, 12_52_59 PM.png', 'image/png', 'C:\\Users\\syada\\Desktop\\kiaan tech\\legal-case-management\\backend\\uploads\\documents\\1776848229802-ChatGPT_Image_Apr_17__2026__12_52_59_PM.png', 1410391, 'client_visible', 'Complaint', 0, '2026-04-22 08:57:09.896', '2026-04-22 08:57:09.896', NULL),
(3, 2, 3, '1776856316740-images.jpg', 'images.jpg', 'image/jpeg', 'C:\\Users\\syada\\Desktop\\kiaan tech\\legal-case-management\\backend\\uploads\\documents\\1776856316740-images.jpg', 10741, 'client_visible', 'Evidence', 0, '2026-04-22 11:11:56.804', '2026-04-22 11:11:56.804', NULL),
(4, 2, 1, '1776860212334-images.jpg', 'images.jpg', 'image/jpeg', 'C:\\Users\\syada\\Desktop\\kiaan tech\\legal-case-management\\backend\\uploads\\documents\\1776860212334-images.jpg', 10741, 'internal', 'Contract', 0, '2026-04-22 12:16:52.360', '2026-04-22 12:16:52.360', NULL),
(5, 3, 1, '1776926499282-images.jpg', 'images.jpg', 'image/jpeg', 'C:\\Users\\syada\\Desktop\\kiaan tech\\legal-case-management\\backend\\uploads\\documents\\1776926499282-images.jpg', 10741, 'internal', 'Complaint', 0, '2026-04-23 06:41:39.307', '2026-04-23 06:41:39.307', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `drafts`
--

CREATE TABLE `drafts` (
  `id` int(11) NOT NULL,
  `matter_id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `category` varchar(191) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `status` enum('draft','ready','sent_for_signature','signed') NOT NULL DEFAULT 'draft',
  `created_by_user_id` int(11) NOT NULL,
  `last_updated_by_user_id` int(11) DEFAULT NULL,
  `sent_for_signature_at` datetime(3) DEFAULT NULL,
  `signed_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `drafts`
--

INSERT INTO `drafts` (`id`, `matter_id`, `title`, `category`, `content`, `status`, `created_by_user_id`, `last_updated_by_user_id`, `sent_for_signature_at`, `signed_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'test', 'Engagement', 'test', 'sent_for_signature', 1, 2, '2026-04-22 09:48:02.377', '2026-04-22 09:45:47.004', '2026-04-22 06:17:44.346', '2026-04-22 09:48:02.435'),
(2, 2, 'Copy of test', 'Engagement', 'test', 'sent_for_signature', 1, NULL, '2026-04-22 12:27:40.307', NULL, '2026-04-22 12:26:49.108', '2026-04-22 12:27:40.325');

-- --------------------------------------------------------

--
-- Table structure for table `folders`
--

CREATE TABLE `folders` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `matter_id` int(11) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `matter_id` int(11) NOT NULL,
  `invoice_number` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `due_date` datetime(3) DEFAULT NULL,
  `status` enum('draft','unpaid','due','paid','overdue','void') NOT NULL DEFAULT 'draft',
  `issued_at` datetime(3) DEFAULT NULL,
  `paid_at` datetime(3) DEFAULT NULL,
  `created_by_user_id` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `matter_id`, `invoice_number`, `description`, `amount`, `due_date`, `status`, `issued_at`, `paid_at`, `created_by_user_id`, `created_at`, `updated_at`) VALUES
(1, 1, 'INV-2026-0001', 'Consolidated billing for matter 1', 148.33, NULL, 'paid', NULL, '2026-04-22 07:28:56.198', 2, '2026-04-21 13:19:35.618', '2026-04-22 07:28:56.221'),
(2, 1, 'INV-2026-0002', 'Consolidated billing for matter 1', 470.00, '2026-04-27 07:32:59.165', 'paid', NULL, '2026-04-22 13:06:10.583', 2, '2026-04-22 07:32:59.167', '2026-04-22 13:06:10.584'),
(3, 1, 'INV-1776852260166', 'testt', 80.00, '2026-04-23 00:00:00.000', 'paid', NULL, '2026-04-23 06:44:11.931', 2, '2026-04-22 10:04:20.183', '2026-04-23 06:44:11.955'),
(4, 2, 'INV-2026-0004', 'Consolidated billing for matter 2', 220.00, '2026-04-27 10:17:22.728', 'paid', NULL, '2026-04-23 05:34:27.188', 2, '2026-04-22 10:17:22.730', '2026-04-23 05:34:27.200'),
(5, 2, 'INV-2026-0005', 'Consolidated billing for matter 2', 10.00, '2026-04-27 13:39:15.820', 'paid', NULL, '2026-04-23 06:44:17.472', 2, '2026-04-22 13:39:15.822', '2026-04-23 06:44:17.483'),
(6, 2, 'INV-2026-0006', 'Consolidated billing for matter 2', 1580.00, '2026-04-28 05:20:38.667', 'due', NULL, NULL, 2, '2026-04-23 05:20:38.672', '2026-04-23 05:49:54.149'),
(7, 2, 'INV-2026-0007', 'Consolidated billing for matter 2', 30.00, '2026-04-28 05:27:33.286', 'due', NULL, NULL, 2, '2026-04-23 05:27:33.290', '2026-04-23 05:33:22.002'),
(8, 2, 'INV-2026-0008', 'Consolidated billing for matter 2', 60.00, '2026-04-28 05:49:08.718', 'paid', NULL, '2026-04-23 06:44:39.162', 2, '2026-04-23 05:49:08.723', '2026-04-23 06:44:39.179'),
(9, 3, 'INV-2026-0009', 'Consolidated billing for matter 3', 10.00, '2026-04-28 06:55:28.494', 'draft', NULL, NULL, 2, '2026-04-23 06:55:28.496', '2026-04-23 06:55:28.518'),
(10, 1, 'INV-2026-0010', 'Consolidated billing for matter 1', 10.00, '2026-04-28 07:33:53.409', 'draft', NULL, NULL, 2, '2026-04-23 07:33:53.410', '2026-04-23 07:33:53.428');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `description` varchar(191) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `description`, `amount`, `created_at`) VALUES
(1, 1, 'Time logged: 11 mins', 18.33, '2026-04-21 13:19:35.651'),
(2, 1, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 06:55:44.256'),
(3, 1, 'Legal Services: 0.2 hrs', 20.00, '2026-04-22 07:05:02.515'),
(4, 1, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 07:05:21.698'),
(5, 1, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 07:09:22.869'),
(6, 1, 'Legal Services: 0.1 hrs', 20.00, '2026-04-22 07:21:58.829'),
(7, 1, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 07:23:20.132'),
(8, 1, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 07:25:55.883'),
(9, 2, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 07:32:59.177'),
(10, 2, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 07:36:10.349'),
(11, 2, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 07:39:20.120'),
(12, 2, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 08:46:04.142'),
(13, 2, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 08:47:56.022'),
(14, 2, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 09:00:29.377'),
(15, 2, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 09:01:41.093'),
(16, 2, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 09:03:15.133'),
(17, 2, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 09:23:20.590'),
(18, 2, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 09:46:48.972'),
(19, 2, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 09:48:05.822'),
(20, 2, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 10:04:03.104'),
(21, 2, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 10:15:51.828'),
(22, 4, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 10:17:22.745'),
(23, 2, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 11:10:48.038'),
(24, 4, 'Legal Services: 0.1 hrs', 30.00, '2026-04-22 11:21:41.346'),
(25, 4, 'Legal Services: 0.2 hrs', 20.00, '2026-04-22 11:34:57.460'),
(26, 4, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 11:40:22.219'),
(27, 4, 'Legal Services: 0.5 hrs', 50.00, '2026-04-22 12:07:33.027'),
(28, 4, 'Legal Services: 0.2 hrs', 20.00, '2026-04-22 12:16:01.598'),
(29, 4, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 12:16:05.213'),
(30, 4, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 12:25:33.684'),
(31, 4, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 12:28:03.562'),
(32, 4, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 12:29:15.498'),
(33, 4, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 12:49:24.960'),
(34, 2, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 12:49:52.318'),
(35, 4, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 12:50:08.059'),
(36, 2, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 12:52:09.638'),
(37, 2, 'Legal Services: 0.2 hrs', 20.00, '2026-04-22 13:02:27.390'),
(38, 2, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 13:03:49.362'),
(39, 3, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 13:06:38.235'),
(40, 3, 'Legal Services: 0.5 hrs', 50.00, '2026-04-22 13:33:45.300'),
(41, 3, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 13:34:36.429'),
(42, 3, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 13:37:45.659'),
(43, 5, 'Legal Services: 0.1 hrs', 10.00, '2026-04-22 13:39:15.836'),
(44, 6, 'Legal Services: 0.1 hrs', 10.00, '2026-04-23 05:20:38.686'),
(45, 6, 'Legal Services: 15.7 hrs', 1570.00, '2026-04-23 05:21:43.632'),
(46, 7, 'Legal Services: 0.1 hrs', 10.00, '2026-04-23 05:27:33.313'),
(47, 7, 'Legal Services: 0.1 hrs', 10.00, '2026-04-23 05:29:05.600'),
(48, 7, 'Legal Services: 0.1 hrs', 10.00, '2026-04-23 05:32:51.766'),
(49, 8, 'Legal Services: 0.3 hrs', 30.00, '2026-04-23 05:49:08.752'),
(50, 8, 'Legal Services: 0.1 hrs', 10.00, '2026-04-23 05:50:31.517'),
(51, 8, 'Legal Services: 0.1 hrs', 10.00, '2026-04-23 06:28:53.788'),
(52, 8, 'Legal Services: 0.1 hrs', 10.00, '2026-04-23 06:39:52.412'),
(53, 9, 'Legal Services: 0.1 hrs', 10.00, '2026-04-23 06:55:28.509'),
(54, 10, 'Legal Services: 0.1 hrs', 10.00, '2026-04-23 07:33:53.421');

-- --------------------------------------------------------

--
-- Table structure for table `lawyers`
--

CREATE TABLE `lawyers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `display_name` varchar(191) NOT NULL,
  `practice_focus` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lawyers`
--

INSERT INTO `lawyers` (`id`, `user_id`, `display_name`, `practice_focus`, `phone`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 2, 'John Doe, Esq.', 'Civil Litigation', NULL, 1, '2026-04-21 12:47:06.274', '2026-04-21 12:47:06.274');

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

CREATE TABLE `leads` (
  `id` int(11) NOT NULL,
  `full_name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `matter_type` varchar(191) DEFAULT NULL,
  `practice_area` varchar(191) DEFAULT NULL,
  `source` varchar(191) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('new','screening','consultation_set','retained','declined','archived') NOT NULL DEFAULT 'new',
  `notes` text DEFAULT NULL,
  `created_by_user_id` int(11) DEFAULT NULL,
  `converted_client_id` int(11) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leads`
--

INSERT INTO `leads` (`id`, `full_name`, `email`, `phone`, `matter_type`, `practice_area`, `source`, `message`, `status`, `notes`, `created_by_user_id`, `converted_client_id`, `created_at`, `updated_at`) VALUES
(1, 'Sample Lead', 'lead@example.com', '123-456-7890', 'Divorce', 'Family Law', 'Google', 'I need legal advice regarding my divorce.', 'new', NULL, NULL, NULL, '2026-04-21 12:47:06.366', '2026-04-21 12:47:06.366'),
(2, 'Sample Lead', 'lead@example.com', '123-456-7890', 'Divorce', 'Family Law', 'Google', 'I need legal advice regarding my divorce.', 'retained', NULL, NULL, 2, '2026-04-21 12:47:35.936', '2026-04-22 10:10:57.450'),
(3, 'Sample Lead', 'lead@example.com', '123-456-7890', 'Divorce', 'Family Law', 'Google', 'I need legal advice regarding my divorce.', 'new', NULL, NULL, NULL, '2026-04-23 05:02:17.997', '2026-04-23 05:02:17.997');

-- --------------------------------------------------------

--
-- Table structure for table `matters`
--

CREATE TABLE `matters` (
  `id` int(11) NOT NULL,
  `matter_number` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `client_id` int(11) NOT NULL,
  `assigned_lawyer_id` int(11) DEFAULT NULL,
  `practice_area` varchar(191) NOT NULL,
  `matter_type` varchar(191) NOT NULL,
  `opposing_party_name` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','active','completed') NOT NULL DEFAULT 'pending',
  `opened_at` datetime(3) DEFAULT NULL,
  `closed_at` datetime(3) DEFAULT NULL,
  `created_by_user_id` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `next_hearing` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `matters`
--

INSERT INTO `matters` (`id`, `matter_number`, `title`, `client_id`, `assigned_lawyer_id`, `practice_area`, `matter_type`, `opposing_party_name`, `description`, `status`, `opened_at`, `closed_at`, `created_by_user_id`, `created_at`, `updated_at`, `next_hearing`) VALUES
(1, 'MAT-2026-001', 'The People vs. Sample Case', 1, 2, 'Civil Litigation', 'Civil Litigation', NULL, 'Initial sample matter for testing the timer system.', 'completed', NULL, NULL, 1, '2026-04-21 12:47:35.942', '2026-04-23 07:33:49.521', '2026-04-22 00:00:00.000'),
(2, 'MT-00002', 'testing', 1, 2, 'Real Estate', 'Real Estate', 'INFRA', 'real estate', 'active', '2026-04-22 00:00:00.000', NULL, 1, '2026-04-22 10:16:35.591', '2026-04-22 11:26:37.716', '2026-04-25 00:00:00.000'),
(3, 'MT-00003', 'test', 1, 2, 'Employment', 'Employment', 'YTN pvt.LTD.', 'test', 'pending', '2026-04-23 00:00:00.000', NULL, 1, '2026-04-23 06:41:04.716', '2026-04-23 06:41:04.716', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `matter_status_history`
--

CREATE TABLE `matter_status_history` (
  `id` int(11) NOT NULL,
  `matter_id` int(11) NOT NULL,
  `old_status` enum('pending','active','completed') NOT NULL,
  `new_status` enum('pending','active','completed') NOT NULL,
  `changed_by_user_id` int(11) NOT NULL,
  `note` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `matter_status_history`
--

INSERT INTO `matter_status_history` (`id`, `matter_id`, `old_status`, `new_status`, `changed_by_user_id`, `note`, `created_at`) VALUES
(1, 1, 'active', 'pending', 1, NULL, '2026-04-22 07:23:59.407'),
(2, 1, 'pending', 'active', 1, NULL, '2026-04-22 07:24:09.070'),
(3, 2, 'pending', 'active', 1, NULL, '2026-04-22 11:26:21.745'),
(4, 2, 'active', 'pending', 1, NULL, '2026-04-22 11:26:36.102'),
(5, 2, 'pending', 'active', 1, NULL, '2026-04-22 11:26:37.730'),
(6, 1, 'active', 'completed', 1, NULL, '2026-04-23 07:33:49.542');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `message` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `reference_id`, `is_read`, `created_at`) VALUES
(4, 2, 'New Message Received', 'Sarah Client sent you a message regarding matter MAT-2026-001.', 'system', 1, 1, '2026-04-22 09:22:47.827'),
(6, 2, 'New Document Uploaded', 'A new document \"images.jpg\" has been added to matter MT-00002.', 'document', 2, 1, '2026-04-22 11:11:56.835'),
(7, 3, 'New Document Uploaded', 'A new document \"images.jpg\" has been added to matter MT-00002.', 'document', 2, 1, '2026-04-22 12:16:52.397'),
(8, 3, 'New Document Uploaded', 'A new document \"images.jpg\" has been added to matter MT-00003.', 'document', 3, 1, '2026-04-23 06:41:39.329');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `matter_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(191) DEFAULT NULL,
  `payment_reference` varchar(191) DEFAULT NULL,
  `paid_on` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `created_by_user_id` int(11) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `invoice_id`, `matter_id`, `amount`, `payment_method`, `payment_reference`, `paid_on`, `created_by_user_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 148.33, 'manual', 'internal-manual', '2026-04-22 07:28:56.198', 3, '2026-04-22 07:28:56.213', '2026-04-22 07:28:56.213'),
(2, 3, 1, 500.00, 'trust_account', 'Trust Tx ID: 2', '2026-04-22 12:48:58.379', 1, '2026-04-22 12:48:58.381', '2026-04-22 12:48:58.381'),
(3, 2, 1, 430.00, 'trust_account', 'Trust Tx ID: 4', '2026-04-22 12:53:47.030', 1, '2026-04-22 12:53:47.031', '2026-04-22 12:53:47.031'),
(4, 2, 1, 470.00, 'trust_account', 'Trust Tx ID: 6', '2026-04-22 13:06:10.574', 1, '2026-04-22 13:06:10.576', '2026-04-22 13:06:10.576'),
(5, 4, 2, 30.00, 'trust_account', 'Trust Tx ID: 7', '2026-04-22 13:07:00.537', 1, '2026-04-22 13:07:00.538', '2026-04-22 13:07:00.538'),
(6, 4, 2, 100.00, 'trust_account', 'Trust Tx ID: 9', '2026-04-22 13:37:00.770', 1, '2026-04-22 13:37:00.772', '2026-04-22 13:37:00.772'),
(7, 5, 2, 5.00, 'trust_account', 'Trust Tx ID: 11', '2026-04-22 13:39:57.494', 1, '2026-04-22 13:39:57.496', '2026-04-22 13:39:57.496'),
(8, 6, 2, 580.00, 'trust_account', 'Trust Tx ID: 12', '2026-04-23 05:22:44.781', 1, '2026-04-23 05:22:44.784', '2026-04-23 05:22:44.784'),
(9, 7, 2, 20.00, 'trust_account', 'Trust Tx ID: 13', '2026-04-23 05:33:21.983', 1, '2026-04-23 05:33:21.987', '2026-04-23 05:33:21.987'),
(10, 4, 2, 220.00, 'manual', 'internal-manual', '2026-04-23 05:34:27.188', 3, '2026-04-23 05:34:27.195', '2026-04-23 05:34:27.195'),
(11, 6, 2, 200.00, 'trust_account', 'Trust Tx ID: 14', '2026-04-23 05:49:54.138', 1, '2026-04-23 05:49:54.140', '2026-04-23 05:49:54.140'),
(12, 3, 1, 80.00, 'manual', 'internal-manual', '2026-04-23 06:44:11.931', 3, '2026-04-23 06:44:11.950', '2026-04-23 06:44:11.950'),
(13, 5, 2, 10.00, 'manual', 'internal-manual', '2026-04-23 06:44:17.472', 3, '2026-04-23 06:44:17.480', '2026-04-23 06:44:17.480'),
(14, 8, 2, 60.00, 'manual', 'internal-manual', '2026-04-23 06:44:39.162', 3, '2026-04-23 06:44:39.168', '2026-04-23 06:44:39.168');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `category` varchar(191) DEFAULT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `title`, `category`, `start_date`, `end_date`, `data`, `created_by`, `created_at`) VALUES
(1, 'test', 'Financial', '2026-04-15 00:00:00.000', '2026-04-23 00:00:00.000', '{\"revenue\":618.33}', 1, '2026-04-23 06:12:57.058'),
(2, 'test', 'Operational', '2026-04-15 00:00:00.000', '2026-04-23 00:00:00.000', '{\"leads\":0,\"matters\":2,\"revenue\":0,\"hours\":21.3}', 1, '2026-04-23 06:24:58.205'),
(3, 'tert', 'Financial', '2026-04-15 00:00:00.000', '2026-04-23 00:00:00.000', '{\"leads\":0,\"matters\":0,\"revenue\":618.33,\"hours\":0}', 1, '2026-04-23 06:25:51.506');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `key` varchar(191) NOT NULL,
  `value` varchar(191) NOT NULL,
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `updated_at`) VALUES
(1, 'firm_name', 'VkTori Legal', '2026-04-23 06:35:13.569'),
(2, 'specialty', 'Civil & Corporate Litigation', '2026-04-23 06:35:13.579'),
(3, 'email', 'info@victoriatulsidaslaw.com', '2026-04-23 06:35:13.586'),
(4, 'phone', '147852411', '2026-04-23 06:35:13.593'),
(5, 'billing_rate', '100', '2026-04-23 06:35:13.600'),
(6, 'auto_invoice', 'true', '2026-04-23 06:35:13.606'),
(7, 'notify_new_lead', 'true', '2026-04-23 06:35:13.613'),
(8, 'notify_direct_message', 'true', '2026-04-23 06:35:13.620'),
(9, 'notify_matter_deadlines', 'true', '2026-04-23 06:35:13.625'),
(10, 'notify_task_assignments', 'true', '2026-04-23 06:35:13.629'),
(11, 'firm_logo_base64', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSEBIVFRUVFRcYFhUWFRUVFhgXFRUWFhUYGBcYHSggGRolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGi0lICUtLSstKy0tLS0tLi0tLS0tLS0tLS0t', '2026-04-23 06:35:13.635'),
(12, 'firm_logo_name', 'images.jpg', '2026-04-23 06:35:13.639');

-- --------------------------------------------------------

--
-- Table structure for table `signatures`
--

CREATE TABLE `signatures` (
  `id` int(11) NOT NULL,
  `draft_id` int(11) NOT NULL,
  `signed_by_user_id` int(11) NOT NULL,
  `signature_data` longtext DEFAULT NULL,
  `signed_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `ip_address` varchar(191) DEFAULT NULL,
  `device_info` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `signatures`
--

INSERT INTO `signatures` (`id`, `draft_id`, `signed_by_user_id`, `signature_data`, `signed_at`, `ip_address`, `device_info`, `created_at`) VALUES
(1, 1, 3, 'data:image/png;base64,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', '2026-04-22 06:37:18.258', '0.0.0.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-22 06:37:18.262'),
(2, 1, 3, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZUAAADSCAYAAACCcV1bAAAQAElEQVR4AeydC5wUxZ3Hu3rWiBAFTdQLRg9RMSe7M7NZAy7uLosYokl8C0kOz4iXD3zQ0494IUj4KIvmjG/yUE5MjBo1OVkNvuKTyOwuD4muOzMLfBQwmMMkpxiSaEBhZ7rv9++dHpvNPmZne2Z6un/7qZqqrq6uqv+3oH5TVd09usY/EiABEiABEnCJAEXFJZAshgRIgARIQNMoKvxXQAJuE2B5JBBgAhSVAHc+TScBEiABtwlQVNwmyvJIgARIIMAECiQqASZK00mABEggwAQoKgHufJpOAiRAAm4ToKi4TZTlkUCBCLBYEigHAhSVcugltpEESIAEyoQARaVMOorNJAESIIFyIFBeolIORNlGEiABEggwAYpKgDufppMACZCA2wQoKm4TZXkkUF4E2FoScJUARcVVnCyMBEiABIJNgKIS7P6n9SRAAiTgKgGKiqZprhJlYSRAAiQQYAIUlQB3Pk0nARIgAbcJUFTcJsrySIAENE0jhKASoKgEtedpNwmQAAkUgABFpQBQWSQJkAAJBJUARaVwPc+SSYAESCBwBCgqgetyGkwCJEAChSNAUSkcW5ZMAiTgNgGW53kCFBXPdxEbSAIkQALlQ4CiUj59xZaSAAmQgOcJUFQ830U9G+j+cV002lhXVVUzORKZLb4hHG6SY0l3vzaWSAIk4GcCFBU/924/tolgTI5GpzdEIqZumqt1XX/V1LTl4jWlFsuxpOP8DvhHkPfGukhk1qSqqtpTw+ETJ4XDR/RTPE+RAAkElABFJUAd3xiNjqqPRH6EmcjvRTBM01xhmw8xiSH+FPw9iDfDyzEOtc/iYwbyLsQ/lp+FdH1dSKnXK5R6pyES+RBlrUO4qiEafaA+HF54WmXlcchPRwJlRYCNdY8Axgn3CmNJ3iUgy1oGZiRK067ATOQYzTQ1SzhMc4mh1JS2RGJKayJxNvwcxGfAy7HqSqU+Zer6ERCV02HdQly3A6HthqGsWhxMRfrFSqkbU6HQNoiMCbH5fX00uqwxHD6jsabm08hDRwIkEAACFBWfdzJmJ2MwO1kBAVkOU6Pw4l6EGFxjCUcy2bQmHrdnJXJuP79+06ZdbR0dO9uSyd9AcG5CeIyWTh9jKnWeMs1bkfll+BT8/k6pY3B+LgTrWSOV2gmhebIxEqnbPxOPSIAE/EaAouK3Hu1hD2YYT2N2Mj2T/LBhGCdDHKbB35xJ6w4G8dm6ceOOtnj88ZZk8jsopxb+AKXUBBSxEOJ1C8LN8D3dWYamtUFc9sr+TG1t7UE9M/CYBEig/AlQVMq/D/u0IDNDGW9lwDIXBv+L1nR2tlvHLn+0xOOvoPybMPtZcOS4cWH8w6rHbOg2VPM2vNN9AkK38IDdu3dMDodvkU1/50nGSYAEypsA/u+XtwFsfe8EsJ9xbnaGYppNrVjm6j2n+6nNzc3pWCKxpjUenw+BGYNlsAbUcjv8bvhup9SnsIQ2H5v+nRC/n3cn8pMEfEUgkMZQVHza7cowFolpEJb2rnT6xxIvhW+GwGCZrA2zmG/vHTZsNITkO2jHW/C2OwBt/Dcsi/25IRpddHpNzUj7BEMSIIHyI0BRKb8+G7DFGKC/hqWnkzMZH5bN9ky8pMGGDRvex17MrbsrKsahfZdATN5wNOgwzTS/ty+Veg3LYr+oHT/+MMc5RkmABMqEAEWlTDpqkM28KZvfMOTurOxhsSO91dfe3t6FpbEHdnZ1hbG/IjcRtDnyjcVs5hsHVFS83hAO31VfXX2S4xyjJEACHidAUfF4B+XZvDGZ6zpbOjvXZ+KeCzZv3ryvLZl8FEtjjRCS89DArfC2OxyzmcuwjPdrefrfTmRIAiTgbQJlKSqTI5GVWOLZjg3e1YjP5nuqPv5HBiYr7CNskFv7Kvaxh0MDy2KPQ1zGYUlsDvwmR1vHhEzzzsnRqMxoHMmMkkBQCXjb7rITFfnWamrauZqmjcHg04j4csd7qrZDZF4VwUH4NpZP3kdc/BsYbO+ri0Turo9GlyG9ScqZXFV1pt/W7tGh9nLRKy3JpLx2RSunv5ZE4p60Uv+Bfm222434eCyTfau+puYzdhpDEiABbxLAGOTNhvXVKnn6G2LyOM477yDCoeXGYACqQUzCo7B8cjDi4sfhW/slMHYOwrlIX2y9+0rXn8Ha/e8gOKun+mDtHjO2sbDfei4F4RrYXpZO+hjLYctgg/NJ/2kqlWoqS4PYaBIIEAGMs+VnLb7NnoelkmMNpaYopWZoprlsQCsUpKj3TCNxprHLMDZhdvMRBOYDzG7a4ZfXh8PfwkAtItX7lV5LDYWOsZsE8XzfjpdjmBGWJWi78+FJa6lT0zQk05EACXiRQFmKig1SBp6WeLy5NZm8HCKj8DcD325l2eQvdp5saOJM9qD3CHIcCIH5JM5+Hn42yvuJruuynGZCZP7SEI0+gaWzxVhCu6q+sjKMPHQFJCD9i/64wVmF0vUFzmPGSYAEvEWgrEWlJ0oRmLZEYgYE5jAY9m0sc63L5lFK3sqbPcwjMgozorNRZhNmAUtVKJSA0IjYvIzwTsxwroXoTMqj3IJcYirli3drYVYqr+LPLoNBZKbLflhBoLFQEggyAZdsx9jrUkkeKyaWSNzeGo+fCoFRhqadCEH4BQYku5V/tSMuhBNRxuUo+3rUsRYCsxt+KwSmBUJzO+KXYlltCvIU3Mk3e7sSCN+Hdrzcw5CmyStesmZgP+xb2QNGSIAEPEXAt6LipLwmkdhi6PpPHGk3dQ0fPlzHngyEYCr8fMxAVkIYUo48+UaH48LjUWYDyrsa8XuxrPYSxEXuQluF8IeyfIZwWk1NjeRFFvcd6jzV/VJLUyK+IDwNe7KzFbRiJkSbm/YAQUcCXiMQCFHpCR0D1Bnr16//MBaPx7Af8xL8bZjVnL+zq2sEzl0BX4hNbrkLbSraciVmEUsRPj8ildqNWcxKzGhWQ2RuQngR0t1xSlW4U5A3SsFynmzaZxtjmqZ963Q2begRlkACJDBUAoERFYyw2VuQMagP6w2c9YR3InEn9mUOxSxjDvK8A9+rg/DswonefjcEybk7lCNvE27EFQtQ54MQF9mn+VtGbObJLyfiXE5ucjT6RUdGudnAcVje0czS3sO2FWA1HTO+S+xjhiRAAt4gEBhRceJWSt3nPO4lbsgG8XtdXXKL7jU4/w8zFwxqhyH9YCxzTcXS2TgJIVaLEC6Db8G5PfD5ukMyYnOHodSzltBEo89AaK6WgbSvhwBNw8gueaF9h+RbuVevU4Zxl7Nt4L3Yecw4CZBA6Qn0FJXSt6gILUgrtSWXamTmgo3+m7H3EkH+O+H3wjvd0RCUJ7AUM/HIE09saUkmb8RS2uXwjbhuxCcqKkbh2ilYuvkqBnkZAB/LCE6ns5Cc4qZ5JoTmdgyk96lU6o8QmnewXHZ7Qzh8MfYXrLvOTF3PzsZQpjOOw/J3ByqVBG/nu8zG8E6w8u9XWuAvArq/zOnbGsMw8l4qwd7LWxCJKzCgfxGi4BzUpMJPQjAefHfLlod6/hbIqvb2v+HaWFs8/mvMfK5HGRdmBCeMOL54GyeL6OD6ORCeG1HYS/A5CR7yHYHrrsYg+wDaJHedmWjftUi3HATI+dCglVbuHy8kk7s1w3jBaUdI0+RnjJ1JjJMACZSQQGBEBYPv/9qcKwxjmx0fTNiSTLZBFCZhEJdbWvdbEsMg/vV9qdRdjdHoqFzLlJ/2FdGB4NwD4VkEoZkKfyK8Em+Y5iko60so+zq0/zbUK8tqryGtd2eaY60TSmlK0+qwVLYN+yzNCK86LRI5yjpX5h+GrjvvAgMS82zPm8QGkkCACOhBsVU3zd/atqbluRX7II8QwnIv9lsOx8xABjTnUtZMzIj+hIHclTfqrkkmN0BcXmhLJG5ojcfno15ZVqtBmtpdUTHCmuUoNU1ERyn1fU3Xu18dbyJF09Jo33FYmrsQ4dKUpm3GUlkMy2YPSftOra4enYfpJb8EdsobjD9+Y4Jpyl11JW8XG0ACJNBNIDCiEksmN3abrMm3+PO1If7JfgtmLk+ldf0MFJW9K0lTahgG8h9gAP8e0gvm2tvb91iznHj8RRGdlnj8u2Y6/bSjwpCIDwSlAV/nr0K7lmKJTWY6GmZAV4ZSKXko8ymIzG11kchXEU6Dn3FadfU/O8rwXLSto2Mn7NlhNww2yV149iFDEiCBEhMokqiU2Eq7etO0hAXf4+UpeDt1SOHajo4/YvC+SA+FTsCS0+OZwkZjEF+EQfoPjeGwLGFlkgschEJJZw1YiotC+GTJ7oeY6TRBfBZLWxHWH/m5z30fgjMXbV6LcBiYyF1sM1OG8SYE8fdo+2NytxnCOXXV1ZFTa2qOcZZdyjja+q5dP/4Bc6Ziw2BIAh4ggP+THmhFsZqg689JVVhCORahq7bHXnttG/ZGzkOh9SjbXhIbbSi1HgPzb5BWcIfBdr87vjCTifdVaXNzcxqzt7fR5pVtyeSjEJoFEJ5zIDoVEMgLIIpPGppWiVnBN3TDeA4zGxGaLbDlUYjN9dYbnCE2hXwrQF9tx7Jf9iYE2FwD8bR/6bKvS5hOAiRQJAIYA4tUkweqgbG/RjM+gj+svrr6cwhdd7FEYk3X8OEyE3Iuf52Gwdisj0TmuV5hAQqMdXS8CoF5AEJzaWYf5zN6V9fB2Je6EmKzEQP5WMxwLoXYxEekUu83yNubI5GfIrwcdk5rHDOm14dL3Woqlry6b0jIFIj9okCKSsZ8BiTgKQIYZz3VnoI2Zp9hyBPw1oCnp9OTC1WZvAIG3/ivxSBcizqyd5phIL4Dg+5D2MMYh3TXXcg09yu3LhqVJ/VdqSe2efPfMbN5DmLTBNsugthM0isqDses4XTMZuRt0GOwjDYXlT1vjBy5C3Y+B39NXTg8seet1sgzJId6MIn6uIhPhELZPZaPUxkjARIoBYFAicq6ZPJdfMt9U0Dj27bMJiRaMI9B+GV8w6/HoPuAo5KZgL62IRqd6UhzJZrrQ52uVIZCYu3t72GJLQaRuRn+dCylVZoVFaMhnnMwo3kZWSZAdH66L5XaDoHpgP8f7NdcLMtVjZ///PE4n5czTdPqQ/tiI53+sx1nSAIkUFoCGN9K24Ah1Z7HxZg9vGJdptQkKyzwB77h/x++1cuDl19CVdvhxX0aQvNQfTS6TA7c8tgrym5gS5khTTtcwmL6tvb2P0FcHszMaM6H2FRVaFoVRGYRbE4jnG8Yxg8hBFshMn+GyDTVDWJGNTkc/gbKkFu5LbPw5aAZwubmTxlY5fKDBEggPwKBExUMSB0ZVCdMnTDhU5l4wQMMri9guWgCZkr/bVeGZZy5GFQ3Y9P7AjttKGFbR4cs7+20yzANY7wdL2X4UiLxB4jMMxDXmeBQhfAcwzRPwYzmSfTHYgi9vKVZ9pxWyDM0fbW1vrr6JOS/HuezYomZUDOO6UiABDxCIHCigm+2a2z2qb17G+x4MUJZEc086wAAEABJREFULmqLxy/DYHoa6ut+UFGpf8EM41F8a7/Tjb0HiNYqlG05xM+1Ih78kAc7MaOZBZFRhlJT0C/N4DIdS1srwELe1PzI5EjkQYhuk+1VOr0J+Y63zUG8OfXhh9YdfXYawyETYAEkMCQCgRMVfdQoebLeeoMwBiV5cHFIAPO5GIPp6q5USp5f+Znj+sv3dXU9O+SHDw0DY3N3qYjIizC7Dzz8Ka+1b0skZhgQF7T5fjRVZlsz0D8XYWay2OFxKuNMcwlmYtesfeONDzIpDEiABDxAIHCiEovFUljbfzHD/ivTp0/H1kPmqIjB+k2bduFb+r+jLfIese49AaVqU4axDsthkpZXa5SuX4cL7edVer5VGae860RcILgyezlCBAazlrshLA/2aPGvsHT2TSyhNa3p7Pxdj3M8JAESKDGBwImKxVupJ61Q0456Z+tW2UDPHHYHxfzE4Hivbhi1EBf77cejsRz2EywBPZJPO7B3Ictq8n4sufxA7FFcJpFy8yIwbcnkXMxgLob4Wi/YzIQXYOns5+VmD9tLAkEhEEhRea+r6yF0sHUXGL4NX4F4SV2ss/N1iMskiMkCNORDeHEzICwdp1VWHicHg/H4dm8t78k1sK8slsCkrfQkQALlTyCQoiIvg0TXvQRvYA3/jMZwuBLxkruWePwWXakvoyGy74NAi6ZCoW1YDhvU3WEoo1kuzvjZmZABCZSQAKsOCoFAiop0Lpac7kdo2Z9W6jrEPeFi8bg8TDhRmeYiu0GYwcj7tlbWVVUdaqf1FyrDkKU02ey2sjWEw9nnOqwEfpAACZBAgQhYg2qByvZ0sbLkhGUiaxMYs5XpGLD3e59UqRvfkkzeCGFpQNvekLagrefquv5sQ1VVlRz352PJ5NvYo/l4tqJU3hv//dXDcyRAAiTQk0BgRUVAYMBeKqH4UCi0UMIC+kEXDWFp2zd8eDUExZ5JTdR0fVVDNNrUOGbAlzY+76jwLOvBQUcCoyRAAiRQCAKBFpXWRCJuKvVLAYsN7emNVVUFeXOxlJ+vl5dTtiUSN2DmIW8Glh/hOgLxxcbIkUmIywl9lYuN/ychmvZdYJpKp2f0lZfpJEACJOAWgUCLCiCa2H+QvQu5W2qkoeu3TAuHRyDdcw4isb0lkThLU+oraJw813ICxGVLf/slEMpHkddy2Je50IrwgwT8RIC2eI5A0EVFk8EavWK/6uMsqIsn7gRDm3p1rfH4M7srKo7CyWvhNYjME/WRyM+mVlYeqfX4g21NdhKW0MbL24HtY4YkQAIkUAgCgRcVgWrqevcAjQNdqV8g8LRrb2/fg6W77+mmKZv2b2GZa9a+UGhdXbSX308xzSW2MZi5nGXHGZIACZBAIQhQVEC1raNjM77J/xhRcWMnR6PTJeJ1H0smN7YmEsdiaWsBlsK2Q2RWYzksOzuR9hum+ZSE4mHjfAnpSYAESKBQBCgqGbIhZT2rEpdDfKO/Q8Jy8dZDk6Z5LYRlCZbDFjdEImZ9NCq/4aKt6exsR3pS6/77ZH11dfa18d1J/CQBEiAB9wjo7hVV3iXF4vG/4pv88owVn8U+xepMvCyCls7O9em9e283lZoFO2LKNO+DuDxiNV4p65U0iB8KwfTEb6ygLXQk4FkCbFj+BCgqDnZtiYS8Fdd6aBD7FI0QlrKaschr4Nvi8fshLEswO1kC0+T9YdARswJxy0FsFlsRfpAACZBAAQhQVHpADYVC37WTICzzyk1YpO1r5FUvyWSTodQULIetV0p9E+l/gNBosKmxrqqqBsd0JEACJOA6AYpKD6Sx117bpgxDXuponcEgPA/LSPaymJVWLh8iLrphzICYyKzlKE3BGjReD4Xurh0//jBE+3Y8QwIkQAJ5EKCo9AIN+xPPtiYSMgL/MXN6tsxYGsPhz2aOyyaIJZNvy/MqEJIT0Oj34DWIzMkHVFS82vNOMescP0iABEhgCAQoKv3A03Vdlo3elixQmHlYTvpRr8+CSAYPe7njK20Ys9DEUfC2OxYzl8UN0ejW+mj3nWIa/0iABApJIBBlU1T66eZYR8cq3TRrkWUDvLjzsNF9WRkJiz45EpE2r0K7Za8ou2EfUmqB3CWGWcuncU7uFDOR9wqITHbpTwymJwESIIHBEKCoDEDLWj5KJE7BTEV+f0VDOB2D8Av49n/SAJeW8rSIyRUQid9COH4F4Qjv1xjTfH11PH5LWyIhG/kzcV72XDTk/RHid2EP6bdY7rueG/r7UeMBCZBADgQoKjlAkiwticQsCIr1jjCEB2Azf5PXnrxvqKw8GvskIgq7RCDge97l9QFsuWnEnj1RhJaTd4kN07RbDblTTNMeRqLMZr4AG6/F8t+rEKZXITArIDTnu7GnhPLpSIAEfEyAojKIzoWwnIlv8ta3ernMNM0VGHBL/pDk5KqqMzHoP6qFQts1pS5D20bC7+cgEvenTfMLrYnEwme3bdvrPPlCMrlb7hTDuYvgj87YeI/kEWHCtfLamscgPDtg7woR04kTJx4i5+lJgARIwEmAouKkkUNc7qRSSmV/mwQDrjwkuboxEvlqDpe7kUWvD4e/jhnJtyEkT8Obpq4/g4IvgA/BO52Ix2NpTauEIM5am0xavyLpzNBbXGyEuMwxKypGm0rJDO1xOx/snS5ieuBHHyXQhqa6aLTRPseQBEigFAS8VSdFJY/+aInHm1W3sOyUyzHQNhqa9lR9JLLC7UG2trb2IAjH+RjAlyLsgE+j7l9iRnIr6pbfVkHwDy6FlJWYZZwDcbhwbSKR/bEupOfs2trb/yRP6EOQzkul08djBnM3bLXLGoM2LNZNczXadC/ad3bOBTMjCZCAbwlQVPLsWhEWLAfNcAyyGuLTM4Pscgy0/5mPwDRGo6OmRCKXYpB+HGVsOWDPnj1o4mOaUlchjML3595VmnYD8p4EMTm/LZFw/qRwf9cNeG7dxo1vYgYz96NhwyZhP+nLEKxmx0WXos4n0N4366PR+R6/icHRbEZJgATcJkBRGQJR2YfAt/hKfIPP7rNkipuN8LaMwOzCDGYDNrxny91UEI0xIjYSF49B+Fz4S5BHNsO3G6a5GctV92KQPgdlnAA/kNuO+n+gGcZkCMk/oT3XYfN960AX5Xt+w4YN78vDoRCsGRDVKai7CUJmz17GKtO8BaKzqSEafbiI4pKvObyOBEjAZQIUFReA4ht8EwZ0JQMsinsL3ukOxaA7Ad/sl8vdVBCN7SI2EhePQXgl/H3II5vhY3DhZ+D7crKs9Qry34ryztC7ug5GvWNR/7zWzs5WXIRkfBbJiaii7iUQskosyV2Oau3neeSp/X+1xCUS2QUhbeTGPujQkUAACFBUXOxkGWAxyB9rGMZxEIkfQ2RkBrMvzyowYdFkxrEC11+jKzUFInIoyp/Qkkx+BzOF52ObN/8d5zzhsBy4DG07Bf+gztKU+rlD3Q6FkK7Gxv4OLOk11VdXe/n5Hk+wZCNIwBME8mwExoA8r+RlfRJY09n5O3x7vxIiIzOYA0VcIDL3w9vLRL1dK6+DeUryQkCqMUBXwI+D/xr8zbF4POYlEenNAEmLJRJPt8bj30xjYx/2vihpGX8IxGaxzF6w1HcHZi8yK8ucYkACJOAXAhSVIvSkiAtEZhZ8panr40U4xGPQnYMlsC9CRI6FcBwNf7bkhYBYv0BZhKYVrArZ2Ie902CTMjVtqbMi2D3PNM3FzjTGSYAE/EGAolLkfmzr6NgswiEeg+498n4xiEjPfZgit6qw1WGp7urMpv4yuyZD0961494N2TISIIHBEqCoDJYY8+dFQDb19x500ELMWs4Qv2/YsP/KqyBeRAIk4GkCFBVPd4+/Gie3I2PW8rx4ifvLOlpDAiQgBAYSFclDTwIkQAIkQAI5EaCo5ISJmUiABEiABHIhQFHJhRLzkICbBFgWCfiYAEXFx51L00iABEig2AQoKsUmzvpIgARIwMcESiQqPiZK00iABEggwAQoKgHufJpOAiRAAm4ToKi4TZTlkUCJCLBaEvACAYqKF3qBbSABEiABnxCgqPikI2kGCZAACXiBgL9ExQtE2QYSIAESCDABikqAO5+mkwAJkIDbBCgqbhNleSTgLwK0hgQGRYCiMihczEwCJEACJNAfAYpKf3R4jgRIgARIYFAEKCo54GIWEiABEiCB3AhQVHLjxFwkQAIkQAI5EKCo5ACJWUiABNwmwPL8SoCi4teepV0kQAIkUAICFJUSQGeVJEACJOBXAhSV0vUsayYBEiAB3xGgqPiuS2kQCZAACZSOAEWldOxZMwmQgNsEWF7JCVBUSt4FbAAJkAAJ+IcARcU/fUlLSIAESKDkBCgqJe8CtxvA8kiABEigdAQoKqVjz5pJgARIwHcEKCq+61IaRAIk4DYBlpc7AYpK7qyYkwRIgARIYAACFJUBAPE0CZAACZBA7gQoKrmzCnZOWk8CJEACORCgqOQAiVlIgARIgARyI0BRyY0Tc5EACZCA2wR8WR5FxZfdSqNIgARIoDQEKCql4c5aSYAESMCXBCgqvuzW8jGKLSUBEvAXAYqKv/qT1pAACZBASQlQVEqKn5WTAAmQgNsESlseRaW0/Fk7CZAACfiKAEXFV91JY0iABEigtAQoKqXlz9oLQ4ClkgAJlIgARaVE4FktCZAACfiRAEXFj71Km0iABEjAbQI5lkdRyREUs5EACZAACQxMgKIyMCPmIAESIAESyJEARSVHUMxGAppGBiRAAgMRoKgMRIjnSYAESIAEciZAUckZFTOSAAmQAAkMRGCwojJQeTxPAiRAAiQQYAIUlQB3Pk0nARIgAbcJUFTcJsrySGCwBJifBHxEgKLio86kKSRAAiRQagIUlVL3AOsnARIgAR8R8Iio+IgoTSEBEiCBABOgqAS482k6CZAACbhNgKLiNlGWRwIeIcBmkEApCFBUSkGddZIACZCATwlQVHzasTSLBEiABEpBwN+iUgqirJMESIAEAkyAohLgzqfpJEACJOA2AYqK20RZHgn4mwCtI4F+CVBU+sXDkyRAAiRAAoMhQFEZDC3mJQESIAES6JcARaVfPL2fZCoJkAAJkEDvBCgqvXNhKgmQAAmQQB4EKCp5QOMlJEACbhNgeX4hQFHxS0/SDhIgARLwAAGKigc6gU0gARIgAb8QoKh4pyfZEhIgARIoewIUlbLvQhpAAiRAAt4hQFHxTl+wJSRAAm4TYHlFJ0BRKTpyVkgCJEAC/iVAUfFv39IyEiABEig6AYpK0ZEXu0LWRwIkQALFI0BRKR5r1kQCJEACvidAUfF9F9NAEiABtwmwvL4JUFT6ZsMzJEACJEACgyRAURkkMGYnARIgARLomwBFpW82PNMfAZ4jARIggV4IUFR6gcIkEiABEiCB/AhQVPLjxqtIgARIwG0CviiPouKLbqQRJEACJOANAhQVb/QDW0ECJEACviBAUfFFN/rHCFpCAiRQ3gQoKlhgDm4AAAGzSURBVOXdf2w9CZAACXiKAEXFU93BxpAACZCA2wSKWx5Fpbi8WRsJkAAJ+JoARcXX3UvjSIAESKC4BCgqxeXN2kpDgLWSAAkUiQBFpUigWQ0JkAAJBIEARSUIvUwbSYAESMBtAn2UR1HpAwyTSYAESIAEBk+AojJ4ZryCBEiABEigDwIUlT7AMJkEBibAHCRAAj0JUFR6EuExCZAACZBA3gQoKnmj44UkQAIkQAI9CQxVVHqWx2MSIAESIIEAE6CoBLjzaToJkAAJuE2AouI2UZZHAkMlwOtJoIwJUFTKuPPYdBIgARLwGgGKitd6hO0hARIggTIm4FFRKWOibDoJkAAJBJgARSXAnU/TSYAESMBtAhQVt4myPBLwKAE2iwSKQYCiUgzKrIMESIAEAkKAohKQjqaZJEACJFAMAsESlWIQZR0kQAIkEGACFJUAdz5NJwESIAG3CVBU3CbK8kggWARoLQnsR4Cish8OHpAACZAACQyFAEVlKPR4LQmQAAmQwH4EKCr74cjvgFeRAAmQAAl0E6CodHPgJwmQAAmQgAsEKCouQGQRJEACbhNgeeVK4P8BAAD//xg3u8AAAAAGSURBVAMAtNyRLPpjqU8AAAAASUVORK5CYII=', '2026-04-22 09:45:46.953', '0.0.0.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-04-22 09:45:46.955');

-- --------------------------------------------------------

--
-- Table structure for table `social_links`
--

CREATE TABLE `social_links` (
  `id` int(11) NOT NULL,
  `platform` enum('LinkedIn','Instagram','Facebook','YouTube') NOT NULL,
  `url` varchar(191) DEFAULT NULL,
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `social_links`
--

INSERT INTO `social_links` (`id`, `platform`, `url`, `updated_at`) VALUES
(1, 'LinkedIn', 'https://www.linkedin.com/', '2026-04-23 05:06:22.512'),
(2, 'Instagram', 'https://www.instagram.com/', '2026-04-23 05:06:22.512'),
(3, 'Facebook', 'https://www.facebook.com/', '2026-04-23 05:06:22.512'),
(4, 'YouTube', 'https://www.youtube.com/', '2026-04-23 05:06:22.512');

-- --------------------------------------------------------

--
-- Table structure for table `time_entries`
--

CREATE TABLE `time_entries` (
  `id` int(11) NOT NULL,
  `matter_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `start_time` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `end_time` datetime(3) DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `is_running` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `time_entries`
--

INSERT INTO `time_entries` (`id`, `matter_id`, `user_id`, `start_time`, `end_time`, `duration_minutes`, `is_running`, `created_at`) VALUES
(1, 1, 2, '2026-04-21 12:51:52.037', '2026-04-21 12:52:01.102', 1, 0, '2026-04-21 12:51:52.039'),
(2, 1, 2, '2026-04-21 13:08:12.588', '2026-04-21 13:19:35.564', 11, 0, '2026-04-21 13:08:12.590'),
(3, 1, 2, '2026-04-22 06:54:34.151', '2026-04-22 06:55:44.226', 6, 0, '2026-04-22 06:54:34.153'),
(4, 1, 2, '2026-04-22 06:56:10.746', '2026-04-22 07:05:02.496', 12, 0, '2026-04-22 06:56:10.748'),
(5, 1, 2, '2026-04-22 07:05:18.812', '2026-04-22 07:05:21.689', 6, 0, '2026-04-22 07:05:18.813'),
(6, 1, 2, '2026-04-22 07:09:08.233', '2026-04-22 07:09:22.860', 6, 0, '2026-04-22 07:09:08.235'),
(7, 1, 2, '2026-04-22 07:21:51.039', '2026-04-22 07:21:58.797', 6, 0, '2026-04-22 07:21:51.041'),
(8, 1, 2, '2026-04-22 07:23:16.318', '2026-04-22 07:23:20.117', 6, 0, '2026-04-22 07:23:16.320'),
(9, 1, 2, '2026-04-22 07:25:50.480', '2026-04-22 07:25:55.863', 6, 0, '2026-04-22 07:25:50.483'),
(10, 1, 2, '2026-04-22 07:32:46.495', '2026-04-22 07:32:59.117', 6, 0, '2026-04-22 07:32:46.497'),
(11, 1, 2, '2026-04-22 07:36:07.623', '2026-04-22 07:36:10.335', 6, 0, '2026-04-22 07:36:07.626'),
(12, 1, 2, '2026-04-22 07:37:50.242', '2026-04-22 07:39:20.093', 6, 0, '2026-04-22 07:37:50.243'),
(13, 1, 2, '2026-04-22 08:46:01.381', '2026-04-22 08:46:04.112', 6, 0, '2026-04-22 08:46:01.384'),
(14, 1, 2, '2026-04-22 08:46:32.959', '2026-04-22 08:47:55.997', 6, 0, '2026-04-22 08:46:32.961'),
(15, 1, 2, '2026-04-22 08:57:54.262', '2026-04-22 09:00:29.338', 6, 0, '2026-04-22 08:57:54.264'),
(16, 1, 2, '2026-04-22 09:01:36.879', '2026-04-22 09:01:41.071', 6, 0, '2026-04-22 09:01:36.886'),
(17, 1, 2, '2026-04-22 09:03:00.296', '2026-04-22 09:03:15.074', 6, 0, '2026-04-22 09:03:00.297'),
(18, 1, 1, '2026-04-22 09:23:18.522', '2026-04-22 09:23:20.542', 6, 0, '2026-04-22 09:23:18.523'),
(19, 1, 2, '2026-04-22 09:40:45.422', '2026-04-22 09:46:48.899', 6, 0, '2026-04-22 09:40:45.424'),
(20, 1, 2, '2026-04-22 09:47:38.302', '2026-04-22 09:48:05.792', 6, 0, '2026-04-22 09:47:38.303'),
(21, 1, 2, '2026-04-22 10:04:01.614', '2026-04-22 10:04:03.088', 6, 0, '2026-04-22 10:04:01.616'),
(22, 1, 1, '2026-04-22 10:15:47.258', '2026-04-22 10:15:51.797', 6, 0, '2026-04-22 10:15:47.263'),
(23, 2, 1, '2026-04-22 10:16:47.910', '2026-04-22 10:17:22.704', 6, 0, '2026-04-22 10:16:47.911'),
(24, 1, 2, '2026-04-22 11:10:43.052', '2026-04-22 11:10:48.011', 6, 0, '2026-04-22 11:10:43.054'),
(25, 2, 2, '2026-04-22 11:21:01.764', '2026-04-22 11:21:41.286', 6, 0, '2026-04-22 11:21:01.766'),
(26, 2, 1, '2026-04-22 11:26:15.724', '2026-04-22 11:34:57.406', 12, 0, '2026-04-22 11:26:15.725'),
(27, 2, 1, '2026-04-22 11:37:14.453', '2026-04-22 11:40:22.155', 6, 0, '2026-04-22 11:37:14.465'),
(28, 2, 1, '2026-04-22 11:40:45.245', '2026-04-22 12:07:32.883', 30, 0, '2026-04-22 11:40:45.246'),
(29, 2, 1, '2026-04-22 12:07:33.562', '2026-04-22 12:16:01.516', 12, 0, '2026-04-22 12:07:33.563'),
(30, 2, 1, '2026-04-22 12:16:02.081', '2026-04-22 12:16:05.190', 6, 0, '2026-04-22 12:16:02.082'),
(31, 2, 1, '2026-04-22 12:25:22.835', '2026-04-22 12:25:33.639', 6, 0, '2026-04-22 12:25:22.837'),
(32, 2, 1, '2026-04-22 12:26:07.171', '2026-04-22 12:28:03.544', 6, 0, '2026-04-22 12:26:07.172'),
(33, 2, 1, '2026-04-22 12:29:12.363', '2026-04-22 12:29:15.479', 6, 0, '2026-04-22 12:29:12.364'),
(34, 2, 1, '2026-04-22 12:49:16.978', '2026-04-22 12:49:24.936', 6, 0, '2026-04-22 12:49:16.980'),
(35, 1, 1, '2026-04-22 12:49:28.364', '2026-04-22 12:49:52.293', 6, 0, '2026-04-22 12:49:28.367'),
(36, 2, 1, '2026-04-22 12:49:55.556', '2026-04-22 12:50:08.024', 6, 0, '2026-04-22 12:49:55.558'),
(37, 1, 1, '2026-04-22 12:51:44.665', '2026-04-22 12:52:09.614', 6, 0, '2026-04-22 12:51:44.666'),
(38, 1, 1, '2026-04-22 12:54:04.200', '2026-04-22 13:02:27.359', 12, 0, '2026-04-22 12:54:04.201'),
(39, 1, 1, '2026-04-22 13:02:44.210', '2026-04-22 13:03:49.331', 6, 0, '2026-04-22 13:02:44.212'),
(40, 1, 1, '2026-04-22 13:06:24.655', '2026-04-22 13:06:38.198', 6, 0, '2026-04-22 13:06:24.656'),
(41, 1, 1, '2026-04-22 13:07:08.459', '2026-04-22 13:33:45.168', 30, 0, '2026-04-22 13:07:08.460'),
(42, 1, 1, '2026-04-22 13:33:50.372', '2026-04-22 13:34:36.358', 6, 0, '2026-04-22 13:33:50.374'),
(43, 1, 1, '2026-04-22 13:37:15.935', '2026-04-22 13:37:45.622', 6, 0, '2026-04-22 13:37:15.940'),
(44, 2, 1, '2026-04-22 13:37:49.822', '2026-04-22 13:39:15.755', 6, 0, '2026-04-22 13:37:49.824'),
(45, 2, 1, '2026-04-22 13:40:08.155', '2026-04-23 05:21:43.611', 942, 0, '2026-04-22 13:40:08.157'),
(46, 2, 2, '2026-04-23 05:20:19.692', '2026-04-23 05:20:38.633', 6, 0, '2026-04-23 05:20:19.696'),
(47, 2, 1, '2026-04-23 05:22:58.143', '2026-04-23 05:27:33.150', 6, 0, '2026-04-23 05:22:58.147'),
(48, 2, 1, '2026-04-23 05:28:59.498', '2026-04-23 05:29:05.585', 6, 0, '2026-04-23 05:28:59.500'),
(49, 2, 1, '2026-04-23 05:32:19.951', '2026-04-23 05:32:51.702', 6, 0, '2026-04-23 05:32:19.955'),
(50, 2, 1, '2026-04-23 05:33:29.737', '2026-04-23 05:49:08.655', 18, 0, '2026-04-23 05:33:29.742'),
(51, 2, 1, '2026-04-23 05:50:13.984', '2026-04-23 05:50:31.474', 6, 0, '2026-04-23 05:50:13.987'),
(52, 2, 1, '2026-04-23 06:28:08.638', '2026-04-23 06:28:53.745', 6, 0, '2026-04-23 06:28:08.639'),
(53, 2, 1, '2026-04-23 06:37:46.127', '2026-04-23 06:39:52.366', 6, 0, '2026-04-23 06:37:46.128'),
(54, 3, 1, '2026-04-23 06:55:14.207', '2026-04-23 06:55:28.472', 6, 0, '2026-04-23 06:55:14.210'),
(55, 1, 2, '2026-04-23 07:33:43.546', '2026-04-23 07:33:53.390', 6, 0, '2026-04-23 07:33:43.547');

-- --------------------------------------------------------

--
-- Table structure for table `trust_accounts`
--

CREATE TABLE `trust_accounts` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `trust_accounts`
--

INSERT INTO `trust_accounts` (`id`, `client_id`, `balance`, `created_at`, `updated_at`) VALUES
(1, 1, 195.00, '2026-04-22 12:48:12.721', '2026-04-23 05:49:54.130');

-- --------------------------------------------------------

--
-- Table structure for table `trust_transactions`
--

CREATE TABLE `trust_transactions` (
  `id` int(11) NOT NULL,
  `trust_account_id` int(11) NOT NULL,
  `matter_id` int(11) DEFAULT NULL,
  `client_id` int(11) NOT NULL,
  `transaction_type` enum('deposit','applied_to_invoice','refund','adjustment') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `reference` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by_user_id` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `trust_transactions`
--

INSERT INTO `trust_transactions` (`id`, `trust_account_id`, `matter_id`, `client_id`, `transaction_type`, `amount`, `reference`, `notes`, `created_by_user_id`, `created_at`) VALUES
(1, 1, 2, 1, 'deposit', 500.00, '1234', 'cash', 1, '2026-04-22 12:48:12.737'),
(2, 1, 1, 1, 'applied_to_invoice', 500.00, 'Applied to Invoice INV-1776852260166', NULL, 1, '2026-04-22 12:48:58.369'),
(3, 1, 1, 1, 'deposit', 430.00, '1222222222223', '', 1, '2026-04-22 12:52:35.128'),
(4, 1, 1, 1, 'applied_to_invoice', 430.00, 'Applied to Invoice INV-2026-0002', NULL, 1, '2026-04-22 12:53:47.019'),
(5, 1, 1, 1, 'deposit', 500.00, '1212', '', 1, '2026-04-22 13:05:50.703'),
(6, 1, 1, 1, 'applied_to_invoice', 470.00, 'Applied to Invoice INV-2026-0002', NULL, 1, '2026-04-22 13:06:10.552'),
(7, 1, 2, 1, 'applied_to_invoice', 30.00, 'Applied to Invoice INV-2026-0004', NULL, 1, '2026-04-22 13:07:00.531'),
(8, 1, 1, 1, 'deposit', 100.00, '1234', '', 1, '2026-04-22 13:36:40.251'),
(9, 1, 2, 1, 'applied_to_invoice', 100.00, 'Applied to Invoice INV-2026-0004', NULL, 1, '2026-04-22 13:37:00.757'),
(10, 1, 2, 1, 'deposit', 1000.00, '122', '', 1, '2026-04-22 13:39:41.972'),
(11, 1, 2, 1, 'applied_to_invoice', 5.00, 'Applied to Invoice INV-2026-0005', NULL, 1, '2026-04-22 13:39:57.485'),
(12, 1, 2, 1, 'applied_to_invoice', 580.00, 'Applied to Invoice INV-2026-0006', NULL, 1, '2026-04-23 05:22:44.761'),
(13, 1, 2, 1, 'applied_to_invoice', 20.00, 'Applied to Invoice INV-2026-0007', NULL, 1, '2026-04-23 05:33:21.970'),
(14, 1, 2, 1, 'applied_to_invoice', 200.00, 'Applied to Invoice INV-2026-0006', NULL, 1, '2026-04-23 05:49:54.116');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(191) NOT NULL,
  `role` enum('admin','lawyer','client') NOT NULL DEFAULT 'client',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `must_reset_password` tinyint(1) NOT NULL DEFAULT 0,
  `last_login_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `role`, `is_active`, `created_at`, `updated_at`, `must_reset_password`, `last_login_at`) VALUES
(1, 'Victoria Admin', 'admin@vktori.com', '$2b$10$iWnL./eKfirquLAsDfw.nOU9IfINbXO5wL28kRgvjWGEqeuV5zEP.', 'admin', 1, '2026-04-21 12:47:06.172', '2026-04-23 07:49:14.098', 0, '2026-04-23 07:49:14.092'),
(2, 'Lawyer John', 'lawyer@vktori.com', '$2b$10$MNfAh1hyGS6PXPNdneZ8NOhT7UmImKKlEzFRYZthxgSrkiVnU0uri', 'lawyer', 1, '2026-04-21 12:47:06.267', '2026-04-23 07:33:40.386', 0, '2026-04-23 07:33:40.384'),
(3, 'Sarah mitchell', 'client@vktori.com', '$2b$10$OhKHkgOtbjUBx4NbtPEZ/.XMhWhU1VT9wuthHLyb2QIgDOqHZ9v2S', 'client', 1, '2026-04-21 12:47:06.355', '2026-04-23 06:43:17.248', 0, '2026-04-23 06:43:17.246'),
(4, 'johnnn don', 'don@gmail.com', '$2b$10$wsaGCBs3QMZwqT/fI6Ucq.6X77oxt05m0Rkp2jVH1S.hd5HJh1F3O', 'client', 1, '2026-04-22 10:19:05.616', '2026-04-22 10:19:59.363', 1, '2026-04-22 10:19:59.362');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activities_matter_id_fkey` (`matter_id`),
  ADD KEY `activities_actor_user_id_fkey` (`actor_user_id`);

--
-- Indexes for table `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `calendar_events_matter_id_fkey` (`matter_id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `clients_user_id_key` (`user_id`);

--
-- Indexes for table `communications`
--
ALTER TABLE `communications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `communications_matter_id_fkey` (`matter_id`),
  ADD KEY `communications_sender_user_id_fkey` (`sender_user_id`);

--
-- Indexes for table `conflict_checks`
--
ALTER TABLE `conflict_checks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conflict_checks_created_by_user_id_fkey` (`created_by_user_id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `documents_matter_id_fkey` (`matter_id`),
  ADD KEY `documents_uploaded_by_user_id_fkey` (`uploaded_by_user_id`),
  ADD KEY `documents_folder_id_fkey` (`folder_id`);

--
-- Indexes for table `drafts`
--
ALTER TABLE `drafts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `drafts_matter_id_fkey` (`matter_id`),
  ADD KEY `drafts_created_by_user_id_fkey` (`created_by_user_id`),
  ADD KEY `drafts_last_updated_by_user_id_fkey` (`last_updated_by_user_id`);

--
-- Indexes for table `folders`
--
ALTER TABLE `folders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `folders_matter_id_fkey` (`matter_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoices_invoice_number_key` (`invoice_number`),
  ADD KEY `invoices_matter_id_fkey` (`matter_id`),
  ADD KEY `invoices_created_by_user_id_fkey` (`created_by_user_id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_items_invoice_id_fkey` (`invoice_id`);

--
-- Indexes for table `lawyers`
--
ALTER TABLE `lawyers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lawyers_user_id_key` (`user_id`);

--
-- Indexes for table `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leads_created_by_user_id_fkey` (`created_by_user_id`),
  ADD KEY `leads_converted_client_id_fkey` (`converted_client_id`);

--
-- Indexes for table `matters`
--
ALTER TABLE `matters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `matters_matter_number_key` (`matter_number`),
  ADD KEY `matters_client_id_fkey` (`client_id`),
  ADD KEY `matters_assigned_lawyer_id_fkey` (`assigned_lawyer_id`),
  ADD KEY `matters_created_by_user_id_fkey` (`created_by_user_id`);

--
-- Indexes for table `matter_status_history`
--
ALTER TABLE `matter_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `matter_status_history_matter_id_fkey` (`matter_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_fkey` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_invoice_id_fkey` (`invoice_id`),
  ADD KEY `payments_matter_id_fkey` (`matter_id`),
  ADD KEY `payments_created_by_user_id_fkey` (`created_by_user_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_key` (`key`);

--
-- Indexes for table `signatures`
--
ALTER TABLE `signatures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `signatures_draft_id_fkey` (`draft_id`);

--
-- Indexes for table `social_links`
--
ALTER TABLE `social_links`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `social_links_platform_key` (`platform`);

--
-- Indexes for table `time_entries`
--
ALTER TABLE `time_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `time_entries_matter_id_fkey` (`matter_id`),
  ADD KEY `time_entries_user_id_fkey` (`user_id`);

--
-- Indexes for table `trust_accounts`
--
ALTER TABLE `trust_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `trust_accounts_client_id_key` (`client_id`);

--
-- Indexes for table `trust_transactions`
--
ALTER TABLE `trust_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trust_transactions_trust_account_id_fkey` (`trust_account_id`),
  ADD KEY `trust_transactions_matter_id_fkey` (`matter_id`),
  ADD KEY `trust_transactions_client_id_fkey` (`client_id`),
  ADD KEY `trust_transactions_created_by_user_id_fkey` (`created_by_user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `calendar_events`
--
ALTER TABLE `calendar_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `communications`
--
ALTER TABLE `communications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `conflict_checks`
--
ALTER TABLE `conflict_checks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `drafts`
--
ALTER TABLE `drafts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `folders`
--
ALTER TABLE `folders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `lawyers`
--
ALTER TABLE `lawyers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `leads`
--
ALTER TABLE `leads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `matters`
--
ALTER TABLE `matters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `matter_status_history`
--
ALTER TABLE `matter_status_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `signatures`
--
ALTER TABLE `signatures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `social_links`
--
ALTER TABLE `social_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `time_entries`
--
ALTER TABLE `time_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `trust_accounts`
--
ALTER TABLE `trust_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `trust_transactions`
--
ALTER TABLE `trust_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `activities_actor_user_id_fkey` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `activities_matter_id_fkey` FOREIGN KEY (`matter_id`) REFERENCES `matters` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD CONSTRAINT `calendar_events_matter_id_fkey` FOREIGN KEY (`matter_id`) REFERENCES `matters` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `clients_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `communications`
--
ALTER TABLE `communications`
  ADD CONSTRAINT `communications_matter_id_fkey` FOREIGN KEY (`matter_id`) REFERENCES `matters` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `communications_sender_user_id_fkey` FOREIGN KEY (`sender_user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `conflict_checks`
--
ALTER TABLE `conflict_checks`
  ADD CONSTRAINT `conflict_checks_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_folder_id_fkey` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `documents_matter_id_fkey` FOREIGN KEY (`matter_id`) REFERENCES `matters` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `documents_uploaded_by_user_id_fkey` FOREIGN KEY (`uploaded_by_user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `drafts`
--
ALTER TABLE `drafts`
  ADD CONSTRAINT `drafts_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `drafts_last_updated_by_user_id_fkey` FOREIGN KEY (`last_updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drafts_matter_id_fkey` FOREIGN KEY (`matter_id`) REFERENCES `matters` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `folders`
--
ALTER TABLE `folders`
  ADD CONSTRAINT `folders_matter_id_fkey` FOREIGN KEY (`matter_id`) REFERENCES `matters` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `invoices_matter_id_fkey` FOREIGN KEY (`matter_id`) REFERENCES `matters` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `lawyers`
--
ALTER TABLE `lawyers`
  ADD CONSTRAINT `lawyers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `leads`
--
ALTER TABLE `leads`
  ADD CONSTRAINT `leads_converted_client_id_fkey` FOREIGN KEY (`converted_client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `leads_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `matters`
--
ALTER TABLE `matters`
  ADD CONSTRAINT `matters_assigned_lawyer_id_fkey` FOREIGN KEY (`assigned_lawyer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `matters_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `matters_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `matter_status_history`
--
ALTER TABLE `matter_status_history`
  ADD CONSTRAINT `matter_status_history_matter_id_fkey` FOREIGN KEY (`matter_id`) REFERENCES `matters` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `payments_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payments_matter_id_fkey` FOREIGN KEY (`matter_id`) REFERENCES `matters` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `signatures`
--
ALTER TABLE `signatures`
  ADD CONSTRAINT `signatures_draft_id_fkey` FOREIGN KEY (`draft_id`) REFERENCES `drafts` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `time_entries`
--
ALTER TABLE `time_entries`
  ADD CONSTRAINT `time_entries_matter_id_fkey` FOREIGN KEY (`matter_id`) REFERENCES `matters` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `time_entries_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `trust_accounts`
--
ALTER TABLE `trust_accounts`
  ADD CONSTRAINT `trust_accounts_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `trust_transactions`
--
ALTER TABLE `trust_transactions`
  ADD CONSTRAINT `trust_transactions_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `trust_transactions_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `trust_transactions_matter_id_fkey` FOREIGN KEY (`matter_id`) REFERENCES `matters` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `trust_transactions_trust_account_id_fkey` FOREIGN KEY (`trust_account_id`) REFERENCES `trust_accounts` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
