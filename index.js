const express = require('express');
const app = express();

// RailwayではPORT環境変数が必要
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const videoId = req.query.v;

  if (!videoId) {
    return res.status(400).send('動画ID (v) を指定してください。');
  }

  const youtubeUrl = `https://youtu.be/${videoId}`;
  const youtubeAppUrl = `vnd.youtube:${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const ogTitle = 'YouTube動画をアプリで開く';
  const ogDescription = 'このリンクを開くとYouTubeアプリが自動で起動します。';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${ogTitle}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta property="og:type" content="video.other">
  <meta property="og:url" content="${youtubeUrl}">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${ogDescription}">
  <meta property="og:image" content="${thumbnailUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${ogTitle}">
  <meta name="twitter:description" content="${ogDescription}">
  <meta name="twitter:image" content="${thumbnailUrl}">
  <meta name="twitter:url" content="${youtubeUrl}">
  <script>
    const youtubeUrl = '${youtubeUrl}';
    const youtubeAppUrl = '${youtubeAppUrl}';
    function openYouTube() {
      window.location = youtubeAppUrl;
      setTimeout(() => {
        window.location = youtubeUrl;
      }, 2000);
    }
    window.onload = openYouTube;
  </script>
</head>
<body>
  <p>アプリを起動中です。開かない場合は <a href="${youtubeUrl}">こちら</a> をクリックしてください。</p>
</body>
</html>
  `;

  res.send(html);
});

app.listen(port, () => {
  console.log(`起動完了: http://localhost:${port}`);
});
