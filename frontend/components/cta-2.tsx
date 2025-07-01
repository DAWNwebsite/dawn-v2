import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";

const Cta2 = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 p-4 pt-6 lg:pt-2 lg:pb-12 pb-1 gap-8 px-8 md:px-12">
      <div>
        <Image
          src={process.env.NEXT_PUBLIC_CTA_2_IMAGE || ""}
          width={580}
          height={580}
          alt="cta-img-2"
        />
      </div>
      <div className="space-y-4 flex flex-col justify-center">
        <h1 className="lg:text-2xl text-[18px] text-center font-bold font-raleway lg:text-left md:text-left">
          The Future of Education is Here
        </h1>
        <p
          className=" md:pr-0 lg:pr-[60px] text-[17px] text-gray-500 
        leading-[23px] md:max-w-[600px] text-center lg:text-left md:text-left lg:text-[14px] pr-0"
        >
          We envision a world where education adapts to you—not the other way
          around. With DAWN AI Study, the future of learning is here. From K-12
          students to educators, we are redefining what’s possible in the
          classroom and beyond.
        </p>
        <Button
          className="p-7 lg:p-3 md:p-2 bg-[#620074] rounded-full lg:max-w-[280px] 
        max-w-[270px] mx-auto  lg:mx-0 md:mx-0 text-[15px]"
        >
          Start your learning Journey Today
        </Button>
      </div>
    </section>
  );
};

export default Cta2;
