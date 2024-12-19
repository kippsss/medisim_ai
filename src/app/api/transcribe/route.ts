import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
  apiKey: process.env.OPENAI_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get('file');

    if (!audioBlob) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 },
      );
    }

    // Convert Blob to Buffer
    const arrayBuffer = await (audioBlob as File).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save the audio file to /tmp folder
    const filePath = '/tmp/audio.wav';
    fs.writeFileSync(filePath, buffer);

    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json(
      { error: `Error transcribing recording: ${error}` },
      { status: 500 },
    );
  }
}
