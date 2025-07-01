import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const testimonials = [
  {
    name: `John Doe`,
    title: `Alphabet Inc.`,
    image: `/images/social-1.webp`,
    quote: `Commodo Lorem consequat ea consectetur pariatur proident excepteur.
        Pariatur eiusmod minim minim ipsum tempor aute excepteur minim eu nisi laboris.
        Duis sunt labore eu eu cupidatat labore commodo id aliquip.`,
  },
  {
    name: `Jack Doe`,
    title: `Amazon.com, Inc.`,
    image: `/images/social-2.webp`,
    quote: `Anim labore ut amet cupidatat pariatur pariatur labore ad est.
        Fugiat eiusmod dolore aliquip aute duis esse excepteur amet.
        Sit cupidatat ipsum culpa nisi esse ipsum culpa in consectetur.
        Enim incididunt do sunt ex do. Proident duis nulla minim sunt irure est
        magna nostrud Lorem consectetur irure.`,
  },
  {
    name: `Jack Doe`,
    title: `Amazon.com, Inc.`,
    image: `/images/social-2.webp`,
    quote: `Anim labore ut amet cupidatat pariatur pariatur labore ad est.
        Fugiat eiusmod dolore aliquip aute duis esse excepteur amet.
        Sit cupidatat ipsum culpa nisi esse ipsum culpa in consectetur.
        Enim incididunt do sunt ex do. Proident duis nulla minim sunt irure est
        magna nostrud Lorem consectetur irure.`,
  },
  {
    name: `Jack Doe`,
    title: `Amazon.com, Inc.`,
    image: `/images/social-2.webp`,
    quote: `Anim labore ut amet cupidatat pariatur pariatur labore ad est.
        Fugiat eiusmod dolore aliquip aute duis esse excepteur amet.
        Sit cupidatat ipsum culpa nisi esse ipsum culpa in consectetur.
        Enim incididunt do sunt ex do. Proident duis nulla minim sunt irure est
        magna nostrud Lorem consectetur irure.`,
  },
  {
    name: `Jack Doe`,
    title: `Amazon.com, Inc.`,
    image: `/images/social-2.webp`,
    quote: `Anim labore ut amet cupidatat pariatur pariatur labore ad est.
        Fugiat eiusmod dolore aliquip aute duis esse excepteur amet.
        Sit cupidatat ipsum culpa nisi esse ipsum culpa in consectetur.
        Enim incididunt do sunt ex do. Proident duis nulla minim sunt irure est
        magna nostrud Lorem consectetur irure.`,
  },
  {
    name: `Jack Doe`,
    title: `Amazon.com, Inc.`,
    image: `/images/social-2.webp`,
    quote: `Anim labore ut amet cupidatat pariatur pariatur labore ad est.
        Fugiat eiusmod dolore aliquip aute duis esse excepteur amet.
        Sit cupidatat ipsum culpa nisi esse ipsum culpa in consectetur.
        Enim incididunt do sunt ex do. Proident duis nulla minim sunt irure est
        magna nostrud Lorem consectetur irure.`,
  },
  {
    name: `Jack Doe`,
    title: `Amazon.com, Inc.`,
    image: `/images/social-2.webp`,
    quote: `Anim labore ut amet cupidatat pariatur pariatur labore ad est.
        Fugiat eiusmod dolore aliquip aute duis esse excepteur amet.
        Sit cupidatat ipsum culpa nisi esse ipsum culpa in consectetur.
        Enim incididunt do sunt ex do. Proident duis nulla minim sunt irure est
        magna nostrud Lorem consectetur irure.`,
  },
];

const Testimonials = () => {
  return (
    <section className="hidden md:block pt-24 pb-24 space-y-8">
      <h1 className="text-center font-bold text-2xl ">
        Hear what Dawn Users Are Saying
      </h1>

      <InfiniteMovingCards items={testimonials} direction="left" speed="slow" />
    </section>
  );
};

export default Testimonials;
