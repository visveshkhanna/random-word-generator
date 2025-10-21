"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function shuffleArray<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
  return array;
}

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const wordsRemaining = useMemo(() => {
    if (!started) return 0;
    return Math.max(sequence.length - currentIndex - 1, 0);
  }, [sequence.length, currentIndex, started]);

  const currentWord = useMemo(() => {
    if (!started || sequence.length === 0) return "";
    return sequence[currentIndex];
  }, [sequence, currentIndex, started]);

  const parseWords = (raw: string): string[] => {
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const unique = Array.from(new Set(parts));
    return unique;
  };

  const requestFullscreen = async (): Promise<void> => {
    const el = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
      msRequestFullscreen?: () => Promise<void> | void;
    };
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) await el.msRequestFullscreen();
    } catch {
      // Best-effort; ignore if fullscreen fails
    }
  };

  const start = useCallback(async () => {
    setSequence(shuffleArray(words));
    setCurrentIndex(0);
    setStarted(true);
    await requestFullscreen();
  }, []);

  const goNext = useCallback(() => {
    if (!started) return;
    setCurrentIndex((idx) => {
      if (idx < sequence.length - 1) return idx + 1;
      return idx;
    });
  }, [sequence.length, started]);

  const goPrev = useCallback(() => {
    if (!started) return;
    setCurrentIndex((idx) => (idx > 0 ? idx - 1 : 0));
  }, [started]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!started) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, started]);

  const words =
    `WiFi, Bluetooth, USB, Charger, Cloud, Screenshot, Battery Low, Ctrl+Z, VPN, Spam Mail, Cache, Reboot, Pop-up, Autocorrect, Copy Paste, Loading, Update Pending, Forgot Password, Buffering, Notification Overload, Google It, Dark Mode, Airplane Mode, QR Code, Terms & Conditions, Low Network, Offline Mode, Screenshot Leak, ChatGPT, Deepfake, Neural Network, Algorithm, Machine Learning, AI Overlord, Skynet, Siri, Alexa, Predictive Text, Recommender System, Hallucination, Bot, Prompt Engineer, AI Intern, Debugging, Tech Support, Git Push, Commit, Merge Conflict, Stack Overflow, Pull Request, Cloud Storage, Big Data, API, Endpoint, 404 Error, Bug Fix, Cybersecurity, Firewall, Data Leak, Password123, PowerPoint Karaoke, Excel Guru, Meme Generator, Digital Detox, Influencer, AI Ethics, IoT, Smartwatch, Facial Recognition, Captcha, Privacy Policy, Spam Filter, Zoom Call, Screen Share, Mute Button, You’re on Mute, Background Blur, Mic Not Working, Breakout Room, Google Meet, Lag, Reconnect, Raise Hand, Frozen Screen, Slack Notification, Jira Ticket, Agile, Scrum, Product Manager, Feature Request, MVP, Bug Report, Cloud Migration, Tech Debt, Infinite Loop, It Works on My Machine, Keyboard Warrior, Meme Lord, Tech Influencer, Let’s Take It Offline, Data Cleaning, Copywriter Bot, Predictive Emoji, Elon Musk, Twitter, X (formerly Twitter 😏), Instagram Reel, Hashtag, Selfie, Filter, Caption, Trending, Algorithm Gods, Blue Tick, Verified, Influencer Collab, Engagement Rate, Comment Section, Meme Page Admin, Story Viewer, Screenshot Drama, Reddit Thread, Downvote, Upvote, Viral Post, Troll, Cancel Culture, WhatsApp Forward, Fake News, Blue Tick Anxiety, YouTube Shorts, Content Creator, Sponsored Post, LinkedIn Thought Leader, Motivational Quote Post, Office Meme, Instagram Story, Repost, DM, Group Chat, Screenshot Gossip, FOMO, Dating App Bio, Ghosting, Typing..., Seen at 2:47 AM, Screenshot Receipt, “Hey, just checking in!”, Online 2 hours ago, Follow Back, Trendsetter, Cat Video, Keyboard Cat, Relatable Post, “That One Friend Who…” Meme, Influencer in the Wild, “Link in Bio”, Comment for Algorithm, and “Let’s Go Viral!”`.split(
      ","
    );

  return (
    <div ref={containerRef} className="min-h-screen w-full">
      {!started ? (
        <div className=" h-dvh justify-center items-center w-full  px-6 py-12 flex flex-col gap-4">
          <p className="text-4xl font-bold">
            Let&apos;s play some &quot;Hot Seat&quot;!
          </p>
          <Image src={"/giphy.gif"} alt="Giphy" width={800} height={800} />
          <button
            onClick={start}
            className="rounded-md px-4 py-2 cursor-pointer bg-foreground text-background hover:opacity-90 disabled:opacity-40"
          >
            Start
          </button>
        </div>
      ) : (
        <div className="fixed inset-0 flex flex-col items-center justify-center select-none">
          <div className="absolute inset-0 animate-bgPulse opacity-10" />
          {/* <div className="absolute top-4 right-4 text-xs sm:text-sm bg-foreground text-background/90 rounded-md px-3 py-1 shadow">
            <span className="font-semibold mr-2">Remaining:</span>
            <span>{wordsRemaining}</span>
          </div> */}
          <div className="px-6 text-center">
            <div className="text-5xl sm:text-7xl font-extrabold tracking-tight dance">
              {currentWord}
            </div>
            <div className="mt-6 flex items-center justify-center gap-3 text-xs opacity-70">
              <span>Left ← previous</span>
              <span>•</span>
              <span>Right → next</span>
            </div>
            {/* <div className="mt-2 text-xs opacity-60">
              {wordsRemaining === 0 && currentIndex === sequence.length - 1
                ? "All words shown"
                : `${wordsRemaining} remaining`}
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}
