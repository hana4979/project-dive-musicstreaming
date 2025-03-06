package com.himedia.projectteamdive.controller;

import com.himedia.projectteamdive.dto.CartRequestDto;
import com.himedia.projectteamdive.entity.Music;
import com.himedia.projectteamdive.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    CartService cs;

    /* 장바구니에 구매할 곡 넣기 */
    @PostMapping("/insertCart")
    public HashMap<String, Object> insertCart(
            @RequestBody CartRequestDto requestDto) {
        HashMap<String, Object> result = new HashMap<>();
        cs.insertCart(requestDto);
        return result;
    }

    /* 장바구니 조회 */
    @GetMapping("/getCartList")
    public HashMap<String, Object> getCartList(@RequestParam("memberId") String memberId){
        HashMap<String, Object> result = new HashMap<>();
        result.put("cartList", cs.getCartList(memberId));
        return result;
    }

    /* 장바구니 개별 삭제 */
    @DeleteMapping("/deleteByCartId")
    public HashMap<String, Object> deleteByCartId(@RequestParam("cartId") int cartId) {
        HashMap<String, Object> result = new HashMap<>();
        cs.deleteByCartId(cartId);
        result.put("message", "yes");
        return result;
    }

    /* 장바구니 선택 삭제 */
    @DeleteMapping("/deleteByCartIdList")
    public HashMap<String, Object> deleteByCartIdList(@RequestBody List<Integer> cartIdList) {
        HashMap<String, Object> result = new HashMap<>();
        cs.deleteByCartIdList(cartIdList);
        result.put("message", "yes");
        return result;
    }
}
