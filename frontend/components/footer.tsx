import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";

const footer_arr = [
  {
    title: "Company",
    items: ["About Us", "Product Demo", "Terms of Use", "Dyslexia Awerness"],
  },
  {
    title: "Solutions",
    items: [
      "For Students",
      "For Educators",
      "AI powered Learning",
      "AI Jobs Hub",
    ],
  },
];

const Footer = () => {
  return (
    <section
      className="w-full grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 px-4 
      lg:px-12 md:px-10 pt-12 lg:pt-24 md:pt-20 lg:gap-16 md:gap-4 
    bg-[#151215] text-white h-[600px] lg:h-[388px] md:h-[330px]"
    >
      <div className="space-y-4 px-2">
        <Image
          src={"/images/logo.jpg"}
          width={128}
          height={28}
          alt="dawn-logo"
          className="bg-white"
        />
        <p className="text-sm">
          Stay Up to Date with The latest updates on Dawn Ai
        </p>
        <div className="rounded-full flex lg:justify-between md:justify-between bg-white lg:p-1 md:p-1 p-1 justify-items-end gap-1 ">
          <input
            type="text"
            placeholder="Enter your email address"
            className="lg:min-w-[70%] md:min-w-[70%] min-w-[60%] rounded-full placeholder:px-6 focus:border-none focus:outline-none text-black px-6"
          />
          <Button className=" rounded-full bg-[#86019D] w-[240px] py-4 lg:w-[350px] md:w-[350px] md:py-0 lg:py-0 ">
            Subscribe
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:justify-items-end lg:justify-items-end justify-items-start">
        {footer_arr.map((item, i) => (
          <div key={i} className=" space-y-4">
            <h1 className="font-bold">{item.title}</h1>
            <ul className="space-y-3 text-[#B8B8B8]">
              {item.items.map((itm, i) => (
                <li
                  key={i}
                  className="text-[14px] hover:text-white hover:text-[15px] transition-all duration-300 cursor-pointer"
                >
                  {itm}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="px-0 md:px-10 lg:px-10 space-y-2 md:space-y-2 md:pb-[10px]">
        <h1 className="">Contact Us</h1>
        <p className="text-[14px]">info@dawnaistudy.com</p>
      </div>
    </section>
  );
};

export default Footer;
