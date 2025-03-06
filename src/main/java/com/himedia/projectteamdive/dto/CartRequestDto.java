package com.himedia.projectteamdive.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CartRequestDto {
    private String memberId;
    private List<Integer> musicIdList;
}
