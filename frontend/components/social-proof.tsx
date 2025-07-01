"use client";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const stackLogos = [
  {
    image: process.env.NEXT_PUBLIC_UCL_IMAGE,
    name: "UCL",
  },
  {
    image: process.env.NEXT_PUBLIC_VENTURE_HUE_IMAGE,
    name: "Venture Hue",
  },
  {
    image: process.env.NEXT_PUBLIC_TOOLIFY_IMAGE,
    name: "Tooliify AI",
  },
  {
    image: process.env.NEXT_PUBLIC_AI_ZONE_IMAGE,
    name: "AI zones",
  },
];

const SocialProof = () => {
  return (
    <section className=" flex items-center justify-center flex-col mt-40 lg:mt-[90px] md:mt-[90px]">
      <h2 className="font-bold text-xl lg:text-[23px] md:text-[23px]">
        Our Partners
      </h2>
      <Marquee className="flex items-center mt-[30px] lg:mt-[40px] md:mt-10">
        {/* < className="absolute"> */}
        {stackLogos.map((item, i: number) => (
          <Image
            key={i}
            src={item.image || ""}
            alt={item.name}
            className={` w-15 h-10`}
            width={400}
            height={400}
          />
        ))}
        {/* </Marquee> */}
      </Marquee>
    </section>
  );
};

export default SocialProof;
