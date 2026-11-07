import { useState, useCallback, memo } from 'react';
import AOS from 'aos';
import PhotoGallery from './PhotoGallery';
import bgImg from '../assets/img16.jpg';

/**
 * LoveLetter - Интерактивное романтическое цифровое письмо для Мушараф
 * Изящный русский язык, вдохновляющие комплименты, анимации AOS.
 */
const LoveLetter = ({ onOpenLetter, triggerHeartBurst }) => {
  // Состояния анимации: 'closed' | 'opening' | 'opened' | 'closing'
  const [envelopeState, setEnvelopeState] = useState('closed');
  const [showGallery, setShowGallery] = useState(false);

  // Плавное открытие конверта
  const handleOpen = useCallback(() => {
    if (envelopeState !== 'closed') return;

    setEnvelopeState('opening');
    if (onOpenLetter) onOpenLetter();
    if (triggerHeartBurst) triggerHeartBurst();

    setTimeout(() => {
      setEnvelopeState('opened');
      AOS.refresh();
    }, 750);
  }, [envelopeState, onOpenLetter, triggerHeartBurst]);

  // Плавное закрытие письма
  const handleClose = useCallback((e) => {
    if (e) e.stopPropagation();
    setShowGallery(false);
    setEnvelopeState('closing');

    setTimeout(() => {
      setEnvelopeState('closed');
      AOS.refresh();
    }, 600);
  }, []);

  // Переключение фотогалереи
  const handleToggleGallery = useCallback(() => {
    setShowGallery((prev) => {
      const nextState = !prev;
      setTimeout(() => {
        AOS.refresh();
      }, 250);
      return nextState;
    });
  }, []);

  return (
    <div className={`letter-experience-wrapper state-${envelopeState}`}>
      {/* ========================================================
          1. СТАДИЯ ЗАКРЫТОГО / ОТКРЫВАЮЩЕГОСЯ КОНВЕРТА
          ======================================================== */}
      {(envelopeState === 'closed' || envelopeState === 'opening' || envelopeState === 'closing') && (
        <div
          className={`closed-envelope-section ${envelopeState === 'opening' ? 'is-unsealing' : ''} ${
            envelopeState === 'closing' ? 'is-folding' : ''
          }`}
        >
          {/* Пригласительный блок с AOS */}
          <div className="envelope-invitation" data-aos="fade-down" data-aos-duration="800">
            <span className="sparkle-tag">
              <span className="sparkle-icon">✨</span>
              <span>Особенное послание для прекрасной Мушараф</span>
              <span className="sparkle-icon">✨</span>
            </span>
            <h1 className="envelope-main-title">Письмо от всего сердца</h1>
            <p className="envelope-sub-text">
              Искренние признания, нежные слова и восхищение, запечатанные с любовью...
            </p>
          </div>

          {/* 3D интерактивный конверт с AOS */}
          <div
            className="envelope-container"
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            data-aos="zoom-in"
            data-aos-duration="900"
            aria-label="Нажмите, чтобы сломать печать и открыть письмо"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleOpen();
            }}
          >
            <div className="envelope-box">
              {/* Задняя стенка конверта */}
              <div className="envelope-back" />

              {/* Выглядывающее письмо */}
              <div className="envelope-letter-sneak">
                <div className="sneak-line long" />
                <div className="sneak-line medium" />
                <div className="sneak-line short" />
                <span className="sneak-seal-badge">🌸</span>
              </div>

              {/* Верхний клапан конверта (3D поворот) */}
              <div className="envelope-flap" />

              {/* Карманы конверта */}
              <div className="envelope-pocket-left" />
              <div className="envelope-pocket-right" />
              <div className="envelope-pocket-bottom" />

              {/* Сургучная печать */}
              <div className="wax-seal" title="Нажмите, чтобы открыть тайну сердца">
                <div className="wax-seal-outer-glow" />
                <div className="wax-seal-body">
                  <div className="wax-seal-inner-emboss">
                    <span className="seal-emblem">🌸</span>
                  </div>
                </div>
              </div>

              {/* Почтовая марка со штемпелем */}
              <div className="envelope-stamp-card">
                <div className="stamp-perforations">
                  <span className="stamp-icon">🕊️</span>
                  <span className="stamp-text">WITH LOVE</span>
                  <span className="stamp-postmark-wavy" aria-hidden="true" />
                </div>
              </div>

              {/* Каллиграфические подписи на конверте */}
              <div className="envelope-calligraphy-label">
                <p className="label-to">
                  <span className="label-prefix">Кому:</span>
                  <span className="recipient-name">Мушараф 🌸</span>
                </p>
                <p className="label-from">
                  <span className="label-prefix">От кого:</span>
                  <span className="sender-note">Тот, чьё сердце бьётся только для тебя 🕊️✨</span>
                </p>
              </div>
            </div>

            {/* Сияющая кнопка открытия */}
            <button type="button" className="open-letter-cta" onClick={handleOpen}>
              <span className="cta-icon">💌</span>
              <span>Открыть тайну сердца</span>
              <span className="cta-shimmer" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          2. СТАДИЯ ЧТЕНИЯ ПИСЬМА (ПЕРГАМЕНТ)
          ======================================================== */}
      {envelopeState === 'opened' && (
        <div className="opened-letter-section">
          {/* Фоновое фото при открытом письме */}
          <div className="opened-bg" style={{ backgroundImage: `url(${bgImg})` }} aria-hidden="true" />
          <div className="letter-paper-wrapper">
            {/* Пергаментный свиток с текстом */}
            <article className="parchment-document" aria-label="Содержимое письма">
              {/* Позолоченные уголки */}
              <span className="filigree-corner top-left" aria-hidden="true">❧</span>
              <span className="filigree-corner top-right" aria-hidden="true">❧</span>
              <span className="filigree-corner bottom-left" aria-hidden="true">❧</span>
              <span className="filigree-corner bottom-right" aria-hidden="true">❧</span>

              {/* Золотая внутренняя рамка */}
              <div className="parchment-border-frame" />

              {/* Шапка письма */}
              <header className="letter-header" data-aos="fade-down" data-aos-duration="700">
                <div className="letter-botanical-crown" aria-hidden="true">
                  <span className="crown-leaf">🌸</span>
                  <span className="crown-sparkle">✨</span>
                  <span className="crown-leaf">🌸</span>
                </div>
                <h2 className="letter-salutation">Прекрасная и неповторимая Мушараф,</h2>
                <p className="letter-subheading">С бесконечной нежностью, любовью и восхищением</p>
                <div className="letter-gold-flourish" aria-hidden="true" />
              </header>

              {/* Текст письма с глубокими романтическими комплиментами */}
              <div className="letter-body-content">
                <p className="letter-para lead-para" data-aos="fade-up" data-aos-duration="750">
                  С того самого дня, как ты появилась в моей жизни, весь мир вокруг заиграл совершенно
                  иными, волшебными красками. Есть люди, чьё присутствие само по себе является чудом —
                  и ты поистине самое прекрасное из них. В тебе удивительным образом живёт редкая,
                  ослепительная гармония: утончённое благородство, безграничная доброта и та чистая,
                  притягательная красота, от которой замирает дыхание. Рядом с тобой время будто
                  останавливается, а сердце наполняется трепетом и тихим счастьем.
                </p>

                <p className="letter-para" data-aos="fade-up" data-aos-duration="750">
                  Твоя улыбка — это чистое утреннее солнце, способное рассеять любые тучи и наполнить сердце
                  невыразимым теплом. Стоит тебе просто улыбнуться, как мир вокруг становится добрее и радостнее.
                  А твои глаза... В них сокрыта целая вселенная: бездонная, таинственная, сотканная из звёздного
                  сияния и трепетной нежности. В твоём взгляде столько девичьего обаяния, нежности и чистоты, что в нём
                  хочется растворяться бесконечно. Твой голос звучит слаще самой прекрасной музыки, а каждое
                  твоё движение исполнено природного благородства.
                </p>

                {/* Стихотворение с эффектом zoom-in */}
                <blockquote className="letter-poem" data-aos="zoom-in" data-aos-duration="850">
                  <span className="quote-mark left" aria-hidden="true">❝</span>
                  <div className="poem-stanza">
                    <p>Ты стала светом в моей темноте,</p>
                    <p>Звездой, что зажглась в моей пустоте.</p>
                    <p>С первого взгляда влюбился в тебя,</p>
                    <p>И сердце с тех пор лишь ищет тебя.</p>
                  </div>
                  <div className="poem-stanza">
                    <p>Пусть между нами преграды стоят,</p>
                    <p>Мои чувства с годами сильнее горят.</p>
                    <p>Ведь если любовь в твоём сердце живёт,</p>
                    <p>То тот, кто не сдастся, однажды дойдёт.</p>
                  </div>
                  <span className="quote-mark right" aria-hidden="true">❞</span>
                </blockquote>

                <p className="letter-para" data-aos="fade-up" data-aos-duration="750">
                  Ты восхитительна во всём — от блеска твоих шелковистых волос до кристальной доброты
                  твоего сердца. В тебе нет ни капли фальши: твоя женственность, скромность, ум и
                  утончённость — это редчайший дар, делающий тебя поистине неповторимой. Для меня ты —
                  само совершенство, живое воплощение красоты и нежности, перед которым невозможно устоять.
                </p>

                <p className="letter-para" data-aos="fade-up" data-aos-duration="750">
                  Я хочу, чтобы ты знала: ты достойна всего самого сказочного, светлого и прекрасного,
                  что только существует на этой земле. Пусть твоё сердце никогда не касается печаль, а
                  твои волшебные глаза всегда сияют только от искреннего счастья. Спасибо тебе просто за
                  то, что ты есть — такая чудесная, нежная и бесконечно любимая.
                </p>

                <p className="letter-closing-wish" data-aos="fade-up" data-aos-duration="750">
                  Ты — моё самое дорогое сокровище и вечное вдохновение, Мушараф. Моё сердце всегда с тобой. 🌸✨
                </p>
              </div>

              {/* Подпись и сургучно-почтовый штемпель */}
              <footer className="letter-footer-section" data-aos="fade-up" data-aos-duration="750">
                <div className="postmark-seal-circle" aria-hidden="true">
                  <span className="postmark-icon">🕊️</span>
                  <span className="postmark-text">С ЛЮБОВЬЮ</span>
                </div>

                <div className="letter-signature-block">
                  <p className="sig-prelude">С бесконечной любовью, трепетом и обожанием,</p>
                  <p className="sig-author">Навеки твой, чьё сердце принадлежит тебе ✍️💖</p>
                </div>
              </footer>

              {/* Интерактивная панель действий */}
              <div className="letter-interactive-bar" data-aos="fade-up" data-aos-duration="750">
                {/* Переключатель фотогалереи */}
                <button
                  type="button"
                  className={`interactive-btn gallery-toggle-btn ${showGallery ? 'is-active' : ''}`}
                  onClick={handleToggleGallery}
                  aria-expanded={showGallery}
                >
                  <span className="btn-icon-symbol">📸</span>
                  <span>{showGallery ? 'Скрыть моменты' : 'Моменты красоты и нежности'}</span>
                </button>

                {/* Кнопка закрытия письма */}
                <button type="button" className="interactive-btn close-fold-btn" onClick={handleClose}>
                  <span className="btn-icon-symbol">✉️</span>
                  <span>Сложить письмо</span>
                </button>
              </div>
            </article>

            {/* Блок фотогалереи */}
            {showGallery && (
              <div className="gallery-slide-drawer">
                <PhotoGallery />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(LoveLetter);
