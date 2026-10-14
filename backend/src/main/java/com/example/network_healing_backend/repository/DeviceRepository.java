package com.example.network_healing_backend.repository;

import com.example.network_healing_backend.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {

    Optional<Device> findByDeviceCode(String deviceCode);

    List<Device> findByStatus(String status);

    List<Device> findByDeviceType(String deviceType);

    long countByStatus(String status);

    @Query("SELECT AVG(d.healthScore) FROM Device d")
    Double getAverageHealthScore();
}