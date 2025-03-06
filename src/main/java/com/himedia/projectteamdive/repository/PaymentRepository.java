package com.himedia.projectteamdive.repository;

import com.himedia.projectteamdive.dto.PaymentResponseDto;
import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    boolean existsByOrderId(String orderId); // 메소드 중복 저장 방지

    Optional<Payment> findByOrderId(String orderId);

    List<Payment> findByMember(Member member);
}
