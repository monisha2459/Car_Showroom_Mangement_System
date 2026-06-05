package com.showroom.service;

import com.showroom.dto.SalesRequest;
import com.showroom.entity.Car;
import com.showroom.entity.Customer;
import com.showroom.entity.Sales;
import com.showroom.exception.BadRequestException;
import com.showroom.exception.ResourceNotFoundException;
import com.showroom.repository.CarRepository;
import com.showroom.repository.CustomerRepository;
import com.showroom.repository.SalesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
@Service
public class SalesService {

    private final SalesRepository salesRepository;
    private final CarRepository carRepository;
    private final CustomerRepository customerRepository;

    public SalesService(SalesRepository salesRepository, CarRepository carRepository,
                        CustomerRepository customerRepository) {
        this.salesRepository = salesRepository;
        this.carRepository = carRepository;
        this.customerRepository = customerRepository;
    }

    public List<Sales> getAllSales() {
        return salesRepository.findAll();
    }

    @Transactional
    public Sales createSale(SalesRequest request) {
        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + request.getCarId()));

        if ("Sold".equals(car.getStatus())) {
            throw new BadRequestException("Car is already sold");
        }

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));

        // Mark car as sold
        car.setStatus("Sold");
        carRepository.save(car);

        Sales sale = new Sales();
        sale.setCar(car);
        sale.setCustomer(customer);
        sale.setSalePrice(request.getSalePrice());
        sale.setSaleDate(LocalDate.now());
        sale.setPaymentMethod(request.getPaymentMethod());

        return salesRepository.save(sale);
    }

    public double getTotalRevenue() {
        Double revenue = salesRepository.getTotalRevenue();
        return revenue != null ? revenue : 0.0;
    }

    public List<Sales> getSalesByDateRange(LocalDate from, LocalDate to) {
        return salesRepository.findBySaleDateBetween(from, to);
    }

    public com.showroom.repository.CustomerRepository getCustomerRepository() {
        return customerRepository;
    }
}
