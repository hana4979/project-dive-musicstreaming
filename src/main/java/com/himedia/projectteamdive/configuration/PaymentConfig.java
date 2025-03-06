package com.himedia.projectteamdive.configuration;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class PaymentConfig {
    @Value("${payment.toss.test_client_api_key}")
    private String clientApiKey;

    @Value("${payment.toss.test_secrete_api_key}")
    private String secretApiKey;

    public static final String URL = "https://api.tosspayments.com/v1/payments/confirm";

}
