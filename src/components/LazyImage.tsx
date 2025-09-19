import React, { useState, useRef, useEffect } from "react";

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    placeholder?: React.ReactNode;
}

export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className = "",
    style,
    onClick,
    placeholder,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: "50px",
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    return (
        <div ref={imgRef} className={`relative ${className}`} style={style}>
            {isInView && (
                <>
                    {!isLoaded && placeholder && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                            {placeholder}
                        </div>
                    )}
                    <img
                        src={src}
                        alt={alt}
                        className={`transition-opacity duration-200 ${isLoaded ? "opacity-100" : "opacity-0"
                            } ${className}`}
                        style={style}
                        onClick={onClick}
                        onLoad={handleLoad}
                        loading="lazy"
                    />
                </>
            )}
            {!isInView && placeholder && (
                <div className="flex items-center justify-center bg-gray-100 rounded" style={style}>
                    {placeholder}
                </div>
            )}
        </div>
    );
};

export default LazyImage;
