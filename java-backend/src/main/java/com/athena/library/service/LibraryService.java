/**
 * SPDX-License-Identifier: Apache-2.0
 */

package com.athena.library.service;

import com.athena.library.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class LibraryService {

    // Thread-safe in-memory collections replacing the SQL database
    private final Map<String, Book> books = new ConcurrentHashMap<>();
    private final Map<String, User> users = new ConcurrentHashMap<>();
    private final Map<String, Checkout> checkouts = new ConcurrentHashMap<>();
    private final Map<String, LibraryNotification> notifications = new ConcurrentHashMap<>();

    public LibraryService() {
        seedInitialData();
    }

    /**
     * Seeds the initial mock library state directly in-memory.
     */
    private void seedInitialData() {
        // 1. Seed Books
        Book b1 = Book.builder()
                .id("B001")
                .title("An Introduction to Algorithms")
                .author("Thomas H. Cormen")
                .isbn("978-0262033848")
                .category("Computer Science")
                .type("physical")
                .coverUrl("https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=400&q=80")
                .description("An absolute cornerstone textbook on computer algorithms, covering a wide range of topics in depth.")
                .publisher("MIT Press")
                .publishYear(2009)
                .pages(1292)
                .rating(4.8)
                .copiesTotal(5)
                .copiesAvailable(4)
                .shelfLocation("Rack C-3, Shelf 1")
                .build();

        Book b2 = Book.builder()
                .id("B002")
                .title("Clean Code: Hand Book of Agile Software Craftsmanship")
                .author("Robert C. Martin")
                .isbn("978-0132350884")
                .category("Software Engineering")
                .type("physical")
                .coverUrl("https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80")
                .description("Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.")
                .publisher("Prentice Hall")
                .publishYear(2008)
                .pages(464)
                .rating(4.7)
                .copiesTotal(3)
                .copiesAvailable(3)
                .shelfLocation("Rack C-3, Shelf 2")
                .build();

        Book b3 = Book.builder()
                .id("B003")
                .title("The Pragmatic Programmer")
                .author("Andrew Hunt, David Thomas")
                .isbn("978-0135957059")
                .category("Software Development")
                .type("ebook")
                .coverUrl("https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&q=80")
                .description("One of the most significant books in software development, detailing best practices and paradigms.")
                .publisher("Addison-Wesley")
                .publishYear(2019)
                .pages(352)
                .rating(4.9)
                .downloadUrl("/api/books/download/b003")
                .fileSize("4.2 MB")
                .readProgress(64)
                .build();

        Book b4 = Book.builder()
                .id("B004")
                .title("Principles of Electromagnetics")
                .author("Matthew N.O. Sadiku")
                .isbn("978-0199461851")
                .category("Electrical Engineering")
                .type("physical")
                .coverUrl("https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80")
                .description("A classic text presenting electromagnetic fields and waves, heavily integrated with mathematical derivations.")
                .publisher("Oxford University Press")
                .publishYear(2015)
                .pages(848)
                .rating(4.3)
                .copiesTotal(4)
                .copiesAvailable(3)
                .shelfLocation("Rack E-1, Shelf 4")
                .build();

        books.put(b1.getId(), b1);
        books.put(b2.getId(), b2);
        books.put(b3.getId(), b3);
        books.put(b4.getId(), b4);

        // 2. Seed Users
        User u1 = User.builder()
                .id("U101")
                .name("Alex Mercer")
                .email("alex.mercer@athenastate.edu")
                .studentId("CS-2024-4091")
                .department("Computer Science & Engineering")
                .semester("6th Semester")
                .avatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80")
                .qrCodeData("STU-CS-2024-4091")
                .role("student")
                .cardIssueDate("2024-01-15")
                .build();

        User u2 = User.builder()
                .id("U102")
                .name("Dr. Elizabeth Vance")
                .email("e.vance@athenastate.edu")
                .studentId("STAFF-001")
                .department("Library Administration")
                .semester("Staff Coordinator")
                .avatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80")
                .qrCodeData("STU-STAFF-001")
                .role("admin")
                .cardIssueDate("2020-08-10")
                .build();

        users.put(u1.getStudentId().toUpperCase(), u1);
        users.put(u2.getStudentId().toUpperCase(), u2);

        // 3. Seed Checkouts
        Checkout c1 = Checkout.builder()
                .id("C001")
                .studentId("CS-2024-4091")
                .bookId("B001")
                .bookTitle("An Introduction to Algorithms")
                .bookAuthor("Thomas H. Cormen")
                .coverUrl("https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=400&q=80")
                .issueDate("2026-06-25")
                .dueDate("2026-07-09")
                .status("active")
                .fineAmount(0.0)
                .progress(12)
                .build();

        Checkout c2 = Checkout.builder()
                .id("C002")
                .studentId("CS-2024-4091")
                .bookId("B004")
                .bookTitle("Principles of Electromagnetics")
                .bookAuthor("Matthew N.O. Sadiku")
                .coverUrl("https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80")
                .issueDate("2026-06-01")
                .dueDate("2026-06-15")
                .status("overdue")
                .fineAmount(140.0)
                .progress(35)
                .build();

        checkouts.put(c1.getId(), c1);
        checkouts.put(c2.getId(), c2);

        // 4. Seed Notifications
        LibraryNotification n1 = LibraryNotification.builder()
                .id("N1")
                .title("Book Overdue Notice")
                .message("The book 'Principles of Electromagnetics' was due on 2026-06-15. Late fine of ₹10/day applies.")
                .date("2026-06-16")
                .type("fine")
                .read(false)
                .build();

        LibraryNotification n2 = LibraryNotification.builder()
                .id("N2")
                .title("System Upgrade Notice")
                .message("Athena Library portal upgraded to v4.2. Secure dynamic checkout passes can now be generated instantly!")
                .date("2026-07-08")
                .type("success")
                .read(true)
                .build();

        notifications.put(n1.getId(), n1);
        notifications.put(n2.getId(), n2);
    }

    // --- BOOKS METHODS ---

    public List<Book> getAllBooks() {
        return new ArrayList<>(books.values());
    }

    public Book addBook(Book book) {
        if (book.getId() == null || book.getId().isEmpty()) {
            book.setId("B00" + (books.size() + 1));
        }
        books.put(book.getId(), book);

        createNotification(
                "New Book Cataloged",
                String.format("\"%s\" by %s has been added to the %s section.", book.getTitle(), book.getAuthor(), book.getCategory()),
                "success"
        );
        return book;
    }

    public Optional<Book> getBookById(String bookId) {
        return Optional.ofNullable(books.get(bookId));
    }

    // --- AUTHENTICATION ---

    public User login(String studentId, String role) {
        String formattedId = studentId.trim().toUpperCase();
        User existingUser = users.get(formattedId);

        if (existingUser != null) {
            return existingUser;
        }

        // Setup profile defaults for new profiles on the fly
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
                .id("U" + (users.size() + 101))
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

        users.put(formattedId, newUser);
        return newUser;
    }

    public User loginWithQR(String qrData) {
        if (qrData == null || qrData.isEmpty()) {
            throw new IllegalArgumentException("Scanned QR code data cannot be blank");
        }

        boolean isAdmin = qrData.contains("ADMIN") || qrData.contains("STAFF");
        String[] parts = qrData.split("-");
        String studentId = parts[parts.length - 1];

        User user = login(studentId, isAdmin ? "admin" : "student");

        createNotification(
                "Login Successful",
                "Successfully authenticated via Digital Student Card QR Code. Welcome back, " + user.getName() + "!",
                "success"
        );

        return user;
    }

    // --- CHECKOUTS METHODS ---

    public List<Checkout> getAllCheckouts() {
        return new ArrayList<>(checkouts.values());
    }

    public List<Checkout> getCheckoutsByStudent(String studentId) {
        String formattedId = studentId.trim().toUpperCase();
        return checkouts.values().stream()
                .filter(c -> formattedId.equals(c.getStudentId()))
                .collect(Collectors.toList());
    }

    public Checkout issueBook(String bookId, String studentId) {
        Book book = books.get(bookId);
        if (book == null) {
            throw new IllegalArgumentException("Book not found in library catalog.");
        }

        if ("ebook".equalsIgnoreCase(book.getType())) {
            throw new IllegalArgumentException("E-Books can be read instantly online and do not require physical checkouts.");
        }

        if (book.getCopiesAvailable() == null || book.getCopiesAvailable() <= 0) {
            throw new IllegalStateException("All physical copies of this book are currently checked out.");
        }

        // Deduct 1 copies available
        book.setCopiesAvailable(book.getCopiesAvailable() - 1);

        LocalDate issueDate = LocalDate.now();
        LocalDate dueDate = issueDate.plusDays(14); // 14-day standard checkout period

        Checkout checkout = Checkout.builder()
                .id("C00" + (checkouts.size() + 1))
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

        checkouts.put(checkout.getId(), checkout);

        createNotification(
                "Book Issued Successfully",
                String.format("\"%s\" has been issued to student %s. Due date: %s.", book.getTitle(), studentId.toUpperCase(), dueDate),
                "success"
        );

        return checkout;
    }

    public Checkout returnBook(String checkoutId) {
        Checkout checkout = checkouts.get(checkoutId);
        if (checkout == null) {
            throw new IllegalArgumentException("Checkout record not found.");
        }

        if ("returned".equalsIgnoreCase(checkout.getStatus())) {
            throw new IllegalStateException("This book has already been returned.");
        }

        checkout.setStatus("returned");
        checkout.setReturnedDate(LocalDate.now().toString());
        checkout.setProgress(100);

        // Put copies back on shelf
        Book book = books.get(checkout.getBookId());
        if (book != null) {
            book.setCopiesAvailable((book.getCopiesAvailable() != null ? book.getCopiesAvailable() : 0) + 1);
        }

        createNotification(
                "Book Returned",
                String.format("\"%s\" has been returned on time. Thank you!", checkout.getBookTitle()),
                "info"
        );

        return checkout;
    }

    public Checkout renewBook(String checkoutId) {
        Checkout checkout = checkouts.get(checkoutId);
        if (checkout == null) {
            throw new IllegalArgumentException("Checkout record not found.");
        }

        if ("returned".equalsIgnoreCase(checkout.getStatus())) {
            throw new IllegalStateException("Cannot renew a book that has already been returned.");
        }

        if ("overdue".equalsIgnoreCase(checkout.getStatus())) {
            throw new IllegalStateException("Cannot renew an overdue book. Please clear outstanding fines first.");
        }

        LocalDate currentDue = LocalDate.parse(checkout.getDueDate());
        LocalDate newDue = currentDue.plusDays(7); // Extend by 7 days

        checkout.setDueDate(newDue.toString());
        checkout.setStatus("renewed");

        createNotification(
                "Due Date Extended",
                String.format("The loan period for \"%s\" has been extended to %s.", checkout.getBookTitle(), newDue),
                "success"
        );

        return checkout;
    }

    public Checkout payFine(String checkoutId) {
        Checkout checkout = checkouts.get(checkoutId);
        if (checkout == null) {
            throw new IllegalArgumentException("Checkout record not found.");
        }

        double finePaid = checkout.getFineAmount();
        if (finePaid <= 0.0) {
            throw new IllegalArgumentException("No pending fines for this book.");
        }

        checkout.setFineAmount(0.0);
        if ("overdue".equalsIgnoreCase(checkout.getStatus())) {
            checkout.setStatus("active");
        }

        createNotification(
                "Fine Paid Successfully",
                String.format("Fines of ₹%.2f for \"%s\" have been fully settled.", finePaid, checkout.getBookTitle()),
                "success"
        );

        return checkout;
    }

    // --- NOTIFICATIONS METHODS ---

    public List<LibraryNotification> getAllNotifications() {
        List<LibraryNotification> list = new ArrayList<>(notifications.values());
        // Sort newest first based on notification dates/IDs
        list.sort((n1, n2) -> n2.getId().compareTo(n1.getId()));
        return list;
    }

    public boolean markNotificationRead(String id) {
        LibraryNotification notif = notifications.get(id);
        if (notif != null) {
            notif.setRead(true);
            return true;
        }
        return false;
    }

    public void clearAllNotifications() {
        notifications.clear();
    }

    public LibraryNotification createNotification(String title, String message, String type) {
        LibraryNotification notif = LibraryNotification.builder()
                .id("N_GEN_" + System.currentTimeMillis())
                .title(title)
                .message(message)
                .date(LocalDate.now().toString())
                .type(type)
                .read(false)
                .build();
        notifications.put(notif.getId(), notif);
        return notif;
    }

    // --- STATS ANALYTICS ---

    public Map<String, Object> getLibraryStats() {
        long totalBooks = books.size();
        long physicalBooks = books.values().stream().filter(b -> "physical".equalsIgnoreCase(b.getType())).count();
        long ebooks = totalBooks - physicalBooks;

        long totalActive = checkouts.values().stream()
                .filter(c -> "active".equalsIgnoreCase(c.getStatus()) || "renewed".equalsIgnoreCase(c.getStatus()))
                .count();

        long totalOverdue = checkouts.values().stream()
                .filter(c -> "overdue".equalsIgnoreCase(c.getStatus()))
                .count();

        double totalOutstandingFines = checkouts.values().stream()
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
