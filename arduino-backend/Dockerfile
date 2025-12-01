FROM maven:3.9.6-eclipse-temurin-21 as builder

WORKDIR /app

COPY pom.xml .

RUN --mount=type=cache,target=/root/.m2 mvn dependency:go-offline -B

COPY src ./src

RUN --mount=type=cache,target=/root/.m2 mvn package -DskipTests -B

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

RUN groupadd --system spring && useradd --system --gid spring spring
USER spring

COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar

EXPOSE 8000

ENV JAVA_OPTS=""

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]