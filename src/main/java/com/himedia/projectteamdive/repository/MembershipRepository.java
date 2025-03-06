package com.himedia.projectteamdive.repository;


import com.himedia.projectteamdive.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MembershipRepository extends JpaRepository<Membership, Integer> {

    List<Membership> findByCategoryAndActiveTrue(String category); // 카테고리에 해당하는 멤버십 불러오기
    List<Membership> findByCategoryNotAndActiveTrue(String category); // gift 카테고리를 제외한 멤버십 불러오기

    Membership findByMembershipId(int membershipId);
}
