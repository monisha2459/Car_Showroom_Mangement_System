package com.showroom.repository;

import com.showroom.entity.TestDriveBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestDriveBookingRepository extends JpaRepository<TestDriveBooking, Long> {
    List<TestDriveBooking> findByUserId(Long userId);
    List<TestDriveBooking> findAllByOrderByBookingDateDesc();
}
