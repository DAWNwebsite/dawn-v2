import { Button } from "./ui/button";
import Image from "next/image";

const SectionTitle = (props: {
  title: string;
  text?: string;
  button?: string;
}) => {
  return (
    <section className=" pt-12 pb-12 grid space-y-8 max-w-full">
      <div className=" space-y-8 text-center md:text-wrap relative">
        <h2 className=" font-bold text-xl lg:text-2xl md:text-2xl">
          {props.title}

          <Image
            src={"/images/curve2.png"}
            alt={"curve"}
            width={80}
            height={100}
            className="absolute left-[130px] lg:top-[32px] lg:left-[570px] md:left-[330px] "
          />
        </h2>
        <p className="text-[15px] text-gray-500 text-center lg:px-[220px] lg:text-[17px] ">
          {props.text}
        </p>
      </div>
      {props.button && (
        <Button className="rounded-full w-fit px-4 justify-self-center">
          {props.button}
        </Button>
      )}
    </section>
  );
};

export default SectionTitle;
