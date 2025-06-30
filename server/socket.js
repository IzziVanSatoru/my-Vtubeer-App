import { Server } from 'socket.io';
import { createServer } from 'http';

// Buat server HTTP kosong (tanpa express)
const httpServer = createServer();

// Inisialisasi Socket.io server
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('🟢 Connected:', socket.id);

  // Saat pesan baru dikirim
  socket.on('new_message', (msg) => {
    io.emit('message_broadcast', msg); // broadcast ke semua klien
  });

  // Saat pesan dihapus
  socket.on('delete_message', (msg) => {
    io.emit('message_deleted', msg); // broadcast pesan terhapus
  });

  socket.on('disconnect', () => {
    console.log('🔴 Disconnected:', socket.id);
  });
});

// Jalankan di port 300 (bukan 3000)
const PORT = 300;
httpServer.listen(PORT, () => {
  console.log(`✅ Socket.IO server running on port ${PORT}`);
});
