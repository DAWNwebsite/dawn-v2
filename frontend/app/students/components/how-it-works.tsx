import Image from "next/image";
import React from "react";

const items = [
  {
    title: "Accessible Onboarding",
    description:
      "Customize your learning environment from the start, with options for accessibility settings tailored to your needs.",
  },
  {
    title: "Gamified Learning",
    description:
      "Our system breaks down lessons into small, achievable tasks that boost engagement and confidence.",
  },
  {
    title: "Emotional and Learning Support",
    description:
      "Our AI tracks your progress and adapts to provide the emotional and academic support you need to succeed.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 p-8 pb-0 lg:pb-24 lg:px-[50px] md:px-[10px] items-center justify-center">
      <div className="space-y-2 pb-8 md:pb-0">
        <h1 className="lg:text-xl md:text-xl text-[18px] font-bold font-raleway lg:text-left md:text-left text-center lg:pb-[10px] md:pb-[10px] pb-[15px] ">
          How It works
        </h1>
        <div className="space-y-4 ">
          {items.map((item, index) => (
            <div
              key={index}
              className={`${
                index == 0
                  ? "bg-gradient-to-r from-[#620074] to-[#FF6A6A] text-white"
                  : "bg-[#363D880F] bg-opacity-5"
              } rounded-xl text-start p-4 lg:w-[550px] md:w-[400px] w-full  z-[-10]`}
            >
              <h2 className="text-[16px] font-semibold pb-[5px]">
                {item.title}
              </h2>

              <p
                className={`${
                  index == 0 ? "text-white" : "text-gray-500"
                }text-[14px] `}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:justify-self-end md:justify-self-end place-items-center ">
        <Image
          src={"/images/student.jpg"}
          alt="how-it-works"
          width={320}
          height={500}
          className="rounded-2xl lg:mr-[40px] md:w-[300px] lg:w-[320px] md:w-[320px] w-[400px]"
        />
      </div>
      <Image
        alt={"circle"}
        src={"/images/circle.png"}
        width={100}
        height={200}
        className="rotate-[180deg] absolute lg:bottom-[40px] md:bottom-[-60px] lg:block md:block hidden"
      />
    </section>
  );
};

export default HowItWorks;
