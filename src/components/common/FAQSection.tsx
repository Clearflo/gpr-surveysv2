import React from 'react';
import { motion } from 'framer-motion';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  faqs: FAQ[];
  className?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({
  title,
  faqs,
  className = ''
}) => {
  return (
    <div className={`bg-gray-50 py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="h-1 w-24 bg-blue-900 mx-auto mb-8"></div>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
