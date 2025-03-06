package com.himedia.projectteamdive.dto;

import com.himedia.projectteamdive.entity.Gift;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GiftRequestDto {
    private String giftName;
    private String giftTo;
    private String giftFrom;

    public GiftRequestDto(String giftName, String giftTo, String giftFrom) {
        this.giftName = giftName;
        this.giftTo = giftTo;
        this.giftFrom = giftFrom;
    }

    public Gift toEntity(){
        return Gift.builder()
                .giftName(giftName)
                .giftTo(giftTo)
                .giftFrom(giftFrom)
                .build();
    }
}
