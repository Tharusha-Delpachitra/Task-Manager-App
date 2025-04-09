package com.app.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load(); // Load environment variables

		SpringApplication application = new SpringApplication(BackendApplication.class);

		// A listener to set the environment properties
		application.addListeners(applicationContext -> {
			Dotenv loadedDotenv = Dotenv.load();
			loadedDotenv.entries().forEach(entry -> {
				System.setProperty(entry.getKey(), entry.getValue());
			});
		});

		ConfigurableApplicationContext context = application.run(args);
	}
}