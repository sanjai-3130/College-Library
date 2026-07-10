/**
 * SPDX-License-Identifier: Apache-2.0
 */

package com.athena.library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.athena.library.model.*;
import com.athena.library.repository.*;

import java.util.List;

@SpringBootApplication
public class LibrarySystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibrarySystemApplication.class, args);
    }

    /**
     * Seed initial records matching our frontend initialData.
     */
    @Bean
    public CommandLineRunner seedDatabase(
            BookRepository bookRepository,
            UserRepository userRepository,
            CheckoutRepository checkoutRepository,
            LibraryNotificationRepository notificationRepository) {
        return args -> {
            // Seed Default Books (Physical and E-Book volumes)
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

            bookRepository.saveAll(List.of(b1, b2, b3, b4));

            // Seed default student records
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

            userRepository.saveAll(List.of(u1, u2));

            // Seed active and overdue loans
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
                    .returnedDate(null)
                    .status("overdue")
                    .fineAmount(140.0)
                    .progress(35)
                    .build();

            checkoutRepository.saveAll(List.of(c1, c2));

            // Seed Library Notifications
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

            notificationRepository.saveAll(List.of(n1, n2));
        };
    }
}
