package com.showroom.controller;

import com.showroom.dto.SalesRequest;
import com.showroom.dto.UserPurchaseRequest;
import com.showroom.entity.Sales;
import com.showroom.entity.UserAccount;
import com.showroom.exception.ResourceNotFoundException;
import com.showroom.repository.UserAccountRepository;
import com.showroom.service.SalesService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/purchase")
public class UserPurchaseController {

    private final SalesService salesService;
    private final UserAccountRepository userRepo;

    public UserPurchaseController(SalesService salesService, UserAccountRepository userRepo) {
        this.salesService = salesService;
        this.userRepo = userRepo;
    }

    @PostMapping
    public ResponseEntity<Sales> purchase(@Valid @RequestBody UserPurchaseRequest req) {
        // Find user and auto-create customer record if needed
        UserAccount user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SalesRequest salesRequest = new SalesRequest();
        salesRequest.setCarId(req.getCarId());
        salesRequest.setSalePrice(req.getSalePrice());
        salesRequest.setPaymentMethod(req.getPaymentMethod());

        // Use existing customer linked to user email, or create new one
        salesRequest.setCustomerId(getOrCreateCustomerId(user));

        Sales sale = salesService.createSale(salesRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(sale);
    }

    private Long getOrCreateCustomerId(UserAccount user) {
        // Check if customer exists with same email
        com.showroom.repository.CustomerRepository customerRepo =
            salesService.getCustomerRepository();
        return customerRepo.findAll().stream()
            .filter(c -> user.getEmail().equals(c.getEmail()))
            .findFirst()
            .map(c -> c.getId())
            .orElseGet(() -> {
                com.showroom.entity.Customer c = new com.showroom.entity.Customer();
                c.setName(user.getName());
                c.setEmail(user.getEmail());
                c.setPhone(user.getPhone());
                return customerRepo.save(c).getId();
            });
    }
}
