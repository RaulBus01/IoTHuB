const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { createClient } = require('@deepgram/sdk');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
const upload = multer({ dest: 'uploads/' });
app.post('/transcribe', upload.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Audio file is required' });
    }

    const filePath = path.join(__dirname, req.file.path);
    const deepgramApiKey = 'c8b62d69fd5410f08c8c5fbd5fc54f7d0f98f663';  // Replace with your actual API key
    const deepgram = createClient(deepgramApiKey);

    try {
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            fs.createReadStream(filePath),
            { punctuate: true, model: 'nova-2', language: 'en-US' }
        );


        if (error) {
            console.error('Deepgram error:', error);
            return res.status(500).json({ error });
        }

        
        fs.unlinkSync(filePath);
        return res.json(result);
    } catch (error) {
        console.error('Error processing transcription:', error);
        fs.unlinkSync(filePath);  // Ensure the file is deleted even if there's an error
        return res.status(500).json({ error: error.message });
    }
});
app.post('/invokeMethod', async (req, res) => {
    const { targetDevice, methodName, payload } = req.body;
  
    let data = JSON.stringify({
      "methodName": methodName,
      "responseTimeoutInSeconds": 200,
      "payload": payload
    });
  
    let config = {
      method: 'post',
      url: `https://iothubbuscrisan.azure-devices.net/twins/${targetDevice}/methods?api-version=2021-04-12`,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'SharedAccessSignature sr=IOTHubBusCrisan.azure-devices.net&sig=yI4g98vU2NMY1Xpa8ap2Fl6L9O0ZFy4WjtFc8jce%2BI4%3D&se=1717600096&skn=iothubowner'
      },
      data : data
    };
  
    try {
      const response = await axios.request(config);
      console.log(response);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error invoking IoT Hub method' });
    }
  });





app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
