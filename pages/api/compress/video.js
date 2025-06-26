// const formidable = require('formidable');
// const path = require('path');
// const { exec } = require('child_process');

// export const config = {
//   api: { bodyParser: false },
// };

// export default function handler(req, res) {
//   const form = new formidable.IncomingForm({
//     uploadDir: './public/uploads',
//     keepExtensions: true,
//   });

//   form.parse(req, (err, fields, files) => {
//     if (err) return res.status(500).json({ error: err.message });

//     const file = Array.isArray(files.file) ? files.file[0] : files.file;
//     const inputPath = path.resolve(file.filepath);
//     const outputPath = path.resolve('./public/compressed', `compressed-${file.originalFilename}`);

//     const cmd = `ffmpeg -i "${inputPath}" -vcodec libx264 -crf 28 "${outputPath}"`;

//     exec(cmd, (error) => {
//       if (error) return res.status(500).json({ error: error.message });
//       res.status(200).json({
//         message: 'Video compressed successfully!',
//         downloadUrl: `/compressed/compressed-${file.originalFilename}`,
//       });
//     });
//   });
// }
const formidable = require('formidable');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

export const config = {
  api: { bodyParser: false },
};

export default function handler(req, res) {
  const form = new formidable.IncomingForm({
    uploadDir: './public/uploads',
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const inputPath = path.resolve(file.filepath);
    const outputPath = path.resolve('./public/compressed', `compressed-${file.originalFilename}`);

    const cmd = `ffmpeg -i "${inputPath}" -vcodec libx264 -crf 28 "${outputPath}"`;

    exec(cmd, (error) => {
      if (error) return res.status(500).json({ error: error.message });
      const stats = fs.statSync(outputPath);
      res.status(200).json({
        message: 'Video compressed successfully!',
        downloadUrl: `/compressed/compressed-${file.originalFilename}`,
        compressedSize: stats.size
      });
    });
  });
}
