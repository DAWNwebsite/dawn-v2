import MiniHero from "@/components/mini-hero";
import Cta from "@/components/cta";
import Banner from "@/components/banner";
import React from "react";
import Image from "next/image";
const AILearning = () => {
  return (
    <section className="relative space-y-4">
      <Banner
        title="Al Learning For Students With Special needs"
        for="ai_learning"
      />
      <MiniHero
        mini_title="Bridging Cultural Gaps:"
        title="AI Learning Tailored for Every Learner"
        primary_text="Our AI-powered language learning tool helps students and teachers engage in culturally relevant and locally adapted lessons. Learn languages in a way that’s meaningful and accessible."
        image={process.env.NEXT_PUBLIC_AI_LEARNING_HERO_IMAGE_1 || ""}
        image_direction="right"
        button="Start Learning"
      />
      <Image
        alt={"arrow"}
        src={"/images/arr.png"}
        width={300}
        height={100}
        className=" absolute lg:right-[180px] md:rotate-[320deg] md:right-[10px] md:top-[620px] lg:top-[710px] z-[-20] 
        lg:block md:block hidden"
      />
      <MiniHero
        title="Learning In Your Local Language"
        primary_text="From the classroom to your home, DAWN AI Study offers language learning tools that are tailored to your region. Whether you’re a teacher offering bilingual courses or a student learning in your local dialect, our platform supports you."
        image={process.env.NEXT_PUBLIC_AI_LEARNING_HERO_IMAGE_2 || ""}
        image_direction="left"
        button="Get Started Now"
      />
      <Image
        alt={"arrow"}
        src={"/images/arr.png"}
        width={300}
        height={100}
        className=" absolute lg:rotate-[340deg] lg:left-[230px] lg:top-[1200px] md:rotate-[-60deg] md:left-[100px] md:top-[1050px] z-[-20] lg:block md:block hidden"
      />
      <MiniHero
        title="Engage with the World"
        primary_text="Explore the world of language with AI that adapts to your learning pace, needs, and goals. Our platform allows for both personalized lessons and global engagement, empowering learners of all backgrounds."
        image={process.env.NEXT_PUBLIC_AI_LEARNING_HERO_IMAGE_1 || ""}
        image_direction="right"
        button="Get Started Now"
      />

      <div className="relative">
        <Cta
          title="Start Learning a new Language Today"
          button="Get Started Now"
          image={process.env.NEXT_PUBLIC_AI_LEARNING_CTA_IMAGE || ""}
          imgh={500}
          imgw={500}
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

export default AILearning;
