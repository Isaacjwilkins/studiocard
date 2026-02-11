"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, Reorder } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Clock,
  Copy,
  Check,
  AlertCircle,
  User,
  Music
} from "lucide-react";
import {
  updateRecital,
  addPerformer,
  updatePerformer,
  removePerformer,
  reorderPerformers,
  toggleRecitalActive
} from "@/app/actions";
import QRCodeGenerator from "@/components/QRCodeGenerator";

interface Performer {
  id: string;
  recital_id: string;
  artist_id: string | null;
  sort_order: number;
  performer_name: string;
  performer_image_url: string | null;
  performer_bio: string | null;
  performer_card_slug: string | null;
  piece_title: string;
  composer: string | null;
  instrument: string | null;
  estimated_duration_minutes: number | null;
  is_intermission: boolean;
}

interface Recital {
  id: string;
  teacher_id: string;
  title: string;
  slug: string;
  event_date: string | null;
  venue: string | null;
  custom_note: string | null;
  background_type: string;
  color_theme: string;
  is_active: boolean;
  recital_performers: Performer[];
}

interface Student {
  id: string;
  full_name: string;
  profile_image_url: string | null;
  bio: string | null;
  slug: string;
}

interface Teacher {
  id: string;
  username: string;
  full_name: string;
}

const BACKGROUND_OPTIONS = [
  { id: "animated", label: "Animated" },
  { id: "gradient", label: "Gradient" },
  { id: "pattern", label: "Pattern" },
  { id: "plain", label: "Plain" }
];

const COLOR_OPTIONS = [
  { id: "#6366f1", label: "Purple" },
  { id: "#3b82f6", label: "Blue" },
  { id: "#10b981", label: "Green" },
  { id: "#f59e0b", label: "Amber" },
  { id: "#ef4444", label: "Red" },
  { id: "#ec4899", label: "Pink" },
  { id: "#8b5cf6", label: "Violet" },
  { id: "#14b8a6", label: "Teal" }
];

