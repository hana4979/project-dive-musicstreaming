package com.himedia.projectteamdive.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.ArrayList;
import java.util.List;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@DynamicUpdate
public class Allpage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "allpage_id")
    private int allpageId;

    @Column(name = "entity_id")
    private int entityId;

    @ElementCollection(fetch = FetchType.EAGER)
    @Builder.Default
    private List<Pagetype> pagetype = new ArrayList<Pagetype>();
}
