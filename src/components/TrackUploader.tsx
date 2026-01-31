"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Mic, Square, UploadCloud, Play, Trash2, Loader2, CheckCircle } from "lucide-react";

export default function TrackUploader() {
  const [mode, setMode] = useState<"select" | "record" | "uploading" | "success">("select");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  // Form State
  const [title, setTitle] = useState("");
  const [artistSlug, setArtistSlug] = useState("");
  const [passcode, setPasscode] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- CLEANUP ON UNMOUNT ---
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // --- RECORDING LOGIC ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 1. COMPRESSION & FALLBACK CHECK
      let options: MediaRecorderOptions = {};
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        options = { mimeType: "audio/webm;codecs=opus", audioBitsPerSecond: 128000 };
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        options = { mimeType: "audio/mp4", audioBitsPerSecond: 128000 };
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mediaRecorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setMode("select"); 
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setMode("record");
      
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  // --- ROBUST UPLOAD LOGIC ---
  const uploadWithRetry = async (fileName: string, file: Blob, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { error } = await supabase.storage
          .from("audio-tracks")
          .upload(fileName, file, {
            upsert: false,
            contentType: file.type,
            cacheControl: '31536000', // Cache for 1 year (Massive performance boost)
            duplex: 'half' // Required for some browser streams, good safety
          });
          
        if (error) throw error;
        return; // Success!
      } catch (err) {
        console.warn(`Upload attempt ${i + 1} failed. Retrying...`, err);
        if (i === maxRetries - 1) throw err; // Throw on final failure
        await new Promise(res => setTimeout(res, 1000 * (i + 1))); // Wait 1s, 2s, 3s...
      }
    }
  };

  const handleUpload = async () => {
    if (!audioBlob || !title || !artistSlug || !passcode) {
      alert("Please fill in all fields (Title, Artist Handle, Passcode)");
      return;
    }

    setMode("uploading");
    setProgress(10); // Start visual feedback

    try {
      // 1. Verify Artist
      const { data: artist, error: artistError } = await supabase
        .from("artists")
        .select("id")
        .eq("slug", artistSlug)
        .eq("passcode", passcode)
        .single();

      if (artistError || !artist) throw new Error("Invalid Artist Handle or Passcode.");

      // 2. Prepare File
      setProgress(30);
      const fileExt = audioBlob.type.includes('mp4') ? 'mp4' : 'webm';
      const fileName = `${artist.id}/${Date.now()}-${title.replace(/\s+/g, '-')}.${fileExt}`;

      // 3. Upload with Retries & Caching
      await uploadWithRetry(fileName, audioBlob);
      setProgress(80);

      // 4. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from("audio-tracks")
        .getPublicUrl(fileName);

      // 5. Save to Database
      const { error: dbError } = await supabase
        .from("tracks")
        .insert([{
          artist_id: artist.id,
          title: title,
          audio_url: publicUrlData.publicUrl,
          release_date: new Date().toISOString()
        }]);

      if (dbError) throw dbError;

      setProgress(100);
      setTimeout(() => setMode("success"), 500);

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Upload failed. Please check your connection.");
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
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              
              <div className="flex items-center gap-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                <button 
                  onClick={() => { setAudioBlob(null); setAudioUrl(null); }} 
                  disabled={mode === "uploading"}
                  className="p-2 text-zinc-400 hover:text-red-500 disabled:opacity-50"
                >
                  <Trash2 size={20} />
                </button>
                <div className="flex-1">
                  <audio controls src={audioUrl!} className="w-full h-8 opacity-80" />
                </div>
                <div className="px-3 py-1 bg-green-500/20 text-green-600 text-[10px] font-bold uppercase rounded-full">
                  Ready
                </div>
              </div>

              {mode === "uploading" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300 ease-out" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-3">Track Title</label>
                  <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Minuet in G"
                    disabled={mode === "uploading"}
                    className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-3">Artist Handle</label>
                    <input 
                      value={artistSlug}
                      onChange={(e) => setArtistSlug(e.target.value)}
                      placeholder="leo-piano"
                      disabled={mode === "uploading"}
                      className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl p-4 font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-3">Passcode</label>
                    <input 
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="****"
                      disabled={mode === "uploading"}
                      className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl p-4 font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
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
                    <Loader2 className="animate-spin" size={16} /> Processing...
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