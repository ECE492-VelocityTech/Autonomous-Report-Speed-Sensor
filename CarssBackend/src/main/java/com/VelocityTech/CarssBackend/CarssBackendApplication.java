package com.VelocityTech.CarssBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.VelocityTech.CarssBackend")
public class CarssBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CarssBackendApplication.class, args);
	}

}
