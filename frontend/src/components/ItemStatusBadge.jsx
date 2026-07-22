import React from 'react';

export default function ItemStatusBadge({ type, status }) {
  if (status === 'RETURNED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
        🟢 REUNITED / RETURNED
      </span>
    );
  }

  if (type === 'LOST') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
        <span className="w-2 h-2 rounded-full bg-rose-600"></span>
        🔴 LOST
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
      <span className="w-2 h-2 rounded-full bg-sky-600"></span>
      🟢 FOUND
    </span>
  );
}
