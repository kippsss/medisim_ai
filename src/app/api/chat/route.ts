import { writeFileSync } from 'node:fs';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
  apiKey: process.env.OPENAI_API_SECRET,
});

export async function POST(req: NextRequest) {
  const messages = await req.json();

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-audio-preview',
      modalities: ['text', 'audio'],
      audio: { voice: 'alloy', format: 'wav' },
      messages: messages,
    });

    // Write audio data to a file
    if (response.choices[0].message.audio) {
      writeFileSync(
        `public/${response.choices[0].message.audio.id}.wav`,
        Buffer.from(response.choices[0].message.audio.data, 'base64'),
        { encoding: 'utf-8' },
      );
      return NextResponse.json({
        message: response.choices[0].message.audio.transcript,
        audioId: response.choices[0].message.audio.id,
      });
    }

    return NextResponse.json({
      message: response.choices[0].message.content,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching chat completion' },
      { status: 500 },
    );
  }
}
