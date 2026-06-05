package com.showroom.dto;

public class DashboardStats {
    private long totalCars;
    private long availableCars;
    private long soldCars;
    private long totalCustomers;
    private long totalSales;
    private double totalRevenue;

    public DashboardStats(long totalCars, long availableCars, long soldCars,
                          long totalCustomers, long totalSales, double totalRevenue) {
        this.totalCars = totalCars;
        this.availableCars = availableCars;
        this.soldCars = soldCars;
        this.totalCustomers = totalCustomers;
        this.totalSales = totalSales;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalCars() { return totalCars; }
    public long getAvailableCars() { return availableCars; }
    public long getSoldCars() { return soldCars; }
    public long getTotalCustomers() { return totalCustomers; }
    public long getTotalSales() { return totalSales; }
    public double getTotalRevenue() { return totalRevenue; }
}
