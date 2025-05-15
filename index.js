import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  const videoId = req.query.v;

  if (!videoId) {
    return res.status(400).send('動画ID (v) を指定してください。');
  }

  const youtubeAppUrl = `vnd.youtube:${videoId}`;
  const tweetAppUrl = 'twitter://post?message=応援中！%20#櫻坂46';
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const thisUrl = `https://www.xouxube.com/?v=${videoId}`;

  let pageTitle = 'YouTubeアプリ + X投稿';
  try {
    const livecountsUrl = `https://livecounts.io/youtube-live-view-counter/${videoId}`;
    const response = await axios.get(livecountsUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(response.data);
    const extractedTitle = $('title').text().trim();
    if (extractedTitle) {
      pageTitle = extractedTitle;
    }
  } catch (error) {
    console.error('タイトル取得エラー:', error.message);
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${pageTitle}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="YouTubeアプリで開く">
  <meta property="og:image" content="${thumbnailUrl}">
  <meta property="og:url" content="${thisUrl}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="YouTubeアプリで開く">
  <meta name="twitter:image" content="${thumbnailUrl}">
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
    window.onload = function() {
      window.location = youtubeAppUrl;
    };
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
