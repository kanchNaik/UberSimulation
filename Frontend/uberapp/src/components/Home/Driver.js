import React from 'react'
import Header from '../Common/Header/DriverHeader/Header'
import HeroSection from '../Common/HeroSection/HeroSection'
import Features from '../Common/Features/Features'
import Footer from '../Common/Footer/Footer'
import GlobalStyles from '../../styles/GlobalStyles';

function DriverHome() {
  return (
    <>
        <GlobalStyles />
        <Header />
        <HeroSection />
        <Features />
        <Footer />
    </>
  )
}

export default DriverHome