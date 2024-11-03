import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from 'lib/supabase';
import { writeFileSync } from 'fs';

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
      const audioData = Buffer.from(
        response.choices[0].message.audio.data,
        'base64',
      );
      const audioId = response.choices[0].message.audio.id;

      // Save the audio file to the public folder
      writeFileSync(`public/audio/${audioId}.wav`, audioData);

      // Upkeep the audio file to Supabase
      const { data, error } = await supabase.storage
        .from('audio')
        .upload(`${audioId}.wav`, audioData, {
          contentType: 'audio/wav',
        });

      if (error) {
        throw new Error(`Error uploading audio to Supabase: ${error.message}`);
      }

      return NextResponse.json({
        message: response.choices[0].message.audio.transcript,
        audioId: audioId,
      });
    }

    return NextResponse.json({
      message: response.choices[0].message.content,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Error fetching chat completion: ${error}` },
      { status: 500 },
    );
  }
}
