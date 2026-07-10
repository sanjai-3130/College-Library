/**
 * SPDX-License-Identifier: Apache-2.0
 */

package com.athena.library.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Checkout {

    private String id; // C001, C002, etc.
    private String studentId;
    private String bookId;
    private String bookTitle;
    private String bookAuthor;
    private String coverUrl;
    private String issueDate; // YYYY-MM-DD
    private String dueDate; // YYYY-MM-DD
    private String returnedDate; // YYYY-MM-DD
    private String status; // "active" | "renewed" | "returned" | "overdue"
    private Double fineAmount;
    private Integer progress; // 0 to 100
}
