import MiniHero from "@/components/mini-hero";
import Features from "@/components/features";
import Cta from "@/components/cta";
import Banner from "@/components/banner";
import React from "react";
import Image from "next/image";
const AISpaces = () => {
  return (
    <section className="space-y-4">
      <Banner
        title="Asl Learning For Students With Special needs"
        for="ai_spaces"
      />
      <MiniHero
        mini_title="Welcome to AIDA Spaces:"
        title="Spark Creativity. Build Knowledge."
        primary_text="Designed specifically for K-12 learners, AIDA Spaces combines interactive learning with fun and gamification to create an immersive educational experience that feels like an adventure. Whether you’re here to explore new topics or strengthen your understanding of core subjects, AIDA Spaces makes every step engaging and memorable."
        image={process.env.NEXT_PUBLIC_AI_SPACES_HERO_IMAGE_1 || ""}
        image_direction="right"
        button="Explore All Spaces"
      />
      <Image
        alt={"arrow"}
        src={"/images/arr.png"}
        width={300}
        height={100}
        className=" absolute lg:right-[180px] md:rotate-[320deg] md:right-[10px] md:top-[680px] lg:top-[790px] z-[-20] lg:block md:block hidden"
      />

      <MiniHero
        title="Learn at Your Own Pace, in Your Own Way"
        primary_text="AIDA Spaces understands that every learner is unique. With our self-paced modules, students can progress through lessons at a speed that feels right for them, revisiting challenging concepts or skipping ahead when they feel ready. This flexibility empowers each learner to feel confident and in control of their education."
        image={process.env.NEXT_PUBLIC_AI_SPACES_HERO_IMAGE_2 || ""}
        image_direction="left"
        button="Get Started Now"
      />
      <Image
        alt={"arrow"}
        src={"/images/arr.png"}
        width={300}
        height={100}
        className=" absolute lg:rotate-[340deg] lg:left-[230px] lg:top-[1300px] md:rotate-[-60deg] md:left-[100px] md:top-[1130px] z-[-20] lg:block md:block hidden"
      />

      <MiniHero
        title="Why Choose AIDA Spaces?"
        primary_text="AIDA Spaces isn’t just a learning tool – it’s a gateway to a world of possibilities. We’re here to make education immersive, inclusive, and inspiring for today’s learners, nurturing skills that extend beyond the classroom."
        image={process.env.NEXT_PUBLIC_AI_SPACES_HERO_IMAGE_3 || ""}
        image_direction="right"
        button="Create Your Own Space"
      />
      <Features
        title="What Makes AIDA Spaces Different?"
        images={[
          process.env.NEXT_PUBLIC_AI_SPACES_FEATURES_IMAGE_1 || "",
          process.env.NEXT_PUBLIC_AI_SPACES_FEATURES_IMAGE_2 || "",
          process.env.NEXT_PUBLIC_AI_SPACES_FEATURES_IMAGE_3 || "",
          process.env.NEXT_PUBLIC_AI_SPACES_FEATURES_IMAGE_4 || "",
        ]}
      />

      <div className="relative">
        <Cta
          title="Ready To Start Your Adventure?"
          button="Get Started Now"
          image={process.env.NEXT_PUBLIC_STUDENT_CTA_IMAGE || ""}
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

export default AISpaces;
