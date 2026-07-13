import React, { useState } from 'react';
import { Player, PlayerEvaluation, CornerRatings } from '../types';
import { PlayerAvatar } from './PlayerAvatar';
import ReactMarkdown from 'react-markdown';
import {
  Calendar,
  Sparkles,
  ClipboardList,
  Edit,
  Trash2,
  TrendingUp,
  Brain,
  Users,
  Zap,
  Award,
  ChevronRight,
  BookOpen,
  Plus,
  ArrowLeft
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

interface PlayerProfileProps {
  player: Player;
  evaluations: PlayerEvaluation[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onNewEvaluation: () => void;
  onDeleteEvaluation: (evaluationId: string) => Promise<void> | void;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({
  player,
  evaluations,
  onBack,
  onEdit,
  onDelete,
  onNewEvaluation,
  onDeleteEvaluation,
}) => {
  const [selectedEvaluation, setSelectedEvaluation] = useState<PlayerEvaluation | null>(null);
  const [evaluationToDelete, setEvaluationToDelete] = useState<PlayerEvaluation | null>(null);
  const [isDeletingPlayer, setIsDeletingPlayer] = useState(false);

  // Calculate Average Ratings across all evaluations
  const getCornerAverages = () => {
    if (evaluations.length === 0) {
      return { technical: 0, physical: 0, psychological: 0, social: 0 };
    }

    let technicalSum = 0;
    let physicalSum = 0;
    let psychologicalSum = 0;
    let socialSum = 0;

    evaluations.forEach((evalItem) => {
      // technical fields avg
      const t = evalItem.ratings.technical;
      const tAvg = (t.dribbling + t.passing + t.shooting + t.defending + t.tactical) / 5;
      technicalSum += tAvg;

      // physical fields avg
      const p = evalItem.ratings.physical;
      const pAvg = (p.agility + p.speed + p.stamina + p.strength) / 4;
      physicalSum += pAvg;

      // psychological fields avg
      const psy = evalItem.ratings.psychological;
      const psyAvg = (psy.confidence + psy.focus + psy.decisionMaking + psy.resilience) / 4;
      psychologicalSum += psyAvg;

      // social fields avg
      const s = evalItem.ratings.social;
      const sAvg = (s.communication + s.teamwork + s.discipline + s.leadership) / 4;
      socialSum += sAvg;
    });

    const count = evaluations.length;
    return {
      technical: Number((technicalSum / count).toFixed(1)),
      physical: Number((physicalSum / count).toFixed(1)),
      psychological: Number((psychologicalSum / count).toFixed(1)),
      social: Number((socialSum / count).toFixed(1)),
    };
  };

  const averages = getCornerAverages();

  // Format data for Recharts Radar & Bar Chart
  const chartData = [
    { subject: 'Technical/Tactical', A: averages.technical, fullMark: 5 },
    { subject: 'Physical', A: averages.physical, fullMark: 5 },
    { subject: 'Psychological', A: averages.psychological, fullMark: 5 },
    { subject: 'Social', A: averages.social, fullMark: 5 },
  ];

  const handleDeleteClick = () => {
    setIsDeletingPlayer(true);
  };

  const handleDeleteEvaluationClick = (evalItem: PlayerEvaluation) => {
    setEvaluationToDelete(evalItem);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      {/* Upper Profile Header card */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex gap-4 items-center">
          <PlayerAvatar
            name={player.name}
            position={player.position}
            squadNumber={player.squadNumber}
            size={80}
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-white tracking-tight font-display">{player.name}</h1>
              {player.squadNumber !== null && (
                <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-xs font-mono font-black px-2.5 py-0.5 rounded-lg">
                  #{player.squadNumber}
                </span>
              )}
            </div>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mt-1.5 flex flex-wrap gap-x-2 gap-y-1 items-center">
              <span className="text-emerald-400 font-bold">{player.position}</span>
              <span className="text-slate-700">•</span>
              <span>{player.ageGroup} Group</span>
              <span className="text-slate-700">•</span>
              <span>{player.preferredFoot} Footed</span>
              <span className="text-slate-700">•</span>
              <span>Born {player.birthYear}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={onBack}
            className="flex-1 md:flex-none px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 hover:text-white transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <button
            onClick={onEdit}
            className="flex-1 md:flex-none px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 hover:text-white transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Profile
          </button>
          <button
            onClick={handleDeleteClick}
            className="flex-1 md:flex-none px-4 py-2 rounded-xl border border-rose-950 text-rose-400 font-semibold hover:bg-rose-500/10 hover:border-rose-500/30 transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
          <button
            onClick={onNewEvaluation}
            className="flex-1 md:flex-none px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-slate-950" /> New Evaluation
          </button>
        </div>
      </div>

      {/* Grid of Averages + Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: Player Corner Ratings Averages */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-white text-sm tracking-wide uppercase font-display mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              FA Four Corner Performance Averages
            </h3>

            {evaluations.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
                No evaluation scores logged yet. Add your first evaluation to view averages.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Technical Card */}
                <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4 flex items-center justify-between transition duration-200 hover:border-emerald-500/40">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase block font-display">Technical / Tactical</span>
                    <span className="text-2xl font-black text-white mt-1 block font-mono">{averages.technical} <span className="text-xs font-normal text-slate-500">/ 5</span></span>
                  </div>
                  <Award className="w-8 h-8 text-emerald-400" />
                </div>

                {/* Physical Card */}
                <div className="border border-blue-500/20 bg-blue-500/5 rounded-xl p-4 flex items-center justify-between transition duration-200 hover:border-blue-500/40">
                  <div>
                    <span className="text-xs font-bold text-blue-400 tracking-wider uppercase block font-display">Physical</span>
                    <span className="text-2xl font-black text-white mt-1 block font-mono">{averages.physical} <span className="text-xs font-normal text-slate-500">/ 5</span></span>
                  </div>
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>

                {/* Psychological Card */}
                <div className="border border-purple-500/20 bg-purple-500/5 rounded-xl p-4 flex items-center justify-between transition duration-200 hover:border-purple-500/40">
                  <div>
                    <span className="text-xs font-bold text-purple-400 tracking-wider uppercase block font-display">Psychological</span>
                    <span className="text-2xl font-black text-white mt-1 block font-mono">{averages.psychological} <span className="text-xs font-normal text-slate-500">/ 5</span></span>
                  </div>
                  <Brain className="w-8 h-8 text-purple-400" />
                </div>

                {/* Social Card */}
                <div className="border border-orange-500/20 bg-orange-500/5 rounded-xl p-4 flex items-center justify-between transition duration-200 hover:border-orange-500/40">
                  <div>
                    <span className="text-xs font-bold text-orange-400 tracking-wider uppercase block font-display">Social</span>
                    <span className="text-2xl font-black text-white mt-1 block font-mono">{averages.social} <span className="text-xs font-normal text-slate-500">/ 5</span></span>
                  </div>
                  <Users className="w-8 h-8 text-orange-400" />
                </div>
              </div>
            )}

            {player.notes && (
              <div className="mt-5 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Coach Intake & Focus Notes</h4>
                <p className="text-sm text-slate-300 leading-relaxed italic bg-slate-950/60 p-4 rounded-xl border border-slate-800">{player.notes}</p>
              </div>
            )}
          </div>

          {/* Evaluations list & Report archive */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-sm tracking-wide uppercase font-display flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-400" />
              Evaluation & Report History
            </h3>

            {evaluations.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-slate-800 rounded-xl">
                This player has no registered FA Corner evaluations. Create one to begin reporting.
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {evaluations.map((evalItem) => {
                  const evalDate = new Date(evalItem.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  // Calculate overall average for this specific evaluation
                  const t = evalItem.ratings.technical;
                  const p = evalItem.ratings.physical;
                  const psy = evalItem.ratings.psychological;
                  const s = evalItem.ratings.social;
                  
                  const tAvg = (t.dribbling + t.passing + t.shooting + t.defending + t.tactical) / 5;
                  const pAvg = (p.agility + p.speed + p.stamina + p.strength) / 4;
                  const psyAvg = (psy.confidence + psy.focus + psy.decisionMaking + psy.resilience) / 4;
                  const sAvg = (s.communication + s.teamwork + s.discipline + s.leadership) / 4;
                  
                  const overallScore = ((tAvg + pAvg + psyAvg + sAvg) / 4).toFixed(1);

                  return (
                    <div key={evalItem.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">Evaluation ({evalDate})</span>
                          <span className="bg-slate-800 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-slate-700">
                            Avg Score: {overallScore}/5
                          </span>
                        </div>
                        {evalItem.coachNotes && (
                          <p className="text-xs text-slate-400 line-clamp-1 mt-1 italic">
                            &ldquo;{evalItem.coachNotes}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {evalItem.generatedReport && (
                          <button
                            onClick={() => setSelectedEvaluation(evalItem)}
                            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/25 flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> View Report
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedEvaluation(evalItem)}
                          className="text-xs font-bold text-slate-300 hover:text-white transition bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Details
                        </button>
                        <button
                          onClick={() => handleDeleteEvaluationClick(evalItem)}
                          className="text-xs font-bold text-rose-400 hover:text-rose-300 transition bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-xl border border-rose-500/20 hover:border-rose-500/35 flex items-center gap-1 cursor-pointer"
                          title="Delete Evaluation"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1/3: Corner Comparison Visual Radar/Bar Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="font-bold text-white text-sm tracking-wide uppercase font-display mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            FA Corners Profile
          </h3>

          {evaluations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-24 text-center text-slate-500 text-sm px-4 border border-dashed border-slate-800 rounded-xl">
              Charts will activate when visual telemetry data becomes available.
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between">
              {/* Polar/Radar Chart for FA Corners */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '500' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#475569', fontSize: 8 }} />
                    <Radar
                      name={player.name}
                      dataKey="A"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart as an alternate grid reference */}
              <div className="h-44 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 8 }} />
                    <YAxis domain={[0, 5]} tick={{ fill: '#64748b', fontSize: 9 }} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(51, 65, 85, 0.3)' }}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                    />
                    <Bar dataKey="A" name="Average Rating" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Report Modal Details Overlay */}
      {selectedEvaluation && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-bold text-lg font-display">FA Four Corner Evaluation Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Report generated on {new Date(selectedEvaluation.date).toLocaleDateString()} for {player.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedEvaluation(null)}
                className="text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 overflow-y-auto space-y-6 bg-slate-900 text-slate-200">
              {/* Performance Scores Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Tech/Tactical</span>
                  <span className="text-lg font-extrabold text-emerald-400 block mt-1 font-mono">
                    {((selectedEvaluation.ratings.technical.dribbling +
                      selectedEvaluation.ratings.technical.passing +
                      selectedEvaluation.ratings.technical.shooting +
                      selectedEvaluation.ratings.technical.defending +
                      selectedEvaluation.ratings.technical.tactical) / 5).toFixed(1)} / 5
                  </span>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Physical</span>
                  <span className="text-lg font-extrabold text-blue-400 block mt-1 font-mono">
                    {((selectedEvaluation.ratings.physical.agility +
                      selectedEvaluation.ratings.physical.speed +
                      selectedEvaluation.ratings.physical.stamina +
                      selectedEvaluation.ratings.physical.strength) / 4).toFixed(1)} / 5
                  </span>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Psychological</span>
                  <span className="text-lg font-extrabold text-purple-400 block mt-1 font-mono">
                    {((selectedEvaluation.ratings.psychological.confidence +
                      selectedEvaluation.ratings.psychological.focus +
                      selectedEvaluation.ratings.psychological.decisionMaking +
                      selectedEvaluation.ratings.psychological.resilience) / 4).toFixed(1)} / 5
                  </span>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Social</span>
                  <span className="text-lg font-extrabold text-orange-400 block mt-1 font-mono">
                    {((selectedEvaluation.ratings.social.communication +
                      selectedEvaluation.ratings.social.teamwork +
                      selectedEvaluation.ratings.social.discipline +
                      selectedEvaluation.ratings.social.leadership) / 4).toFixed(1)} / 5
                  </span>
                </div>
              </div>

              {/* Coach Comments */}
              {selectedEvaluation.coachNotes && (
                <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/40 text-slate-300">
                  <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Coach Review Comments</h4>
                  <p className="text-sm text-slate-300 leading-relaxed italic">&ldquo;{selectedEvaluation.coachNotes}&rdquo;</p>
                </div>
              )}

              {/* Development Report */}
              {selectedEvaluation.generatedReport ? (
                <div className="border border-slate-800 rounded-xl p-5 bg-slate-950/30 text-slate-300 space-y-4">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm border-b border-slate-850 pb-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 fill-emerald-400/20 animate-pulse" />
                    <span className="font-display">Personalized AI Development Report</span>
                  </div>
                  <div className="markdown-body text-sm leading-relaxed text-slate-300 space-y-3 prose max-w-none">
                    <ReactMarkdown>{selectedEvaluation.generatedReport}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs italic border border-dashed border-slate-800 rounded-xl">
                  No automated reports generated for this evaluation.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950/50 px-6 py-4 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => handleDeleteEvaluationClick(selectedEvaluation)}
                className="px-4 py-2 border border-rose-950 text-rose-400 font-semibold hover:bg-rose-500/10 hover:border-rose-500/30 transition text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                title="Delete Evaluation"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Evaluation
              </button>
              <button
                onClick={() => setSelectedEvaluation(null)}
                className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Evaluation Delete Confirmation Modal */}
      {evaluationToDelete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="bg-rose-500/10 p-2.5 rounded-full border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Delete Evaluation Report?</h3>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              Are you sure you want to delete the evaluation report from{' '}
              <strong className="text-white font-semibold">
                {new Date(evaluationToDelete.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </strong>
              ? This action is permanent and cannot be undone.
            </p>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setEvaluationToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onDeleteEvaluation(evaluationToDelete.id);
                  if (selectedEvaluation && selectedEvaluation.id === evaluationToDelete.id) {
                    setSelectedEvaluation(null);
                  }
                  setEvaluationToDelete(null);
                }}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-500/20 cursor-pointer"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Player Delete Confirmation Modal */}
      {isDeletingPlayer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="bg-rose-500/10 p-2.5 rounded-full border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Delete Player Profile?</h3>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              Are you sure you want to delete the player <strong className="text-white font-semibold">{player.name}</strong>? This will permanently remove their profile and all of their evaluations.
            </p>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setIsDeletingPlayer(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setIsDeletingPlayer(false);
                }}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-500/20 cursor-pointer"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
