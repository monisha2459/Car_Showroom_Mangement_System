package com.showroom.service;

import com.showroom.dto.UserRegisterRequest;
import com.showroom.entity.UserAccount;
import com.showroom.exception.BadRequestException;
import com.showroom.repository.UserAccountRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserAccountService {

    private final UserAccountRepository userRepo;

    public UserAccountService(UserAccountRepository userRepo) {
        this.userRepo = userRepo;
    }

    public Map<String, Object> register(UserRegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent())
            throw new BadRequestException("Email already registered");

        UserAccount user = new UserAccount();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());
        user.setPhone(req.getPhone());
        UserAccount saved = userRepo.save(user);

        return Map.of("message", "Registration successful",
                "userId", saved.getId(), "name", saved.getName(), "email", saved.getEmail());
    }

    public Map<String, Object> login(String email, String password) {
        UserAccount user = userRepo.findByEmailAndPassword(email, password)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));
        return Map.of("message", "Login successful",
                "userId", user.getId(), "name", user.getName(), "email", user.getEmail());
    }
}
