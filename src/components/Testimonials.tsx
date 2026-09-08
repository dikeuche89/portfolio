import { testimonials } from "@/data/testimonials";
import styles from "./Gallery.module.css";

export default function Testimonials() {
  return (
    <section
      className={styles.testimonials}
      aria-labelledby="testimonials-title"
    >
      <p className={styles.label}>Collaborators</p>
      <h2 className={styles.heading} id="testimonials-title">
        From the people I’ve worked with.
      </h2>
      <div className={styles.testimonialList}>
        {testimonials.map((testimonial) => (
          <figure key={testimonial.name}>
            <figcaption>
              <strong>{testimonial.name}</strong>
              {testimonial.title}
              <br />
              {testimonial.company}
            </figcaption>
            <blockquote>“{testimonial.quote}”</blockquote>
          </figure>
        ))}
      </div>
    </section>
  );
}
