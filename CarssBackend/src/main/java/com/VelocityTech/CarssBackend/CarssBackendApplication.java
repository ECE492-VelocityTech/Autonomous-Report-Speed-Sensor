package com.VelocityTech.CarssBackend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.VelocityTech.CarssBackend")
public class CarssBackendApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();
		System.out.println("GOOGLE_API_KEY: " + dotenv.get("GOOGLE_API_KEY"));

		SpringApplication.run(CarssBackendApplication.class, args);
	}

}
