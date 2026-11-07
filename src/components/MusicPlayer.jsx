import React, { useEffect, useRef, useState, useCallback } from 'react';
import musicFile from '../audio/hammali-navai_-_a-esli-eto-lyubov.(обработан).mp3';

/**
 * MusicPlayer - Премиальный плавающий романтический аудиоплеер
 */
const MusicPlayer = ({ shouldPlay, onToggle }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Синхронизация громкости
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // При открытии конверта запускаем музыку, если пользователь сам не ставил на паузу
  useEffect(() => {
    if (shouldPlay && !isPlaying && !hasInteracted) {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            if (onToggle) onToggle(true);
          })
          .catch((err) => {
            console.log('Audio playback waiting for direct user gesture:', err);
          });
      }
    }
  }, [shouldPlay, isPlaying, hasInteracted, onToggle]);

  const togglePlay = useCallback(() => {
    setHasInteracted(true);
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (onToggle) onToggle(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          if (onToggle) onToggle(true);
        })
        .catch((err) => {
          console.error('Audio play error:', err);
        });
    }
  }, [isPlaying, onToggle]);

  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  }, []);

  const handleVolumeChange = useCallback((e) => {
    e.stopPropagation();
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  return (
    <div
      className={`music-player-widget ${isPlaying ? 'is-playing' : 'is-paused'}`}
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => setShowVolumeSlider(false)}
      role="region"
      aria-label="Фоновый аудиоплеер"
    >
      <audio
        ref={audioRef}
        src={musicFile}
        loop
        preload="none"
      />

      <div className="music-player-inner">
        {/* Play / Pause Primary Action */}
        <button
          type="button"
          onClick={togglePlay}
          className="music-play-btn"
          aria-label={isPlaying ? 'Приостановить музыку' : 'Включить романтическую музыку'}
          title={isPlaying ? 'Пауза' : 'Слушать музыку'}
        >
          {isPlaying ? (
            <span className="btn-icon-pause" aria-hidden="true">❚❚</span>
          ) : (
            <span className="btn-icon-play" aria-hidden="true">▶</span>
          )}
        </button>

        {/* Live Audio Equalizer & Track Information */}
        <div
          className="music-track-info"
          onClick={togglePlay}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') togglePlay();
          }}
          aria-label="Название трека"
        >
          <div className="music-equalizer" aria-hidden="true">
            <span className={`eq-bar bar-1 ${isPlaying ? 'active' : ''}`} />
            <span className={`eq-bar bar-2 ${isPlaying ? 'active' : ''}`} />
            <span className={`eq-bar bar-3 ${isPlaying ? 'active' : ''}`} />
            <span className={`eq-bar bar-4 ${isPlaying ? 'active' : ''}`} />
          </div>
          <div className="music-labels">
            <span className="track-title">HammAli & Navai — А если это любовь?</span>
            <span className="track-status">
              {isPlaying ? 'Романтическая мелодия любви ✨' : 'Нажмите, чтобы включить 🎶'}
            </span>
          </div>
        </div>

        {/* Volume & Mute Controls */}
        <div className={`music-volume-group ${showVolumeSlider ? 'expanded' : ''}`}>
          <button
            type="button"
            onClick={toggleMute}
            className="music-mute-btn"
            title={isMuted || volume === 0 ? 'Включить звук' : 'Без звука'}
            aria-label={isMuted || volume === 0 ? 'Включить звук' : 'Выключить звук'}
          >
            {isMuted || volume === 0 ? (
              <span className="vol-icon">🔇</span>
            ) : volume < 0.4 ? (
              <span className="vol-icon">🔉</span>
            ) : (
              <span className="vol-icon">🔊</span>
            )}
          </button>

          <div className="volume-slider-wrapper">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              aria-label="Регулятор громкости"
              title={`Громкость: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MusicPlayer);
