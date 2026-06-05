package com.showroom.repository;

import com.showroom.entity.Sales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface SalesRepository extends JpaRepository<Sales, Long> {
    List<Sales> findByCustomerId(Long customerId);
    List<Sales> findBySaleDateBetween(LocalDate from, LocalDate to);

    @Query("SELECT SUM(s.salePrice) FROM Sales s")
    Double getTotalRevenue();
}
