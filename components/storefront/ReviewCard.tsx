import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

export interface ReviewData {
  id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  product: string;
  date: string;
  verified: boolean;
}

interface ReviewCardProps {
  review: ReviewData;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <FontAwesomeIcon
          key={i}
          icon={i < rating ? faStarSolid : faStarRegular}
          className="w-3 h-3 text-[#FFC107]"
        />
      ))}
    </div>
  );
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col gap-2.5 h-full shadow-sm text-left">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-700">
          Overall Rating: {review.rating} / 5
        </span>
        <Stars rating={review.rating} />
      </div>
      <p className="text-xs font-bold text-gray-800 leading-tight">
        {review.title}
      </p>
      <p className="text-xs text-gray-600 leading-relaxed flex-1 italic">
        &quot;{review.body}&quot;
      </p>
      <div className="border-t border-gray-100 pt-2 mt-auto text-[10px] text-gray-500">
        <p>
          Posted by <span className="font-semibold text-gray-700">{review.author}</span> on {review.date}
        </p>
        <p className="mt-0.5">
          Source: <span className="text-emerald-700 font-medium">Gemstone Empire Verified</span>
        </p>
      </div>
    </div>
  );
}
