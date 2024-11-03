import { useState } from 'react'
import axios from 'axios'

function App() {
  const [file, setFile] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !prompt) {
      alert('Por favor, selecciona un archivo y escribe un prompt.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);

    try {
      const response = await axios.post('http://localhost:3000/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResponse(response.data.summary);
    } catch (error) {
      console.error('Error al generar el resumen:', error);
      setResponse('Ocurrió un error al procesar la solicitud.');
    }
  };

  return (
    <>
      <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Procesamiento de documentos</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Subir documento (PDF):</label>
            <input type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'block', marginTop: '5px' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Prompt:</label>
            <input
              type="text"
              value={prompt}
              onChange={handlePromptChange}
              placeholder="Escribe una instrucción para la IA"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }}>Generar Resumen</button>
        </form>

        {response && (
          <div style={{ marginTop: '20px' }}>
            <h2>Respuesta de la IA:</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default App