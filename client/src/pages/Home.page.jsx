import React from 'react';
import Menus from '../components/Menus/Menus';
import Banner from '../components/Banners/Banner';
import Banner2 from '../components/Banners/Banner2';
import Banner3 from '../components/Banners/Banner3';
import Hero from '../components/Hero/Hero';

export const HomePage = () => {
    return (
        <>
            <Hero/>
            <Menus />
            <Banner />
            <Banner2 />
            <Banner3 />
        </>
    )
}