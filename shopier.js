const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// Shopier API anahtarları gerekiyor.
const apiKey = 'your_api_key';
const apiSecret = 'your_api_secret';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ödeme başlatma endpoint'i
app.post('/start-payment', (req, res) => {
  const order_id = 'unique_order_id'; // Sipariş kimliği
  const amount = 100.0; // Ödeme miktarı
  const currency = 'TRY'; // Para birimi 

  // Shopier API'ye gönderilecek ödeme verileri
  const paymentData = {
    API_KEY: apiKey,
    SECRET_KEY: apiSecret,
    order_id,
    total: amount,
    currency,
    // Diğer ödeme bilgilerini buraya ekleyebilirsiniz.
  };

  
  axios.post('https://www.shopier.com/api/payment', paymentData)
    .then((response) => {
     
      if (response.data.status === 'success') {
    
        console.log('Ödeme başarılı. Ödeme bilgileri:', response.data);
        res.status(200).json({ message: 'Ödeme başarılı', data: response.data });
      } else {
    
        console.error('Ödeme başarısız. Hata kodu:', response.data.error_code);
        res.status(400).json({ message: 'Ödeme başarısız', error: response.data.error_message });
      }
    })
    .catch((error) => {
     
      console.error('Ödeme hatası:', error);
      res.status(500).json({ message: 'Ödeme hatası' });
    });
});

// Sunucuyu başlatma
app.listen(port, () => {
  console.log(`Server çalışıyor: http://localhost:${port}`);
});