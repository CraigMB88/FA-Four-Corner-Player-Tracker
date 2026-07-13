import React, { useState } from 'react';
import { Player, CornerRatings, PlayerEvaluation } from '../types';
import { ArrowLeft, Sparkles, Brain, Users, Award, ShieldAlert, Zap } from 'lucide-react';

interface EvaluationFormProps {
  player: Player;
  onBack: () => void;
  onSubmit: (evaluation: Omit<PlayerEvaluation, 'id' | 'playerId' | 'date'>) => Promise<void>;
  isSubmitting: boolean;
  previousEvaluation?: PlayerEvaluation;
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({
  player,
  onBack,
  onSubmit,
  isSubmitting,
  previousEvaluation,
}) => {
  const [coachNotes, setCoachNotes] = useState('');
  
  // Initialize scores with neutral value of 2 (developing) or previous evaluation values if present
  const [technical, setTechnical] = useState(() => ({
    dribbling: previousEvaluation?.ratings?.technical?.dribbling ?? 2,
    passing: previousEvaluation?.ratings?.technical?.passing ?? 2,
    shooting: previousEvaluation?.ratings?.technical?.shooting ?? 2,
    defending: previousEvaluation?.ratings?.technical?.defending ?? 2,
    tactical: previousEvaluation?.ratings?.technical?.tactical ?? 2,
  }));

  const [physical, setPhysical] = useState(() => ({
    agility: previousEvaluation?.ratings?.physical?.agility ?? 2,
    speed: previousEvaluation?.ratings?.physical?.speed ?? 2,
    stamina: previousEvaluation?.ratings?.physical?.stamina ?? 2,
    strength: previousEvaluation?.ratings?.physical?.strength ?? 2,
  }));

  const [psychological, setPsychological] = useState(() => ({
    confidence: previousEvaluation?.ratings?.psychological?.confidence ?? 2,
    focus: previousEvaluation?.ratings?.psychological?.focus ?? 2,
    decisionMaking: previousEvaluation?.ratings?.psychological?.decisionMaking ?? 2,
    resilience: previousEvaluation?.ratings?.psychological?.resilience ?? 2,
  }));

  const [social, setSocial] = useState(() => ({
    communication: previousEvaluation?.ratings?.social?.communication ?? 2,
    teamwork: previousEvaluation?.ratings?.social?.teamwork ?? 2,
    discipline: previousEvaluation?.ratings?.social?.discipline ?? 2,
    leadership: previousEvaluation?.ratings?.social?.leadership ?? 2,
  }));

  const [apiGenerating, setApiGenerating] = useState(false);
  const [draftReport, setDraftReport] = useState<string | null>(null);

  const handleRatingChange = (
    corner: 'technical' | 'physical' | 'psychological' | 'social',
    field: string,
    value: number
  ) => {
    if (corner === 'technical') {
      setTechnical((prev) => ({ ...prev, [field]: value }));
    } else if (corner === 'physical') {
      setPhysical((prev) => ({ ...prev, [field]: value }));
    } else if (corner === 'psychological') {
      setPsychological((prev) => ({ ...prev, [field]: value }));
    } else if (corner === 'social') {
      setSocial((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handlePreviewReport = async () => {
    setApiGenerating(true);
    setDraftReport(null);
    try {
      const evaluationData = {
        ratings: { technical, physical, psychological, social },
        coachNotes,
      };
      
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player,
          evaluation: evaluationData,
        }),
      });

      if (!res.ok) {
        throw new Error('Server error generating report');
      }

      const data = await res.json();
      setDraftReport(data.report);
    } catch (err) {
      console.error(err);
      alert('Failed to generate report draft. Check server logs.');
    } finally {
      setApiGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ratings: { technical, physical, psychological, social },
      coachNotes,
      generatedReport: draftReport || undefined,
    });
  };

