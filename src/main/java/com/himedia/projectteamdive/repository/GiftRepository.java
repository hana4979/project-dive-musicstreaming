package com.himedia.projectteamdive.repository;

import com.himedia.projectteamdive.entity.Gift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GiftRepository extends JpaRepository<Gift, Integer> {
    @Query("SELECT g FROM Gift g " +
            "WHERE g.giftTo = :giftTo " +
            "AND g.active = false " +
            "ORDER BY CASE WHEN g.membershipDownloadCount = 0 THEN 0 ELSE 1 END ASC, " +
            "g.giftDate DESC")
    List<Gift> findInactiveGiftsByGiftToOrderByMembershipDownloadCountAndGiftDate(@Param("giftTo") String giftTo);

    Gift findByGiftId(int giftId);
}
