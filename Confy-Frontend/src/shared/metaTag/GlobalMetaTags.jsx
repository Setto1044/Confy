import { Helmet } from "react-helmet-async";

function GlobalMetaTags() {
  return (
    <Helmet>
      <title>Confy</title>

      {/* Open Graph 메타 태그 */}
      <meta property="og:title" content="Confy - 실시간 회의 요약 & 시각화" />
      <meta property="og:description" content="회의를 자동으로 요약하고, 다양한 시각화 방식으로 내용을 정리하세요!" />
      <meta property="og:image" content="https://i12a508.p.ssafy.io/assets/images/confy-thumbnail.png?v=3" />
      <meta property="og:url" content="https://i12a508.p.ssafy.io/" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Confy" />

      {/* Twitter 카드 메타 태그 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Confy - 실시간 회의 요약 & 시각화" />
      <meta name="twitter:description" content="회의를 자동으로 요약하고, 다양한 시각화 방식으로 내용을 정리하세요!" />
      <meta name="twitter:image" content="https://i12a508.p.ssafy.io/assets/images/confy-thumbnail.png?v=3" />
    </Helmet>
  );
}

export default GlobalMetaTags;
