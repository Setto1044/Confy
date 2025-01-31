import React from "react";
import HomeNavbar from "../../widgets/Navbar/HomeNavbar";
import ConfyBanner from "../../assets/images/home_banner.png";

const HomePage = () => {
  return (
    <div>
      <HomeNavbar/>
      <div className="">
        <img 
          src={ConfyBanner} 
          alt="confy_banner" 
          className="w-full"
        />
      </div>
    </div>
  );
};

export default HomePage;
