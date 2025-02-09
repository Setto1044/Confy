# 1. Node.js 20 베이스 이미지 사용
FROM node:20

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json과 package-lock.json 복사
COPY package*.json ./ 

# 4. 의존성 설치
RUN npm install 

# 5. 소스 코드 복사
COPY . .

# 6. 환경 변수 설정 (파일 변경 감지)
ENV CHOKIDAR_USEPOLLING=true

# 7. React 개발 서버 실행
CMD ["npm", "start"]