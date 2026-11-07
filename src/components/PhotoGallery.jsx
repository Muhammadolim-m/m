import { useState, useEffect, useCallback, useRef, memo } from 'react';
import loveVideo from '../video/love-video.mp4';

// Все фото из папки assets подключаются автоматически
const modules = import.meta.glob('../assets/*.jpg', { eager: true, import: 'default' });
const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true });

// База романтических подписей и комплиментов для каждой фотографии Мушараф
const PHOTO_METADATA = {
  eyes: {
    badge: 'Взгляд сердца ✨',
    title: 'Твои волшебные глаза',
    subtitle: 'Океан нежности и звёздного света',
    desc: 'В твоих глазах кроется удивительная глубина. В них столько чистоты, тепла и магии, что в них хочется растворяться бесконечно.'
  },
  hair: {
    badge: 'Шёлковое сияние 🌸',
    title: 'Нежность твоих локонов',
    subtitle: 'Природное очарование и мягкость',
    desc: 'Твоя естественная красота и утончённость делают каждое движение лёгким и невесомым, словно весенний ветерок.'
  },
  lips: {
    badge: 'Свет улыбки 💋',
    title: 'Самая прекрасная улыбка',
    subtitle: 'Дар озарять мир теплом и радостью',
    desc: 'Когда ты улыбаешься, рассеивается любая печаль. Твоя улыбка — самое сладкое, нежное и светлое чудо на свете.'
  },
  neck: {
    badge: 'Царственная стать 🕊️',
    title: 'Изящество и нежность',
    subtitle: 'Воплощение подлинной женственности',
    desc: 'Твоя стать, скромность и врождённое благородство вызывают самое искреннее восхищение и трепет.'
  },
  img1: {
    badge: 'Ослепительный образ 🌟',
    title: 'Сияние чистой красоты',
    subtitle: 'Неповторимая Мушараф',
    desc: 'Каждая черта твоего лица совершенна и наполнена удивительным светом и гармонией.'
  },
  img2: {
    badge: 'Весенняя нежность 🌷',
    title: 'Цветок вдохновения',
    subtitle: 'Мягкость и девичье очарование',
    desc: 'Ты словно самый нежный цветок, распустившийся под первыми теплыми лучами весеннего солнца.'
  },
  img3: {
    badge: 'Чистая душа 💎',
    title: 'Драгоценное сокровище',
    subtitle: 'Искренность в каждом взгляде',
    desc: 'В тебе гармонично переплелись внешнее великолепие и кристальная чистота чуткого сердца.'
  },
  img4: {
    badge: 'Магия мгновения ✨',
    title: 'Пленительный силуэт',
    subtitle: 'Загадка и таинственный свет',
    desc: 'В твоём присутствии есть особая магия, от которой на душе становится тепло, светло и спокойно.'
  },
  img5: {
    badge: 'Солнечный смех 💖',
    title: 'Радость моего сердца',
    subtitle: 'Свет, прогоняющий любые печали',
    desc: 'Твой смех звучит как самая светлая песня, прогоняющая любые сомнения и согревающая душу.'
  },
  img6: {
    badge: 'Изысканный стиль 👑',
    title: 'Королевское благородство',
    subtitle: 'Природное величие и скромность',
    desc: 'Твоя манера держаться и говорить внушает искреннее почтение, теплоту и восхищение.'
  },
  img7: {
    badge: 'Гармония красоты 🌺',
    title: 'Неподражаемая Мушараф',
    subtitle: 'Свет, притягивающий взгляды',
    desc: 'Ты обладаешь редким природным магнетизмом, перед которым бессильны любые слова.'
  },
  img8: {
    badge: 'Бесконечная нежность 🕊️',
    title: 'Ангельский образ',
    subtitle: 'Доброта и сердечное тепло',
    desc: 'Рядом с тобой мир кажется уютным, чистым и наполненным искренней любовью.'
  },
  img9: {
    badge: 'Звёздное сияние ⭐',
    title: 'Моя путеводная звезда',
    subtitle: 'Свет среди суеты',
    desc: 'Ты озаряешь мой путь и даришь крылья моим самым светлым мечтам.'
  },
  img10: {
    badge: 'Тайное очарование 💫',
    title: 'Загадочный взгляд',
    subtitle: 'Глубина девичьих дум',
    desc: 'В твоём задумчивом взгляде есть нечто глубокое, волнующее и бесконечно прекрасное.'
  },
  img11: {
    badge: 'Юное очарование 🌸',
    title: 'Дыхание весны',
    subtitle: 'Свежесть и легкое очарование',
    desc: 'Ты воплощаешь в себе самое трепетное очарование молодости, нежности и женственности.'
  },
  img12: {
    badge: 'Чистый восторг 🌹',
    title: 'Отражение совершенства',
    subtitle: 'Красота, не знающая равных',
    desc: 'Природа создала тебя с особой любовью, наделив всем самым лучшим и утончённым.'
  },
  img13: {
    badge: 'Светлый луч ☀️',
    title: 'Солнце моего сердца',
    subtitle: 'Тепло каждого мгновения',
    desc: 'Один лишь твой взгляд способен развеять любые тучи и вернуть в сердце радость.'
  },
  img14: {
    badge: 'Истинное изящество 🎀',
    title: 'Поэзия в каждом жесте',
    subtitle: 'Утончённая женственность',
    desc: 'Ты двигаешься и говоришь с такой лёгкостью, будто сошла со страниц прекрасной восточной поэмы.'
  },
  img15: {
    badge: 'Мир и покой 🕊️',
    title: 'Оазис безмятежности',
    subtitle: 'Тихая радость души',
    desc: 'Твой внутренний покой и доброта передаются каждому, кому посчастливилось быть рядом.'
  },
  img16: {
    badge: 'Моё вдохновение 💖',
    title: 'Самая прекрасная',
    subtitle: 'Навсегда в моём сердце',
    desc: 'Ты — главное вдохновение для каждого тёплого слова, каждой песни и искренней строки.'
  },
  img17: {
    badge: 'Сказка наяву 👑',
    title: 'Прекрасная царица',
    subtitle: 'Неземное очарование Мушараф',
    desc: 'Ты делаешь сказку реальностью, оставаясь самой неповторимой и чуткой на всем белом свете.'
  }
};

