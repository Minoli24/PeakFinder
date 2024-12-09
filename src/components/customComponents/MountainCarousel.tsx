import React from 'react';
import Carousel, {CarouselRenderItem} from 'react-native-reanimated-carousel';

// Define the types for the props of the MountainCarousel component
interface MountainCarouselProps {
  mountains: any[];

  renderItem: CarouselRenderItem<any>;
  width?: number;
  height?: number;
}

const MountainCarousel: React.FC<MountainCarouselProps> = ({
  mountains,
  renderItem,
  width = 400, // Default width
  height = 200, // Default height
}) => {
  return (
    <Carousel
      autoPlay={false}
      data={mountains}
      height={height}
      loop={true}
      pagingEnabled={false}
      snapEnabled={true}
      width={width}
      mode="parallax"
      modeConfig={{
        parallaxScrollingScale: 0.9,
        parallaxAdjacentItemScale: 0.85,
        parallaxScrollingOffset: 80,
      }}
      renderItem={renderItem}
    />
  );
};

export default MountainCarousel;
