package com.himedia.projectteamdive.service;

import com.himedia.projectteamdive.dto.CartRequestDto;
import com.himedia.projectteamdive.dto.CartResponseDto;
import com.himedia.projectteamdive.entity.Cart;
import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.entity.Music;
import com.himedia.projectteamdive.repository.CartRepository;
import com.himedia.projectteamdive.repository.MemberRepository;
import com.himedia.projectteamdive.repository.MusicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    @Autowired
    CartRepository cartRepo;
    @Autowired
    MemberRepository memberRepo;
    @Autowired
    MusicRepository musicRepo;

    /* 장바구니에 구매할 곡 넣기 */
    public void insertCart(CartRequestDto requestDto) {
        Member member = memberRepo.findByMemberId(requestDto.getMemberId());
        List<Integer> musicIdList = requestDto.getMusicIdList();
        List<Cart> cartsToSave = new ArrayList<>();

        for (Integer musicId : musicIdList) {
            Music music = musicRepo.findByMusicId(musicId);
            Optional<Cart> checkCart = cartRepo.findByMemberAndMusic(member, music);
            if (checkCart.isEmpty()) {
                Cart newCart = new Cart();
                newCart.setMember(member);
                newCart.setMusic(music);
                cartsToSave.add(newCart);  // 저장할 Cart를 리스트에 추가
            }
        }

        // 한 번의 DB 호출로 일괄 저장
        if (!cartsToSave.isEmpty()) {
            cartRepo.saveAll(cartsToSave);
        }
    }

    /* 장바구니 조회 */
    public List<CartResponseDto> getCartList(String memberId) {
        Member member = memberRepo.findByMemberId(memberId);
        List<Cart> cartList = cartRepo.findByMember(member);
        return cartList.stream()
                .map(CartResponseDto::new) // Cart 객체를 CartResponseDto로 변환
                .collect(Collectors.toList());
    }

    /* 장바구니 개별 삭제 */
    public void deleteByCartId(int cartId) {
        cartRepo.deleteByCartId(cartId);
    }

    /* 장바구니 선택 삭제 */
    public void deleteByCartIdList(List<Integer> cartIdList) {
        if (cartIdList != null && !cartIdList.isEmpty()) {
            cartRepo.deleteAllById(cartIdList);  // 일괄 삭제로 성능 최적화
        }
    }
}
