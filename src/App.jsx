import { useState, useCallback, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import FloatingHearts from './components/FloatingHearts';
import MusicPlayer from './components/MusicPlayer';
import LoveLetter from './components/LoveLetter';
import './App.css';

/**
 * App - Главная оболочка романтического проекта LOVE LETTER
 * Изысканность, кинематографичность, элегантный русский язык для Мушараф.
 */
function App() {
  const [shouldPlayMusic, setShouldPlayMusic] = useState(false);
  const [burstCount, setBurstCount] = useState(0);

  // Инициализация библиотеки AOS (Animate On Scroll) с оптимизацией производительности
  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      offset: 40,
      throttleDelay: 99,
      debounceDelay: 50,
    });
  }, []);

  // Вызывается при открытии конверта
  const handleOpenLetter = useCallback(() => {
    setShouldPlayMusic(true);
    setBurstCount((prev) => prev + 1);
    setTimeout(() => {
      AOS.refresh();
    }, 400);
  }, []);

  // Вызывается при романтических анимациях сердечек
  const handleTriggerBurst = useCallback(() => {
    setBurstCount((prev) => prev + 1);
  }, []);

  return (
    <div className="romantic-app-root">
      {/* 1. Динамический канвас с парящими светящимися лепестками и сердцами */}
      <FloatingHearts triggerBurst={burstCount} />

      {/* 2. Плавающий романтический аудиоплеер */}
      <MusicPlayer shouldPlay={shouldPlayMusic} />

      {/* 3. Атмосферное освещение и свечное мерцание */}
      <div className="ambient-radial-glow glow-primary" aria-hidden="true" />
      <div className="ambient-radial-glow glow-secondary" aria-hidden="true" />
      <div className="ambient-radial-glow glow-tertiary" aria-hidden="true" />
      <div className="ambient-vignette" aria-hidden="true" />

      {/* 4. Главная сцена: Конверт и Письмо */}
      <main className="romantic-main-content">
        <LoveLetter
          onOpenLetter={handleOpenLetter}
          triggerHeartBurst={handleTriggerBurst}
        />
      </main>

      {/* 5. Элегантный романтический футер */}
      <footer className="romantic-footer" data-aos="fade-up" data-aos-duration="600">
        <p>
          Создано с искренней любовью и бесконечным восхищением для Мушараф{' '}
          <span className="heart-pulse">🌸</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
