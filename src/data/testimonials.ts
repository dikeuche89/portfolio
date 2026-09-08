export type Testimonial = {
  quote: string;
  excerpt?: string;
  name: string;
  title: string;
  company: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Dike's design style is both modern and visually appealing. He has an intuitive knack for creating designs that are not only functional but also aesthetically pleasing. His work showcases a contemporary design language that is sure to resonate with users and clients alike.",
    name: "Daniel Eordogh",
    title: "SVP of Product & Technology",
    company: "LeoVegas Group",
  },
  {
    quote:
      "Dike is a very creative designer that delivers very high quality work. His designs are very clean and sharp. He is very easy to work with and accommodates all of our requirements. He is a consummate professional.",
    name: "Alex Aydin",
    excerpt:
      "He is very easy to work with and accommodates all of our requirements. He is a consummate professional.",
    title: "Founder & CEO",
    company: "BookingPal",
  },
  {
    quote:
      "Dike's designs seamlessly merge modern aesthetics with functionality. He possesses a unique flair for crafting designs that resonate contemporarily while always aligning with broader company objectives. Dike consistently sees the bigger picture, ensuring his creations uphold the overarching goals of the organization.",
    name: "Michael Globe",
    title: "Executive",
    company: "YooFinn, TD Bank",
  },
];

export const featuredTestimonial = testimonials[1];
