import React from "react";
import Image from "next/image";
import SectionTitle from "./section-title";

const Features = (props: {
  title: string;
  text?: string;
  button?: string;
  images: string[];
}) => {
  return (
    <section className="space-y-4 p-[30px] grid px-8 md:px-3 ">
      <SectionTitle
        title={props.title}
        text={props.text}
        button={props.button}
      />

      <div
        className={
          props.images.length == 3
            ? `grid gap-8 lg:grid-cols-3 max-w-full md:grid-cols-3 md:gap-2 lg:px-10`
            : `grid gap-8 lg:grid-cols-4  max-w-full md:grid-cols-3 lg:px-10`
        }
      >
        {props.images.map((url, i) => (
          <Image
            src={url}
            alt={"images"}
            key={i}
            width={600}
            height={400}
            className="w-full h-60 object-cover rounded-xl"
          />
        ))}
      </div>
    </section>
  );
};

export default Features;
