import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";

type MiniHeroProps = {
  mini_title?: string;
  title?: string;
  primary_text?: string;
  secondary_text?: { title?: string; text: string; accent_color?: string };

  button?: string;
  image: string;
  image_direction: string;
};

const MiniHero: React.FC<MiniHeroProps> = ({
  mini_title,
  title,
  primary_text,
  secondary_text,
  button,
  image,
  image_direction,
}) => {
  return (
    <section
      className=" lg:max-h-[460px] md:max-h-[420px] h-full pt-8 pb-8 
    lg:mx-[30px] md:mx-[13px] md:text-left  lg:text-left"
    >
      <div
        className={`grid gap-0 grid-cols-1 lg:grid-cols-2 md:grid-cols-2 items-center place-items-center p-0 m-0`}
      >
        <Image
          src={image}
          // src={"/images/girl2.jpg"}
          alt={title || mini_title || ""}
          width={440}
          height={440}
          className={`h-[440px] lg:w-[350px] md:w-[300px] w-[400px] max-w-full ${
            image_direction === "left"
              ? "md:order-first order-none lg:justify-self-start md:justify-self-start"
              : "md:order-last order-none lg:justify-self-end md:justify-self-end"
          } object-center object-contain mx-auto justify-items-center`}
        />

        <div className="space-y-4 px-[20px]">
          {mini_title && (
            <h1 className="text-xl text-orange-500">{mini_title}</h1>
          )}
          {title && (
            <h2 className="lg:text-[18px] font-bold md:text[15px] text-[18px] font-raleway pr-0 lg:pr-0 md:pr-0">
              {title}
            </h2>
          )}
          {primary_text && (
            <p className="text-[15px] text-gray-500">{primary_text}</p>
          )}
          {/* {secondary_text && (
            <div className="relative ">
              <div
                className={`absolute h-full w-3 bg-[#620074] rounded-l-lg left-0`}
              />
              <div className="bg-gray-200 rounded-lg p-4 px-8 min-h-[180px]">
                <p className="font-bold">{secondary_text.title}</p>
                <p>{secondary_text.text}</p>
              </div>
            </div>
          )} */}

          {secondary_text && (
            <div className="flex">
              <div
                className={` w-[40px] h-[180px] lg:h-[150px] md:h-[180px] w-3 bg-[#620074] rounded-l-lg `}
              ></div>
              <div className="bg-gray-200 rounded-r-lg p-4 min-h-[100px]">
                <p className="font-bold pb-[10px]">{secondary_text.title}</p>
                <p className="text-gray-500 text-[14px] lg:pr-[35px] md:pr-0">
                  {secondary_text.text}
                </p>
              </div>
            </div>
          )}
          {button && !secondary_text && (
            <Button className="rounded-full w-[250px] lg:mx-0 md:mx-0 lg:py-0 md:py-0 md:w-[150px] lg:w-[180px] py-5">
              {button}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default MiniHero;
