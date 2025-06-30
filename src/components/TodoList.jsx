import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const addTask = () => {
    if (!input.trim()) return;
    const newTask = {
      id: Date.now(),
      text: input.trim(),
      done: false
    };
    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div class="todo-container">
      <h2>🎀 To-Do List Lucu</h2>

      <div class="todo-input-wrap">
        <input
          type="text"
          placeholder="Tulis tugas lucu hari ini..."
          value={input}
          onInput={(e) => setInput(e.target.value)}
        />
        <button onClick={addTask}>✨ Tambah</button>
      </div>

      <ul class="todo-list">
        {tasks.map((task) => (
          <li key={task.id} class={`todo-item ${task.done ? 'done' : ''}`}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleDone(task.id)}
              />
              <span>{task.text}</span>
            </label>
            <button class="delete" onClick={() => deleteTask(task.id)}>🗑️</button>
          </li>
        ))}
      </ul>

      <style scoped>{`
        .todo-container {
          max-width: 600px;
          margin: 2rem auto;
          background: #fff0f6;
          padding: 2rem;
          border-radius: 1.5rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          font-family: 'Comic Neue', 'Poppins', sans-serif;
        }

        h2 {
          text-align: center;
          color: #d63384;
          margin-bottom: 1.5rem;
        }

        .todo-input-wrap {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.8rem;
          margin-bottom: 1.5rem;
        }

        input[type="text"] {
          padding: 0.8rem 1rem;
          border: 2px solid #faa2c1;
          border-radius: 1rem;
          font-size: 1rem;
          outline: none;
          background: #fff;
        }

        button {
          padding: 0.8rem 1.2rem;
          background: #f783ac;
          color: white;
          border: none;
          font-weight: bold;
          border-radius: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        button:hover {
          background: #e64980;
        }

        .todo-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .todo-item {
          background: white;
          border: 2px solid #ffe3ec;
          border-radius: 1rem;
          padding: 0.8rem 1.2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: 0.3s;
        }

        .todo-item.done {
          opacity: 0.6;
          text-decoration: line-through;
        }

        .todo-item label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
        }

        .todo-item input[type="checkbox"] {
          accent-color: #f783ac;
          width: 1.2rem;
          height: 1.2rem;
        }

        .delete {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #d00000;
          border-radius: 0.5rem;
        }

        .delete:hover {
          background: #ffe3ec;
        }

        @media (max-width: 480px) {
          .todo-input-wrap {
            grid-template-columns: 1fr;
          }

          button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
