// const formidable = require('formidable');
// const path = require('path');
// const sharp = require('sharp');

// export const config = {
//   api: { bodyParser: false },
// };

// export default async function handler(req, res) {
//   const form = new formidable.IncomingForm({
//     uploadDir: './public/uploads',
//     keepExtensions: true,
//   });

//   form.parse(req, async (err, fields, files) => {
//     if (err) return res.status(500).json({ error: err.message });

//     const file = Array.isArray(files.file) ? files.file[0] : files.file;
//     const inputPath = file.filepath;
//     const outputPath = path.join('./public/compressed', `compressed-${file.originalFilename}`);

//     try {
//       await sharp(inputPath).jpeg({ quality: 50 }).toFile(outputPath);
//       res.status(200).json({
//         message: 'Image compressed successfully!',
//         downloadUrl: `/compressed/compressed-${file.originalFilename}`,
//       });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
// }
const formidable = require('formidable');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm({
    uploadDir: './public/uploads',
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const inputPath = file.filepath;
    const outputPath = path.join('./public/compressed', `compressed-${file.originalFilename}`);

    try {
      await sharp(inputPath).jpeg({ quality: 50 }).toFile(outputPath);
      const compressedStat = fs.statSync(outputPath);
      res.status(200).json({
        message: 'Image compressed successfully!',
        downloadUrl: `/compressed/compressed-${file.originalFilename}`,
        compressedSize: compressedStat.size
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}