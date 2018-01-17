-- phpMyAdmin SQL Dump
-- version 4.7.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8887
-- Generation Time: Jan 17, 2018 at 07:50 AM
-- Server version: 5.6.35
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `biodata`
--

-- --------------------------------------------------------

--
-- Table structure for table `biodata_karyawan`
--

CREATE TABLE `biodata_karyawan` (
  `id` int(11) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `jenis_kelamin` varchar(50) NOT NULL,
  `alamat` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `biodata_karyawan`
--

INSERT INTO `biodata_karyawan` (`id`, `nama`, `jenis_kelamin`, `alamat`) VALUES
(1, 'Adit', 'Laki-laki', 'Bandung'),
(6, 'Amin', 'Laki-laki', 'Tangerang'),
(7, 'Felix', 'Laki-laki', 'Jakarta');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `biodata_karyawan`
--
ALTER TABLE `biodata_karyawan`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `biodata_karyawan`
--
ALTER TABLE `biodata_karyawan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;