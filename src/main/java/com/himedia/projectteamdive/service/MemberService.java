package com.himedia.projectteamdive.service;

import com.himedia.projectteamdive.dto.GiftRequestDto;
import com.himedia.projectteamdive.entity.Gift;
import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.entity.RoleName;
import com.himedia.projectteamdive.repository.GiftRepository;
import com.himedia.projectteamdive.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class MemberService {



    @Autowired
    MemberRepository mr;

    BCryptPasswordEncoder pe = new BCryptPasswordEncoder();

    public Member getMember(String memberId) {
        return mr.findByMemberId(memberId);
    }


    public void insertMember(Member member) {

        List<RoleName> roles =  new ArrayList<RoleName>();
        roles.add(RoleName.USER);
        if(member.getImage() ==null){
            member.setImage("https://d9k8tjx0yo0q5.cloudfront.net/image/user.png");
        }
        member.setMemberRoleList(roles);
        member.setPassword(pe.encode(member.getPassword()));
        member.setMemberKey(UUID.randomUUID().toString());
        //member.setBirth(convertStringToTimestamp(member.getBirth()));;
        mr.save(member);

    }

    private Timestamp convertStringToTimestamp(Timestamp dateString) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            return new Timestamp(dateFormat.parse(String.valueOf(dateString)).getTime());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Member updateMember(Member member) {

        Member updateMember = mr.findByMemberId(member.getMemberId());
        updateMember.setPassword(pe.encode(member.getPassword()));
        updateMember.setPhone(member.getPhone());
        updateMember.setNickname(member.getNickname());
        updateMember.setZipCode(member.getZipCode());
        updateMember.setAddress(member.getAddress());
        updateMember.setAddressDetail(member.getAddressDetail());
        updateMember.setAddressExtra(member.getAddressExtra());
        updateMember.setIntroduction(member.getIntroduction());
        updateMember.setImage(member.getImage());
        return updateMember;

    }






    public void deleteMember(String memberId) {
        Member member = mr.findByMemberId(memberId);
        mr.delete(member);
    }

    public List<Member> getSearchMember(String memberId) {
        List<Member> list = mr.findByMemberIdContainingIgnoreCase(memberId);
        return list;
    }


    public boolean updateMemberRole(String memberId, RoleName targetRole) {
        Member member = mr.findByMemberId(memberId);
        if (member == null) {
            return false;
        }

        List<RoleName> roles = member.getMemberRoleList();

        // ✅ 이미 권한이 있으면 제거, 없으면 추가
        if (roles.contains(targetRole)) {
            roles.remove(targetRole);
        } else {
            roles.add(targetRole);
        }

        member.setMemberRoleList(roles);
        return true;
    }

    public Member resetPassword(String memberId) {
        Member updateMember = mr.findByMemberId(memberId);
        updateMember.setPassword("");
        return updateMember;
    }
}
