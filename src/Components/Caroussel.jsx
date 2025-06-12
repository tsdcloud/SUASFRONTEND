import React, { useRef, useState } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

import suas from '../assets/suas.jpg'
import padimg from '../assets/PAD.webp'

import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const slides = [
  {
    titleTop: 'SUAS',
    titleMain: 'Professionnalisez vos meetings, calls, interviews avec SUAS',
    buttonText: 'Explorer les évènements',
    desc: 'un spectacle, une activité ou une grande expérience.',
    image: suas,
  },
  {
    titleTop: '150 ANS DU PAD',
    titleMain: 'Professionnalisez vos meetings, calls, interviews avec SUAS',
    buttonText: 'Explorer',
    desc: 'un spectacle, une activité ou une grande expérience.',
    image: padimg,
  },
  // Ajoute d'autres slides ici si besoin
]

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const timeoutRef = useRef(null)
  const mouseOverRef = useRef(false)

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    // autoplay simulation
    renderMode: 'performance',
    drag: true,
    created(slider) {
      startAutoPlay(slider)
      slider.container.addEventListener('mouseover', () => {
        mouseOverRef.current = true
        clearTimeout(timeoutRef.current)
      })
      slider.container.addEventListener('mouseout', () => {
        mouseOverRef.current = false
        startAutoPlay(slider)
      })
    },
    animationEnded(slider) {
      startAutoPlay(slider)
    },
  })

  function startAutoPlay(slider) {
    clearTimeout(timeoutRef.current)
    if (mouseOverRef.current) return
    timeoutRef.current = setTimeout(() => {
      slider.next()
    }, 5000)
  }

  console.log("currentSlide", currentSlide);

  return (
    <div className="relative w-full overflow-hidden rounded-xl animate-fade-in">
      <div
        ref={sliderRef}
        className="keen-slider"
      // onMouseEnter={() => slider?.current?.pause()}
      // onMouseLeave={() => slider?.current?.play()}
      >
        {slides.map((slide, index) => (
          <div key={index} className="keen-slider__slide relative">
            <img
              src={slide.image}
              alt="Slide"
              className="w-full h-[400px] object-cover brightness-75"
            />
            <div className="absolute inset-0 flex items-center sm:mx-10 px-10">
              <div className="bg-black bg-opacity-50 p-6 rounded-xl max-w-md space-y-4 animate-fade-in shadow-2xl">

                <h2 className="text-white text-4xl font-extrabold tracking-tight leading-tight">
                  <span className="text-orange-400">{slide.titleTop.toLocaleUpperCase()}</span>
                </h2>

                <p className="text-gray-100 text-lg font-medium">
                  Professionnalisez vos <span className="text-white font-semibold">meetings</span>, <span className="text-white font-semibold">calls</span>, <span className="text-white font-semibold">interviews</span> avec <span className="text-green-400 font-semibold">SUAS</span>.
                </p>

                <Link to="/events" className='mt-3 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-300'>
                  Explorer
                </Link>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FLECHES - visibles uniquement sur grand écran */}
      <button
        onClick={() => { slider.current?.prev() }}
        className="hidden lg:flex absolute top-1/2 left-3 -translate-y-1/2 bg-white p-2 rounded-full shadow"
      >
        <ChevronDoubleLeftIcon className='h-6 w-6 text-gray-500' />
      </button>
      <button
        onClick={() => { slider.current?.next() }}
        className="hidden lg:flex absolute top-1/2 right-3 -translate-y-1/2 bg-white p-2 rounded-full shadow"
      >
        <ChevronDoubleRightIcon className='h-6 w-6 text-gray-500' />
      </button>

      {/* PAGINATION */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full ${currentSlide === idx ? 'bg-white' : 'bg-gray-400'
              }`}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default Carousel
