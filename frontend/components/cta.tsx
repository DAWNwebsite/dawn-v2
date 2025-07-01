import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const Cta = (props: {
  title: string;
  button: string;
  image: string;
  imgw?: number;
  imgh?: number;
}) => {
  return (
    <section className="justify-items-center lg:pt-50 md:pt-[100px] pt-32 pb-32 p-8">
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl bg-gradient-to-r from-[#86019D] to-[#362F37] h-[200px] 
      relative mx-auto max-w-[1200px]"
      >
        <div className="lg:px-12 px-4 pt-4 md:pt-6 space-y-5 justify-items-center lg:justify-items-start md:justify-items-start">
          <h1
            className="text-white text-[22px] font-normal text-center lg:text-left md:text-left
           lg:text-[29px] lg:font-[600] md:text-xl font-raleway px-[10px] lg:px-0 md:px-0"
          >
            {props.title.replace("Dawn AI", "DAWN AI")}
          </h1>
          <Button
            className="bg-white rounded-full justify-self-center lg:justify-self-start md:justify-self-start text-black 
          md:w-[180px] w-[250px] text-md py-5 hover:text-white transition transition-all duration-300"
          >
            {props.button}
          </Button>
        </div>
        <div className="absolute lg:top-[-170px] lg:right-0 hidden lg:block md:block md:top-[-110px] md:right-[-30px]">
          <Image
            src={props.image ? props.image : ""}
            alt="cta-img"
            width={400}
            height={150}
            className={`lg:justify-self-end md:justify-self-end md:w-[250px] lg:w-[300px]`}
          />
        </div>
      </div>
    </section>
  );
};

export default Cta;
