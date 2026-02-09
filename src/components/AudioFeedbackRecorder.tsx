"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Send, X, Loader2, Play, Pause, Trash2 } from "lucide-react";
import { sendAudioFeedback } from "@/app/actions";

interface AudioFeedbackRecorderProps {
  artistId: string;
  artistName: string;
  onClose: () => void;
  onSuccess?: (url: string) => void;
}

export default function AudioFeedbackRecorder({
  artistId,
  artistName,
  onClose,
  onSuccess
}: AudioFeedbackRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);

    } catch (err) {
      setError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playPause = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const deleteRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
  };

  const handleSend = async () => {
    if (!audioBlob) return;

    setSending(true);
    setError(null);

    const formData = new FormData();
    formData.append('artistId', artistId);
    formData.append('audio', audioBlob, 'feedback.webm');

    const result = await sendAudioFeedback(formData);

    if (result.error) {
      setError(result.error);
      setSending(false);
    } else {
      onSuccess?.(result.url || '');
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative h-24 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">
              Voice Note for
            </p>
            <p className="text-white text-lg font-black">{artistName}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}

          {/* Recording state */}
          {!audioBlob ? (
            <div className="text-center">
              <div className="mb-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto transition-all ${
                    isRecording
                      ? 'bg-red-500 animate-pulse'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  {isRecording ? (
                    <Square size={32} className="text-white" fill="white" />
                  ) : (
                    <Mic size={32} className="text-white" />
                  )}
                </motion.button>
              </div>

              <p className="text-2xl font-black mb-2">
                {isRecording ? formatTime(duration) : "Tap to Record"}
              </p>
              <p className="text-sm text-zinc-500">
                {isRecording
                  ? "Recording... Tap the button to stop"
                  : "Record a voice note for your student"
                }
              </p>
            </div>
          ) : (
            /* Playback state */
            <div className="text-center">
              <audio
                ref={audioRef}
                src={audioUrl || undefined}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={playPause}
                  className="w-16 h-16 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center transition-colors"
                >
                  {isPlaying ? (
                    <Pause size={24} className="text-white" fill="white" />
                  ) : (
                    <Play size={24} className="text-white ml-1" fill="white" />
                  )}
                </button>
                <button
                  onClick={deleteRecording}
                  className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center transition-colors group"
                >
                  <Trash2 size={18} className="text-zinc-500 group-hover:text-red-500" />
                </button>
              </div>

              <p className="text-lg font-bold mb-1">{formatTime(duration)} recorded</p>
              <p className="text-sm text-zinc-500 mb-6">Tap play to preview</p>

              <button
                onClick={handleSend}
                disabled={sending}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>Send Voice Note <Send size={16} /></>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
