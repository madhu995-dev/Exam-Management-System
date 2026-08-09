package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.Room;
import com.exam.exam_management_system.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    Optional<Seat> findByRoomAndSeatNumber(Room room, String seatNumber);

    boolean existsByRoomAndSeatNumber(Room room, String seatNumber);

    List<Seat> findByRoomId(Long roomId);

}