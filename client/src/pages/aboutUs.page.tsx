import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiTruck, 
  FiShield, 
  FiDollarSign,
  FiGlobe,
  FiUser,
  FiHome,
  FiAward,
  FiHeart,
  FiCalendar,
  FiPackage
} from 'react-icons/fi';
import { FadeUp, FadeLeft, FadeRight } from '../utility/animation';

const AboutUs = () => {
  const stats = [
    { value: '10,000+', label: 'Happy Customers', icon: <FiUsers className="text-3xl" /> },
    { value: '500+', label: 'Verified Farmers', icon: <FiTruck className="text-3xl" /> },
    { value: '100%', label: 'Quality Guarantee', icon: <FiShield className="text-3xl" /> },
    { value: '24/7', label: 'Customer Support', icon: <FiDollarSign className="text-3xl" /> }
  ];

  const teamMembers = [
    {
      icon: <FiUser className="text-5xl text-green-600" />,
      name: "John Farmer",
      role: "Agricultural Expert",
      description: "With 15 years in organic farming, ensures our quality standards"
    },
    {
      icon: <FiGlobe className="text-5xl text-green-600" />,
      name: "Sarah Connect",
      role: "Platform Developer",
      description: "Built the marketplace to connect farmers directly with buyers"
    },
    {
      icon: <FiAward className="text-5xl text-green-600" />,
      name: "David Quality",
      role: "Quality Assurance",
      description: "Implements our rigorous freshness verification process"
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-50 to-secondary/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FadeUp(0.3)}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Story: Connecting Farms to Tables
            </h1>
            <p className="text-xl text-gray-600">
              Revolutionizing the way fresh fruits reach your home by cutting out the middlemen
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FadeLeft(0.3)}
              className="flex justify-center"
            >
              <div className="bg-green-100 p-12 rounded-full">
                <FiHome className="text-green-600 text-8xl" />
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FadeRight(0.3)}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              <p className="text-gray-600 text-lg">
                We're on a mission to empower local farmers and provide consumers with the freshest
                fruits at fair prices. Our platform bridges the gap between growers and buyers,
                ensuring everyone gets the best value.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FiTruck className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Direct From Farm</h3>
                    <p className="text-gray-600">
                      Fruits reach you within 24-48 hours of harvest, maximizing freshness.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FiDollarSign className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Fair Pricing</h3>
                    <p className="text-gray-600">
                      Farmers earn more while you pay less by eliminating middlemen.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FadeUp(0.3)}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={FadeUp(0.5 + index * 0.2)}
                className="p-6 bg-gray-50 rounded-xl hover:shadow-md transition-all"
              >
                <div className="text-green-500 flex justify-center mb-3">
                  {stat.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FadeUp(0.3)}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              A passionate group of agri-tech enthusiasts, farmers, and technology experts working
              together to transform the fruit supply chain.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={FadeUp(0.5 + index * 0.2)}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center"
              >
                <div className="bg-green-50 h-48 w-48 mx-auto rounded-full mb-4 flex items-center justify-center">
                  {member.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-green-600 mb-3">{member.role}</p>
                <p className="text-gray-600">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-secondary/10">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FadeUp(0.3)}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Join Our Growing Community
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Whether you're a farmer looking to sell your produce or a buyer seeking fresh fruits,
              we have a place for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Register as Seller
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                
                className="bg-white hover:bg-gray-100 text-green-600 px-8 py-3 rounded-lg font-medium border border-green-600 transition-colors"
              >
                Shop Fruits Now
              </motion.button>
              
              
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;