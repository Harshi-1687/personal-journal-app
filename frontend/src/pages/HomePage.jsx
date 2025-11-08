import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import JournalEntryForm from "../components/JournalEntryForm";
import JournalList from "../components/JournalList";
import { deleteEntry, getEntries } from "../api";

export default function HomePage() {
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.editingEntry) {
      setEditingEntry(location.state.editingEntry);
    }
  }, [location.state]);

  const fetchEntries = async () => {
    try {
      const data = await getEntries();
      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEntries(sorted);
    } catch (err) {
      console.error("Error fetching entries:", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleEdit = (entry) => setEditingEntry(entry);
  const handleCancelEdit = () => setEditingEntry(null);

  const handleDelete = async (id) => {
  try {
    setEntries((prev) => prev.filter((entry) => entry._id !== id));
    await deleteEntry(id);
  } catch (err) {
    console.error("Failed to delete entry:", err);
    fetchEntries();
  }
};

  useEffect(() => {
    fetchEntries();
  }, []);

   return (
    <div className="max-w-6xl mx-auto p-6 sm:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <JournalEntryForm
            onEntryAdded={() => {
              fetchEntries();
              setEditingEntry(null);
            }}
            editingEntry={editingEntry}
            onCancelEdit={handleCancelEdit}
          />
        </div>
        <div>
          <JournalList
            entries={entries.slice(0, 2)}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
};
