package com.showroom.service;

import com.showroom.dto.DashboardStats;
import com.showroom.repository.CarRepository;
import com.showroom.repository.CustomerRepository;
import com.showroom.repository.SalesRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final CarRepository carRepository;
    private final CustomerRepository customerRepository;
    private final SalesRepository salesRepository;

    public DashboardService(CarRepository carRepository, CustomerRepository customerRepository,
                            SalesRepository salesRepository) {
        this.carRepository = carRepository;
        this.customerRepository = customerRepository;
        this.salesRepository = salesRepository;
    }

    public DashboardStats getStats() {
        long totalCars = carRepository.count();
        long availableCars = carRepository.findByStatus("Available").size();
        long soldCars = carRepository.findByStatus("Sold").size();
        long totalCustomers = customerRepository.count();
        long totalSales = salesRepository.count();
        Double revenue = salesRepository.getTotalRevenue();
        double totalRevenue = revenue != null ? revenue : 0.0;

        return new DashboardStats(totalCars, availableCars, soldCars, totalCustomers, totalSales, totalRevenue);
    }
}
