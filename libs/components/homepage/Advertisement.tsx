import React, { useState, useRef, useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack } from '@mui/material';

const videos = [
  '/video/video1.mp4',
  '/video/video2.mp4',
  '/video/video3.mp4',
  '/video/video4.mp4',
  '/video/video5.mp4',
];

const mobileVideo = '/video/ads.mov';

const Advertisement = () => {
  const device = useDeviceDetect();
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnded = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {}); // autoPlay might require interaction
    }
  }, [currentVideo]);

  if (device === 'mobile') {
    return (
      <Stack className="video-frame">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src={mobileVideo} type="video/mp4" />
        </video>
      </Stack>
    );
  }

  return (
    <Stack className="video-frame">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onEnded={handleEnded}
      >
        <source src={videos[currentVideo]} type="video/mp4" />
      </video>
    </Stack>
  );
};

export default Advertisement;
