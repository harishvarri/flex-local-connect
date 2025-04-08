
import React from "react";

const testimonials = [
  {
    content:
      "SmartFlex helped me find consistent part-time work that fits perfectly around my college schedule. I can pick up jobs when I need them and earn extra income.",
    author: "Ravi Kumar",
    role: "Student & Part-time Worker",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
  },
  {
    content:
      "Our restaurant often needs extra staff during busy seasons. SmartFlex makes it easy to find reliable workers at short notice without lengthy hiring processes.",
    author: "Priya Shah",
    role: "Restaurant Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
  },
  {
    content:
      "I've been able to build a flexible work schedule that lets me balance family responsibilities while still earning a good income. The platform is so easy to use.",
    author: "Arjun Patel",
    role: "Electrician & Handyman",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
  },
];

const TestimonialSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by workers and businesses alike
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Hear from people who've found success using SmartFlex
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
            >
              <div className="text-gray-600 italic">
                "{testimonial.content}"
              </div>
              <div className="mt-6 flex items-center">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={testimonial.avatar}
                  alt={testimonial.author}
                />
                <div className="ml-4">
                  <div className="font-medium text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
