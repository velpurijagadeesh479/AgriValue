import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { FileText, Scale, Shield, AlertCircle, Users, CheckCircle } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const Terms = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: 'By accessing and using AgriValue, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.'
    },
    {
      icon: Users,
      title: 'User Accounts',
      content: 'To access certain features of the service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating your account.'
    },
    {
      icon: Shield,
      title: 'User Conduct',
      content: 'You agree not to use the service for any unlawful purpose or in any way that could damage, disable, or impair the service. You must not attempt to gain unauthorized access to any portion of the service, other accounts, or any systems or networks connected to the service.'
    },
    {
      icon: Scale,
      title: 'Transactions and Payments',
      content: 'All transactions conducted through AgriValue are subject to our payment terms. Buyers agree to pay for products ordered, and sellers agree to deliver products as described. We reserve the right to charge transaction fees for using our platform. All prices are subject to applicable taxes.'
    },
    {
      icon: CheckCircle,
      title: 'Product Listings',
      content: 'Sellers are responsible for the accuracy of their product listings, including descriptions, prices, and availability. Sellers must comply with all applicable laws and regulations regarding the sale of agricultural products. AgriValue reserves the right to remove any listing that violates these terms.'
    },
    {
      icon: AlertCircle,
      title: 'Limitation of Liability',
      content: 'AgriValue acts as a marketplace platform connecting buyers and sellers. We are not responsible for the quality, safety, or legality of products listed, the truth or accuracy of listings, or the ability of sellers to complete sales. Users engage in transactions at their own risk.'
    }
  ];

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
              Terms & <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">Conditions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our platform.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: April 4, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-12"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Additional Terms */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 p-8 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              The service and its original content, features, and functionality are owned by AgriValue and are protected by international copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our content without express written permission.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Dispute Resolution
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              In the event of any dispute between users, AgriValue will make reasonable efforts to facilitate a resolution. However, AgriValue is not obligated to become involved in disputes between users. Any disputes that cannot be resolved may be subject to binding arbitration in accordance with applicable laws.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Termination
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We reserve the right to terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including breach of these terms. Upon termination, your right to use the service will immediately cease.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Changes to Terms
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We reserve the right to modify or replace these terms at any time. We will provide notice of any significant changes by posting the new terms on this page and updating the "Last updated" date. Your continued use of the service after any changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Governing Law
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any legal action or proceeding arising under these terms will be brought exclusively in the appropriate courts.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these terms and conditions, please contact us at legal@agrivalue.com or through our contact page.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center"
          >
            <motion.button
              onClick={() => navigate('/contact')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg font-semibold"
            >
              Questions? Contact Us
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;