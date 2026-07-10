/**
 * SPDX-License-Identifier: Apache-2.0
 */

package com.athena.library.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "checkouts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Checkout {

    @Id
    private String id; // C001, C002, etc.

    @Column(nullable = false)
    private String studentId;

    @Column(nullable = false)
    private String bookId;

    @Column(nullable = false)
    private String bookTitle;

    private String bookAuthor;

    @Column(length = 1000)
    private String coverUrl;

    @Column(nullable = false)
    private String issueDate; // YYYY-MM-DD

    @Column(nullable = false)
    private String dueDate; // YYYY-MM-DD

    private String returnedDate; // YYYY-MM-DD

    @Column(nullable = false)
    private String status; // "active" | "renewed" | "returned" | "overdue"

    @Column(nullable = false)
    private Double fineAmount;

    @Column(nullable = false)
    private Integer progress; // 0 to 100
}
