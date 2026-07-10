/**
 * SPDX-License-Identifier: Apache-2.0
 */

package com.athena.library.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    private String id; // B001, B002, etc.
    private String title;
    private String author;
    private String isbn;
    private String category;
    private String type; // "physical" or "ebook"
    private String coverUrl;
    private String description;
    private String publisher;
    private Integer publishYear;
    private Integer pages;
    private Double rating;

    // Physical-only fields
    private Integer copiesTotal;
    private Integer copiesAvailable;
    private String shelfLocation;

    // Ebook-only fields
    private String downloadUrl;
    private String fileSize;
    private Integer readProgress; // 0 to 100
}
