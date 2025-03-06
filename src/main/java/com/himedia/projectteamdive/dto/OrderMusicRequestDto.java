package com.himedia.projectteamdive.dto;

import com.himedia.projectteamdive.entity.Cart;
import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.entity.Payment;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class OrderMusicRequestDto {
    private String orderId;
    private int amount;
    private String orderName;
    private String giftToId;
    private String memberId;
    private int payCount;
    private int membershipCount;
    private int membershipUserId;
    private List<Integer> cartIdList;
    private List<Integer> musicIdList;

    public OrderMusicRequestDto(
            String orderId,
            int amount,
            String orderName,
            String giftToId,
            String memberId,
            int payCount,
            int membershipCount,
            int membershipUserId,
            List<Integer> cartIdList,
            List<Integer> musicIdList) {
        this.orderId = orderId;
        this.amount = amount;
        this.orderName = orderName;
        this.giftToId = giftToId;
        this.memberId = memberId;
        this.payCount = payCount;
        this.membershipCount = membershipCount;
        this.membershipUserId = membershipUserId;
        this.cartIdList = cartIdList;
        this.musicIdList = musicIdList;
    }

    public Payment toEntity(Member member) {
        return Payment.builder()
                .orderId(orderId)
                .amount(amount)
                .orderName(orderName)
                .giftToId(giftToId)
                .member(member)
                .musicIdList(musicIdList)
                .isPaid(false)
                .payCount(payCount)
                .membershipCount(membershipCount)
                .membershipUserId(membershipUserId)
                .build();
    }
}
