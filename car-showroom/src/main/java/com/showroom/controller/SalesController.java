package com.showroom.controller;

import com.showroom.dto.SalesRequest;
import com.showroom.entity.Sales;
import com.showroom.service.SalesService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SalesController {

    private final SalesService salesService;

    public SalesController(SalesService salesService) {
        this.salesService = salesService;
    }

    @GetMapping
    public ResponseEntity<List<Sales>> getAllSales(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        if (from != null && to != null) {
            return ResponseEntity.ok(salesService.getSalesByDateRange(LocalDate.parse(from), LocalDate.parse(to)));
        }
        return ResponseEntity.ok(salesService.getAllSales());
    }

    @PostMapping
    public ResponseEntity<Sales> createSale(@Valid @RequestBody SalesRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(salesService.createSale(request));
    }
}