export default function RecitalEditorClient({
  teacher,
  recital: initialRecital,
  students
}: {
  teacher: Teacher;
  recital: Recital;
  students: Student[];
}) {
  const router = useRouter();
  const [recital, setRecital] = useState(initialRecital);
  const [performers, setPerformers] = useState<Performer[]>(initialRecital.recital_performers);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Form state
  const [title, setTitle] = useState(recital.title);
  const [slug, setSlug] = useState(recital.slug);
  const [eventDate, setEventDate] = useState(
    recital.event_date ? new Date(recital.event_date).toISOString().slice(0, 16) : ""
  );
  const [venue, setVenue] = useState(recital.venue || "");
  const [customNote, setCustomNote] = useState(recital.custom_note || "");
  const [backgroundType, setBackgroundType] = useState(recital.background_type);
  const [colorTheme, setColorTheme] = useState(recital.color_theme);
  const [isActive, setIsActive] = useState(recital.is_active);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<"student" | "manual" | "intermission">("student");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [manualName, setManualName] = useState("");
  const [pieceTitle, setPieceTitle] = useState("");
  const [composer, setComposer] = useState("");
  const [instrument, setInstrument] = useState("");
  const [duration, setDuration] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/recital/${teacher.username}/${slug}`;

  // Check if all performers have durations
  const hasMissingDurations = performers.some(
    p => !p.is_intermission && !p.estimated_duration_minutes
  );

  const handleSaveDetails = async () => {
    setIsSaving(true);
    setSaveMessage("");

    const formData = new FormData();
    formData.set("recitalId", recital.id);
    formData.set("title", title);
    formData.set("slug", slug);
    formData.set("eventDate", eventDate);
    formData.set("venue", venue);
    formData.set("customNote", customNote);
    formData.set("backgroundType", backgroundType);
    formData.set("colorTheme", colorTheme);

    const result = await updateRecital(formData);

    if (result.error) {
      setSaveMessage(result.error);
    } else {
      setSaveMessage("Saved!");
      // Update URL if slug changed
      if (slug !== recital.slug) {
        router.replace(`/studio/recitals/${slug}`);
      }
      setTimeout(() => setSaveMessage(""), 2000);
    }

    setIsSaving(false);
  };

  const handleToggleActive = async () => {
    const result = await toggleRecitalActive(recital.id);
    if (!result.error) {
      setIsActive(result.is_active ?? !isActive);
    }
  };

  const handleAddPerformer = async () => {
    setIsAdding(true);

    const formData = new FormData();
    formData.set("recitalId", recital.id);

    if (addMode === "intermission") {
      formData.set("performerName", "INTERMISSION");
      formData.set("pieceTitle", "Intermission");
      formData.set("isIntermission", "true");
    } else if (addMode === "student" && selectedStudent) {
      formData.set("artistId", selectedStudent.id);
      formData.set("performerName", selectedStudent.full_name);
      formData.set("performerImageUrl", selectedStudent.profile_image_url || "");
      formData.set("performerBio", selectedStudent.bio || "");
      formData.set("performerCardSlug", selectedStudent.slug);
      formData.set("pieceTitle", pieceTitle);
      formData.set("composer", composer);
      formData.set("instrument", instrument);
      formData.set("estimatedDurationMinutes", duration);
    } else if (addMode === "manual") {
      formData.set("performerName", manualName);
      formData.set("pieceTitle", pieceTitle);
      formData.set("composer", composer);
      formData.set("instrument", instrument);
      formData.set("estimatedDurationMinutes", duration);
    }

    const result = await addPerformer(formData);

    if (!result.error && result.performer) {
      setPerformers(prev => [...prev, result.performer]);
      resetAddForm();
    }

    setIsAdding(false);
  };

  const resetAddForm = () => {
    setShowAddModal(false);
    setAddMode("student");
    setSelectedStudent(null);
    setManualName("");
    setPieceTitle("");
    setComposer("");
    setInstrument("");
    setDuration("");
  };

  const handleRemovePerformer = async (performerId: string) => {
    const result = await removePerformer(performerId);
    if (!result.error) {
      setPerformers(prev => prev.filter(p => p.id !== performerId));
    }
  };

  const handleReorder = useCallback(
    async (newOrder: Performer[]) => {
      setPerformers(newOrder);
      const orderedIds = newOrder.map(p => p.id);
      await reorderPerformers(recital.id, orderedIds);
    },
    [recital.id]
  );

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/studio/recitals"
          className="flex items-center gap-2 text-zinc-500 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Recitals</span>
        </Link>
        <div className="flex items-center gap-3">
          {isActive && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 transition-colors"
            >
              Preview <ExternalLink size={14} />
            </a>
          )}
          <button
            onClick={handleSaveDetails}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg font-medium transition-colors"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 px-4 py-2 rounded-lg text-sm ${
            saveMessage === "Saved!"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {saveMessage}
        </motion.div>
      )}

      {/* Recital Details */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Recital Details</h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            />
            <p className="text-xs text-zinc-500 mt-1">
              studiocard.live/recital/{teacher.username}/{slug}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date & Time</label>
              <input
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Venue</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Community Hall"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Welcome Note</label>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Welcome to our annual recital..."
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
            />
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Appearance</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Background</label>
            <div className="flex flex-wrap gap-2">
              {BACKGROUND_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setBackgroundType(opt.id)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    backgroundType === opt.id
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Color Theme</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setColorTheme(opt.id)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    colorTheme === opt.id
                      ? "border-foreground scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: opt.id }}
                  title={opt.label}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Performers */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Performers</h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setAddMode("student");
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Plus size={14} />
              Add Student
            </button>
            <button
              onClick={() => {
                setAddMode("manual");
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <User size={14} />
              Manual Entry
            </button>
            <button
              onClick={() => {
                setAddMode("intermission");
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Clock size={14} />
              Intermission
            </button>
          </div>
        </div>

        {hasMissingDurations && (
          <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-sm">
            <AlertCircle size={16} />
            Some performers are missing duration estimates. Start times won&apos;t be calculated.
          </div>
        )}

        {performers.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <Music size={32} className="mx-auto mb-2 opacity-50" />
            <p>No performers yet. Add students or manual entries above.</p>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={performers}
            onReorder={handleReorder}
            className="space-y-2"
          >
            {performers.map((performer, index) => (
              <Reorder.Item
                key={performer.id}
                value={performer}
                className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-3">
                  <GripVertical size={16} className="text-zinc-400 flex-shrink-0" />
                  <span className="text-zinc-400 text-sm w-6">{index + 1}.</span>

                  {performer.is_intermission ? (
                    <div className="flex-1 text-center font-medium text-zinc-500">
                      ─── INTERMISSION ───
                    </div>
                  ) : (
                    <>
                      {performer.performer_image_url ? (
                        <img
                          src={performer.performer_image_url}
                          alt={performer.performer_name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-zinc-500">
                            {performer.performer_name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{performer.performer_name}</p>
                        <p className="text-sm text-zinc-500 truncate">
                          {performer.piece_title}
                          {performer.composer && ` - ${performer.composer}`}
                        </p>
                      </div>
                      {performer.instrument && (
                        <span className="text-xs text-zinc-500 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 rounded">
                          {performer.instrument}
                        </span>
                      )}
                      {performer.estimated_duration_minutes && (
                        <span className="text-xs text-zinc-500">
                          {performer.estimated_duration_minutes} min
                        </span>
                      )}
                    </>
                  )}

                  <button
                    onClick={() => handleRemovePerformer(performer.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </section>

      {/* Share */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        <h2 className="text-lg font-bold mb-4">Share</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Public URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={publicUrl}
                readOnly
                className="flex-1 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm"
              />
              <button
                onClick={copyUrl}
                className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">QR Code</label>
            <div className="flex items-start gap-4">
              <QRCodeGenerator url={publicUrl} colorTheme={colorTheme} />
              <p className="text-sm text-zinc-500">
                Download and display this QR code at your recital venue for easy program access.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <div>
              <label className="font-medium">Status</label>
              <p className="text-sm text-zinc-500">
                {isActive ? "Visitors can view this program" : "Program is hidden from public"}
              </p>
            </div>
            <button
              onClick={handleToggleActive}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </button>
          </div>
        </div>
      </section>

      {/* Add Performer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-zinc-200 dark:border-zinc-800 max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">
              {addMode === "intermission"
                ? "Add Intermission"
                : addMode === "student"
                ? "Add Student"
                : "Add Manual Entry"}
            </h2>

            {addMode === "intermission" ? (
              <div className="space-y-4">
                <p className="text-zinc-500">
                  This will add an intermission marker to the program.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resetAddForm}
                    className="flex-1 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPerformer}
                    disabled={isAdding}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg font-medium transition-colors"
                  >
                    {isAdding ? "Adding..." : "Add Intermission"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {addMode === "student" ? (
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Student</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border border-zinc-200 dark:border-zinc-700 rounded-lg p-2">
                      {students.length === 0 ? (
                        <p className="text-sm text-zinc-500 text-center py-2">No students in your roster</p>
                      ) : (
                        students.map((student) => (
                          <button
                            key={student.id}
                            onClick={() => setSelectedStudent(student)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                              selectedStudent?.id === student.id
                                ? "bg-purple-100 dark:bg-purple-900/30"
                                : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            }`}
                          >
                            {student.profile_image_url ? (
                              <img
                                src={student.profile_image_url}
                                alt={student.full_name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                <span className="text-xs font-bold">{student.full_name.charAt(0)}</span>
                              </div>
                            )}
                            <span className="text-sm font-medium">{student.full_name}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-1">Performer Name</label>
                    <input
                      type="text"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      placeholder="John Smith"
                      className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Piece Title</label>
                  <input
                    type="text"
                    value={pieceTitle}
                    onChange={(e) => setPieceTitle(e.target.value)}
                    placeholder="Fur Elise"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Composer</label>
                  <input
                    type="text"
                    value={composer}
                    onChange={(e) => setComposer(e.target.value)}
                    placeholder="Beethoven"
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Instrument</label>
                    <input
                      type="text"
                      value={instrument}
                      onChange={(e) => setInstrument(e.target.value)}
                      placeholder="Piano"
                      className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration (min)</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="3"
                      min="1"
                      className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetAddForm}
                    className="flex-1 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPerformer}
                    disabled={
                      isAdding ||
                      !pieceTitle ||
                      (addMode === "student" && !selectedStudent) ||
                      (addMode === "manual" && !manualName)
                    }
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg font-medium transition-colors"
                  >
                    {isAdding ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
