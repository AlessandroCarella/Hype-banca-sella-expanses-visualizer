import React, { useRef, useEffect } from "react";
import TextCapsule from "./TextCapsule";
import { animateScrollToSelected } from "./helpers/DatesCarouselHelpers";
import "../styles/components/DatesCarousel.css";
import "../styles/components/DatesCarousel light mode.css";
import "../styles/components/DatesCarousel dark mode.css";

const DatesCarousel = ({ dates, onDateSelect, selectedDate }) => {
    const carouselRef = useRef(null);

    useEffect(() => {
        const selectedIndex = dates.indexOf(selectedDate);
        if (selectedIndex !== -1) {
            animateScrollToSelected(carouselRef.current, selectedIndex);
        }
    }, [selectedDate, dates]);

    const handleClick = (date) => {
        onDateSelect(date);
    };

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
                                        onClick={() => handleClick(date)}
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
