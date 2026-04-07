import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Award, Users, Globe, Leaf, User } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To empower farmers and promote rural entrepreneurship by connecting them with global markets through innovative technology solutions.'
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'A world where every farmer has direct access to global buyers, ensuring fair prices and sustainable agricultural practices.'
    },
    {
      icon: Award,
      title: 'Our Commitment',
      description: 'Dedicated to building transparent, secure, and efficient marketplace solutions that benefit all stakeholders in the agricultural value chain.'
    }
  ];

  const stats = [
    { icon: Users, label: 'Active Users', value: 'Growing Daily' },
    { icon: Globe, label: 'Countries', value: 'Expanding Globally' },
    { icon: Leaf, label: 'Products', value: 'Diverse Catalog' }
  ];

  const teamMembers = [
    {
      id: '2400031894',
      name: 'Velpuri Jagadeesh',
      role: 'Project Lead',
      description: 'Leading the development and vision of AgriValue platform'
    },
    {
      id: '2400032325',
      name: 'Mendu Satya Naga Sai Rakesh',
      role: 'Team Member',
      description: 'Contributing to platform development and implementation'
    },
    {
      id: '2400032775',
      name: 'Devisetty V D S B Suchitha',
      role: 'Team Member',
      description: 'Contributing to platform development and implementation'
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
              About <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">AgriValue</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transforming agriculture through technology, connecting farmers with global opportunities, 
              and building a sustainable future for rural communities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Commitment */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-gray-700 leading-relaxed mb-6">
              AgriValue was born from a simple yet powerful vision: to bridge the gap between farmers and 
              global buyers, creating opportunities for rural entrepreneurship while ensuring fair trade practices.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We recognized that farmers often struggle to reach international markets, losing significant value 
              to intermediaries and facing challenges in showcasing their quality products. At the same time, 
              buyers seek direct connections with authentic agricultural producers.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our platform leverages cutting-edge technology to create a transparent, efficient marketplace 
              where trust is built through verified profiles, secure transactions, and direct communication. 
              We're not just a marketplace; we're a community dedicated to sustainable agricultural growth.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, AgriValue continues to grow, driven by our commitment to empowering farmers, 
              facilitating fair trade, and promoting sustainable agricultural practices worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-200"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated team behind AgriValue, committed to revolutionizing agricultural marketplaces.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all p-8"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mb-6">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <div className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-3">
                    {member.role}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {member.description}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">
                    ID: {member.id}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;