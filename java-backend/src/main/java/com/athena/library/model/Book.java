/**
 * SPDX-License-Identifier: Apache-2.0
 */

package com.athena.library.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    private String id; // B001, B002, etc.

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(unique = true)
    private String isbn;

    private String category;

    @Column(nullable = false)
    private String type; // "physical" or "ebook"

    @Column(length = 1000)
    private String coverUrl;

    @Column(length = 2000)
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
