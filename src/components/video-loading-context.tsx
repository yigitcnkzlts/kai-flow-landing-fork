"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface VideoLoadingContextType {
    isVideoLoaded: boolean;
    setVideoLoaded: () => void;
}

const VideoLoadingContext = createContext<VideoLoadingContextType>({
    isVideoLoaded: false,
    setVideoLoaded: () => { },
});

export const VideoLoadingProvider = ({ children }: { children: ReactNode }) => {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    const setVideoLoaded = () => setIsVideoLoaded(true);

    return (
        <VideoLoadingContext.Provider value={{ isVideoLoaded, setVideoLoaded }}>
            {children}
        </VideoLoadingContext.Provider>
    );
};

export const useVideoLoading = () => useContext(VideoLoadingContext);
