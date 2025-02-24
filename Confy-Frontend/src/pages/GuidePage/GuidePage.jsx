import React from "react";
import { Link } from "react-router-dom";
import HomeHeader from "../../widgets/Header/HomeHeader";

// GuideCard 컴포넌트의 p 태그 className을 수정
const GuideCard = ({ emoji, title, description }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
    <div className="flex flex-col items-center space-y-4">
      <div className="p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
        <span className="text-3xl">{emoji}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <p className="text-gray-600 text-center whitespace-pre-line">
        {description}
      </p>
    </div>
  </div>
);

const GuidePage = () => {
  const guides = [
    {
      emoji: "👋",
      title: "1. 회원 가입 및 로그인",
      description:
        "Confy를 사용하려면 먼저 회원 가입이 필요합니다.\n로그인 후 다양한 기능을 활용할 수 있습니다.",
    },
    {
      emoji: "🎥",
      title: "2. 화상 회의 시작하기",
      description:
        '우선 그룹을 생성합니다.\n좌측 사이드바의 "+" 버튼을 눌러 그룹을 생성하세요.\n그룹명 옆 "👤+" 버튼 클릭 후, 회원을 초대하여 회의를 시작하세요.',
    },
    {
      emoji: "🗯️",
      title: "3. 회의 실시간 요약",
      description: "회의 중 놓친 구간의 내용을 실시간으로 요약해줍니다.",
    },
    {
      emoji: "📊",
      title: "4. 회의 결과 시각화",
      description: "지난 회의의 요약 이미를 저장해 보고서에 사용하세요.",
    },
  ];

  return (
    <>
      <HomeHeader />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              사용자 가이드
            </h1>
            <p className="text-lg text-gray-600">
              Confy를 보다 효과적으로 사용하는 방법을 안내합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guides.map((guide, index) => (
              <GuideCard key={index} {...guide} />
            ))}
          </div>

          <Link
            to="/"
            className="mt-12 mx-auto block px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300 text-center w-48"
          >
            홈으로 돌아가기
          </Link>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-200 rounded-full opacity-50"></div>
          <div className="absolute top-32 -right-16 w-48 h-48 bg-blue-300 rounded-full opacity-30"></div>
          <div className="absolute -bottom-16 -left-8 w-40 h-40 bg-blue-400 rounded-full opacity-20"></div>
        </div>
      </div>
    </>
  );
};

export default GuidePage;
