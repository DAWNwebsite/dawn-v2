import React from "react";

interface BannerProps {
  title: string;
  for?: "student" | "educators" | "ai_learning" | "ai_spaces";
}

const Banner: React.FC<BannerProps> = (props) => {
  const images = {
    student:
      "bg-[url('https://utfs.io/f/ERfZs2vvQm4VkhOuhPSp1SugNIV9ZJTeoydAHsP4cWwUYri6')]",
    educators:
      "bg-[url('https://utfs.io/f/ERfZs2vvQm4VFU6HJJEeGtDR7mAiQj9kXTxsEKIh8MUCSHLw')]",
    ai_learning:
      "bg-[url('https://utfs.io/f/ERfZs2vvQm4VylLUUsembD85xfEPN0g93VaLjldUrGAn2u7Z')]",
    ai_spaces:
      "bg-[url('https://utfs.io/f/ERfZs2vvQm4VlfOH4vGy69jRJBmseXC1uWfFMSgUaDTnK2b4')]",
  };

  return (
    <section
      className={`rounded-br-[120px] lg:min-h-[300px] md:min-h-[280px] min-h-[250px] bg-cover bg-center ${
        props.for ? images[props.for] : ""
      } `}
    >
      <div
        className="flex flex-col text-center text-white items-center justify-end 
      lg:pt-[190px] lg:px-[430px] md:pt-[170px] md:px-[150px] pt-[140px] px-[30px]"
      >
        <h1 className="lg:text-[32px] font-bold md:text-[30px] text-[23px]">
          <span className="border-b-[3px] border-[#f88c3d]">Al Learning</span>{" "}
          {props.title.replace("Al Learning", "")}
        </h1>
      </div>
    </section>
  );
};

export default Banner;
