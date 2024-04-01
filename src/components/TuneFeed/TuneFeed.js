import React, { useState, useRef, useEffect } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { Modal, Button } from 'react-bootstrap';
import { useSwipeable } from 'react-swipeable';
import './TuneFeed.css';

const videoData = [
  {
    src: "./video1.mp4",
    user: "@usuario1",
    description: "Descrição do vídeo 1",
    music: "Música 1",
  },
  {
    src: "./video2.mp4",
    user: "@usuario2",
    description: "Descrição do vídeo 2",
    music: "Música 2"
  },
  {
    src: "./video3.mp4",
    user: "@usuario3",
    description: "Descrição do vídeo 3",
    music: "Música 3"
  },
  {
    src: "./video4.mp4",
    user: "@usuario4",
    description: "Descrição do vídeo 4",
    music: "Música 4"
  },
];

function VideoComponent({ video, preload, onVideoEnd, isFirstVideo }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleVideoEnd = () => {
      if (onVideoEnd) {
        onVideoEnd();
      }
    };

    const videoElement = videoRef.current;
    videoElement.addEventListener('ended', handleVideoEnd);

    return () => {
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, [onVideoEnd]);

  const handleVisibilityChange = (isVisible) => {
    if (isVisible) {
      if (!isFirstVideo) {
        videoRef.current.play().catch(error => console.error("Erro ao tentar reproduzir vídeo:", error));
      }
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

  const [showModal, setShowModal] = useState(true);

  const handleCloseModal = () => {
    setShowModal(false);
    const firstVideo = feedRef.current.querySelector('video');
    if (firstVideo) {
      firstVideo.play().catch(error => console.error("Erro ao tentar reproduzir vídeo:", error));
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => setVideoIndex(prevIndex => (prevIndex + 1) % videoData.length),
    onSwipedDown: () => setVideoIndex(prevIndex => (prevIndex - 1 + videoData.length) % videoData.length),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY > 0) {
        setVideoIndex(prevIndex => (prevIndex + 1) % videoData.length);
      } else {
        setVideoIndex(prevIndex => (prevIndex - 1 + videoData.length) % videoData.length);
      }
    };

    const feedElement = feedRef.current;
    feedElement.addEventListener('wheel', handleWheel);

    return () => {
      feedElement.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="tuneFeed" {...swipeHandlers} ref={feedRef}>
      <Modal show={showModal} centered className="custom-modal">
        <Modal.Header className="custom-modal-header">
          <Modal.Title className="custom-modal-title">Bem-vindo ao TuneFeed!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <p className="custom-modal-text">Arrasta para cima para descobrir vídeos incríveis!</p>
        </Modal.Body>
        <Modal.Footer className="custom-modal-footer">
          <Button variant="primary" onClick={handleCloseModal} className="custom-modal-button">OK</Button>
        </Modal.Footer>
      </Modal>

      <h1 className="title">TuneFeed - Vídeos recomendados</h1>
      {videoData.map((video, index) => (
        index === videoIndex && <VideoComponent key={index} video={video} preload={true} onVideoEnd={() => setVideoIndex(prevIndex => (prevIndex + 1) % videoData.length)} isFirstVideo={index === 0} />
      ))}
    </div>
  );
}

export default TuneFeed;
