import React from "react";
import companyLogo from "../../public/LiveCodeX logo red.json";
import Lottie from "lottie-react";
import { Roboto, Sen } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});
const sen = Sen({
  weight: "400",
  subsets: ["latin"],
});

const Logo2 = () => {
  return (
    <div className="flex items-center">
      <div className="w-10">
        <Lottie
          loop={true}
          animationData={companyLogo}
          height={10}
          width={10}
        />
      </div>
      <div className="font-bold text-2xl logoColor">
        LiveCode
        <span className={sen.className}>
          <span className="logoColor2">X</span>
        </span>
      </div>
    </div>
  );
};

export default Logo2;
