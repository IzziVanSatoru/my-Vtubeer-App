import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { supabase } from '../../supabase';

export default function Schedule() {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('schedule')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setImages(data);
    else console.error('❌ Fetch error:', error);
  };

  const uploadImage = async () => {
    if (!selectedFile) return alert('⚠️ Pilih gambar dulu');
    setUploading(true);

    const ext = selectedFile.name.split('.').pop();
    const filename = `${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase
      .storage
      .from('schedule')
      .upload(filename, selectedFile);

    if (uploadError) {
      alert('❌ Gagal upload');
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('schedule')
      .getPublicUrl(filename);

    const { error: insertError, data } = await supabase
      .from('schedule')
      .insert([{ filename, url: publicUrlData.publicUrl }])
      .select();

    if (!insertError && data?.length) {
      setImages(prev => [data[0], ...prev]);
      setSelectedFile(null);
    }

    setUploading(false);
  };

  const deleteImage = async (img) => {
    const confirmDelete = confirm(`Hapus "${img.filename}"?`);
    if (!confirmDelete) return;

    await supabase.storage.from('schedule').remove([img.filename]);
    await supabase.from('schedule').delete().eq('id', img.id);
    setImages(prev => prev.filter(i => i.id !== img.id));
  };

  const deleteAllImages = async () => {
    if (images.length === 0) return alert('📭 Tidak ada gambar untuk dihapus.');
    const confirmDelete = confirm('⚠️ Yakin hapus semua gambar dan data dari bucket dan tabel?');
    if (!confirmDelete) return;

    // Step 1: List semua file dari bucket secara paksa
    const { data: fileList, error: listError } = await supabase
      .storage
      .from('schedule')
      .list('', { limit: 1000 });

    if (!listError && fileList.length > 0) {
      const filenames = fileList.map(file => file.name);
      await supabase.storage.from('schedule').remove(filenames);
    }

    // Step 2: Hapus semua row dari tabel
    const { error: deleteAll } = await supabase
      .from('schedule')
      .delete()
      .neq('id', ''); // semua baris yang id-nya tidak kosong

    if (deleteAll) {
      alert('❌ Gagal hapus data tabel.');
      console.error(deleteAll);
    } else {
      alert('✅ Semua file dan data berhasil dihapus!');
      setImages([]);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div class="schedule-container">
      <h2>🗓️ Jadwal Upload Vtuber</h2>

      <div class="actions">
        <label class="btn">
          📁 Pilih Gambar
          <input hidden type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files[0])} />
        </label>
        <button class="btn danger" onClick={deleteAllImages}>🧨 Hapus Semua</button>
      </div>

      {selectedFile && <p>📂 {selectedFile.name}</p>}

      <button class="btn upload" onClick={uploadImage} disabled={uploading}>
        {uploading ? '⏳ Uploading...' : '📤 Upload'}
      </button>

      <div class="gallery">
        {images.map(img => (
          <div class="card" key={img.id}>
            <img src={img.url} alt={img.filename} onClick={() => setPreviewImg(img.url)} />
            <div class="caption">
              {img.filename}
              <button class="btn small danger" onClick={() => deleteImage(img)}>❌</button>
            </div>
          </div>
        ))}
      </div>

      {previewImg && (
        <div class="preview" onClick={() => setPreviewImg(null)}>
          <img src={previewImg} />
        </div>
      )}

      <style scoped>{`
        .schedule-container {
          max-width: 720px;
          margin: 2rem auto;
          background: #ecfdf5;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 0 20px rgba(0,0,0,0.05);
          text-align: center;
        }
        .actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .btn {
          background: #3b82f6;
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: bold;
          border: none;
        }
        .btn.upload {
          background: #22c55e;
          margin-top: 1rem;
        }
        .btn.danger {
          background: #ef4444;
        }
        .btn.small {
          font-size: 0.75rem;
          padding: 0.3rem 0.6rem;
        }
        .gallery {
          margin-top: 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }
        .card {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .card img {
          width: 100%;
          cursor: zoom-in;
        }
        .caption {
          padding: 0.5rem;
          background: #f8fafc;
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
        }
        .preview {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          cursor: zoom-out;
        }
        .preview img {
          max-width: 90vw;
          max-height: 90vh;
          border-radius: 1rem;
        }
      `}</style>
    </div>
  );
}
