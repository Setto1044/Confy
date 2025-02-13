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

# 6. 개발 서버 실행 (포트 5080)
EXPOSE 5080
CMD ["npm", "start"]