import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { SOAP_SYSTEM_PROMPT, SOAP_USER_PROMPT } from './prompts/soap';

// Configuration
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma:2b'; // 使用較小的模型作為預設，可透過環境變數更改
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in environment variables.');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function transcribeAudio(filePath: string): Promise<string> {
  console.log(`🎤 Transcribing ${path.basename(filePath)} with Whisper...`);
  
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      response_format: 'text',
      language: 'zh', // 強制中文，或讓它自動偵測
    });

    return transcription as unknown as string; // response_format: 'text' returns string
  } catch (error) {
    console.error('Whisper API Error:', error);
    throw error;
  }
}

async function generateSOAP(transcript: string): Promise<string> {
  console.log(`🧠 Generating SOAP note with Ollama (${OLLAMA_MODEL})...`);

  try {
    const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: 'system', content: SOAP_SYSTEM_PROMPT },
          { role: 'user', content: SOAP_USER_PROMPT(transcript) }
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message.content;
  } catch (error) {
    console.error('Ollama API Error:', error);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: npx tsx scripts/process-audio.ts <audio-file-path>');
    process.exit(1);
  }

  const audioPath = args[0];
  if (!fs.existsSync(audioPath)) {
    console.error(`Error: File not found: ${audioPath}`);
    process.exit(1);
  }

  const outputDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const baseName = path.basename(audioPath, path.extname(audioPath));

  try {
    // 1. Transcribe
    const transcript = await transcribeAudio(audioPath);
    const transcriptPath = path.join(outputDir, `${baseName}_transcript.txt`);
    fs.writeFileSync(transcriptPath, transcript);
    console.log(`✅ Transcript saved to ${transcriptPath}`);

    // 2. Generate SOAP
    const soapNote = await generateSOAP(transcript);
    const soapPath = path.join(outputDir, `${baseName}_soap.md`);
    fs.writeFileSync(soapPath, soapNote);
    console.log(`✅ SOAP note saved to ${soapPath}`);

  } catch (error) {
    console.error('Processing failed:', error);
    process.exit(1);
  }
}

main();
