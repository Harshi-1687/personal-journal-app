import React ,{ useEffect } from "react";
import PropTypes from "prop-types";

export default function ConfirmDialog ({ message, onConfirm, onCancel }) {

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm delete dialog"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>

        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmDialog.propTypes = {
  message: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

ConfirmDialog.defaultProps = {
  message: "Are you sure you want to delete this item?",
};
