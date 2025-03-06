package com.himedia.projectteamdive.repository;

import com.himedia.projectteamdive.entity.Allpage;
import com.himedia.projectteamdive.entity.Pagetype;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AllpageRepository extends JpaRepository<Allpage, Integer> {


    Allpage findByEntityIdAndPagetype(int entityId, Pagetype pagetype);

}
