package com.himedia.projectteamdive.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
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

    private static final int codeLength = 8;
    private static String authSecret = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom random = new SecureRandom();


    public String sendMail(String email) {

        MimeMessage message = JMSender.createMimeMessage();
        authKey = generateAuthkey();
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

    private String generateAuthkey() {

        StringBuilder sb = new StringBuilder(codeLength);
        for(int i = 0; i < codeLength; i++) {
            sb.append(authSecret.charAt(random.nextInt(authSecret.length())));
        }
        return sb.toString();
    }
}
