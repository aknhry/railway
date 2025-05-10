const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const videoId = req.query.v;

  if (!videoId) {
    return res.status(400).send('動画ID (v) を指定してください。');
  }

  const youtubeAppUrl = `vnd.youtube:${videoId}`;
  const tweetAppUrl = 'twitter://post?message=応援中！%20#櫻坂46';
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>YouTubeアプリ + X投稿</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #000;
    }
    img {
      width: 100%;
      max-width: 600px;
      cursor: pointer;
    }
  </style>
  <script>
    const youtubeAppUrl = '${youtubeAppUrl}';
    const tweetAppUrl = '${tweetAppUrl}';

    // ページ読み込みと同時にYouTubeアプリを起動（フォールバックなし）
    window.onload = function() {
      window.location = youtubeAppUrl;
    };

    // 画像クリックでX投稿画面をアプリで開く
    function openTwitterPost() {
      window.location = tweetAppUrl;
    }
  </script>
</head>
<body>
  <img src="${thumbnailUrl}" alt="画像" onclick="openTwitterPost()">
</body>
</html>
  `;

  res.send(html);
});

app.listen(port, () => {
  console.log(`起動完了: http://localhost:${port}`);
});
