import { h } from 'preact';
import Fanboard from './components/Fanboard';
import Schedule from './components/Schedule';
import SupporterWall from './components/SupporterWall';
import TodoList from './components/TodoList';

export default function App() {
  return (
    <div class="container">
      <header>
        <h1>🌊🐱 Vtuber OceanBoard</h1>
        <p>Let the gray cat tide carry your message.</p>
      </header>

      <div class="grid">
        <div class="grid-item large"><Schedule /></div>
        <div class="grid-item small"><Fanboard /></div>
        <div class="grid-item small"><SupporterWall /></div>
        <div class="grid-item full"><TodoList /></div>
      </div>

      <footer>
        <p>© 2025 OceanBoard. Built with 🐾 + 💙</p>
      </footer>

      <style scoped>{`
        .container {
          max-width: 1200px;
          margin: auto;
          padding: 1rem;
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(to bottom, #e0f7ff, #bcecff);
          color: #333;
        }

        header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .grid-item {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          padding: 1rem;
        }

        .large {
          grid-column: span 2;
        }

        .small {
          grid-column: span 1;
        }

        .full {
          grid-column: span 3;
        }

        footer {
          text-align: center;
          margin-top: 2rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .large, .small, .full {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
