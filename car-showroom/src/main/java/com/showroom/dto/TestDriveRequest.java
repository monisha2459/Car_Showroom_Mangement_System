package com.showroom.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class TestDriveRequest {
    @NotNull private Long carId;
    @NotNull private Long userId;
    @NotNull private LocalDate bookingDate;
    private String message;

    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
