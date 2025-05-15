const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/run', async (req, res) => {
  try {
    const code = req.body.code;
    const payload = new URLSearchParams({
      source_code: code,
      language: 'csharp',
      api_key: 'guest'
    });
    // Отправляем код на Paiza.IO
    const createResp = await axios.post('https://api.paiza.io/runners/create', payload);
    const id = createResp.data.id;
    if (!id) return res.json(createResp.data);

    // Ждём 2 секунды и получаем результат
    setTimeout(async () => {
      const detailsResp = await axios.get(`https://api.paiza.io/runners/get_details?id=${id}&api_key=guest`);
      res.json(detailsResp.data);
    }, 2000);
  } catch (err) {
    res.json({ error: err.toString() });
  }
});

app.listen(5000, () => console.log('Proxy server running on http://localhost:5000'));