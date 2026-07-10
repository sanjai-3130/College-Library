/**
 * SPDX-License-Identifier: Apache-2.0
 */

package com.athena.library.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id; // U101, etc.

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String studentId; // CS-2024-4091

    private String department;

    private String semester;

    @Column(length = 1000)
    private String avatarUrl;

    @Column(length = 2000)
    private String qrCodeData;

    @Column(nullable = false)
    private String role; // "student" | "admin"

    private String cardIssueDate;
}
