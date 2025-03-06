package com.himedia.projectteamdive.service;

import com.himedia.projectteamdive.configuration.PaymentConfig;
import com.himedia.projectteamdive.dto.*;
import com.himedia.projectteamdive.entity.*;
import com.himedia.projectteamdive.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {

    @Autowired
    PaymentRepository paymentRepo;
    @Autowired
    MemberRepository memberRepo;
    @Autowired
    MembershipRepository membershipRepo;
    @Autowired
    MembershipUserRepository membershipUserRepo;
    @Autowired
    PaymentConfig paymentConfig;
    @Autowired
    GiftRepository giftRepo;
    @Autowired
    MusicRepository musicRepo;
    @Autowired
    PurchasedMusicRepository purchasedMusicRepo;
    @Autowired
    CartService cs;
    @Autowired
    Mp3Service ms;

    /* 멤버십 결제 정보 저장 */
    public PaymentResponseDto savePaymentInfo(PaymentRequestDto requestDto, String memberId) {
        Payment payment = new Payment();
        Optional<Member> member = Optional.ofNullable(memberRepo.findByMemberId(memberId));
        if(member.isPresent()) {
            requestDto.setMember(member.get());
            payment = requestDto.toEntity();
            paymentRepo.save(payment);
        }else {
            throw new IllegalArgumentException("memberId 에 해당하는 member 가 없습니다");
        }
        return new PaymentResponseDto(payment);
    }

    /* 음악 결제 정보 저장 및 장바구니에서 삭제 */
    public PaymentResponseDto savePaymentMusicInfo(OrderMusicRequestDto requestDto) {
        Payment payment = new Payment();
        Optional<Member> member = Optional.ofNullable(memberRepo.findByMemberId(requestDto.getMemberId()));
        if(member.isPresent()) {
            payment = requestDto.toEntity(member.get());
            paymentRepo.save(payment);
        }else{
            throw new IllegalArgumentException("memberId 에 해당하는 member 가 없습니다");
        }
        cs.deleteByCartIdList(requestDto.getCartIdList()); // 장바구니에서 삭제

        return new PaymentResponseDto(payment);
    }

    /* 결제 성공 후 검증 및 최종 승인을 위한 응답 반환 */
    public ResponseEntity<String> paymentSuccess(String paymentKey, String orderId, int amount) {
        Payment payment = validatePayment(orderId, amount); // 결제 금액 확인
        Membership membership = validateOrderId(orderId); // orderId 형식 확인
        ResponseEntity<String> response = confirmPayment(paymentKey, orderId, amount);

        payment.setPaymentKey(paymentKey); // 결제 검증 키 저장
        payment.setPaid(true); // 결제 완료 처리

        if(membership == null) {
            // 개별곡 구매 및 선물
            String purchaseMemberId =
                    (payment.getGiftToId() != null && !payment.getGiftToId().isEmpty()) ?
                            (payment.getGiftToId()) : (payment.getMember().getMemberId());

            Member ownerMember = musicOwner(purchaseMemberId); // 개별곡 소유자

            // 구매한 곡 저장
            savePurchasedMusic(payment.getMusicIdList(), ownerMember);

            // 다운로드 멤버십 개수 차감
            Optional<Membership_user> downloadMembership = Optional.ofNullable(
                    membershipUserRepo.findByMembershipUserId(payment.getMembershipUserId()));
            if(downloadMembership.isPresent()) {
                int useCount = payment.getMembershipCount(); // 사용 개수
                payMembership(downloadMembership.get(), useCount);
            }
        }else if(membership.getCategory().equals("gift")){
            // 멤버십 선물
            giftMembership(membership, payment);
        }else{
            // 멤버십 활성화
            activeMembership(membership, payment.getMember());
        }
        return response;
    }

    /* 결제 요청 가격, 실제 결제된 금액이 같은지 확인 */
    private Payment validatePayment(String orderId, int amount) {
        Payment payment = paymentRepo.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("결제 정보 없음"));

        if (payment.getAmount() != amount) {
            throw new IllegalStateException("결제 금액 불일치");
        }
        return payment;
    }

    /* 주문번호 형식 확인 후 membership 반환 */
    private Membership validateOrderId(String orderId) {
        int index = orderId.indexOf("-"); // "-"의 위치 찾기
        if (index == -1) { // "-"가 없을 경우 예외 발생
            throw new IllegalArgumentException("orderId 형식이 잘못되었습니다");
        }
        String membershipId = orderId.substring(0, index);

        if (membershipId.startsWith("m")) { // 개별곡 구매
            return null;
        } else { // 멤버십 구매
            return membershipRepo.findByMembershipId(Integer.parseInt(membershipId));
        }
    }

    /* 토스 페이먼츠 api 에 결제 승인 요청 전달 */
    private ResponseEntity<String> confirmPayment(String paymentKey, String orderId, int amount) {
        RestTemplate restTemplate = new RestTemplate();
        String url = PaymentConfig.URL;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 토스페이먼츠 시크릿 키 (Base64 인코딩 필요)
        String secretKey = paymentConfig.getSecretApiKey();
        String encodedAuth = Base64.getEncoder().encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));
        headers.set("Authorization", "Basic " + encodedAuth);

        Map<String, Object> body = new HashMap<>();
        body.put("paymentKey", paymentKey);
        body.put("orderId", orderId);
        body.put("amount", amount);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers); // 요청 데이터와 요청 해더를 포함한 요청 객체 생성

        return restTemplate.exchange(url, HttpMethod.POST, entity, String.class); // 요청 보내고 응답 받기
    }

    /* 멤버십 선물 */
    private void giftMembership(Membership membership, Payment payment) {
        GiftRequestDto giftRequestDto = new GiftRequestDto();
        giftRequestDto.setGiftName(membership.getName());
        giftRequestDto.setGiftFrom(payment.getMember().getMemberId());
        giftRequestDto.setGiftTo(payment.getGiftToId());
        Gift gift = new Gift(giftRequestDto, membership);
        giftRepo.save(gift);
    }

    /* 멤버십 등록 */
    private void activeMembership(Membership membership, Member member) {
        Membership_user membershipUser = new Membership_user(member, membership);
        membershipUserRepo.save(membershipUser); // 멤버십 정보 저장
    }

    /* 결제 요청 실패 이유 저장 */
    public void paymentFail(String failReason, String orderId) {
        Optional<Payment> payment = paymentRepo.findByOrderId(orderId);
        if(payment.isPresent()) {
            payment.get().setPaid(false);
            payment.get().setFailReason(failReason);
        }
    }

    /* 결제 내역 조회 */
    public List<PaymentResponseDto> getPaymentList(String memberId) {
        Member member = memberRepo.findByMemberId(memberId);
        List<Payment> paymentList = paymentRepo.findByMember(member);

        List<PaymentResponseDto> paymentResponseList = paymentList.stream()
                .map(payment -> {
                    PaymentResponseDto responseDto = new PaymentResponseDto(payment);
                    List<Integer> musicIdList = payment.getMusicIdList(); // Payment에서 musicIdList 가져오기
                    List<MusicDto> musicDtoList = null;
                    if (musicIdList != null && !musicIdList.isEmpty()) {
                        musicDtoList = ms.getPurchaseMusicList(musicIdList);
                    }

                    responseDto.setMusicList(musicDtoList); // MusicDto 설정
                    return responseDto;
                })
                .collect(Collectors.toList());

        return paymentResponseList;
    }

    /* 멤버십으로 개별곡 결제 */
    public void payOnlyMembership(OrderMusicRequestDto requestDto) {
        // 소장할 멤버 정보 가져오기
        Member ownerMember = new Member();
        if (requestDto.getGiftToId() != null && !requestDto.getGiftToId().isEmpty()) {
            ownerMember = musicOwner(requestDto.getGiftToId());
        } else {
            ownerMember = musicOwner(requestDto.getMemberId());
        }

        // 구매한 곡 저장
        savePurchasedMusic(requestDto.getMusicIdList(), ownerMember);

        // 구매한 곡 장바구니에서 삭제
        cs.deleteByCartIdList(requestDto.getCartIdList());

        // 다운로드 멤버십 개수 차감
        Membership_user downloadMembership = membershipUserRepo.findByMembershipUserId(requestDto.getMembershipUserId());
        int useCount = requestDto.getMembershipCount(); // 사용 개수
        payMembership(downloadMembership, useCount);

        // payment 엔티티로 변환
        Member member = memberRepo.findByMemberId(requestDto.getMemberId());
        Payment payment = requestDto.toEntity(member);
        payment.setPaid(true); // 결제 성공
        paymentRepo.save(payment);
    }

    /* 소장할 멤버 정보 가져오기 */
    public Member musicOwner(String memberId){
        return memberRepo.findByMemberId(memberId);
    }

    /* 구매곡 저장 */
    public void savePurchasedMusic(List<Integer> musicIdList, Member purchasedMember) {
        // 구매한 곡을 한번에 저장할 배열
        List<PurchasedMusic> purchasedMusicToSave = new ArrayList<>();

        // 구매한 곡 배열에 담기
        for (Integer musicId : musicIdList) {
            PurchasedMusic purchasedMusic = new PurchasedMusic();
            purchasedMusic.setMember(purchasedMember);
            Music music = musicRepo.findById(musicId).orElseThrow();
            purchasedMusic.setMusic(music);
            purchasedMusicToSave.add(purchasedMusic);
            System.out.println("어떤 곡을 소장하냐면.... " + purchasedMusic.getMusic().getMusicId());
        }

        // 한번에 저장
        if(!purchasedMusicToSave.isEmpty()){
            purchasedMusicRepo.saveAll(purchasedMusicToSave);
        }
    }

    /* 다운로드 멤버십에서 사용한 만큼 개수 차감 */
    public void payMembership(Membership_user downloadMembership, int useCount) {
        int newDownloadCount = downloadMembership.getDownloadCount() - useCount;
        downloadMembership.setDownloadCount(newDownloadCount);
    }
}
