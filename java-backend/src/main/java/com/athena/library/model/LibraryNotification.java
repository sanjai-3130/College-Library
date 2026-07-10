/**
 * SPDX-License-Identifier: Apache-2.0
 */

package com.athena.library.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "library_notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibraryNotification {

    @Id
    private String id; // N_ISS_123, etc.

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(nullable = false)
    private String date; // YYYY-MM-DD

    @Column(nullable = false)
    private String type; // "alert" | "info" | "success" | "fine"

    @Column(nullable = false)
    private Boolean read;
}
