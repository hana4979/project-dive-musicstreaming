package com.himedia.projectteamdive.repository;

import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.entity.Membership;
import com.himedia.projectteamdive.entity.Membership_user;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MembershipUserRepository extends JpaRepository<Membership_user, Integer> {
    /* 활성화 시킨 멤버십 기록이 구매하려는 기록과 겹치는지 확인 */
    @Query("SELECT mu FROM Membership_user mu " +
            "JOIN mu.member m " +
            "WHERE m.memberId = :memberId " + // 구매하려는 유저
            "AND mu.membershipCategory = :membershipCategory " + // 복사 저장된 멤버십 카테고리 비교
            "AND mu.active = TRUE " + // active가 TRUE인 멤버십만 조회
            "ORDER BY mu.startDate DESC") // 마지막으로 추가된 멤버십
    Membership_user getLatestActiveMembershipByCategory(@Param("memberId") String memberId, @Param("membershipCategory") String membershipCategory);


    List<Membership_user> member(Member member);

    @Query("SELECT mu FROM Membership_user mu " +
            "JOIN mu.member m " +
            "WHERE m.memberId = :memberId " + // 구매하려는 유저
            "AND mu.active = TRUE " + // active가 TRUE인 멤버십만 조회
            "ORDER BY mu.startDate DESC") // 마지막으로 추가된 멤버십
    List<Membership_user> getActiveMembership(String memberId);

    Membership_user findByMembershipUserId(int membershipId);
}
