import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqCategories = [
    {
      category: 'General',
      questions: [
        {
          question: 'What is AgriValue?',
          answer: 'AgriValue is a value-added agriculture marketplace platform that connects farmers and global buyers to promote rural entrepreneurship using technology. We provide a secure, transparent platform for agricultural trade.'
        },
        {
          question: 'How does AgriValue work?',
          answer: 'Farmers can list their products on our platform, while buyers can browse and connect with farmers directly. Our platform facilitates secure transactions, communication, and order management between both parties.'
        },
        {
          question: 'Who can use AgriValue?',
          answer: 'AgriValue is designed for farmers who want to sell their agricultural products directly to global markets, and buyers (individuals or businesses) looking to source quality agricultural products directly from farmers.'
        }
      ]
    },
    {
      category: 'For Farmers',
      questions: [
        {
          question: 'How do I register as a farmer?',
          answer: 'Click on "Get Started" and select the Farmer role. Complete the registration form with your details, verify your account, and you\'ll be ready to start listing your products.'
        },
        {
          question: 'Is there a fee to list products?',
          answer: 'Creating an account and listing products on AgriValue is free. We operate on a commission-based model where a small percentage is charged only on successful transactions.'
        },
        {
          question: 'How do I receive payments?',
          answer: 'Payments are processed securely through our platform. Once an order is confirmed and delivered, the payment is transferred to your registered account after our verification process.'
        },
        {
          question: 'Can I update my product listings?',
          answer: 'Yes, you can update your product listings at any time from your farmer dashboard. You can modify prices, descriptions, quantities, and product images as needed.'
        }
      ]
    },
    {
      category: 'For Buyers',
      questions: [
        {
          question: 'How do I place an order?',
          answer: 'Browse products in the marketplace, add items to your cart, and proceed to checkout. You can communicate with farmers directly to discuss specific requirements before placing an order.'
        },
        {
          question: 'How can I ensure product quality?',
          answer: 'All farmers on our platform are verified. You can view farmer profiles, ratings, and reviews from other buyers. We also encourage direct communication with farmers to discuss quality standards.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept various secure payment methods including credit/debit cards, bank transfers, and digital wallets. All transactions are encrypted and secure.'
        },
        {
          question: 'Can I track my orders?',
          answer: 'Yes, once your order is confirmed, you can track its status in real-time from your buyer dashboard. You\'ll receive notifications at each stage of the order fulfillment process.'
        }
      ]
    },
    {
      category: 'Security & Privacy',
      questions: [
        {
          question: 'Is my personal information secure?',
          answer: 'Yes, we take data security seriously. All personal information is encrypted and stored securely. We comply with international data protection standards and never share your information without consent.'
        },
        {
          question: 'How are transactions secured?',
          answer: 'All transactions on AgriValue are processed through secure payment gateways with industry-standard encryption. We use escrow services to ensure both buyers and sellers are protected.'
        },
        {
          question: 'What if there\'s a dispute?',
          answer: 'We have a dedicated dispute resolution team that mediates between buyers and sellers. Both parties can submit their concerns, and we work to find a fair solution based on our terms and conditions.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'I forgot my password. What should I do?',
          answer: 'Click on "Forgot Password" on the login page. You\'ll receive a password reset link via email. Follow the instructions to set a new password.'
        },
        {
          question: 'The verification code isn\'t working. What should I do?',
          answer: 'If your verification code doesn\'t work, click on "Resend Code" to receive a new one. Make sure you\'re entering the code exactly as received and within the time limit.'
        },
        {
          question: 'How do I contact customer support?',
          answer: 'You can reach our customer support team through the Contact page, via email at vjagadeesh024@gmail.com, or by phone at +91 99999 99999 during business hours.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Frequently Asked <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">Questions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about AgriValue and how our platform works.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-green-600">
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.questions.map((item, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === index;

                  return (
                    <motion.div
                      key={questionIndex}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-8">
                          {item.question}
                        </span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </motion.div>
                      </button>

                      <motion.div
                        initial={false}
                        animate={{
                          height: isOpen ? 'auto' : 0,
                          opacity: isOpen ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                          {item.answer}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* Still Have Questions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 p-8 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-200 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg font-semibold"
            >
              Contact Support
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
