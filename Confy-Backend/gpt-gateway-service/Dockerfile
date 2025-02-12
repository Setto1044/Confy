FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
COPY images /app/images
EXPOSE 8099
ENTRYPOINT ["java","-jar","app.jar"]