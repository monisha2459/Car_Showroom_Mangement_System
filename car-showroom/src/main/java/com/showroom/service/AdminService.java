package com.showroom.service;

import com.showroom.dto.LoginRequest;
import com.showroom.entity.Admin;
import com.showroom.exception.BadRequestException;
import com.showroom.repository.AdminRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public Map<String, Object> login(LoginRequest request) {
        Admin admin = adminRepository
                .findByUsernameAndPassword(request.getUsername(), request.getPassword())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        return Map.of(
                "message", "Login successful",
                "adminId", admin.getId(),
                "fullName", admin.getFullName(),
                "username", admin.getUsername()
        );
    }

    public void changePassword(String username, String oldPassword, String newPassword) {
        Admin admin = adminRepository.findByUsernameAndPassword(username, oldPassword)
                .orElseThrow(() -> new BadRequestException("Current password is incorrect"));
        if (newPassword == null || newPassword.length() < 4)
            throw new BadRequestException("New password must be at least 4 characters");
        admin.setPassword(newPassword);
        adminRepository.save(admin);
    }
}
