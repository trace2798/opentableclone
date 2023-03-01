import React from "react";
import fullStar from "../../public/icons/full-star.png";
import halfStar from "../../public/icons/half-star.png";
import emptyStar from "../../public/icons/empty-star.png";
import Image from "next/image";
import { Review } from "@prisma/client";
import { calculateReviewRatingAverage } from "../../utils/calculateReviewRatingAverage";

export default function Stars({ reviews }: { reviews: Review[] }) {
  const rating = calculateReviewRatingAverage(reviews);

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      //calculate the difference
      const difference = parseFloat((rating - i).toFixed(1));
      // difference is greater than 1 push a full star.
      if (difference >= 1) stars.push(fullStar);
      // difference is in-between  1 and 0 do more calculations.
      else if (difference < 1 && difference > 0) {
        // difference is less than or equal to 0.2 push a empty star.
        if (difference <= 0.2) stars.push(emptyStar);
        // difference is greater than 0.2 and less than 0.6 push a half star.
        else if (difference > 0.2 && difference <= 0.6) stars.push(halfStar);
        //greater than 0.6 push a full star
        else stars.push(fullStar);
      } 
      //if it is 0 push empty star.
      else stars.push(emptyStar);
    }
    return stars.map((star) => {
      return <Image src={star} alt="" className="w-4 h-4 mr-1" />;
    });
  };

  return <div className="flex items-center">{renderStars()}</div>;
}
