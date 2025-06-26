// import { useState } from 'react';

// export default function UploadForm() {
//   const [type, setType] = useState('image');
//   const [downloadUrl, setDownloadUrl] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const res = await fetch(`/api/compress/${type}`, {
//       method: 'POST',
//       body: formData,
//     });
//     const result = await res.json();

//     if (result.downloadUrl) {
//       setDownloadUrl(result.downloadUrl);
//     }
//     alert(result.message);
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
//         <select name="type" onChange={(e) => setType(e.target.value)} className="border p-2">
//           <option value="image">Image</option>
//           <option value="audio">Audio</option>
//           <option value="video">Video</option>
//         </select>
//         <input type="file" name="file" required className="border p-2" />
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2">Compress</button>
//       </form>

//       {downloadUrl && (
//         <div className="mt-4">
//           <a
//             href={downloadUrl}
//             download
//             className="text-blue-600 underline"
//           >
//             ⬇️ Download Hasil Kompresi
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState } from 'react';

export default function UploadForm() {
  const [type, setType] = useState('image');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState({ originalSize: 0, compressedSize: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const file = form.file.files[0];
    const formData = new FormData(form);
    setLoading(true);
    setDownloadUrl('');

    const res = await fetch(`/api/compress/${type}`, {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    setLoading(false);
    if (result.downloadUrl) {
      setDownloadUrl(result.downloadUrl);
      setFileInfo({
        originalSize: (file.size / 1024).toFixed(2),
        compressedSize: result.compressedSize ? (result.compressedSize / 1024).toFixed(2) : 0,
      });
    }
    alert(result.message);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <select name="type" onChange={(e) => setType(e.target.value)} className="border p-2">
          <option value="image">Image</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
        </select>
        <input type="file" name="file" required className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2" disabled={loading}>
          {loading ? 'Compressing...' : 'Compress'}
        </button>
      </form>

      {downloadUrl && (
        <div className="mt-4">
          <p className="text-sm">Original size: {fileInfo.originalSize} KB</p>
          <p className="text-sm">Compressed size: {fileInfo.compressedSize} KB</p>
          <a
            href={downloadUrl}
            download
            className="text-blue-600 underline block mt-2"
          >
            Download Hasil Kompresi
          </a>
          {type === 'image' && <img src={downloadUrl} alt="Preview" className="mt-4 max-w-md" />}
          {type === 'audio' && <audio controls src={downloadUrl} className="mt-4" />}
          {type === 'video' && <video controls src={downloadUrl} className="mt-4 max-w-md" />}
        </div>
      )}
    </div>
  );
}