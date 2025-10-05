import React from "react";

interface InputProps {
  label: string;
  value?: string;
  onChange: (v: string) => void;
}

const Input: React.FC<InputProps> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm text-zinc-400 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
  </div>
);

export default Input;
