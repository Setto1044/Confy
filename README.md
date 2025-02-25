# 회의를 더 스마트하게, Confy 👨‍💻

<img src="assets/랜딩페이지.gif" width="100%" />

## 📅 프로젝트 정보

<p align="center">

<h3>SSAFY 12기 2학기 공통 프로젝트</h3>

2025.01.06(월) ~ 2025.02.21(금) [7주]

<a href="https://youtu.be/LS8G4rlMbOE">
  <img src="assets/thumbnail.png" width="500px" />
</a>

</br>

<a href="https://youtu.be/LS8G4rlMbOE" >😎 영상 포트폴리오 바로가기</a>

</p>


## 📖 주제

**실시간 회의 요약** 및 **시각화** 서비스

- 🎞️ WebRTC를 기반으로 화상회의 기능을 지원
- 📊 STT를 활용한 회의 자동 요약을 제공

![subject](assets/홈화면.gif)

## 📝 주요 기능

### ✏️ 실시간 회의 요약

Confy는 실시간 회의 요약 및 회의 스크립트를 제공합니다.

- 실시간 회의 스크립트

회의 중 사용자의 발언을 STT(Speech-to-Text) 기술로 실시간 변환하여 회의 스크립트를 자동 생성하며, 새로운 발언이 추가될 때마다 스크립트가 자동으로 스크롤됩니다.

- 실시간 회의 요약

회의 내용을 효율적으로 정리할 수 있도록 회의 요약 옵션을 지원합니다.
사용자는 원하는 시간대를 입력하여 해당 시간의 회의 요약을 받을 수 있습니다. 5분 전, 10분 전, 30분 전 요약 또는 전체 요약 버튼을 제공하여 사용자의 편의성을 높였습니다. 마크다운 형식의 요약도 제공합니다.

</br>

|                  실시간 스크립트                  |                 회의 요약 요청                 |
| :-------------------------------------------: | :--------------------------------------------: |
| <img src="assets/회의스크립트.gif"> | <img src="assets/회의요약요청.gif"> |

</br>

### 🎨 회의 시각화

Confy는 회의 내용을 직관적으로 이해할 수 있도록 시각화 기능을 제공합니다.

- 회의 스크립트

회의 중 생성된 스크립트와 요약 내용을 바탕으로 주요 키워드를 태그 형태로 제공하며, 이를 통해 회의의 핵심 내용을 빠르게 파악할 수 있습니다.

- 회의 요약 정리

회의 요약을 마크다운 형식으로 정리하여 내용 조회 및 수정이 가능하며, 이를 바탕으로 회의 내용을 시각적으로 표현하는 기능을 지원합니다.

- 회의 시각화 조회 및 수정

사용자는 텍스트 및 시각화 노드 수정이 가능하며, 원하는 형태로 이미지로 저장할 수도 있어 효과적인 회의 기록 및 공유가 가능합니다.

</br>


|                 회의 기록 조회 및 시각화 수정                |
| :----------------------------------------------------: |
| <img src="assets/회의_종료_후_수정.gif" width="800px"> |



<!-- |                   스크립트 제공                   |                  요약 정리                    |
| :-------------------------------------------: | :------------------------------------------: |
| <img src="assets/회의_종료_후_수정.gif"> | <img src="aasets/none.gif"> |

|                  시각화                  |                    시각화 수정                    |
| :-----------------------------------------: | :---------------------------------------------: |
| <img src="aasets/none.gif"> | <img src="aasets/none.gif"> | -->

</br>

<!-- ### ✅ 무제

Confy는 **내용**을 지원합니다.

</br>

|                  무제                  |                 무제                 |
| :-------------------------------------------: | :--------------------------------------------: |
| <img src="images/none.gif"> | <img src="images/none.gif"> |

</br>

### ✏ 무제

Confy는 **내용**를 관리합니다.

- 설명1

    - 세부 설명

    - 세부 설명

- 설명2

  </br>

|                 내용                 |
| :----------------------------------------------------: |
| <img src="images/none.gif" width="800px"> |

  </br> -->


## 📌 ERD (Entity-Relationship Diagram)

<img src="assets/ERD.png" width="800px">

 </br>

## ⚒️ 기술 스택

### 🖥️ Backend

