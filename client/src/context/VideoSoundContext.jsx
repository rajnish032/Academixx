"use client";

import { createContext, useContext, useState } from "react";

const VideoSoundContext = createContext();

export function VideoSoundProvider({ children }) {
  const [muted, setMuted] = useState(true);

  return (
    <VideoSoundContext.Provider value={{ muted, setMuted }}>
      {children}
    </VideoSoundContext.Provider>
  );
}

export const useVideoSound = () => useContext(VideoSoundContext);