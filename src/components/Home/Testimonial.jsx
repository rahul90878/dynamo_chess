import React, { useRef, useState } from 'react';
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { useQuery } from 'react-query';
import { getApi } from '../../utils/api';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

const Testimonial = () => {
    const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_RATINGS}`;
    const { data, error, isLoading } = useQuery('GET_RATINGS_LIST', () => getApi(url));

    if (isLoading) {
        return <p className="text-center text-gray-600">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error loading data</p>;
    }

    if (!data?.data?.ratings || data.data.ratings.length === 0) {
        return <p className="text-center text-gray-600">No ratings available</p>;
    }

    return (
        <section className="mb-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap">
                    <div className="w-full sm:w-1/4 text-center sm:text-left py-8">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-800">
                            Player Feedback
                        </h2>
                    </div>
                    <div className="w-full sm:w-3/4">
                        <OwlCarousel
                            className="owl-theme"
                            loop
                            margin={16}
                            autoplay={false}
                            items={4}
                            dots={false}
                            responsive={{
                                0: { items: 1 },
                                600: { items: 2 },
                                1000: { items: 4 },
                            }}
                        >
                            {data.data.ratings.map((item, index) => (
                                <blockquote
                                    key={index}
                                    className="rounded-lg bg-white shadow-md p-5"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14">
                                            <img
                                                alt="User Avatar"
                                                src={item.profilePicture || 'https://via.placeholder.com/150'}
                                                className="h-full w-full rounded-full"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex gap-0.5 text-yellow-500">
                                                {[...Array(5)].map((_, starIndex) => {
                                                    const ratingValue = starIndex + 1;
                                                    const fullStar = ratingValue <= Math.floor(item.rating);
                                                    const halfStar = !fullStar && ratingValue - 0.5 <= item.rating;
                                                    return (
                                                        <span key={starIndex}>
                                                            {fullStar ? (
                                                                <FaStar />
                                                            ) : halfStar ? (
                                                                <FaStarHalfAlt />
                                                            ) : (
                                                                <FaRegStar />
                                                            )}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                            <p className="mt-1 text-sm font-medium text-gray-800">
                                                {item.userName}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-gray-600 text-sm whitespace-pre-wrap break-words overflow-hidden max-h-24">
                                        {item.messages.length > 20
                                            ? `${item.messages.slice(0, 20)} ...`
                                            : item.messages}
                                    </p>


                                </blockquote>
                            ))}
                        </OwlCarousel>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonial;
