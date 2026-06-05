package com.showroom.service;

import com.showroom.entity.Car;
import com.showroom.exception.ResourceNotFoundException;
import com.showroom.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {

    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));
    }

    public Car addCar(Car car) {
        car.setStatus("Available");
        return carRepository.save(car);
    }

    public Car updateCar(Long id, Car updatedCar) {
        Car existing = getCarById(id);
        existing.setMake(updatedCar.getMake());
        existing.setModel(updatedCar.getModel());
        existing.setYear(updatedCar.getYear());
        existing.setColor(updatedCar.getColor());
        existing.setPrice(updatedCar.getPrice());
        existing.setFuelType(updatedCar.getFuelType());
        existing.setTransmission(updatedCar.getTransmission());
        existing.setMileage(updatedCar.getMileage());
        if (updatedCar.getStatus() != null) existing.setStatus(updatedCar.getStatus());
        return carRepository.save(existing);
    }

    public void deleteCar(Long id) {
        Car car = getCarById(id);
        carRepository.delete(car);
    }

    public List<Car> searchCars(String keyword) {
        return carRepository.findByMakeContainingIgnoreCaseOrModelContainingIgnoreCase(keyword, keyword);
    }

    public List<Car> getCarsByStatus(String status) {
        return carRepository.findByStatus(status);
    }
}
