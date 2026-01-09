import Slider from "react-slick";

export default function AnimatedCarousel({
  children,
  slidesToShow = 2,
  autoplaySpeed = 2000,
  showDots = true,
  className = "",
}) {
  const settings = {
    dots: showDots,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    centerMode: true,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(slidesToShow, 2),
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div
      data-aos="zoom-in"
      data-aos-duration="300"
      className={`relative ${className} max-w-[600px] mx-auto`}
    >
      <Slider {...settings}>
        {children.map((child, index) => (
          <div key={index} className="px-4 py-6">
            {child}
          </div>
        ))}
      </Slider>
    </div>
  );
}
