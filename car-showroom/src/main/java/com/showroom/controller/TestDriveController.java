package com.showroom.controller;

import com.showroom.dto.TestDriveRequest;
import com.showroom.entity.TestDriveBooking;
import com.showroom.service.TestDriveService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/testdrive")
public class TestDriveController {

    private final TestDriveService testDriveService;

    public TestDriveController(TestDriveService testDriveService) {
        this.testDriveService = testDriveService;
    }

    @PostMapping
    public ResponseEntity<TestDriveBooking> book(@Valid @RequestBody TestDriveRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(testDriveService.book(req));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TestDriveBooking>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(testDriveService.getByUser(userId));
    }

    @GetMapping
    public ResponseEntity<List<TestDriveBooking>> getAll() {
        return ResponseEntity.ok(testDriveService.getAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TestDriveBooking> updateStatus(@PathVariable Long id,
                                                          @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(testDriveService.updateStatus(id, body.get("status")));
    }
}
