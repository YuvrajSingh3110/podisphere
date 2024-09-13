'use client';

import { usePathname } from "@/node_modules/next/navigation";
import { AudioContextType, AudioProps } from "@/types/index";
import React, { createContext, useContext, useEffect, useState } from "react";

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [audio, setAudio] = useState<AudioProps | undefined>()
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/create-podcast') setAudio(undefined);
    }, [pathname])

    return (
        <AudioContext.Provider value={{ audio, setAudio }}>
            {children}
        </AudioContext.Provider>
    )
}

export const useAudio = () => {
    const context = useContext(AudioContext);

    if (!context) throw new Error('useAudio must be used within an AudioProvider');

    return context;
}

export default AudioProvider;