# Stage 1: Build the application with Maven
FROM maven:3.8.4-openjdk-11 AS build
COPY . /app
WORKDIR /app
RUN mvn clean package -DskipTests

# Stage 2: Build the application image
FROM gcr.io/distroless/java:11
COPY --from=build /app/target/theroamingkitchen-0.0.1-SNAPSHOT.jar /app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]