"use client";
import Image from "next/image";
import React, { useState } from "react";

const bgColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-orange-500",
    "bg-teal-500",
];


/**
* Deterministically generates a background color based on the user's name.
*/
const getColorByName = (name) => {
    const hash = [...name.toLowerCase()].reduce(
        (acc, char) => acc + char.charCodeAt(0),
        0,
    );
    return bgColors[hash % bgColors.length];
};

const CircleAvatar = ({
    image,
    name = "U",
    w = "w-[100px] md:w-[130px]",
    text = "text-3xl md:text-4xl",
}) => {
    const [imgError, setImgError] = useState(false);
    const bgColor = getColorByName(name);
    const avatarStyle = `aspect-square ${w} rounded-full object-cover`;

    const fallbackAvatar = (
        <div
            title={name}
            className={`${avatarStyle} ${bgColor} ${text} flex items-center justify-center font-semibold text-white uppercase`}
        >
            {name.charAt(0)}
        </div>
    );

    if (image && !imgError) {
        return (
            <Image
                width={100}
                height={100}
                src={image}
                alt={name}
                title={name}
                className={avatarStyle}
                onError={() => setImgError(true)}
            />
        );
    }
    return fallbackAvatar;
};
export default CircleAvatar;



