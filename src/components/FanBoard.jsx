import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { io } from 'socket.io-client';
import { supabase } from '../../supabase';

const socket = io('http://localhost:300');

export default function FanBoard() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('stream_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setMessages(data);
  };

  const sendMessage = async () => {
    if (!username.trim() || !message.trim()) return alert('⚠️ Isi nama & pesan');

    const newMsg = { username, message };
    const { data, error } = await supabase
      .from('stream_entries')
      .insert([newMsg])
      .select();

    if (error) return console.error('❌ Gagal insert:', error);

    const inserted = data[0];
    socket.emit('new_message', inserted);
    setMessages(prev => [inserted, ...prev]);
    setMessage('');
  };

  const deleteMessage = async (msg) => {
    if (!confirm('🗑️ Yakin hapus pesan ini?')) return;

    const { error } = await supabase.from('stream_entries').delete().eq('id', msg.id);
    if (!error) {
      socket.emit('delete_message', msg);
      setMessages(prev => prev.filter(m => m.id !== msg.id));
    }
  };

  useEffect(() => {
    fetchMessages();

    socket.on('message_broadcast', (msg) => {
      setMessages(prev => [msg, ...prev.filter(m => m.id !== msg.id)]);
    });

    socket.on('message_deleted', (msg) => {
      setMessages(prev => prev.filter(m => m.id !== msg.id));
    });

    return () => {
      socket.off('message_broadcast');
      socket.off('message_deleted');
    };
  }, []);

  return (
    <div class="fanboard">
      <h2>📨 Fanboard (Chat Style)</h2>

      <input
        type="text"
        placeholder="Nama kamu..."
        value={username}
        onInput={(e) => setUsername(e.target.value)}
      />
      <textarea
        placeholder="Tulis pesan dukungan..."
        value={message}
        onInput={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Kirim</button>

      <div class="list">
        {messages.map((msg) => (
          <div
            class={`bubble ${msg.username === username ? 'me' : 'you'}`}
            key={msg.id}
          >
            <div class="name">{msg.username}</div>
            <div class="text">{msg.message}</div>
            <div class="bottom">
              <span class="time">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              {msg.username === username && (
                <button class="del" onClick={() => deleteMessage(msg)}>🗑️</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <style scoped>{`
        .fanboard {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1rem;
          border-radius: 1rem;
          background: #e5f5ff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        }

        h2 {
          text-align: center;
          color: #1d3557;
        }

        input, textarea {
          width: 100%;
          padding: 0.6rem;
          margin: 0.5rem 0;
          border-radius: 0.5rem;
          border: 1px solid #ccc;
          font-size: 1rem;
        }

        button {
          width: 100%;
          background: #0077b6;
          color: white;
          border: none;
          padding: 0.6rem;
          border-radius: 0.5rem;
          font-weight: bold;
          cursor: pointer;
        }

        .list {
          display: flex;
          flex-direction: column-reverse;
          margin-top: 1rem;
          gap: 1rem;
        }

        .bubble {
          max-width: 80%;
          padding: 0.8rem;
          border-radius: 0.8rem;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .me {
          align-self: flex-end;
          background: #dcf8c6;
          border-top-right-radius: 0;
        }

        .you {
          align-self: flex-start;
          background: #ffffff;
          border-top-left-radius: 0;
        }

        .name {
          font-size: 0.75rem;
          color: #555;
          margin-bottom: 0.2rem;
        }

        .text {
          font-size: 1rem;
          color: #222;
          line-height: 1.4;
        }

        .bottom {
          margin-top: 0.5rem;
          font-size: 0.7rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .time {
          color: #888;
        }

        .del {
          background: transparent;
          color: #d00000;
          border: none;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .del:hover {
          color: #ff4444;
        }
      `}</style>
    </div>
  );
}
