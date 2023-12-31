import React from 'react'
import ContactDetails from '../components/ContactPage/ContactDetails'
import ContactForm from '../components/ContactPage/ContactForm'
import Footer from '../components/common/Footer'
import ReviewSlider from '../components/common/ReviewSlider'

const Contact = () => {
  return (
    <div className='text-white'>
        <div className='mx-auto mt-20 max-w-maxContent flex w-11/12 gap-10 justify-between text-white lg:flex-row flex-col'>
            <div className='lg:w-[40%]'>
                <ContactDetails/>
            </div>
            {/* Contact Form */}
            <div className='lg:w-[60%]'>
                <ContactForm/>
            </div>
        </div>

        <div className='relative mx-auto mt-[50px] flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>
            <h1 className='text-center text-4xl font-semibold mt-8'>Reviwes from other learners</h1>
            {/* ReviewSlider */}
            <ReviewSlider/>
        </div>
        <Footer/>
    </div>
  )
}

export default Contact