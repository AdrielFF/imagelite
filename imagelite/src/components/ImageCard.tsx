"use client"

import React from "react";

interface ImageCardProps {
    url?: string;
    name?: string;
    size?: number;
    extension?: string;
    uploadDate?: string;
}

export const ImageCard: React.FC<ImageCardProps> = (props) => {
    const {name, size, uploadDate, extension, url} = props

        function download() {
            window.open(`${url}/download`, "_blank")
        }

    return (
        <div className="card relative bg-white rounded-md shadow-md">
        <img src={url} className="h-56 w-full object-cover rounded-t-md" alt={name} />
        <div className="card-body p-4">
            <h5 className="text-xl font-semibold mb-2 text-gray-600">{name}</h5>
            <p className="text-gray-600">{extension}</p>
            <p className="text-gray-600">{formatBytes(size)}</p>
            <p className="text-gray-600">{uploadDate}</p>
            <button 
                type="button" 
                onClick={download}
                className="absolute right-3 bottom-3 border bg-gray-50 border-gray-400 border-collapse rounded-md py-1 px-1 transition hover:bg-gray-200 ease-in"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke-width="1.5" 
                    stroke="currentColor" 
                    className="size-6 text-gray-700">
                    <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>

            </button>
        </div>
        </div>
  )
}

function formatBytes(bytes: number = 0, decimals = 2) {
    if(!+bytes) return '0 bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}