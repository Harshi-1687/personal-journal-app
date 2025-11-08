import React, { useEffect, useState } from "react";
import { getEntries, deleteEntry } from "../api.js";
import JournalCard from "../components/JournalCard";
import { useNavigate } from "react-router-dom";

export default function AllEntriesPage () {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMood, setFilterMood] = useState("All");

  const fetchEntries = async () => {
    try {
      const data = await getEntries();
      setEntries(data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (id) => {
  try {
    setEntries((prev) => prev.filter((entry) => entry._id !== id));
    await deleteEntry(id);
  } catch (error) {
    console.error("Error deleting entry:", error);
    fetchEntries(); // fallback
  }
};


  const handleEdit = (entry) => {
    navigate("/", { state: { editingEntry: entry } });
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesMood = filterMood === "All" || entry.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        All Journal Entries
      </h2>

      {/* ✅ Search + Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 w-full sm:w-64"
        />

        <select
          value={filterMood}
          onChange={(e) => setFilterMood(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white w-full sm:w-48 cursor-pointer focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        >
          <option value="All">All Moods</option>
          <option value="Happy">😄 Happy</option>
          <option value="Sad">😣 Sad</option>
          <option value="Angry">😡 Angry</option>
          <option value="Calm">😌 Calm</option>
          <option value="Neutral">🙂 Neutral</option>
        </select>
      </div>

      {/* ✅ Entries Section */}
      {loading ? (
        <p className="text-center text-gray-600">Loading entries...</p>
      ) : filteredEntries.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
          No entries found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEntries.map((entry) => (
            <JournalCard
              key={entry._id}
              entry={entry}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Back button */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-sm transition"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
