# 베이스 이미지 선택
FROM openjdk:17-jdk-slim

# 빌드된 JAR 파일을 컨테이너에 복사
COPY target/*.jar app.jar

# 컨테이너 실행 시 실행할 명령어 설정
CMD ["java", "-jar", "app.jar"]

# 5. 문서화를 위한 포트 노출 (실제 개방은 -p 옵션 필요)
EXPOSE 6080