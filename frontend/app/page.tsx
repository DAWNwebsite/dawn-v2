import React from "react";
import Hero from "@/components/hero";
import Features from "@/components/features";
import SocialProof from "@/components/social-proof";
import KeyFeatures from "@/components/key-features";
import SectionTitle from "@/components/section-title";
import Hero2 from "@/components/hero-2";
import Cta2 from "@/components/cta-2";
import Cta from "@/components/cta";
import Testimonials from "@/components/testimonials";

function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Features
        title="Our Mission"
        text="At DAWN AI Study, we believe that every learner, regardless of background or ability, 
deserves access to high-quality education. Our mission is to bridge the gap by offering 
personalized learning experiences, breaking down barriers, and empowering students 
with special needs, teachers, and educational institutions worldwide."
        button="Join Our Global Community"
        images={[
          process.env.NEXT_PUBLIC_FEATURES_IMAGE_1 || "",
          process.env.NEXT_PUBLIC_FEATURES_IMAGE_2 || "",
          process.env.NEXT_PUBLIC_FEATURES_IMAGE_3 || "",
        ]}
      />
      <KeyFeatures />
      <div
        className="text-center aspect-video bg-black text-xl w-[360px] lg:w-[1000px] lg:h-[400px] 
      md:w-[600px] md:h-[400px] rounded-xl justify-self-center py-12"
      >
        video
      </div>
      <SectionTitle
        title="Accessibiliity Features at DAWN AI Study"
        text="At DAWN AI Study, we believe that education should be inclusive and accessible to all. Our platform 
integrates advanced AI tools designed to support students with special needs, 
ensuring that everyone can learn without barriers."
      />
      <Hero2 />
      <Testimonials />
      <Cta2 />
      <Cta
        title="Discover how Dawn AI study can empower you"
        button="Get Started Now"
        image={process.env.NEXT_PUBLIC_CTA_IMAGE_1 || ""}
      />
    </>
  );
}

export default Home;
