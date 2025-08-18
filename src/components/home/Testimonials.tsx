import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "GPR Surveys provided exceptional service for our commercial redevelopment project. They identified several unmarked utilities that could have resulted in costly damages and delays had they gone undetected.",
    author: "Mark Richardson",
    company: "Coastal Development Group"
  },
  {
    quote: "Their team was professional, thorough, and delivered results ahead of schedule. The detailed documentation they provided was instrumental in our infrastructure planning process.",
    author: "Jennifer Harris",
    company: "Harris Engineering Ltd."
  },
  {
    quote: "We've worked with GPR Surveys on multiple environmental remediation projects. Their ability to accurately locate underground utilities in challenging conditions has been invaluable to our operations.",
    author: "David Mitchell",
    company: "EcoTech Solutions"
  }
];

const Testimonials = () => {
  return (
    <div className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-blue-900 mb-4 uppercase tracking-wider">
            Client Testimonials
          </h2>
          <div className="h-1 w-24 bg-blue-900 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            What our clients say about our services
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="industrial-card p-8 relative"
            >
              <div className="absolute -top-4 left-8 text-[#fd8800] text-6xl">"</div>
              <p className="text-gray-600 mb-6 relative z-10 pt-6">{testimonial.quote}</p>
              <div className="pt-4 border-t border-gray-100">
                <p className="font-display font-bold text-blue-900">{testimonial.author}</p>
                <p className="text-gray-500">{testimonial.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;