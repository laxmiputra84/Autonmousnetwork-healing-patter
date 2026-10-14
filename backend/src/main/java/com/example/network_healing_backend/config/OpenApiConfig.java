package com.example.network_healing_backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI networkHealingOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Autonomous Network Healing Platform REST API")
                        .description("Production REST API and Autonomous Engine for Network Topology, Fault Injection, AI-driven RCA, and Autonomous Remediation Pipelines.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Network Reliability Engineering")
                                .email("nre-core@network-healing.internal"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://springdoc.org")));
    }
}
