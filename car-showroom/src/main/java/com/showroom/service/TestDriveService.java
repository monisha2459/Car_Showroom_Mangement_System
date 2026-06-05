package com.showroom.service;

import com.showroom.dto.TestDriveRequest;
import com.showroom.entity.Car;
import com.showroom.entity.TestDriveBooking;
import com.showroom.entity.UserAccount;
import com.showroom.exception.BadRequestException;
import com.showroom.exception.ResourceNotFoundException;
import com.showroom.repository.CarRepository;
import com.showroom.repository.TestDriveBookingRepository;
import com.showroom.repository.UserAccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestDriveService {

    private final TestDriveBookingRepository bookingRepo;
    private final CarRepository carRepo;
    private final UserAccountRepository userRepo;

    public TestDriveService(TestDriveBookingRepository bookingRepo,
                            CarRepository carRepo, UserAccountRepository userRepo) {
        this.bookingRepo = bookingRepo;
        this.carRepo = carRepo;
        this.userRepo = userRepo;
    }

    public TestDriveBooking book(TestDriveRequest req) {
        Car car = carRepo.findById(req.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));
        if ("Sold".equals(car.getStatus()))
            throw new BadRequestException("This car is already sold");

        UserAccount user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TestDriveBooking booking = new TestDriveBooking();
        booking.setCar(car);
        booking.setUser(user);
        booking.setBookingDate(req.getBookingDate());
        booking.setMessage(req.getMessage());
        booking.setStatus("Pending");
        return bookingRepo.save(booking);
    }

    public List<TestDriveBooking> getByUser(Long userId) {
        return bookingRepo.findByUserId(userId);
    }

    public List<TestDriveBooking> getAll() {
        return bookingRepo.findAllByOrderByBookingDateDesc();
    }

    public TestDriveBooking updateStatus(Long id, String status) {
        TestDriveBooking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(status);
        return bookingRepo.save(booking);
    }
}
