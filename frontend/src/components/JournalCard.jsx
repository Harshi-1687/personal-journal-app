import React, { useState } from "react";
import PropTypes from "prop-types";
import { deleteEntry } from "../api.js";
import { getMoodColor } from "../utils/moodUtils";
import { formatDate, formatTime } from "../utils/dateFormatter";
import ConfirmDialog from "./ConfirmDialog";

export default function JournalCard ({ entry, onDelete, onEdit })  {
  const [showConfirm, setShowConfirm] = useState(false);
  const { color, icon } = getMoodColor(entry.mood);

  const handleDelete = async () => {
    try {
      await deleteEntry(entry._id);
      if (onDelete) onDelete(entry._id);
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  const handleEdit = () => {
    if (onEdit) onEdit(entry);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-4 mb-4 border-l-8 transition-shadow hover:shadow-md"
      style={{ borderLeftColor: color }}
    >
      {/* Header */}
      <div className="flex justify-between items-center font-semibold">
        <h3 className="text-gray-800 flex items-center gap-2">
          <span>{icon}</span>
          {entry.mood}
        </h3>
        <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
      </div>

      {/* Entry text */}
      <p className="mt-2 text-gray-700 line-clamp-2 leading-relaxed">
        {entry.text}
      </p>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-3">
        <button
          onClick={handleEdit}
          className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md text-sm font-medium transition"
        >
          Edit
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
        >
          Delete
        </button>
      </div>

      {/* Time */}
      <div className="text-right text-xs text-gray-500 mt-2">
        Time: {formatTime(entry.date)}
      </div>

      {/* Confirm Delete Dialog */}
      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this entry?"
          onConfirm={() => {
            handleDelete();
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

JournalCard.propTypes = {
  entry: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};
