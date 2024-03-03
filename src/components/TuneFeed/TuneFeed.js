import React, { useState, useRef, useEffect } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { useSwipeable } from 'react-swipeable';
import './TuneFeed.css';

const videoData = [
    {
      src: "/video1.mp4",
      user: "@usuario1",
      description: "Descrição do vídeo 1",
      music: "Música 1",
    },
    {
      src: "/video2.mp4",
      user: "@usuario2",
      description: "Descrição do vídeo 2",
      music: "Música 2"
    },
    {
        src: "/video3.mp4",
        user: "@usuario3",
        description: "Descrição do vídeo 3",
        music: "Música 3"
    },
    {
        src: "/video4.mp4",
        user: "@usuario4",
        description: "Descrição do vídeo 4",
        music: "Música 4"
    },
];

function VideoComponent({ video, preload, onVideoEnd, autoPlay }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    const handleVideoEnd = () => {
      if (onVideoEnd) {
        onVideoEnd();
      }
    };

    if (autoPlay) {
      videoElement.play().catch(error => console.log("Erro ao tentar reproduzir vídeo automaticamente: ", error));
    }

    videoElement.addEventListener('ended', handleVideoEnd);

    return () => {
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, [onVideoEnd, autoPlay]); // Adiciona autoPlay na lista de dependências para reagir às mudanças

  const handleVisibilityChange = (isVisible) => {
    if (isVisible) {
      videoRef.current.play().catch(error => console.log("Erro ao tentar reproduzir vídeo: ", error));
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <VisibilitySensor onChange={handleVisibilityChange} partialVisibility>
      <div className="videoSection">
        <video ref={videoRef} width="320" height="240" controls preload={preload ? "auto" : "none"}>
          <source src={video.src} type="video/mp4" />
          Seu navegador não suporta o elemento de vídeo.
        </video>
        <div className="videoInfo">
          <span className="userName">{video.user}</span>
          <p className="videoDescription">{video.description}</p>
          <span className="musicInfo">🎵 {video.music}</span>
        </div>
      </div>
    </VisibilitySensor>
  );
}
function TuneFeed() {
  const [videoIndex, setVideoIndex] = useState(0);
  const feedRef = useRef(null);

  const goToNextVideo = () => setVideoIndex(prevIndex => (prevIndex + 1) % videoData.length);

  const handlers = useSwipeable({
      onSwipedUp: goToNextVideo,
      onSwipedDown: () => setVideoIndex(prevIndex => (prevIndex - 1 + videoData.length) % videoData.length),
      preventDefaultTouchmoveEvent: true,
      trackMouse: true
  });

  useEffect(() => {
      const handleScroll = (e) => {
          if (e.deltaY > 0) {
              goToNextVideo();
          } else {
              setVideoIndex(prevIndex => (prevIndex - 1 + videoData.length) % videoData.length);
          }
      };

      const feedElement = feedRef.current;
      feedElement.addEventListener('wheel', handleScroll);

      return () => {
          feedElement.removeEventListener('wheel', handleScroll);
      };
  }, []);

  return (
      <div className="tuneFeed" {...handlers} ref={feedRef}>
          <h1>TuneFeed - Vídeos recomendados</h1>

          {videoData.map((video, index) => (
              index === videoIndex && <VideoComponent key={index} video={video} onVideoEnd={goToNextVideo} />
          ))}

          {/* Pré-carregar o próximo vídeo se não for o último */}
          {videoIndex < videoData.length - 1 && 
            <div style={{ display: "none" }}>
              <VideoComponent video={videoData[videoIndex + 1]} preload={true} />
            </div>
          }
      </div>
    );
}

export default TuneFeed;
