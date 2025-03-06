package com.himedia.projectteamdive.repository;

import com.himedia.projectteamdive.entity.Member;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MemberRepository extends JpaRepository<Member, String> {

    @EntityGraph(attributePaths = {"memberRoleList"})
    @Query("select m from Member m where m.memberId= :username")
    Member getWithRole(@Param("username") String username);

    Member findByMemberId(String memberId);

    List<Member> findByMemberIdContainingIgnoreCase(String memberId);
}
