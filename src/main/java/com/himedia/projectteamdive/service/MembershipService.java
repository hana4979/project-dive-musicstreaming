package com.himedia.projectteamdive.service;

import com.himedia.projectteamdive.entity.Gift;
import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.entity.Membership;
import com.himedia.projectteamdive.entity.Membership_user;
import com.himedia.projectteamdive.repository.GiftRepository;
import com.himedia.projectteamdive.repository.MemberRepository;
import com.himedia.projectteamdive.repository.MembershipRepository;
import com.himedia.projectteamdive.repository.MembershipUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MembershipService {

    @Autowired
    MembershipRepository msr;
    @Autowired
    MembershipUserRepository msur;
    @Autowired
    MemberRepository mr;
    @Autowired
    GiftRepository gr;

    /* 카테고리에 해당하는 멤버십 정보 가져오기 */
    public List<Membership> getMembershipByCategory(String category) {
        if(category.equals("all"))
            return msr.findByCategoryNotAndActiveTrue("gift");
        else
            return msr.findByCategoryAndActiveTrue(category);
    }

    /* 카테고리를 기준으로 활성화된 멤버십이 있는지 확인 */
    public Membership_user checkActiveMembership(String memberId, String membershipCategory) {
        Optional<Membership_user> membershipUser =
                Optional.ofNullable(msur.getLatestActiveMembershipByCategory(memberId, membershipCategory));

        return membershipUser.map(this::checkStillActive).orElse(null);
    }

    /* 현재 로그인 유저에게 활성화된 멤버십이 있는지 확인 */
    public List<Membership_user> getActiveMembership(String memberId) {
        List<Membership_user> membershipUserList = msur.getActiveMembership(memberId);
        List<Membership_user> activeMembershipUserList = new ArrayList<>();
        if(!membershipUserList.isEmpty()){
            for(Membership_user membershipUser : membershipUserList){
                Membership_user checkedUser = checkStillActive(membershipUser);
                if (checkedUser != null) { // 빈값이 아니라면
                    activeMembershipUserList.add(checkedUser);
                }
            }
        }
        return activeMembershipUserList;
    }

    /* 반환된 멤버십이 활성화 상태인지 확인하고 조취 */
    public Membership_user checkStillActive(Membership_user membershipUser) {
        LocalDate today = LocalDate.now();

        if("streaming".equalsIgnoreCase(membershipUser.getMembershipCategory())) {
            // "streaming" 카테고리일 때
            // endDate가 오늘 날짜를 지나면 active를 false로 설정
            if(membershipUser.getEndDate() != null
                    && membershipUser.getEndDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().isBefore(today)) {
                membershipUser.setActive(false);
                msur.save(membershipUser); // 엔티티 상태를 DB에 반영
                return null;
            }
        }else if("download".equalsIgnoreCase(membershipUser.getMembershipCategory())) {
            // "download" 카테고리일 때
            // endDate가 오늘 날짜를 지나거나, downloadCount가 0이면 active를 false로 설정
            if((membershipUser.getEndDate() != null
                    && membershipUser.getEndDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().isBefore(today))
                    || membershipUser.getDownloadCount() == 0) {
                membershipUser.setActive(false);
                msur.save(membershipUser); // 엔티티 상태를 DB에 반영
                return null;
            }
        }

        return membershipUser;
    }

    /* 선물 리스트 조회 */
    public List<Gift> getGiftList(String giftTo) {
        return gr.findInactiveGiftsByGiftToOrderByMembershipDownloadCountAndGiftDate(giftTo);
    }

    /* 멤버십 활성화 */
    public Boolean membershipActive(int giftId, String membershipCategory) {
        Gift gift = gr.findByGiftId(giftId);
        Optional<Membership_user> currentActiveMembership = Optional.ofNullable(msur.getLatestActiveMembershipByCategory(gift.getGiftTo(), membershipCategory));
        if(currentActiveMembership.isEmpty()) {
            Member member = mr.findByMemberId(gift.getGiftTo());
            msur.save(new Membership_user(member, gift)); // 멤버십 활성화
            gift.setActive(true); // 선물 사용 표시
            return true;
        }else{
            return false;
        }
    }

    /* 멤버십 정보 전부 가져오기 */
    public List<Membership> getMembership() {
        return msr.findAll();
    }

    /* 멤버십 세부 정보 가져오기 */
    public Membership getMembershipById(int membershipId) {
        return msr.findByMembershipId(membershipId);
    }

    /* 멤버십 추가 */
    public void insertMembership(Membership membership) {
        msr.save(membership);
    }

    /* 멤버십 정보 수정 */
    public Membership updateMembership(Membership membership) {
        Membership updatemembership = msr.findById(membership.getMembershipId()).orElse(null);
        if(updatemembership != null) {
            updatemembership.setName(membership.getName());
            updatemembership.setContent(membership.getContent());
            updatemembership.setPrice(membership.getPrice());
            updatemembership.setDiscount(membership.getDiscount());
            updatemembership.setPeriod(membership.getPeriod());
            updatemembership.setCategory(membership.getCategory());
            updatemembership.setDownloadCount(membership.getDownloadCount());
        }
        return updatemembership;
    }

    /* 멤버십 활성화 / 비활성화 설정 */
    public boolean toggleMembershipActive(int membershipId) {
        Optional<Membership> membershipOpt = msr.findById(membershipId);
        if (membershipOpt.isPresent()) {
            Membership membership = membershipOpt.get();
            membership.setActive(!membership.isActive()); // 🔥 현재 상태 반전
            return true;
        }
        return false;
    }

    /* 멤버십 삭제 */
    public void deleteMembership(int membershipId) {
        Optional<Membership> membershipOpt = msr.findById(membershipId);
        membershipOpt.ifPresent(membership -> msr.delete(membership));
    }

}















