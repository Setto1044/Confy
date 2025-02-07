FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
COPY images /app/images
EXPOSE 8082
ENTRYPOINT ["java","-jar","app.jar"]