import React, { useState } from 'react';
import { Player, PlayerEvaluation } from '../types';
import { PlayerAvatar } from './PlayerAvatar';
import {
  Search,
  Filter,
  TrendingUp,
  UserPlus,
  Zap,
  Users,
  Brain,
  Award,
  ChevronRight,
  ClipboardList,
  Sparkles,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface SquadDashboardProps {
  players: Player[];
  evaluations: PlayerEvaluation[];
  onSelectPlayer: (player: Player) => void;
  onNewPlayer: () => void;
  onNewEvaluation: (player: Player) => void;
}

export const SquadDashboard: React.FC<SquadDashboardProps> = ({
  players,
  evaluations,
  onSelectPlayer,
  onNewPlayer,
  onNewEvaluation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('All');
  const [positionFilter, setPositionFilter] = useState('All');

  // Helper: Calculate average scores for a single player
  const getPlayerStats = (playerId: string) => {
    const playerEvals = evaluations.filter((e) => e.playerId === playerId);
    if (playerEvals.length === 0) return { overall: 0, count: 0 };

    let totalSum = 0;
    playerEvals.forEach((evalItem) => {
      const t = evalItem.ratings.technical;
      const tAvg = (t.dribbling + t.passing + t.shooting + t.defending + t.tactical) / 5;

      const p = evalItem.ratings.physical;
      const pAvg = (p.agility + p.speed + p.stamina + p.strength) / 4;

      const psy = evalItem.ratings.psychological;
      const psyAvg = (psy.confidence + psy.focus + psy.decisionMaking + psy.resilience) / 4;

      const s = evalItem.ratings.social;
      const sAvg = (s.communication + s.teamwork + s.discipline + s.leadership) / 4;

      totalSum += (tAvg + pAvg + psyAvg + sAvg) / 4;
    });

    return {
      overall: Number((totalSum / playerEvals.length).toFixed(1)),
      count: playerEvals.length,
    };
  };

  // Squad average scores per corner
  const getSquadAverages = () => {
    if (evaluations.length === 0) {
      return [
        { name: 'Technical', score: 0 },
        { name: 'Physical', score: 0 },
        { name: 'Psychological', score: 0 },
        { name: 'Social', score: 0 },
      ];
    }

    let technical = 0;
    let physical = 0;
    let psychological = 0;
    let social = 0;

    evaluations.forEach((evalItem) => {
      const t = evalItem.ratings.technical;
      technical += (t.dribbling + t.passing + t.shooting + t.defending + t.tactical) / 5;

      const p = evalItem.ratings.physical;
      physical += (p.agility + p.speed + p.stamina + p.strength) / 4;

      const psy = evalItem.ratings.psychological;
      psychological += (psy.confidence + psy.focus + psy.decisionMaking + psy.resilience) / 4;

      const s = evalItem.ratings.social;
      social += (s.communication + s.teamwork + s.discipline + s.leadership) / 4;
    });

    const count = evaluations.length;
    return [
      { name: 'Technical / Tactical', score: Number((technical / count).toFixed(1)), fill: '#10b981' },
      { name: 'Physical', score: Number((physical / count).toFixed(1)), fill: '#3b82f6' },
      { name: 'Psychological', score: Number((psychological / count).toFixed(1)), fill: '#a855f7' },
      { name: 'Social', score: Number((social / count).toFixed(1)), fill: '#f97316' },
    ];
  };

  const positionDistribution = () => {
    const counts = { Goalkeeper: 0, Defender: 0, Midfielder: 0, Forward: 0 };
    players.forEach((p) => {
      counts[p.position] = (counts[p.position] || 0) + 1;
    });

    const COLORS = ['#10b981', '#3b82f6', '#a855f7', '#f97316'];

    return Object.entries(counts).map(([name, value], idx) => ({
      name,
      value,
      color: COLORS[idx],
    }));
  };

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (player.squadNumber?.toString() === searchTerm);
    const matchesAge = ageFilter === 'All' || player.ageGroup === ageFilter;
    const matchesPosition = positionFilter === 'All' || player.position === positionFilter;

    return matchesSearch && matchesAge && matchesPosition;
  });

  const squadAverages: any[] = getSquadAverages();
  const positionData = positionDistribution();

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Squad Overview Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Players */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5 flex items-center gap-4 transition duration-200 hover:border-slate-700/80">
          <div className="p-3 bg-slate-800 text-emerald-400 rounded-xl border border-slate-700/50">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wide">Squad Size</span>
            <span className="text-2xl font-black text-white">{players.length} Players</span>
          </div>
        </div>

        {/* Total Evaluations */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5 flex items-center gap-4 transition duration-200 hover:border-slate-700/80">
          <div className="p-3 bg-slate-800 text-blue-400 rounded-xl border border-slate-700/50">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wide">Evaluations</span>
            <span className="text-2xl font-black text-white font-mono">{evaluations.length} Logs</span>
          </div>
        </div>

        {/* Top Performer Average */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5 flex items-center gap-4 transition duration-200 hover:border-slate-700/80">
          <div className="p-3 bg-slate-800 text-purple-400 rounded-xl border border-slate-700/50">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wide">Squad Corners Avg</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {evaluations.length > 0
                ? (squadAverages.reduce((acc: number, curr: any) => acc + curr.score, 0) / 4).toFixed(1)
                : '0.0'}{' '}
              / 5
            </span>
          </div>
        </div>

        {/* Gemini reports */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5 flex items-center gap-4 transition duration-200 hover:border-slate-700/80">
          <div className="p-3 bg-slate-800 text-orange-400 rounded-xl border border-slate-700/50">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wide">AI Reports Generated</span>
            <span className="text-2xl font-black text-white">
              {evaluations.filter((e) => e.generatedReport).length} Reports
            </span>
          </div>
        </div>
      </div>

      {/* Visual Squad Analytics charts */}
      {players.length > 0 && evaluations.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Squad averages per corner (2/3 width) */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-white text-sm tracking-tight mb-4 flex items-center gap-2 font-display uppercase">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Squad Performance Average across FA 4 Corners
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={squadAverages} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '500' }} />
                  <YAxis domain={[0, 5]} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(51, 65, 85, 0.3)' }} 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {squadAverages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Position Distribution (1/3 width) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <h3 className="font-bold text-white text-sm tracking-tight mb-2 flex items-center gap-2 font-display uppercase">
              <Activity className="w-4 h-4 text-emerald-400" />
              Squad Position Distribution
            </h3>
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={positionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {positionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {positionData.map((pos) => (
                <div key={pos.name} className="flex items-center gap-1.5 border border-slate-800 rounded-xl p-1.5 bg-slate-950/60">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pos.color }} />
                  <span className="text-slate-400 font-medium">{pos.name}: <strong className="text-slate-200">{pos.value}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Directory Searching and Filters bar */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4.5 h-4.5" />
              <input
                type="text"
                placeholder="Search by player name or squad number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-850/80 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition outline-none text-sm"
              />
            </div>

            {/* Age Group Filter */}
            <div className="relative">
              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="pl-4 pr-10 py-2.5 rounded-xl border border-slate-700 bg-slate-850/80 text-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition outline-none text-sm font-medium appearance-none min-w-[120px]"
              >
                <option value="All">All Ages</option>
                {['U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16'].map((age) => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
              <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5 pointer-events-none" />
            </div>

            {/* Position Filter */}
            <div className="relative">
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="pl-4 pr-10 py-2.5 rounded-xl border border-slate-700 bg-slate-850/80 text-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition outline-none text-sm font-medium appearance-none min-w-[140px]"
              >
                <option value="All">All Positions</option>
                <option value="Goalkeeper">Goalkeepers</option>
                <option value="Defender">Defenders</option>
                <option value="Midfielder">Midfielders</option>
                <option value="Forward">Forwards</option>
              </select>
              <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={onNewPlayer}
            className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-900 font-bold text-sm hover:bg-white transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-white/5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Register Player
          </button>
        </div>

        {/* List of Players Grid */}
        {filteredPlayers.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
            <p className="text-slate-400 text-sm">No registered players match your search criteria.</p>
            {players.length === 0 && (
              <button
                onClick={onNewPlayer}
                className="mt-3 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/25"
              >
                Register your first player
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlayers.map((player) => {
              const { overall, count } = getPlayerStats(player.id);
              return (
                <div
                  key={player.id}
                  className="bg-slate-900/80 border border-slate-800/85 rounded-2xl p-5 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-950/20 transition duration-250 flex flex-col justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <PlayerAvatar
                      name={player.name}
                      position={player.position}
                      squadNumber={player.squadNumber}
                      size={52}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm tracking-tight truncate flex items-center gap-1.5">
                        {player.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {player.position} • {player.ageGroup}
                      </p>
                    </div>

                    {/* Overall Rating Circular Badge */}
                    <div className="text-right flex-shrink-0">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Average</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">{overall > 0 ? overall : '—'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs text-slate-400">
                    <div>
                      <span className="font-semibold text-slate-200">{count}</span> evaluation{count !== 1 ? 's' : ''} logged
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onNewEvaluation(player)}
                        className="text-xs font-semibold text-slate-300 hover:text-emerald-400 bg-slate-800/80 border border-slate-700 hover:border-emerald-500/30 hover:bg-emerald-500/10 px-3 py-1.5 rounded-xl transition cursor-pointer"
                      >
                        Evaluate
                      </button>
                      <button
                        onClick={() => onSelectPlayer(player)}
                        className="text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 px-3.5 py-1.5 rounded-xl transition flex items-center gap-0.5 shadow-md shadow-emerald-500/10 cursor-pointer"
                      >
                        Profile <ChevronRight className="w-3 h-3 text-slate-950" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
