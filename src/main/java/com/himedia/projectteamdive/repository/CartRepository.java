package com.himedia.projectteamdive.repository;

import com.himedia.projectteamdive.entity.Cart;
import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.entity.Music;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    List<Cart> findByMember(Member member);
    Optional<Cart> findByMemberAndMusic(Member member, Music music);
    void deleteByCartId(int cartId);
    Cart findByCartId(Integer cartId);
}
