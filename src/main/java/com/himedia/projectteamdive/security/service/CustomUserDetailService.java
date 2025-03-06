package com.himedia.projectteamdive.security.service;

import com.himedia.projectteamdive.dto.MemberDto;
import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomUserDetailService  implements UserDetailsService {
    final MemberRepository mr;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("loadUserByUsername - username : " + username + "   ----------------------------------");

        Member member = mr.getWithRole(username);
        if(member == null) {
            throw new UsernameNotFoundException(username+" not found");
        }
        MemberDto memberDto=new MemberDto(
                member.getMemberId(),
                member.getPassword(),
                member.getName(),
                member.getNickname(),
                member.getPhone(),
                member.getEmail(),
                member.getGender(),member.getBirth(),member.getZipCode(),member.getAddress(),
                member.getAddressDetail(),member.getAddressExtra(),member.getImage(),member.getProvider(),member.getMemberKey(),
                member.getIntroduction(),
                member.getMemberRoleList().stream().map(roleName -> roleName.name()).collect(Collectors.toList())
        );

        //System.out.println(memberDto);
//        System.out.println(member);
        return memberDto;
    }
}