  const renderRatingRow = (
    label: string,
    corner: 'technical' | 'physical' | 'psychological' | 'social',
    field: string,
    currentValue: number
  ) => {
    const desc = ['Needs Focus', 'Developing', 'Consistent', 'Highly Capable', 'Outstanding'];
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-slate-850/60 last:border-b-0 gap-2">
        <div className="flex-1">
          <span className="text-sm font-semibold text-slate-200 block">{label}</span>
          <span className="text-xs text-slate-500 font-mono">{desc[currentValue - 1]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((val) => {
            const isSelected = currentValue === val;
            let btnClass = 'w-9 h-9 text-xs rounded-lg font-bold border transition flex items-center justify-center cursor-pointer ';
            if (isSelected) {
              if (corner === 'technical') btnClass += 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/10 font-black';
              else if (corner === 'physical') btnClass += 'bg-blue-500 text-slate-950 border-blue-500 shadow-lg shadow-blue-500/10 font-black';
              else if (corner === 'psychological') btnClass += 'bg-purple-500 text-slate-950 border-purple-500 shadow-lg shadow-purple-500/10 font-black';
              else if (corner === 'social') btnClass += 'bg-orange-500 text-slate-950 border-orange-500 shadow-lg shadow-orange-500/10 font-black';
            } else {
              btnClass += 'bg-slate-850/80 hover:bg-slate-800 text-slate-400 border-slate-700';
            }
            return (
              <button
                key={val}
                type="button"
                onClick={() => handleRatingChange(corner, field, val)}
                className={btnClass}
              >
                {val}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight font-display">FA Four Corner Evaluation</h1>
          <p className="text-sm text-slate-400">Evaluating: <strong className="text-emerald-400">{player.name}</strong> ({player.position} • {player.ageGroup})</p>
        </div>
      </div>

      {previousEvaluation && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl px-4 py-3 text-xs flex items-center gap-2 font-medium">
          <Award className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Baseline scores pre-populated from the previous evaluation on{' '}
            <strong className="text-white font-semibold">
              {new Date(previousEvaluation.date).toLocaleDateString()}
            </strong>
            .
          </span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* FA Corners Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TECHNICAL / TACTICAL CORNER */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-850 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-emerald-400 text-xs tracking-wider uppercase font-display">1. Technical & Tactical</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Ball control, passing, finishing, and spatial tactics</p>
              </div>
            </div>
            <div className="p-5 space-y-1">
              {renderRatingRow('Dribbling & Ball Control', 'technical', 'dribbling', technical.dribbling)}
              {renderRatingRow('Passing & Receiving', 'technical', 'passing', technical.passing)}
              {renderRatingRow('Shooting & Finishing', 'technical', 'shooting', technical.shooting)}
              {renderRatingRow('Tackling & Intercepting', 'technical', 'defending', technical.defending)}
              {renderRatingRow('Tactical Positional Awareness', 'technical', 'tactical', technical.tactical)}
            </div>
          </div>

          {/* PHYSICAL CORNER */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-850 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="font-bold text-blue-400 text-xs tracking-wider uppercase font-display">2. Physical</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Agility, raw speed, matching stamina, and functional strength</p>
              </div>
            </div>
            <div className="p-5 space-y-1">
              {renderRatingRow('Agility & Balance', 'physical', 'agility', physical.agility)}
              {renderRatingRow('Speed & Acceleration', 'physical', 'speed', physical.speed)}
              {renderRatingRow('Stamina & Endurance', 'physical', 'stamina', physical.stamina)}
              {renderRatingRow('Strength & Shielding', 'physical', 'strength', physical.strength)}
            </div>
          </div>

          {/* PSYCHOLOGICAL CORNER */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-850 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="font-bold text-purple-400 text-xs tracking-wider uppercase font-display">3. Psychological</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Self-belief, match focus, in-game decisions, and resilience</p>
              </div>
            </div>
            <div className="p-5 space-y-1">
              {renderRatingRow('Confidence & Self-Belief', 'psychological', 'confidence', psychological.confidence)}
              {renderRatingRow('Focus & Concentration', 'psychological', 'focus', psychological.focus)}
              {renderRatingRow('Decision Making under Pressure', 'psychological', 'decisionMaking', psychological.decisionMaking)}
              {renderRatingRow('Resilience & Determination', 'psychological', 'resilience', psychological.resilience)}
            </div>
          </div>

          {/* SOCIAL CORNER */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-850 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              <div>
                <h3 className="font-bold text-orange-400 text-xs tracking-wider uppercase font-display">4. Social</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">On-field voice, teamwork, respect, and peer leadership</p>
              </div>
            </div>
            <div className="p-5 space-y-1">
              {renderRatingRow('Communication & Vocals', 'social', 'communication', social.communication)}
              {renderRatingRow('Teamwork & Cooperation', 'social', 'teamwork', social.teamwork)}
              {renderRatingRow('Discipline & Respect', 'social', 'discipline', social.discipline)}
              {renderRatingRow('Leadership & Encouragement', 'social', 'leadership', social.leadership)}
            </div>
          </div>
        </div>

        {/* Coach Overall Notes */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3 shadow-md">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-display">
            Observation Notes / Coaching Feedback
          </label>
          <textarea
            rows={3}
            placeholder="Provide qualitative details about training performance, recent matches, highlight moments, or specific advice to guide Gemini report customization..."
            value={coachNotes}
            onChange={(e) => setCoachNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-850/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition outline-none text-white placeholder-slate-500 text-sm"
          />
        </div>

        {/* Gemini Report Area */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                <h3 className="font-bold text-lg tracking-tight font-display">AI Personalized Development Report</h3>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Generate custom UEFA-aligned recommendations, actionable feedback, and training tips.
              </p>
            </div>
            <button
              type="button"
              disabled={apiGenerating || isSubmitting}
              onClick={handlePreviewReport}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide uppercase border flex items-center gap-2 transition cursor-pointer ${
                apiGenerating
                  ? 'bg-slate-800 border-slate-700 text-slate-500'
                  : 'bg-emerald-500 text-slate-950 border-emerald-500 hover:bg-emerald-400 hover:scale-[1.01] shadow-lg shadow-emerald-500/15'
              }`}
            >
              {apiGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-emerald-400 rounded-full animate-spin"></div>
                  Generating Draft...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Report
                </>
              )}
            </button>
          </div>

          {draftReport ? (
            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 text-sm space-y-4 max-h-96 overflow-y-auto">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-widest border-b border-slate-800 pb-1 flex justify-between items-center font-mono">
                <span>DRAFT REPORT GENERATED BY GEMINI</span>
                <span className="text-[10px] text-emerald-400 normal-case">Generated successfully</span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 space-y-3">
                {draftReport.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl py-8 text-center text-slate-500 text-xs font-mono">
              <p>No report draft generated yet. Click the button above to synthesize and preview reports.</p>
            </div>
          )}
        </div>

        {/* Actions bar */}
        <div className="flex gap-3 justify-end items-center">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 font-semibold text-sm hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || apiGenerating}
            className={`px-7 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/15 flex items-center gap-2 cursor-pointer ${
              isSubmitting ? 'opacity-80' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-slate-700 rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Evaluation'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
