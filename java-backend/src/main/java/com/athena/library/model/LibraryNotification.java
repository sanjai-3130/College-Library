/**
 * SPDX-License-Identifier: Apache-2.0
 */

package com.athena.library.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibraryNotification {

    private String id; // N_ISS_123, etc.
    private String title;
    private String message;
    private String date; // YYYY-MM-DD
    private String type; // "alert" | "info" | "success" | "fine"
    private Boolean read;
}
