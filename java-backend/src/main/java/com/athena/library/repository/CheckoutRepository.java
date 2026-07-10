/**
 * SPDX-License-Identifier: Apache-2.0
 */

package com.athena.library.repository;

import com.athena.library.model.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CheckoutRepository extends JpaRepository<Checkout, String> {
    List<Checkout> findByStudentId(String studentId);
    List<Checkout> findByStudentIdAndStatus(String studentId, String status);
    List<Checkout> findByStatus(String status);
}
