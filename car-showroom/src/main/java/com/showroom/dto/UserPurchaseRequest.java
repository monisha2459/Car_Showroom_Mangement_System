package com.showroom.dto;

import jakarta.validation.constraints.NotNull;

public class UserPurchaseRequest {
    @NotNull private Long carId;
    @NotNull private Long userId;
    @NotNull private Double salePrice;
    private String paymentMethod;

    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Double getSalePrice() { return salePrice; }
    public void setSalePrice(Double salePrice) { this.salePrice = salePrice; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
