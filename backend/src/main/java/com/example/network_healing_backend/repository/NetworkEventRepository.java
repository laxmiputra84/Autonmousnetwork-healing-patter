package com.example.network_healing_backend.repository;

import com.example.network_healing_backend.entity.NetworkEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NetworkEventRepository extends JpaRepository<NetworkEvent, Long> {

    List<NetworkEvent> findByDeviceIdOrderByTimestampDesc(Long deviceId);

    List<NetworkEvent> findAllByOrderByTimestampDesc();

    List<NetworkEvent> findTop20ByOrderByTimestampDesc();
}
