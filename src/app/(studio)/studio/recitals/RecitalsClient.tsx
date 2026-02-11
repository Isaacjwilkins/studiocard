"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Calendar, MapPin, Users, Eye, EyeOff, Trash2, ExternalLink } from "lucide-react";
import { createRecital, deleteRecital, toggleRecitalActive } from "@/app/actions";

interface Recital {
  id: string;
  title: string;
  slug: string;
  event_date: string | null;
  venue: string | null;
  is_active: boolean;
  created_at: string;
  performer_count: number;
}

interface Teacher {
  id: string;
  username: string;
  full_name: string;
}

export default function RecitalsClient({
  teacher,
  recitals: initialRecitals
}: {
  teacher: Teacher;
  recitals: Recital[];
}) {
  const router = useRouter();
  const [recitals, setRecitals] = useState(initialRecitals);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  // Create form state
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");

    const formData = new FormData();
    formData.set("title", newTitle);
    formData.set("slug", newSlug.toLowerCase().replace(/\s+/g, "-"));

    const result = await createRecital(formData);

    if (result.error) {
      setError(result.error);
      setIsCreating(false);
      return;
    }

    // Navigate to the new recital editor
    router.push(`/studio/recitals/${newSlug.toLowerCase().replace(/\s+/g, "-")}`);
  };

  const handleToggleActive = async (recitalId: string) => {
    const result = await toggleRecitalActive(recitalId);
    if (!result.error) {
      setRecitals(prev =>
        prev.map(r =>
          r.id === recitalId ? { ...r, is_active: result.is_active ?? !r.is_active } : r
        )
      );
    }
  };

  const handleDelete = async (recitalId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    const result = await deleteRecital(recitalId);
    if (!result.error) {
      setRecitals(prev => prev.filter(r => r.id !== recitalId));
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "No date set";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Recitals</h1>
          <p className="text-zinc-500 mt-1">Create digital programs for your showcases</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          New Recital
        </button>
      </div>

      {/* Recitals List */}
      {recitals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800"
        >
          <Calendar size={48} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-xl font-bold mb-2">No recitals yet</h3>
          <p className="text-zinc-500 mb-6">Create your first digital recital program</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Create Recital
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {recitals.map((recital, index) => (
            <motion.div
              key={recital.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => router.push(`/studio/recitals/${recital.slug}`)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{recital.title}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        recital.is_active
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {recital.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(recital.event_date)}
                    </span>
                    {recital.venue && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {recital.venue}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {recital.performer_count} performer{recital.performer_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {recital.is_active && (
                    <a
                      href={`/recital/${teacher.username}/${recital.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-zinc-400 hover:text-purple-500 transition-colors"
                      title="View public page"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                  <button
                    onClick={() => handleToggleActive(recital.id)}
                    className="p-2 text-zinc-400 hover:text-foreground transition-colors"
                    title={recital.is_active ? "Set inactive" : "Set active"}
                  >
                    {recital.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    onClick={() => handleDelete(recital.id, recital.title)}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    title="Delete recital"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-zinc-200 dark:border-zinc-800"
          >
            <h2 className="text-xl font-bold mb-4">Create New Recital</h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Spring Recital 2026"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL Slug</label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="spring-2026"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  required
                />
                <p className="text-xs text-zinc-500 mt-1">
                  URL: studiocard.live/recital/{teacher.username}/{newSlug || "your-slug"}
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewTitle("");
                    setNewSlug("");
                    setError("");
                  }}
                  className="flex-1 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newTitle || !newSlug}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg font-medium transition-colors"
                >
                  {isCreating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
