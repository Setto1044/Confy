import React from "react";
import HomeHeader from "../../widgets/Header/HomeHeader";
import ConfyBanner from "../../assets/images/home_banner.png";
import HomeFooter from "../../widgets/Footer/HomeFooter";

const HomePage = () => {
  return (
    <div>
      <HomeHeader />
      <div>
        <img src={ConfyBanner} alt="confy_banner" />
      </div>
      <HomeFooter />
    </div>
  );
};

export default HomePage;
