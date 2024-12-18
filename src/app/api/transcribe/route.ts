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
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.9,
    });
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
