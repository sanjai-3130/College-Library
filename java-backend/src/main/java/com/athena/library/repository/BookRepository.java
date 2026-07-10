/**
 * SPDX-License-Identifier: Apache-2.0
 */

package com.athena.library.repository;

import com.athena.library.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {
    List<Book> findByCategoryIgnoreCase(String category);
    List<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(String title, String author);
}
