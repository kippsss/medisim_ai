'use client';
import { useState } from 'react';
import Chat from './components/Chat/Chat';
import Hero from './components/Hero/Hero';

export default function Home() {
  const [showHero, setShowHero] = useState(true);
  return <>{showHero ? <Hero setShowHero={setShowHero} /> : <Chat />}</>;
}
