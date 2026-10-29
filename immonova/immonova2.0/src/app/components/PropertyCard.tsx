import React from 'react';
import Image from 'next/image';

interface PropertyCardProps {
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  onClick: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  title,
  price,
  location,
  imageUrl,
  onClick,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-xl font-bold text-blue-600 mt-2">
          ${price.toLocaleString()}
        </p>
        <p className="text-gray-600 mt-1">{location}</p>
      </div>
    </div>
  );
};

export default PropertyCard; 