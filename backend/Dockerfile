# Stage 1: Build the application with Maven
FROM maven:3.8.4-eclipse-temurin-17 AS build

# Set the working directory inside the container for this stage
WORKDIR /app

# Copy the Maven project file (pom.xml) to the working directory
COPY pom.xml .

# Download project dependencies without requiring network during the actual build
RUN mvn dependency:go-offline

# Copy the source code directory to the working directory
COPY src ./src

# Clean the project and build the application, skipping unit tests
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre

# Copy the packaged JAR file from the 'build' stage to the /app directory in this stage
COPY --from=build /app/target/*.jar /app/app.jar

# Define the entry point for the container, which will execute the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]