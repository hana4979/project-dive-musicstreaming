package com.himedia.projectteamdive;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;

@SpringBootTest
class ProjectTeamDiveApplicationTests {


    @Test
    void contextLoads() {

        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
        System.out.println(pe.encode("1234"));

    }




}
