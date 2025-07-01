import React from "react";
import MiniHero from "@/components/mini-hero";

const secondary_text_1 = {
  title: "Emotional Impact",
  text: "Our AI tools also consider the emotional impact of learning, providing support and encouragement to keep students motivated.",
  accent_color: "#620074",
};
const secondary_text_2 = {
  title: "Emotional Impact",
  text: `“Education should never be out of reach. With DAWN AI Study’s accessible 
keyboard navigation, students can move through their academic journey with 
confidence, no matter their physical limitations.”
`,
  accent_color: "#3491E74",
};
const secondary_text_3 = {
  title: "Emotional Impact",
  text: "We understand that seeing the world isn't the same for everyone, so we’ve built DAWN AI Study to fit every student’s vision. With customizable color settings, the world of education is just a little clearer for everyone.",
  accent_color: "#620074",
};
const secondary_text_4 = {
  title: "Emotional Impact",
  text: "At DAWN AI Study, every word counts, and every voice matters. With closed captioning and sign language support, we’re breaking down barriers to ensure every student has a seat at the table of knowledge.",
  accent_color: "#F88C3D",
};
const secondary_text_5 = {
  title: "Emotional Impact",
  text: "Learning should be free of distractions. DAWN AI Study’s focus mode creates a calm, centered space for students to learn at their own pace, in their own way.",
  accent_color: "#2EBB5E",
};
const secondary_text_6 = {
  title: "Emotional Impact",
  text: "For every student who struggles to find the right words, DAWN AI Study gives them the voice they’ve been searching for. With AI-powered support, expressing their ideas has never been easier.",
  accent_color: "#3491E7",
};

const Hero2 = () => {
  return (
    <>
      <MiniHero
        title="1. AI-Powered Screen Reader Compatibility"
        primary_text="DAWN LMS includes AI tools that ensure content is easily read aloud to visually impaired students. This would allow them to access course materials, navigate the platform, and complete assignments without barriers."
        secondary_text={secondary_text_1}
        image={process.env.NEXT_PUBLIC_MINI_HERO_IMG_1 || ""}
        image_direction="left"
      />
      <MiniHero
        title="2. Keyboard Navigation for Motor Disabilities"
        primary_text="Enabling keyboard navigation tools will make DAWN LMS accessible to students with motor disabilities. This ensures they can navigate the platform using only their keyboard, without the need for a mouse, simplifying their experience and making learning more independent."
        secondary_text={secondary_text_2}
        image={process.env.NEXT_PUBLIC_MINI_HERO_IMG_2 || ""}
        image_direction="right"
      />
      <MiniHero
        title="3. Color Adjustment and Contrast Optimization"
        primary_text="For students with visual impairments or color blindness, integrating color adjustment and contrast optimization tools will allow them to personalize the platform to their visual needs. This creates a customized experience that removes visual strain and allows students to focus on what truly matters—learning."
        secondary_text={secondary_text_3}
        image={process.env.NEXT_PUBLIC_MINI_HERO_IMG_3 || ""}
        image_direction="left"
      />
      <MiniHero
        title="4. Closed Captioning and Sign Language Integration"
        primary_text="DAWN LMS can adopt real-time closed captioning and sign language interpretation for video content, making lessons accessible to students who are hard of hearing or deaf. These tools can ensure that no one is left out of critical conversations, lectures, or lessons, fostering an inclusive learning community."
        secondary_text={secondary_text_4}
        image={process.env.NEXT_PUBLIC_MINI_HERO_IMG_4 || ""}
        image_direction="right"
      />
      <MiniHero
        title="5. Cognitive Load Adjustments and Focus Mode"
        primary_text="DAWN LMS can integrate features that help students with cognitive disabilities reduce distractions. Simplifying layouts, adjusting text spacing, and offering focus modes can help these students engage with content more easily, ensuring their learning experience is calm and clear."
        secondary_text={secondary_text_5}
        image={process.env.NEXT_PUBLIC_MINI_HERO_IMG_5 || ""}
        image_direction="left"
      />
      <MiniHero
        title=" 6. AI-Based Text-to-Speech and Speech-to-Text"
        primary_text="Including AI-powered text-to-speech and speech-to-text tools can help students with dyslexia or writing difficulties. They can listen to lessons and transcribe their thoughts into words, allowing them to communicate and learn in a way that works best for them."
        secondary_text={secondary_text_6}
        image={process.env.NEXT_PUBLIC_MINI_HERO_IMG_6 || ""}
        image_direction="right"
      />
    </>
  );
};

export default Hero2;
