import Features from "@/components/features";
import MiniHero from "@/components/mini-hero";
import Cta from "@/components/cta";
import Banner from "@/components/banner";
import React from "react";
import HowItWorks from "./components/how-it-works";
import Image from "next/image";
const Students = () => {
  return (
    <section className="space-y-4 lg:space-y-1 ">
      <Banner
        for="student"
        title="Al Learning For Students With Special needs"
      />
      <MiniHero
        mini_title="Learning Without Limits"
        title="Empowering Students With Special Needs"
        image={process.env.NEXT_PUBLIC_STUDENT_HERO_IMAGE || ""}
        primary_text="We’re on a mission to ensure that no student is left behind. Our AI tools adapt to every learning style and need, offering accessible and engaging education for students with disabilities."
        image_direction="right"
        button="Get Started Now"
      />
      <div className="relative">
        <Features
          title="Tailored Learning For Every Student"
          text="With DAWN AI Study, students with visual, auditory, or learning impairments have access to personalized education. Our platform includes dyslexia-friendly fonts, voice command interfaces, closed captions, and sign language interpretation—all built into our AI-powered lessons."
          images={[
            process.env.NEXT_PUBLIC_STUDENT_FEATURES_IMAGE_1 || "",
            "/images/girl2.jpg",
            process.env.NEXT_PUBLIC_STUDENT_FEATURES_IMAGE_3 || "",
          ]}
        />
        <div className="image absolute top-[230px] right-[20px] md:right-0 z-[-10] md:block lg:block hidden">
          <Image
            alt={"circle"}
            src={"/images/circle.png"}
            width={100}
            height={100}
          />
        </div>
      </div>
      <HowItWorks />
      <Cta
        title="Experience a Learning Environment Built for You"
        button="Jump Right In"
        image={process.env.NEXT_PUBLIC_STUDENT_CTA_IMAGE || ""}
      />
    </section>
  );
};

export default Students;
