import { useRef } from "react";
import { CategoryDataItem, HomeCatCard } from "../../components/cards/appcards";
import { Carousel } from "antd";
export const CategoryCarousel = ({
  categoryData,
}: {
  categoryData: CategoryDataItem[];
}): React.ReactNode => {
  const carouselRef = useRef<any>(null);
  return (
    <div>
      <Carousel
        ref={carouselRef}
        dots={true}
        autoplay={true}
        slidesToShow={2}
        slidesToScroll={1}
        responsive={[
          {
            breakpoint: 1540,
            settings: {
              slidesToShow: 8,
            },
          },
          {
            breakpoint: 1360,
            settings: {
              slidesToShow: 7,
            },
          },
          {
            breakpoint: 1150,
            settings: {
              slidesToShow: 6,
            },
          },
          {
            breakpoint: 1000,
            settings: {
              slidesToShow: 5,
            },
          },
          {
            breakpoint: 860,
            settings: {
              slidesToShow: 4,
            },
          },
          {
            breakpoint: 680,
            settings: {
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 350,
            settings: {
              slidesToShow: 2,
            },
          },
        ]}
      >
        {categoryData.map((data, index) => (
          <div key={index}>
            <HomeCatCard {...data} />
          </div>
        ))}
      </Carousel>
      {}
    </div>
  );
};
