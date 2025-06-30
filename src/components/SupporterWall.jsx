// src/components/SupporterWall.jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function SupporterWall() {
  const [popup, setPopup] = useState('');

  const support = (emoji) => {
    setPopup(emoji);
    setTimeout(() => setPopup(''), 1000);
  };

  return (
    <div class="wall">
      <h2>🐱 Supporter Wall</h2>
      <div class="emojis">
        {['💖', '😺', '🌊', '✨', '🐟'].map((e) => (
          <button onClick={() => support(e)}>{e}</button>
        ))}
      </div>

      {popup && <div class="popup">{popup}</div>}

      <style scoped>
        {`
        .wall {
          background: linear-gradient(to right, #bcecff, #e0f7ff);
          padding: 1rem;
          border-radius: 1rem;
          position: relative;
        }
        .emojis button {
          font-size: 2rem;
          margin: 0.3rem;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .popup {
          position: absolute;
          top: 0;
          right: 1rem;
          font-size: 3rem;
          animation: pop 0.5s ease;
        }
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        `}
      </style>
    </div>
  );
}
