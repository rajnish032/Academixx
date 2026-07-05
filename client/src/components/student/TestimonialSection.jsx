import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets';

const TestimonialSection = () => {
  const serifDisplay = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };
  const serifBody = { fontFamily: "'Source Serif 4', Georgia, serif" };
  const metaSans = { fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" };

  return (
    <div className="pt-4 pb-20 px-8 md:px-40" style={{ background: "#F8F5EE", color: "#211F1B" }}>
      <p className="text-[10px] uppercase mb-2" style={{ ...metaSans, color: "#7A2E2E" }}>
        Alumni Testimony
      </p>

      <h2 className="text-3xl font-semibold" style={{ ...serifDisplay, color: "#1D2B3A" }}>
        Testimonials
      </h2>

      <p className="md:text-base mt-3.5 leading-relaxed max-w-2xl mx-auto" style={{ ...serifBody, color: "#6B6355" }}>
  Hear from our learners as they share their journeys of transformation, success, and how our
  <br className="hidden md:block" />
  platform has made a difference in their lives.
</p>

      <div className="grid gap-8 mt-14 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="text-sm text-left overflow-hidden transition-transform duration-200 hover:-translate-y-1 flex flex-col"
            style={{ background: "#FFFDF8", border: "1px solid #1D2B3A" }}
          >
            <div
              className="flex items-center gap-4 px-5 py-4"
              style={{ borderBottom: "1px solid #A9823D30" }}
            >
              <img
                className="h-14 w-14 object-cover"
                src={testimonial.image}
                alt={testimonial.name}
                
              />
              <div>
                <h1 className="text-lg" style={{ ...serifDisplay, fontWeight: 600, color: "#1D2B3A" }}>
                  {testimonial.name}
                </h1>
                <p className="text-xs" style={{ ...metaSans, color: "#6B6355" }}>
                  {testimonial.role}
                </p>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="h-4"
                    src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                    alt="star"
                    style={{
                      filter:
                        i < Math.floor(testimonial.rating)
                          ? "sepia(60%) saturate(400%) brightness(0.8)"
                          : "grayscale(1) opacity(0.5)",
                    }}
                  />
                ))}
              </div>

              <p className="leading-relaxed flex-1" style={{ ...serifBody, color: "#3A3630" }}>
                <span style={{ ...serifDisplay, color: "#A9823D", fontSize: "1.4em", lineHeight: 0, verticalAlign: "-0.35em" }}>
                  "
                </span>
                {testimonial.feedback}
              </p>
            </div>

            
            <a  href="#"
              className="px-5 pb-5 pt-1 inline-block text-[11px] uppercase transition-colors"
              style={{ ...metaSans, color: "#7A2E2E" }}
            >
              Read Full Account →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialSection;

