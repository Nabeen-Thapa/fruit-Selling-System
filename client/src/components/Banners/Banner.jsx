import React from 'react'
import BannerPng from '../../assets/fruits-splash.png';
import { motion } from 'framer-motion';
import { FadeLeft, FadeUp } from '../../utility/animation';

const Banner = () => {
  return (
    <section className='bg-secondary/10'>
      <div className="container grid grid-cols-1 md:grid-cols-2 space-y-6 md:space-y-0 py-14">
        <div className='flex justify-center items-center'>
          <motion.img 
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity:1 , scale:1 }}
            transition={{ type:"spring", stiffness: 100, delay:0.2 }}
            viewport={{once:true}}
            src={BannerPng} 
            alt='Fresh fruits selection' 
            className='w-[300px] md:max-w-[400px] h-full object-cover drop-shadow'
          />
        </div>
        <div className='flex flex-col justify-center'>
          <div className='text-center md:text-left space-4 lg:max-w-[400px]'>
            <motion.h1 
              variants={FadeUp(0.5)}
              initial="hidden"
              whileInView='visible'
              viewport={{ once: true }}
              className='text-3xl lg:text-4xl font-bold uppercase'
            >
              Fresh From Farm To You
            </motion.h1>
            <br/>
            <motion.p
              variants={FadeUp(0.7)}
              initial="hidden"
              whileInView='visible'
              viewport={{ once: true }}
            >
              Welcome to FarmConnect - your direct marketplace for fresh, 
              locally-grown fruits. Sellers can easily list their harvests, 
              while buyers enjoy farm-fresh produce at competitive prices. 
              Join our community supporting local farmers and getting the 
              freshest fruits available.
            </motion.p>
            <br/>
            <motion.p
              variants={FadeUp(0.9)}
              initial="hidden"
              whileInView='visible'
              viewport={{ once: true }}
            >
              Whether you're a grower looking to sell your harvest or 
              a buyer seeking quality fruits, our platform makes the 
              process simple, transparent, and rewarding for everyone.
            </motion.p>
            <br/>
            <motion.div 
              variants={FadeUp(1.1)}
              initial='hidden'
              animate='visible'
              className='flex justify-center md:justify-start'
            >
              <button className='primary-btn'>Join Our Marketplace</button>
            </motion.div>
          </div>
        </div>
      </div>  
    </section>
  )
}

export default Banner