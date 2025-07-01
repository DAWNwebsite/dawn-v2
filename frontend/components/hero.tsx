import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
const Hero = () => {
  return (
    <section
      className=" relative px-2 grid gap-12  rounded-br-[200px] lg:gap-1 lg:grid-cols-2 md:grid-cols-2 md:gap-1
    bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] to-[#FF9A7A1A] from-[#F88C3D1A] md:pb-5 "
    >
      <div className="pt-24 md:pt-20 lg:pt-32 space-y-3  md:px-1 lg:px-8 text-center md:text-left">
        <div className="rounded-xl bg-[#D24D6542] bg-opacity-5 p-2 w-fit mx-6 lg:mx-0 md:mx-0">
          <h2 className="text-[#620074] text-[14px] justify-center lg:justfy-self-start lg:text-4 md:text-[14px]">
            <span className="font-bold">First Dyslexic Friendly</span> Edtech
            Platform In Africa🌸
          </h2>
        </div>
        <h1 className="text-4xl text-center px-6 md:text-4xl lg:text-5xl md:text-left lg:text-left md:px-0 md:px-0">
          {/* Empowering <br className="md:hidden" /> */}
          <span className="font-semibold">Empowering </span>
          <span className="font-bold text-[#620074] underline decoration-orange-400">
            Inclusive learning
          </span>
          {/* <br className="md:hidden" /> */}
          <span className="font-semibold"> for all</span>
        </h1>
        <p className="text-gray-500 px-4 md:px-0 lg:px-0 lg:pr-11 lg:pt-5 lg:text-[15px] md:text-[14px] md:pt-4">
          At DAWN AI Study, we’re revolutionizing education by building a future
          where learning is accessible, personalized, and inspiring. Whether
          you’re a student, teacher, or lifelong learner, our AI-driven platform
          adapts to your needs, making education inclusive for everyone.
        </p>
        <Button className="rounded-full mt-6 lg:mt-5 md:mt-6">
          Start Your Learning Journey Today
        </Button>
      </div>
      <div className="">
        <Image
          src={
            "https://utfs.io/f/ERfZs2vvQm4VAfmgTzHmFPlH8w92bdJUVfiXMY5ckEQ4OuSq"
          }
          alt="hero-img"
          width={600}
          height={400}
          className="w-full"
        />
        <div className="absolute hidden lg:block md:block lg:bottom-[-84px] lg:right-[94px] md:bottom-[-50px] md:right-[28px] md:z-[-3]">
          <Image
            src={"/images/arr.png"}
            alt="hero-img"
            width={600}
            height={400}
            className="w-full object-contain object-fit"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
