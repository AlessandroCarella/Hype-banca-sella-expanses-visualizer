import React, { useRef, useEffect } from "react";
import TextCapsule from "./TextCapsule";
import { animateScrollToSelected, useCarouselEffect } from "./helpers/DatesCarouselHelpers";

const DatesCarousel = ({ dates, onDateSelect, selectedDate }) => {
    const carouselRef = useRef(null);

    useCarouselEffect(carouselRef, selectedDate, dates);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 d-flex justify-content-center">
                    <div className="dates-carousel-container">
                        <div className="dates-carousel" ref={carouselRef}>
                            {dates.map((date) => (
                                <div key={date} className="px-2">
                                    <TextCapsule
                                        text={date}
                                        onClick={() => onDateSelect(date)}
                                        isSelected={date === selectedDate}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatesCarousel;
