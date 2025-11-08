import JournalCard from './JournalCard';
import PropTypes from "prop-types";
import { getEntries, deleteEntry } from "../api";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";

export default function JournalList ({ entries , onDelete ,onEdit}) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Recent Entries
      </h2>

      {/* No entries message */}
      {entries.length === 0 ? (
        <p className="text-gray-500 italic text-center py-6">
          No entries yet. Start writing!
        </p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <JournalCard
              key={entry._id}
              entry={entry}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}

      {/* View All Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/entries")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition"
        >
          View All Entries →
        </button>
      </div>
    </div>
  );
}

JournalList.propTypes = {
  entries: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