// Извлечение имени файла
const getFileKey = (path) => {
  const parts = path.split('/');
  const filename = parts[parts.length - 1];
  return filename.replace('.jpg', '');
};

// Подготовка массива фотографий
const photoItems = Object.keys(modules)
  .sort(natural)
  .map((path, i) => {
    const key = getFileKey(path);
    const meta = PHOTO_METADATA[key] || {
      badge: 'Момент красоты 🌸',
      title: `Прекрасный момент ${i + 1}`,
      subtitle: 'Очарование и нежность Мушараф',
      desc: 'Каждое мгновение с тобой наполнено светом, теплом и чистой радостью.'
    };

    return {
      id: i + 1,
      key,
      img: modules[path],
      meta
    };
  });

/**
 * PhotoGallery - Галерея в стиле Luxury Art Cards с Lightbox, видео и подписями под каждым фото
 */
const PhotoGallery = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const touchX = useRef(0);

  const selectedPhoto = selectedIndex !== null ? photoItems[selectedIndex] : null;

  // Навигация с клавиатуры для полноэкранного просмотра
  const handleKeyDown = useCallback(
    (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev + 1) % photoItems.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev - 1 + photoItems.length) % photoItems.length);
      }
    },
    [selectedIndex]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % photoItems.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + photoItems.length) % photoItems.length);
  };

  return (
    <section className="photo-gallery-section" aria-label="Моменты красоты и нежности">
      {/* Заголовок галереи с AOS анимацией */}
      <div className="gallery-header" data-aos="fade-down" data-aos-duration="700">
        <div className="gallery-botanical-divider" aria-hidden="true">
          <span>🌸</span>
          <span className="divider-sparkle">✨</span>
          <span>🕊️</span>
        </div>
        <h3 className="gallery-title">Моменты красоты и нежности, Мушараф</h3>
        <p className="gallery-subtitle">
          Искреннее посвящение твоей неповторимой красоте, чуткому сердцу и безмятежному свету
        </p>
      </div>

      {/* Коллаж из всех фото с подписью под каждым фото */}
      <div className="gallery-masonry">
        {photoItems.map((item, index) => (
          <div
            key={item.id}
            className="masonry-tile"
            data-aos="fade-up"
            data-aos-delay={((index % 4) + 1) * 80}
            onClick={() => setSelectedIndex(index)}
            role="button"
            tabIndex={0}
            aria-label={`Открыть фото: ${item.meta.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setSelectedIndex(index);
            }}
          >
            {/* Сама фотография */}
            <div className="tile-image-container">
              <img
                src={item.img}
                alt={item.meta.title}
                loading="lazy"
                decoding="async"
              />
              <div className="tile-overlay-hint">
                <span className="hint-pill">🔍 Увеличить</span>
              </div>
            </div>

            {/* Подпись и слова под каждой фотографией */}
            <div className="tile-caption-card">
              <span className="tile-badge">{item.meta.badge}</span>
              <h4 className="tile-title">{item.meta.title}</h4>
              <p className="tile-subtitle">{item.meta.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Блок с памятным видео */}
      <div className="video-moment-wrapper" data-aos="zoom-in" data-aos-duration="800">
        <button
          type="button"
          onClick={() => setShowVideo(!showVideo)}
          className="romantic-video-toggle-btn"
          aria-expanded={showVideo}
        >
          <span className="video-btn-icon">{showVideo ? '🎥' : '🎬'}</span>
          <span>{showVideo ? 'Скрыть памятное видео' : 'Посмотреть памятный момент (Видео)'}</span>
        </button>

        {showVideo && (
          <div className="video-player-container">
            <div className="video-frame-border">
              <video
                ref={(el) => {
                  if (el) el.muted = true;
                }}
                src={loveVideo}
                controls
                autoPlay
                playsInline
                muted
                preload="none"
                className="romantic-video-element"
                aria-label="Особенный памятный момент"
              />
            </div>
            <p className="video-caption-label">
              ✨ Дорогой и безмятежный момент покоя и красоты... 🌸
            </p>
          </div>
        )}
      </div>

      {/* Полноэкранный просмотр (Lightbox) */}
      {selectedPhoto && (
        <div
          className="lightbox-overlay"
          onClick={() => setSelectedIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.meta.title}
        >
          <div
            className="lightbox-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Кнопка закрытия */}
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setSelectedIndex(null)}
              aria-label="Закрыть просмотр"
            >
              ✕
            </button>

            {/* Кнопка «Назад» */}
            <button
              type="button"
              className="lightbox-nav-btn prev"
              onClick={handlePrev}
              aria-label="Предыдущее фото"
            >
              ‹
            </button>

            {/* Кнопка «Вперёд» */}
            <button
              type="button"
              className="lightbox-nav-btn next"
              onClick={handleNext}
              aria-label="Следующее фото"
            >
              ›
            </button>

            {/* Фотография крупным планом */}
            <div
              className="lightbox-image-showcase"
              onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
              onTouchEnd={(e) => {
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 50) setSelectedIndex((prev) => (prev + (dx < 0 ? 1 : -1) + photoItems.length) % photoItems.length);
              }}
            >
              <img
                src={selectedPhoto.img}
                alt={selectedPhoto.meta.title}
                className="lightbox-display-img"
                loading="lazy"
                decoding="async"
              />
              <span className="lightbox-counter">
                {selectedIndex + 1} / {photoItems.length}
              </span>
            </div>

            {/* Романтическое описание и комплимент к фотографии в модалке */}
            <div className="lightbox-details">
              <span className="lightbox-badge-pill">
                {selectedPhoto.meta.badge}
              </span>
              <h4 className="lightbox-title">
                {selectedPhoto.meta.title}
              </h4>
              <p className="lightbox-subtitle">
                {selectedPhoto.meta.subtitle}
              </p>
              <p className="lightbox-description">
                {selectedPhoto.meta.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default memo(PhotoGallery);
