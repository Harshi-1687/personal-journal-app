import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { addEntry, updateEntry } from "../api";
import { MOOD_OPTIONS } from "../utils/moodUtils";

export default function JournalEntryForm ({ onEntryAdded, editingEntry, onCancelEdit }) {
  const [mood, setMood] = useState("Happy");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingEntry) {
      setText(editingEntry.text);
      setMood(editingEntry.mood);
      setDate(editingEntry.date);
    } else {
      setText("");
      setMood("Neutral");
      setDate("");
    }
  }, [editingEntry]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEntry) {
        await updateEntry(editingEntry._id, { mood, text, date });
      } else {
        await addEntry({ mood, text, date });
      }

      // ✅ Refresh list
      onEntryAdded();

      // ✅ Reset form after adding
      setMood("Neutral");
      setText("");
      setDate("");

      // ✅ Exit edit mode (if editing)
      if (onCancelEdit) onCancelEdit();

    } catch (err) {
      console.error("Error saving entry:", err);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md min-h-[523px]">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {editingEntry ? "Edit Journal Entry" : "Add New Journal Entry"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mood Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select your Mood:
          </label>

          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((option) => (
              <button
                key={option.mood}
                type="button"
                onClick={() => setMood(option.mood)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200 
                  ${
                    mood === option.mood
                      ? "border-gray-800 bg-opacity-90 text-gray-900"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
                  }`}
                style={{
                  backgroundColor: mood === option.mood ? option.color : "",
                }}
              >
                <span>{option.icon}</span> {option.mood}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Thoughts:
          </label>
          <textarea
            className="w-full h-36 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 resize-none"
            placeholder="Write about your day..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            {editingEntry ? "Update Entry" : "Save Entry"}
          </button>

          {editingEntry && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

JournalEntryForm.propTypes = {
  onEntryAdded: PropTypes.func.isRequired,
  editingEntry: PropTypes.object,
  onCancelEdit: PropTypes.func,
};
