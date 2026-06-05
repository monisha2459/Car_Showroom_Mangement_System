package com.showroom.repository;

import com.showroom.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByStatus(String status);
    List<Car> findByMakeContainingIgnoreCaseOrModelContainingIgnoreCase(String make, String model);
}
