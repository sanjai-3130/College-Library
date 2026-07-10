/**
 * SPDX-License-Identifier: Apache-2.0
 */

package com.athena.library.repository;

import com.athena.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByStudentIdIgnoreCase(String studentId);
    Optional<User> findByEmailIgnoreCase(String email);
}
