/**
 * SPDX-License-Identifier: Apache-2.0
 */

package com.athena.library.repository;

import com.athena.library.model.LibraryNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryNotificationRepository extends JpaRepository<LibraryNotification, String> {
    List<LibraryNotification> findByReadFalseOrderByDateDesc();
    List<LibraryNotification> findAllByOrderByDateDesc();
}
