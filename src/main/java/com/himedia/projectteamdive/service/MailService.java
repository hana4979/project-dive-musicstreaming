package com.himedia.projectteamdive.service;

import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.repository.MemberRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
@Transactional
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender JMSender;
    @Value("{spring.mail.username}")
    private static String senderEmail;
    private static String authKey;

    private static int codeLength;
    private static String authSecret = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom random = new SecureRandom();


    public String sendMail(String email) {
        int codeLength = 8;
        MimeMessage message = JMSender.createMimeMessage();
        authKey = generateAuthkey(8);
        System.out.println(authKey);

        try {
            message.setFrom(senderEmail);   // 보내는 사람
            message.setRecipients(MimeMessage.RecipientType.TO, email);  // 받는 사람
            message.setSubject("[인증코드] Dive의 회원가입을 위한 인증코드 발송");    // 이메일 제목
            String mailContent ="";
            mailContent += "<h2>" + "Dive 회원 가입을 위한 인증 코드입니다."+"</h2>";
            mailContent += "<h1 style='color:blue; fontweight:bold'>" + authKey +"</h1>";
            mailContent += "<h2>" + "회원가입 이메일 인증란에 정확히 입력해주세요."+"</h2>";
            mailContent += "<h2>" + "감사합니다."+"</h2>";
            message.setText(mailContent, "UTF-8", "html");
        } catch (MessagingException e) {
            throw new RuntimeException("이메일 전송 실패",e);
        }
        JMSender.send(message); // 구성 완료된 message 를  JMSender 로 전송
        return authKey;


    }

    private static String temporaryPassword;

    @Autowired
    MemberRepository mr;

    BCryptPasswordEncoder pe = new BCryptPasswordEncoder();

    public String sendMailForPassword(String memberId, String email) {

        int codeLength = 10;
        MimeMessage message = JMSender.createMimeMessage();
        temporaryPassword = generateAuthkey(10);
        System.out.println(temporaryPassword);

        try {
            message.setFrom(senderEmail);   // 보내는 사람
            message.setRecipients(MimeMessage.RecipientType.TO, email);  // 받는 사람
            message.setSubject("[임시 비밀번호] Dive의 임시 비밀번호 발송");    // 이메일 제목
            String mailContent ="";
            mailContent += "<h2>" + "Dive 임시 비밀번호입니다."+"</h2>";
            mailContent += "<h1 style='color:blue; fontweight:bold'>" + temporaryPassword +"</h1>";
            mailContent += "<h2>" + "임시번호 인증란에 정확히 입력해주세요."+"</h2>";
            mailContent += "<h2>" + "감사합니다."+"</h2>";
            message.setText(mailContent, "UTF-8", "html");

            Member updateMember = mr.findByMemberId(memberId);
            updateMember.setPassword(pe.encode(temporaryPassword));
            mr.save(updateMember);

        } catch (MessagingException e) {
            throw new RuntimeException("이메일 전송 실패",e);
        }
        JMSender.send(message); // 구성 완료된 message 를  JMSender 로 전송
        return temporaryPassword;

    }

    private String generateAuthkey(int length) {

        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < length; i++) {
            sb.append(authSecret.charAt(random.nextInt(authSecret.length())));
        }
        return sb.toString();
    }
}
