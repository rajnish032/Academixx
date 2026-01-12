import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets';

const TestimonialSection = () => {
  return (
    <div className="pb-16 px-8 md:px-40">
      <h2 className="text-3xl font-medium text-white">Testimonial</h2>

      <p className="md:text-base text-gray-300 mt-3.5">
        Hear from our learners as they share their journeys of transformation, success, and how our
        <br className="hidden md:block" />
        platform has made a difference in their lives.
      </p>

      <div className="grid gap-8 mt-14 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="text-sm text-left border border-white/10 rounded-xl 
                       bg-white/5 backdrop-blur-md shadow-[0px_4px_25px_0px_rgba(0,0,0,0.4)]
                       overflow-hidden hover:border-cyan-400/40 hover:-translate-y-1 
                       transition-transform transition-colors duration-200"
          >
            <div className="flex items-center gap-4 px-5 py-4 bg-white/5">
              <img
                className="h-14 w-14 rounded-full object-cover"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h1 className="text-lg font-medium text-white">
                  {testimonial.name}
                </h1>
                <p className="text-gray-300">{testimonial.role}</p>
              </div>
            </div>

            <div className="p-5 pb-7">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="h-5"
                    src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                    alt="star"
                  />
                ))}
              </div>

              <p className="text-gray-200 mt-4">
                {testimonial.feedback}
              </p>
            </div>

            <a
              href="#"
              className="text-cyan-400 underline px-5 pb-4 inline-block hover:text-cyan-300"
            >
              See more
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialSection;
