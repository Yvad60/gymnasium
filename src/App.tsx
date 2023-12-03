import { useEffect, useRef } from "react";
import { SwiperContainer, register } from "swiper/element/bundle";
import { SwiperOptions } from "swiper/types";
import { ChevronLeft } from "./ChevronLeft";
register();

const testimonials = [
  {
    content:
      "Working with Ana over 8years has been the best decision we have made. She is thorough, detail oriented, enthusiastic and willing to help change an outcome to the benefit of her client",
    author: "Oheneba Ofori Boateng",
  },
  {
    content:
      "“My relationship with Ana started in 2014 when I contracted her to rent out my property at Tema Community 6. I was very satisfied with the speed and professionalism exhibited by Ana in carrying out the assignment to the extent that I introduced other clients to her.”",
    author: "T.D - Investor",
  },

  {
    content:
      "“Working with Ana over 8 years has been the best decision we have made. She is thorough, detail oriented, enthusiastic and willing to help change an outcome to the benefit of her client.”",
    author: "T.D - Investor",
  },
];

const MySwiper = () => {
  const swiperRef = useRef<SwiperContainer>(null);

  const handleSlideNext = () => {
    swiperRef.current?.swiper.slideNext();
  };

  const handleSlidePrev = () => {
    swiperRef.current?.swiper.slideNext();
  };

  useEffect(() => {
    const swiperContainer = swiperRef.current;
    const params: SwiperOptions = {
      pagination: {
        type: "fraction",
      },
      loop: true,
      speed: 300,
    };

    if (swiperContainer) {
      Object.assign(swiperContainer, params);
      swiperContainer.initialize();
    }
  }, []);

  return (
    <div className="h-[692px] py-20 flex justify-center bg-[#0C0203] text-white">
      <div className="flex flex-col w-fit relative">
        <h4 className="text-4xl text-center text-yellow-600">Testimonials</h4>
        <swiper-container ref={swiperRef} class="flex justify-center mt-6 max-w-3xl" init="false">
          {testimonials.map((testimonial, index) => (
            <swiper-slide class="flex flex-col items-center gap-6" key={index}>
              <div className="h-[500px]">
                <p className="max-w-4xl text-2xl font-light text-center">{testimonial.content}</p>
                <span className="block text-center mt-4">{testimonial.author}</span>
              </div>
            </swiper-slide>
          ))}
        </swiper-container>
        <button onClick={handleSlidePrev}>
          <ChevronLeft className="absolute w-10 h-10 top-1/2 -translate-y-1/2 -left-40" />
        </button>
        <button onClick={handleSlideNext}>
          <ChevronLeft className="absolute w-10 h-10 top-1/2 -translate-y-1/2 -right-40 rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default MySwiper;
