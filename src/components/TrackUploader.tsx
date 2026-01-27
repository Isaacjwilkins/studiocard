"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Mic, Square, UploadCloud, Play, Trash2, Loader2, CheckCircle } from "lucide-react";

export default function TrackUploader() {
  const [mode, setMode] = useState<"select" | "record" | "uploading" | "success">("select");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  
  // Form State
  const [title, setTitle] = useState("");
  const [artistSlug, setArtistSlug] = useState(""); // Simple ID for now
  const [passcode, setPasscode] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- RECORDING LOGIC ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setMode("select"); // Go to preview/upload screen
        stream.getTracks().forEach(track => track.stop()); // Stop mic
      };

      mediaRecorder.start();
      setRecording(true);
      setMode("record");
      
      // Simple timer
      setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please allow permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // --- FILE UPLOAD LOGIC ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  // --- SUBMIT TO SUPABASE ---
  const handleUpload = async () => {
    if (!audioBlob || !title || !artistSlug || !passcode) {
      alert("Please fill in all fields (Title, Artist Handle, Passcode)");
      return;
    }

    setMode("uploading");

    try {
      // 1. Verify Artist
      const { data: artist, error: artistError } = await supabase
        .from("artists")
        .select("id")
        .eq("slug", artistSlug)
        .eq("passcode", passcode)
        .single();

      if (artistError || !artist) {
        throw new Error("Invalid Artist Handle or Passcode.");
      }

      // 2. Upload File to Storage bucket 'audio-tracks'
      const fileName = `${artist.id}/${Date.now()}-${title.replace(/\s+/g, '-')}.webm`;
      
      const { error: uploadError } = await supabase.storage
        .from("audio-tracks")
        .upload(fileName, audioBlob);

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from("audio-tracks")
        .getPublicUrl(fileName);

      // 4. Save to Database
      const { error: dbError } = await supabase
        .from("tracks")
        .insert([{
          artist_id: artist.id,
          title: title,
          audio_url: publicUrlData.publicUrl,
          release_date: new Date().toISOString()
        }]);

      if (dbError) throw dbError;

      setMode("success");

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Upload failed");
      setMode("select");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (mode === "success") {
    return (
      <div className="text-center p-12 bg-green-50 dark:bg-green-900/20 rounded-3xl border border-green-200 dark:border-green-800">
        <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 mb-6">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-2xl font-black text-foreground mb-2">Upload Complete!</h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">Your track is now live on your card.</p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-foreground text-background rounded-xl font-bold uppercase tracking-widest text-xs">
          Upload Another
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-zinc-200 dark:border-white/10">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black tracking-tight mb-2">Add to Your Card</h2>
        <p className="text-zinc-500 text-sm">Upload a file or record directly right now.</p>
      </div>

      {/* RECORDING INTERFACE */}
      {mode === "record" ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-8 animate-pulse">
          <div className="text-6xl font-black text-red-500 font-mono tracking-widest">
            {formatTime(duration)}
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-red-500">Recording in progress...</p>
          <button 
            onClick={stopRecording}
            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
          >
            <Square fill="white" className="text-white" size={32} />
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* 1. AUDIO SOURCE SELECTION */}
          {!audioBlob ? (
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={startRecording}
                className="group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mic size={24} />
                </div>
                <span className="font-bold text-sm">Record Audio</span>
              </button>

              <label className="group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud size={24} />
                </div>
                <span className="font-bold text-sm">Upload File</span>
                <input type="file" accept="audio/*" onChange={handleFileSelect} className="hidden" />
              </label>
            </div>
          ) : (
            // 2. PREVIEW & DETAILS
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              
              <div className="flex items-center gap-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                <button onClick={() => { setAudioBlob(null); setAudioUrl(null); }} className="p-2 text-zinc-400 hover:text-red-500">
                  <Trash2 size={20} />
                </button>
                <div className="flex-1">
                  <audio controls src={audioUrl!} className="w-full h-8 opacity-80" />
                </div>
                <div className="px-3 py-1 bg-green-500/20 text-green-600 text-[10px] font-bold uppercase rounded-full">
                  Ready
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-3">Track Title</label>
                  <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Minuet in G"
                    className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-3">Artist Handle</label>
                    <input 
                      value={artistSlug}
                      onChange={(e) => setArtistSlug(e.target.value)}
                      placeholder="leo-piano"
                      className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl p-4 font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-3">Passcode</label>
                    <input 
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="****"
                      className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl p-4 font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleUpload}
                disabled={mode === "uploading"}
                className="w-full py-4 rounded-xl bg-foreground text-background font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {mode === "uploading" ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Uploading...
                  </>
                ) : (
                  "Publish Track"
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}