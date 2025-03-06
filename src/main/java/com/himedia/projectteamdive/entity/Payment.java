package com.himedia.projectteamdive.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "paymenet_id")
    private int paymentId; // payment ID
    @Column(unique = true, nullable = false, name = "order_id")
    private String orderId; // 토스에서 생성한 주문 ID
    @Column(nullable = false, name = "order_name")
    private String orderName; // 구매 상품 이름
    @Column(nullable = false)
    private Integer amount; // 결제 금액
    @Column(name = "created_at")
    private Timestamp createdAt; // 생성 시간
    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = new Timestamp(System.currentTimeMillis()); // 현재 시간 설정
        }
    }
    @Column(name = "payment_key")
    private String paymentKey; // 결제 검증 키
    @Column(nullable = false, name = "is_paid")
    private boolean isPaid = false; // 결제 여부 확인 필드
    @Column(name = "fail_reason")
    private String failReason; // 실패 이유
    @Column(name = "cancel_status")
    private String cancelStatus; // 결제 취소 여부
    @Column(name = "cancel_reason")
    private String cancelReason; // 취소 이유
    @Column(name = "gift_to_id")
    private String giftToId; // 선물 받는 유저
    @Column(name = "pay_count")
    private int payCount; // 돈주고 구매한 곡 수
    @Column(name = "membership_count")
    private int membershipCount; // 멤버십에서 차감된 곡 수
    @Column(name = "membership_user_id")
    private int membershipUserId; // 사용한 멤버십 id

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "member_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Member member; // 결제 유저 정보

    @ElementCollection
    @CollectionTable(
            name = "payment_music", // 컬렉션 테이블 이름
            joinColumns = @JoinColumn(name = "payment_id") // 조인 컬럼 명시
    )
    @Column(name = "music_id") // 컬렉션 테이블의 컬럼 이름
    private List<Integer> musicIdList; // 음악 ID 저장
}
