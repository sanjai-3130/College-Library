/**
 * SPDX-License-Identifier: Apache-2.0
 */
package com.athena.library.controller;

import com.athena.library.model.*;
import com.athena.library.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LibraryController {

    private final LibraryService libraryService;

    @Autowired
    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    // --- AUTHENTICATION ---

    @PostMapping("/auth/login")
    public ResponseEntity<User> login(@RequestBody Map<String, String> request) {
        String studentId = request.get("studentId");
        String role = request.getOrDefault("role", "student");
        if (studentId == null || studentId.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        User user = libraryService.login(studentId, role);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/auth/qr")
    public ResponseEntity<?> loginWithQR(@RequestBody Map<String, String> request) {
        String qrData = request.get("qrData");
        try {
            User user = libraryService.loginWithQR(qrData);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // --- BOOKS CATALOG ---

    @GetMapping("/books")
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(libraryService.getAllBooks());
    }

    @PostMapping("/books")
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        Book saved = libraryService.addBook(book);
        return ResponseEntity.ok(saved);
    }

    // --- LOAN CHECKOUTS ---

    @GetMapping("/checkouts")
    public ResponseEntity<List<Checkout>> getAllCheckouts() {
        return ResponseEntity.ok(libraryService.getAllCheckouts());
    }

    @GetMapping("/checkouts/student/{studentId}")
    public ResponseEntity<List<Checkout>> getStudentCheckouts(@PathVariable String studentId) {
        return ResponseEntity.ok(libraryService.getCheckoutsByStudent(studentId));
    }

    @PostMapping("/checkouts/issue")
    public ResponseEntity<?> issueBook(@RequestBody Map<String, String> request) {
        String bookId = request.get("bookId");
        String studentId = request.get("studentId");
        try {
            Checkout checkout = libraryService.issueBook(bookId, studentId);
            return ResponseEntity.ok(checkout);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/checkouts/return/{checkoutId}")
    public ResponseEntity<?> returnBook(@PathVariable String checkoutId) {
        try {
            Checkout checkout = libraryService.returnBook(checkoutId);
            return ResponseEntity.ok(checkout);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/checkouts/renew/{checkoutId}")
    public ResponseEntity<?> renewBook(@PathVariable String checkoutId) {
        try {
            Checkout checkout = libraryService.renewBook(checkoutId);
            return ResponseEntity.ok(checkout);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/checkouts/pay-fine/{checkoutId}")
    public ResponseEntity<?> payFine(@PathVariable String checkoutId) {
        try {
            Checkout checkout = libraryService.payFine(checkoutId);
            return ResponseEntity.ok(checkout);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // --- NOTIFICATIONS ---

    @GetMapping("/notifications")
    public ResponseEntity<List<LibraryNotification>> getNotifications() {
        return ResponseEntity.ok(libraryService.getAllNotifications());
    }

    @PostMapping("/notifications/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable String id) {
        boolean updated = libraryService.markNotificationRead(id);
        if (updated) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/notifications/all")
    public ResponseEntity<?> clearNotifications() {
        libraryService.clearAllNotifications();
        return ResponseEntity.ok().build();
    }

    // --- STATISTICS ANALYTICS ---

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(libraryService.getLibraryStats());
    }
}
