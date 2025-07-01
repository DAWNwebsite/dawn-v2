import MiniHero from "@/components/mini-hero";
import Cta from "@/components/cta";
import Banner from "@/components/banner";
import React from "react";
import Image from "next/image";

const Educators = () => {
  return (
    <section className="lg:space-y-6">
      <Banner
        title="Al Learning For Students With Special needs"
        for="educators"
      />
      <div className="relative px-[30px]">
        <MiniHero
          mini_title="Revolutionizing Teaching"
          title="Empower Educators with AI Tools"
          primary_text="For educators, DAWN AI Study is a tool that simplifies the teaching process while enhancing the learning experience for all students—especially those with special needs."
          image={process.env.NEXT_PUBLIC_EDUCATORS_HERO_IMAGE_1 || ""}
          image_direction="right"
          button="Get Started Now"
        />
        <Image
          alt={"arrow"}
          src={"/images/arr.png"}
          width={300}
          height={100}
          className=" absolute lg:right-[180px] md:rotate-[320deg] md:right-[10px] md:top-[320px] lg:top-[410px] z-[-20] lg:block md:block hidden"
        />
        <MiniHero
          title="Build Inclusive Courses with ease"
          primary_text="Our AI-powered tools help you create courses that adapt to every student’s needs. Use AI-assisted course templates that ensure lessons are accessible, inclusive, and engaging."
          image={process.env.NEXT_PUBLIC_EDUCATORS_HERO_IMAGE_2 || ""}
          image_direction="left"
          button="Get Started Now"
        />
        <Image
          alt={"arrow"}
          src={"/images/arr.png"}
          width={300}
          height={100}
          className=" absolute lg:rotate-[340deg] lg:left-[250px] lg:top-[900px] md:rotate-[-60deg] md:left-[100px] md:top-[760px] z-[-20] lg:block md:block hidden"
        />
        <MiniHero
          title="Real-Time Feedback and Analytics"
          primary_text="Track student progress, receive instant feedback, and make adjustments to your lessons based on real-time analytics. Whether you’re teaching online or in-person, our tools allow you to create an inclusive environment for all students."
          image={process.env.NEXT_PUBLIC_EDUCATORS_HERO_IMAGE_3 || ""}
          image_direction="right"
          button="Get Started Now"
        />
      </div>

      <div className="relative">
        <Cta
          title="Experience a Learning Environment Built for You"
          button="Jump Right In"
          image={process.env.NEXT_PUBLIC_EDUCATORS_CTA_IMAGE || ""}
          // imgw={350}
          // imgh={280}
        />
        <Image
          alt={"circle"}
          src={"/images/circle.png"}
          width={100}
          height={100}
          className="absolute top-[40px] lg:block md:block hidden rotate-[160deg] lg:z-[-10] md:z-[-10]"
        />
      </div>
    </section>
  );
};

export default Educators;
