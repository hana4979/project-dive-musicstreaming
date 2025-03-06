package com.himedia.projectteamdive.repository;

import com.himedia.projectteamdive.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {

}
