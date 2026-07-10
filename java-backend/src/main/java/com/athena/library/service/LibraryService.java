/**
 * SPDX-License-Identifier: Apache-2.0
 */

package com.athena.library.service;

import com.athena.library.model.*;
import com.athena.library.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class LibraryService {

    private final BookRepository bookRepository;
    private final CheckoutRepository checkoutRepository;
    private final UserRepository userRepository;
    private final LibraryNotificationRepository notificationRepository;

    @Autowired
    public LibraryService(BookRepository bookRepository,
                          CheckoutRepository checkoutRepository,
                          UserRepository userRepository,
                          LibraryNotificationRepository notificationRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    /**
     * Authenticate and retrieve user profile.
     */
    public User login(String studentId, String role) {
        String formattedId = studentId.trim().toUpperCase();
        Optional<User> existingUser = userRepository.findByStudentIdIgnoreCase(formattedId);

        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        // Simulate creation of default profiles for demo
        String name = "Alex Mercer";
        String department = "Computer Science & Engineering";
        String semester = "6th Semester";
        String avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";

        if ("admin".equalsIgnoreCase(role)) {
            name = "Dr. Elizabeth Vance";
            department = "Library Administration";
            semester = "Staff Coordinator";
            avatarUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80";
        } else {
            if (formattedId.contains("MECH") || formattedId.contains("1002")) {
                name = "Rohan Sharma";
                department = "Mechanical Engineering";
                semester = "4th Semester";
                avatarUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80";
            } else if (formattedId.contains("ECE") || formattedId.contains("1003")) {
                name = "Priya Patel";
                department = "Electronics & Communication";
                semester = "8th Semester";
                avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80";
            }
        }

        String qrCodeJson = String.format(
                "{\"studentId\":\"STU-%s\",\"regNo\":\"%s\",\"name\":\"%s\",\"dept\":\"%s\",\"year\":\"%s\",\"timestamp\":%d}",
                formattedId, formattedId, name, department,
                "4th Semester".equals(semester) ? "2nd Year" : "8th Semester".equals(semester) ? "4th Year" : "3rd Year",
                System.currentTimeMillis()
        );

        User newUser = User.builder()
                .id("U" + (userRepository.count() + 101))
                .studentId(formattedId)
                .name(name)
                .email(formattedId.toLowerCase() + "@athenastate.edu")
                .department(department)
                .semester(semester)
                .avatarUrl(avatarUrl)
                .role(role != null ? role.toLowerCase() : "student")
                .qrCodeData(qrCodeJson)
                .cardIssueDate(LocalDate.now().toString())
                .build();

        return userRepository.save(newUser);
    }

    /**
     * Handle login via Digital Student Card QR Scans.
     */
    public User loginWithQR(String qrData) {
        if (qrData == null || qrData.isEmpty()) {
            throw new IllegalArgumentException("Scanned QR code data cannot be blank");
        }

        boolean isAdmin = qrData.contains("ADMIN") || qrData.contains("STAFF");
        String[] parts = qrData.split("-");
        String studentId = parts[parts.length - 1];

        User user = login(studentId, isAdmin ? "admin" : "student");

        // Log authentication notification
        createNotification(
                "Login Successful",
                "Successfully authenticated via Digital Student Card QR Code. Welcome back, " + user.getName() + "!",
                "success"
        );

        return user;
    }

    /**
     * Add new book to the database catalog.
     */
    @Transactional
    public Book addBook(Book book) {
        if (book.getId() == null || book.getId().isEmpty()) {
            book.setId("B00" + (bookRepository.count() + 1));
        }
        Book savedBook = bookRepository.save(book);

        createNotification(
                "New Book Cataloged",
                String.format("\"%s\" by %s has been added to the %s section.", savedBook.getTitle(), savedBook.getAuthor(), savedBook.getCategory()),
                "success"
        );

        return savedBook;
    }

    /**
     * Issue a book to a student.
     */
    @Transactional
    public Checkout issueBook(String bookId, String studentId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found in library catalog."));

        if ("ebook".equalsIgnoreCase(book.getType())) {
            throw new IllegalArgumentException("E-Books can be read instantly online and do not require physical checkouts.");
        }

        if (book.getCopiesAvailable() == null || book.getCopiesAvailable() <= 0) {
            throw new IllegalStateException("All physical copies of this book are currently checked out.");
        }

        // Deduct 1 available copy
        book.setCopiesAvailable(book.getCopiesAvailable() - 1);
        bookRepository.save(book);

        LocalDate issueDate = LocalDate.now();
        LocalDate dueDate = issueDate.plusDays(14); // Standard 14-day loan

        Checkout checkout = Checkout.builder()
                .id("C00" + (checkoutRepository.count() + 1))
                .studentId(studentId.toUpperCase())
                .bookId(book.getId())
                .bookTitle(book.getTitle())
                .bookAuthor(book.getAuthor())
                .coverUrl(book.getCoverUrl())
                .issueDate(issueDate.toString())
                .dueDate(dueDate.toString())
                .status("active")
                .fineAmount(0.0)
                .progress(0)
                .build();

        Checkout savedCheckout = checkoutRepository.save(checkout);

        createNotification(
                "Book Issued Successfully",
                String.format("\"%s\" has been issued to student %s. Due date: %s.", book.getTitle(), studentId.toUpperCase(), dueDate),
                "success"
        );

        return savedCheckout;
    }

    /**
     * Return a checked-out book.
     */
    @Transactional
    public Checkout returnBook(String checkoutId) {
        Checkout checkout = checkoutRepository.findById(checkoutId)
                .orElseThrow(() -> new IllegalArgumentException("Checkout record not found."));

        if ("returned".equalsIgnoreCase(checkout.getStatus())) {
            throw new IllegalStateException("This book has already been returned.");
        }

        checkout.setStatus("returned");
        checkout.setReturnedDate(LocalDate.now().toString());
        checkout.setProgress(100);
        Checkout savedCheckout = checkoutRepository.save(checkout);

        // Put copy back on library shelf
        bookRepository.findById(checkout.getBookId()).ifPresent(book -> {
            book.setCopiesAvailable((book.getCopiesAvailable() != null ? book.getCopiesAvailable() : 0) + 1);
            bookRepository.save(book);
        });

        createNotification(
                "Book Returned",
                String.format("\"%s\" has been returned on time. Thank you!", checkout.getBookTitle()),
                "info"
        );

        return savedCheckout;
    }

    /**
     * Renew checkout loan duration.
     */
    @Transactional
    public Checkout renewBook(String checkoutId) {
        Checkout checkout = checkoutRepository.findById(checkoutId)
                .orElseThrow(() -> new IllegalArgumentException("Checkout record not found."));

        if ("returned".equalsIgnoreCase(checkout.getStatus())) {
            throw new IllegalStateException("Cannot renew a book that has already been returned.");
        }

        if ("overdue".equalsIgnoreCase(checkout.getStatus())) {
            throw new IllegalStateException("Cannot renew an overdue book. Please clear outstanding fines first.");
        }

        // Extend due date by 7 days
        LocalDate currentDue = LocalDate.parse(checkout.getDueDate());
        LocalDate newDue = currentDue.plusDays(7);

        checkout.setDueDate(newDue.toString());
        checkout.setStatus("renewed");
        Checkout savedCheckout = checkoutRepository.save(checkout);

        createNotification(
                "Due Date Extended",
                String.format("The loan period for \"%s\" has been extended to %s.", checkout.getBookTitle(), newDue),
                "success"
        );

        return savedCheckout;
    }

    /**
     * Pay fine outstanding on a loan.
     */
    @Transactional
    public Checkout payFine(String checkoutId) {
        Checkout checkout = checkoutRepository.findById(checkoutId)
                .orElseThrow(() -> new IllegalArgumentException("Checkout record not found."));

        double finePaid = checkout.getFineAmount();
        if (finePaid <= 0.0) {
            throw new IllegalArgumentException("No pending fines for this book.");
        }

        checkout.setFineAmount(0.0);
        if ("overdue".equalsIgnoreCase(checkout.getStatus())) {
            checkout.setStatus("active"); // Revert to active loan once fine is cleared
        }
        Checkout savedCheckout = checkoutRepository.save(checkout);

        createNotification(
                "Fine Paid Successfully",
                String.format("Fines of ₹%.2f for \"%s\" have been fully settled.", finePaid, checkout.getBookTitle()),
                "success"
        );

        return savedCheckout;
    }

    /**
     * Helper to create a new live notification.
     */
    public LibraryNotification createNotification(String title, String message, String type) {
        LibraryNotification notif = LibraryNotification.builder()
                .id("N_GEN_" + System.currentTimeMillis())
                .title(title)
                .message(message)
                .date(LocalDate.now().toString())
                .type(type)
                .read(false)
                .build();
        return notificationRepository.save(notif);
    }

    /**
     * Compile statistical summary of library inventory and loans.
     */
    public Map<String, Object> getLibraryStats() {
        long totalBooks = bookRepository.count();
        long physicalBooks = bookRepository.findAll().stream().filter(b -> "physical".equalsIgnoreCase(b.getType())).count();
        long ebooks = totalBooks - physicalBooks;

        List<Checkout> activeLoans = checkoutRepository.findByStatus("active");
        List<Checkout> renewedLoans = checkoutRepository.findByStatus("renewed");
        long totalActive = activeLoans.size() + renewedLoans.size();

        long totalOverdue = checkoutRepository.findByStatus("overdue").size();

        double totalOutstandingFines = checkoutRepository.findAll().stream()
                .mapToDouble(Checkout::getFineAmount)
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBooks", totalBooks);
        stats.put("physicalBooks", physicalBooks);
        stats.put("ebooks", ebooks);
        stats.put("activeCheckouts", totalActive);
        stats.put("overdueBooks", totalOverdue);
        stats.put("totalFines", totalOutstandingFines);

        return stats;
    }
}
