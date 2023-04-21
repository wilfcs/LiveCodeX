import React from 'react'
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

const Logo = () => {
  return (
    <div className="flex items-center">
      <div className="w-20">
        <Lottie
          loop={true}
          animationData={companyLogo}
          height={100}
          width={100}
        />
      </div>
      <div className="font-bold text-4xl">
        LiveCode<span className={sen.className}>X</span>
      </div>
    </div>
  );
}

export default Logo