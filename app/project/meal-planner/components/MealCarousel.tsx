import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

type MealCarouselProps = {
    // Define the props for your component here
};

const MealCarousel: React.FC<MealCarouselProps> = (props) => {

    return (
        <div>
            <Carousel>
                <CarouselContent>
                    <CarouselItem>
                        <div>
                            <p>lorem ipsum dolor sit amet</p>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div>
                            <p>lorem ipsum dolor sit amet</p>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div>
                            <p>lorem ipsum dolor sit amet</p>
                        </div>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};

export default MealCarousel;

