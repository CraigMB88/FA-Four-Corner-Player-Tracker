import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { User, Shield, Zap, Sparkles, Award, ArrowLeft } from 'lucide-react';

interface PlayerFormProps {
  playerToEdit?: Player | null;
  onSubmit: (playerData: Omit<Player, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({
  playerToEdit,
  onSubmit,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState(new Date().getFullYear() - 10);
  const [ageGroup, setAgeGroup] = useState('U11');
  const [position, setPosition] = useState<'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'>('Midfielder');
  const [preferredFoot, setPreferredFoot] = useState<'Left' | 'Right' | 'Both'>('Right');
  const [squadNumber, setSquadNumber] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (playerToEdit) {
      setName(playerToEdit.name);
      setBirthYear(playerToEdit.birthYear);
      setAgeGroup(playerToEdit.ageGroup);
      setPosition(playerToEdit.position);
      setPreferredFoot(playerToEdit.preferredFoot);
      setSquadNumber(playerToEdit.squadNumber || '');
      setNotes(playerToEdit.notes);
    }
  }, [playerToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Player name is required');
      return;
    }

    if (birthYear < 1990 || birthYear > new Date().getFullYear()) {
      setError('Please enter a valid birth year');
      return;
    }

    onSubmit({
      name: name.trim(),
      birthYear,
      ageGroup,
      position,
      preferredFoot,
      squadNumber: squadNumber === '' ? null : Number(squadNumber),
      avatarSeed: Math.random().toString(36).substring(7),
      notes: notes.trim(),
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto my-4">
      {/* Form Header */}
      <div className="bg-slate-950 px-6 py-5 text-white flex items-center justify-between border-b border-slate-850">
        <div>
          <h2 className="text-xl font-bold tracking-tight font-display text-white">
            {playerToEdit ? 'Edit Player Record' : 'Register New Player'}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Create or update profiles for squad ratings and reports
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-rose-500/10 text-rose-400 border border-rose-500/25 text-sm p-4 rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Name & Squad number */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">
              Player Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="e.g. Charlie Maxwell"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-850/80 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition outline-none"
                maxLength={50}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">
              Squad Number
            </label>
            <div className="relative">
              <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="number"
                placeholder="e.g. 10"
                value={squadNumber}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') setSquadNumber('');
                  else {
                    const num = parseInt(val);
                    if (num >= 0 && num <= 99) setSquadNumber(num);
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-850/80 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition outline-none font-mono"
                min={1}
                max={99}
              />
            </div>
          </div>
        </div>

        {/* Age group & Birth Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">
              Age Group <span className="text-rose-500">*</span>
            </label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-850/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition outline-none text-slate-200"
            >
              {['U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16'].map((grp) => (
                <option key={grp} value={grp} className="bg-slate-900 text-white">{grp}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">
              Birth Year <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 2015"
              value={birthYear}
              onChange={(e) => setBirthYear(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-850/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition outline-none text-white font-mono"
              min={1990}
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        {/* Position & Foot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">
              Primary Position <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Goalkeeper', 'Defender', 'Midfielder', 'Forward'] as const).map((pos) => {
                const isActive = position === pos;
                return (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setPosition(pos)}
                    className={`px-3 py-2 text-xs rounded-xl border transition text-center font-bold cursor-pointer ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-700 bg-slate-850/30 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {pos}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">
              Preferred Foot <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Left', 'Right', 'Both'] as const).map((foot) => {
                const isActive = preferredFoot === foot;
                return (
                  <button
                    key={foot}
                    type="button"
                    onClick={() => setPreferredFoot(foot)}
                    className={`px-3 py-2 text-xs rounded-xl border transition text-center font-bold cursor-pointer ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-700 bg-slate-850/30 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {foot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coach Bio/Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">
            Initial Coach Comments / Focus Areas
          </label>
          <textarea
            rows={4}
            placeholder="Describe the player's initial training challenges, strengths, technical focus areas, and goals for the season..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-850/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition outline-none text-white placeholder-slate-500 text-sm"
            maxLength={1000}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 hover:text-white transition text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/15 text-sm cursor-pointer"
          >
            {playerToEdit ? 'Save Changes' : 'Register Player'}
          </button>
        </div>
      </form>
    </div>
  );
};
