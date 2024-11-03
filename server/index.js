import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const fileManager = new GoogleAIFileManager(process.env.API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/generate', upload.single('file'), async (req, res) => {
    const { prompt } = req.body;
    const filePath = req.file?.path;

    if (!filePath) {
        return res.status(400).json({ error: 'No se recibió un archivo.' });
    }

    try {
        const uploadResponse = await fileManager.uploadFile(filePath, {
            mimeType: 'application/pdf',
            displayName: 'My Document'
        });

        console.log(`Archivo subido: ${uploadResponse.file.displayName} con URI: ${uploadResponse.file.uri}`);

        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri
                }
            },
            { text: prompt }
        ]);

        const generatedText = await result.response.text();
        console.log(`Texto generado: ${generatedText}`);

        res.json({ summary: generatedText });
    } catch (error) {
        console.error('Error al generar contenido:', error);
        res.status(500).json({ error: 'Error al generar contenido' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});