| Tech Stack      | Description                                                                                                                                                                                                                                |
| :-------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | <img src="https://img.shields.io/badge/spring 3.4.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="springboot"> |
| JDK        | <img src="https://img.shields.io/badge/JDK17%28jdk 17.0.14%29-000000?style=for-the-badge&logo=openjdk&logoColor=white" alt="openjdk"> |
| Build Tool      | <img src="https://img.shields.io/badge/Maven compiler 3.10.1-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" alt="apachemaven"> |
| Database        | <img src="https://img.shields.io/badge/MySQL 8.0.40-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="mysql"> <img src="https://img.shields.io/badge/Redis 7.4.2-FF4438?style=for-the-badge&logo=redis&logoColor=white" alt="redis"> |
| Libraries      | <img src="https://img.shields.io/badge/OpenVidu v3-333333?style=for-the-badge&logo=webrtc&logoColor=white" alt="webrtc"> <img src="https://img.shields.io/badge/Azure STT SDK 1.42.0-40AEF0?style=for-the-badge&logo=microsoft&logoColor=white" alt="microsoft"> <img src="https://img.shields.io/badge/GPT 3.5 Turbo-191A1B?style=for-the-badge&logo=gpt&logoColor=white" alt="gpt"> |
| Web Server      | <img src="https://img.shields.io/badge/Caddy 2.8.4-1F88C0?style=for-the-badge&logo=caddy&logoColor=white" alt="caddy"> |
| IDE     | <img src="https://img.shields.io/badge/intellij-000000?style=for-the-badge&logo=intellijidea&logoColor=white" alt="intellijidea"> |

</br>

### 🖥️ Frontend

| Tech Stack      | Description                                                                                                                                                                                                                                |
| :-------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework        | <img src="https://img.shields.io/badge/react 18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="react"> |
| Styling        | <img src="https://img.shields.io/badge/tailwind css 4.0.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=black" alt="tailwindcss"> |
| Build Tool        | <img src="https://img.shields.io/badge/Vite 5.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=black" alt="vite"> |
| State Management        | <img src="https://img.shields.io/badge/Redux 9.2.0-764ABC?style=for-the-badge&logo=redux&logoColor=black" alt="redux"> |
| Libraries        | <img src="https://img.shields.io/badge/ReactFlow 11.11.4-FF4B4B?style=for-the-badge&logo=ReactFlow&logoColor=black" alt="ReactFlow"> |

</br>

### 🖥️ DevOps / Deployment

| Tech Stack      | Description                                                                                                                                                                                                                                |
| :-------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Container        | <img src="https://img.shields.io/badge/Docker 26.1.3-2496ED?style=for-the-badge&logo=docker&logoColor=black" alt="docker"> |
| Server        | <img src="https://img.shields.io/badge/AWS EC2 %28Ubuntu 22.04.5 LTS%29-FF9900?style=for-the-badge&logo=amazonec2&logoColor=black" alt="amazonec2"> |
| Deployment URL        | <a href="https://i12a508.p.ssafy.io/" target="_blank"><img src="https://img.shields.io/badge/Confy-3B66BC?style=for-the-badge&logo=Confy&logoColor=black" alt="amazonec2"></a> |


</br>

### 🖥️ Common

|               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Collaboration | <img src="https://img.shields.io/badge/jira-0052CC?style=for-the-badge&logo=jira&logoColor=white" alt="Notion"/> <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white" alt="Notion"/> <img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma"/> |
| Version Control  | <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"/> <img src="https://img.shields.io/badge/gitLAB-fc6d26?style=for-the-badge&logo=gitlab&logoColor=white"/>                   |

</br>

## 🧑🏻 팀원

<table>
    <tr>
      <th scope="col" colspan="4"> Backend </th>
      <th scope="col" colspan="2"> Frontend </th>
    </tr>
    <tr>
      <td>배석진</td>
      <td>김예진</td>
      <td>노영단</td>
      <td>예세림</td>
      <td>강명주</td>
      <td>신유영</td>
    </tr>
    <tr>
      <td>
        <a href="https://github.com/Setto1044"><img src="https://avatars.githubusercontent.com/Setto1044" width=160/></a>
      </td>
      <td>
        <a href="https://github.com/z5zH0"><img src="https://avatars.githubusercontent.com/z5zH0" width=160/></a>
      </td>
      <td>
        <a href="https://github.com/YoungdanNoh"><img src="https://avatars.githubusercontent.com/YoungdanNoh" width=160/></a>
      </td>
      <td>
       <a href="https://github.com/serimmmaime"><img src="https://avatars.githubusercontent.com/serimmmaime" width=160/></a> 
      </td>
      <td>
        <a href="https://github.com/notrealsilk"><img src="https://avatars.githubusercontent.com/notrealsilk" width=160/></a>
      </td>
      <td>
         <a href="https://github.com/shinyou28"><img src="https://avatars.githubusercontent.com/shinyou28" width=160/></a> 
      </td>
    </tr>
</table>

</br>

<!-- ## 📚 산출물

|                |                                                   |
| :------------: | ------------------------------------------------: |
| File Structure | <img src="assets/none.png" width="300"> | -->
