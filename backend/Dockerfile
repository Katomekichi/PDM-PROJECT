# ---- Build stage ----
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn -q dependency:go-offline

COPY src ./src
RUN mvn -q clean package -DskipTests

# ---- Run stage ----
FROM eclipse-temurin:21-jre

WORKDIR /app

RUN useradd -ms /bin/bash pdm

COPY --from=build /app/target/pdm-service-*.jar app.jar

USER pdm

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]