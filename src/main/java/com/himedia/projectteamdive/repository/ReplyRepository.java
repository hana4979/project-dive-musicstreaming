package com.himedia.projectteamdive.repository;

import com.himedia.projectteamdive.entity.Allpage;
import com.himedia.projectteamdive.entity.Pagetype;
import com.himedia.projectteamdive.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Integer> {

    Reply findByReplyId(int replyId);

    List<Reply> findByAllpage(Allpage allpage);

    @Query("SELECT r FROM Reply r " +
            "WHERE r.member.memberId = :memberId " +
            "AND :pagetype MEMBER OF r.allpage.pagetype")
    List<Reply> findByMemberIdAndPagetype(@Param("memberId") String memberId,
                                          @Param("pagetype") Pagetype pagetype);
}
