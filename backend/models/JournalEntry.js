import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Journal text is required"],
    },
    mood: {
      type: String,
      required: [true, "Mood is required"],
      enum: ["Happy", "Sad", "Angry", "Calm", "Neutral"],
    },
    date: {
      type: Date,
      default: Date.now, // Auto-set current date/time
    },
    // 👇 NEW FIELD: this links the entry to the logged-in user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference the User model
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);
export default JournalEntry;
