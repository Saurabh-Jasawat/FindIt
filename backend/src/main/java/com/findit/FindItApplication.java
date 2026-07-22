package com.findit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Entry Point for the FindIt Spring Boot REST API application.
 * 
 * @SpringBootApplication enables Auto-Configuration, Component Scanning,
 * and Configuration properties.
 */
@SpringBootApplication
public class FindItApplication {

    public static void main(String[] args) {
        SpringApplication.run(FindItApplication.class, args);
    }
}
