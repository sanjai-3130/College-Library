/**
 * SPDX-License-Identifier: Apache-2.0
 */

package com.athena.library.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    private String id; // U101, etc.
    private String name;
    private String email;
    private String studentId; // CS-2024-4091
    private String department;
    private String semester;
    private String avatarUrl;
    private String qrCodeData;
    private String role; // "student" | "admin"
    private String cardIssueDate;
}
