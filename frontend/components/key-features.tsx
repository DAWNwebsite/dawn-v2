import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const index = [
  {
    imageUrl: process.env.NEXT_PUBLIC_KEY_FEATURE_IMAGE_1 || "",
    title: "AI Powered Learning Spaces",
    text: "Interactive, accessible, and tailored to each learner’s needs.",
  },
  {
    imageUrl: process.env.NEXT_PUBLIC_KEY_FEATURE_IMAGE_2 || "",
    title: "AI language Learning",
    text: "Courses designed with local languages and cultural relevance in mind",
  },
  {
    imageUrl: process.env.NEXT_PUBLIC_KEY_FEATURE_IMAGE_3 || "",
    title: "Inclusive LMS",
    text: "Some text about feature Tools for students with special needs, including dyslexia-friendly layouts, sign language support, and adaptive learning techniques.",
  },
  {
    imageUrl: process.env.NEXT_PUBLIC_KEY_FEATURE_IMAGE_4 || "",
    title: "AI Spaces For Teachers",
    text: "Collaborate, create, and engage with students using advanced, inclusive AI-powered tools.  ",
  },
];

const KeyFeatures = () => {
  return (
    <section className="space-y-8 justify-items-center py-24">
      <div className="text-center font-bold text-2xl">
        <h1>Key Features</h1>
        <Image
          src={"/images/curve2.png"}
          width={100}
          height={100}
          alt="curve"
          className=" ml-20"
        />
      </div>
      <div className="cirle-container relative px-7 lg:px-0 md:px-8 ">
        <Image
          alt={"circle"}
          src={"/images/circle.png"}
          width={80}
          height={200}
          className="absolute lg:top-[-27px] lg:left-[150px] lg:block md:block md:top-[-30px] md:left-0 hidden"
        />
        <Image
          alt={"contact"}
          src={"/images/contact.png"}
          width={110}
          height={200}
          className="absolute lg:top-[380px] lg:left-[140px] lg:block md:block md:top-[370px] md:left-[-10px] hidden z-[99]"
        />
        <Image
          alt={"book"}
          src={"/images/book.png"}
          width={110}
          height={200}
          className="absolute lg:top-[470px] lg:left-[170vh] lg:block md:block md:top-[520px] md:left-[650px] hidden z-[99]"
        />
        <div className="grid gap-8 md:grid-cols-2 text-center lg:px-[200px] ">
          {index.map((item, i) => (
            <Card className="p-2 z-[1]" key={i}>
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={130}
                height={200}
                className="justify-self-center"
              />
              <h2 className="text-base font-bold">{item.title}</h2>
              <p className="text-[15px] text-gray-500 text-center px-10 py-4 md:text-[13px]">
                {item.text}
              </p>
            </Card>
          ))}
        </div>
      </div>
      <Button className="justify-self-center rounded-full bg-white text-[#883e96] border-2 border-[#883e96] hover:text-white hover:border-none">
        Explore our solutions
      </Button>
    </section>
  );
};

export default KeyFeatures;
