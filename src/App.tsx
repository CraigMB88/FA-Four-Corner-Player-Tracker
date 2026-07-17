import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { Player, PlayerEvaluation } from './types';
import { SquadDashboard } from './components/SquadDashboard';
import { PlayerProfile } from './components/PlayerProfile';
import { PlayerForm } from './components/PlayerForm';
import { EvaluationForm } from './components/EvaluationForm';
import { Shield, Sparkles, HelpCircle, Activity, Star } from 'lucide-react';

export default function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [evaluations, setEvaluations] = useState<PlayerEvaluation[]>([]);
  const [loading, setLoading] = useState(true);

  // Navigation states
  const [currentView, setCurrentView] = useState<'dashboard' | 'player-profile' | 'player-form' | 'evaluation-form'>('dashboard');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top of the page on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  // Load Real-time Data from Firestore
  useEffect(() => {
    const unsubPlayers = onSnapshot(collection(db, 'players'), async (snapshot) => {
      const playersList: Player[] = [];
      snapshot.forEach((doc) => {
        playersList.push({ id: doc.id, ...doc.data() } as Player);
      });
      setPlayers(playersList);
      setLoading(false);

      // Trigger Seeding if empty and never seeded in this database
      if (playersList.length === 0 && !loading) {
        try {
          const seedRef = doc(db, 'system', 'seeding');
          const seedSnap = await getDoc(seedRef);
          if (!seedSnap.exists()) {
            await seedInitialSquadData();
          }
        } catch (e) {
          console.error('Error checking database seeding status:', e);
        }
      }
    });

    const unsubEvals = onSnapshot(collection(db, 'evaluations'), (snapshot) => {
      const evalsList: PlayerEvaluation[] = [];
      snapshot.forEach((doc) => {
        evalsList.push({ id: doc.id, ...doc.data() } as PlayerEvaluation);
      });
      setEvaluations(evalsList);
    });

    return () => {
      unsubPlayers();
      unsubEvals();
    };
  }, [loading]);

  // Seeding function with rich youth football players & historical reports
  const seedInitialSquadData = async () => {
    try {
      console.log('Seeding initial FA 4-Corner sample players...');
      const batch = writeBatch(db);

      // Write a seeding document to prevent future automatic re-seeding if the squad is emptied
      const seedingStatusRef = doc(db, 'system', 'seeding');
      batch.set(seedingStatusRef, { seeded: true, seededAt: new Date().toISOString() });

      const playerSamples: Omit<Player, 'id' | 'createdAt'>[] = [
        {
          name: 'Charlie Maxwell',
          birthYear: 2015,
          ageGroup: 'U11',
          position: 'Midfielder',
          preferredFoot: 'Right',
          squadNumber: 8,
          avatarSeed: 'charlie-m',
          notes: 'An intelligent central midfielder. Excelled in ball retention and creative distribution during pre-season trials. Working on vocals and organizing teammates.'
        },
        {
          name: 'Sophie Jenkins',
          birthYear: 2015,
          ageGroup: 'U11',
          position: 'Forward',
          preferredFoot: 'Both',
          squadNumber: 10,
          avatarSeed: 'sophie-j',
          notes: 'Highly clinical striker. High-tempo athletic speed with bilateral finishing capabilities. Coaching goal: Improve defensive positional shielding and leadership.'
        },
        {
          name: 'Leo Dubois',
          birthYear: 2014,
          ageGroup: 'U12',
          position: 'Defender',
          preferredFoot: 'Left',
          squadNumber: 4,
          avatarSeed: 'leo-d',
          notes: 'Robust left-sided center-back. Displays excellent focus, tackling strength, and timing. Working on playing out from tight spaces under pressure.'
        },
        {
          name: 'Maya Patel',
          birthYear: 2015,
          ageGroup: 'U11',
          position: 'Goalkeeper',
          preferredFoot: 'Right',
          squadNumber: 1,
          avatarSeed: 'maya-p',
          notes: 'Brave and reactive shot-stopper. Command of the penalty area is developing well. Focused on distribution accuracy and playing out from the back.'
        }
      ];

      for (const pData of playerSamples) {
        const playerRef = doc(collection(db, 'players'));
        batch.set(playerRef, {
          ...pData,
          createdAt: new Date().toISOString()
        });

        // Add 1 sample evaluation for each
        const evalRef = doc(collection(db, 'evaluations'));
        
        let ratings = {
          technical: { dribbling: 3, passing: 4, shooting: 3, defending: 3, tactical: 3 },
          physical: { agility: 4, speed: 3, stamina: 3, strength: 3 },
          psychological: { confidence: 4, focus: 3, decisionMaking: 3, resilience: 4 },
          social: { communication: 3, teamwork: 4, discipline: 4, leadership: 3 }
        };

        let coachNotes = '';

        if (pData.position === 'Goalkeeper') {
          ratings = {
            technical: { dribbling: 2, passing: 4, shooting: 2, defending: 4, tactical: 4 },
            physical: { agility: 4, speed: 3, stamina: 3, strength: 4 },
            psychological: { confidence: 5, focus: 4, decisionMaking: 4, resilience: 4 },
            social: { communication: 4, teamwork: 3, discipline: 5, leadership: 3 }
          };
          coachNotes = 'Maya shows great bravery and reflexes. Her vocal command of the penalty area is a huge asset for the defense. Excellent performance today.';
        } else if (pData.position === 'Forward') {
          ratings = {
            technical: { dribbling: 4, passing: 3, shooting: 5, defending: 2, tactical: 3 },
            physical: { agility: 5, speed: 5, stamina: 4, strength: 3 },
            psychological: { confidence: 4, focus: 4, decisionMaking: 3, resilience: 3 },
            social: { communication: 3, teamwork: 3, discipline: 4, leadership: 3 }
          };
          coachNotes = 'Sophie was clinical in front of goal, scoring twice. Her athletic agility is a key weapon. We want to encourage her to help in counter-press setups.';
        } else if (pData.position === 'Defender') {
          ratings = {
            technical: { dribbling: 3, passing: 3, shooting: 2, defending: 5, tactical: 4 },
            physical: { agility: 3, speed: 4, stamina: 4, strength: 5 },
            psychological: { confidence: 4, focus: 5, decisionMaking: 4, resilience: 4 },
            social: { communication: 3, teamwork: 4, discipline: 5, leadership: 4 }
          };
          coachNotes = 'Leo was exceptionally solid, reading the game well and displaying strong tackles. Let\'s continue developing his short passing out from the back.';
        } else {
          ratings = {
            technical: { dribbling: 4, passing: 4, shooting: 3, defending: 3, tactical: 4 },
            physical: { agility: 4, speed: 3, stamina: 4, strength: 3 },
            psychological: { confidence: 4, focus: 4, decisionMaking: 4, resilience: 4 },
            social: { communication: 3, teamwork: 5, discipline: 4, leadership: 4 }
          };
          coachNotes = 'Charlie controlled the midfield tempo with great precision. His touch and passing were outstanding. Continue guiding him to communicate louder.';
        }

        const initialReport = `### FA Four Corner Development Report
**Executive Summary**
${pData.name} has shown a fantastic attitude during our latest session. They are demonstrating high potential in their primary role as a ${pData.position}, showing great developmental maturity.

**Four Corner Deep Dive**
* **Technical/Tactical**: Displays high quality in core positional movements. Work on accelerating after taking a first touch.
* **Physical**: High-tempo agility is present. Work on sustained aerobic stamina.
* **Psychological**: Fantastic focus. Encourage risk-taking in the final third.
* **Social**: Listens well and supports teammates. Focus on developing a strong on-pitch voice.

**Action Plan & Drills**
1. **Wall Passing Challenge**: Practice 50 rapid passing reps against a rebound wall using both left and right feet daily.
2. **Speed-Agility Shuttles**: Perform diagonal ladder drills to maximize core balance during turning transits.`;

        batch.set(evalRef, {
          playerId: playerRef.id,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
          ratings,
          coachNotes,
          generatedReport: initialReport
        });
      }

      await batch.commit();
      console.log('Seeding successfully completed!');
    } catch (e) {
      console.error('Failed to seed mock players:', e);
    }
  };

  // CRUD: Add or Edit Player Record
  const handlePlayerSubmit = async (playerData: Omit<Player, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    try {
      if (playerToEdit) {
        // Edit
        const playerRef = doc(db, 'players', playerToEdit.id);
        await updateDoc(playerRef, {
          ...playerData
        });
        
        // Sync selected player state if editing active profile
        if (selectedPlayer && selectedPlayer.id === playerToEdit.id) {
          setSelectedPlayer({ id: playerToEdit.id, createdAt: selectedPlayer.createdAt, ...playerData } as Player);
        }
      } else {
        // Create
        await addDoc(collection(db, 'players'), {
          ...playerData,
          createdAt: new Date().toISOString()
        });
      }
      setPlayerToEdit(null);
      setCurrentView(selectedPlayer ? 'player-profile' : 'dashboard');
    } catch (err) {
      console.error('Error saving player:', err);
      alert('Failed to save player record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // CRUD: Delete Player and associated Evaluations
  const handlePlayerDelete = async () => {
    if (!selectedPlayer) return;
    try {
      // 1. Delete player record
      await deleteDoc(doc(db, 'players', selectedPlayer.id));

      // 2. Fetch and delete all related evaluations
      const playerEvals = evaluations.filter((e) => e.playerId === selectedPlayer.id);
      const batch = writeBatch(db);
      playerEvals.forEach((evalItem) => {
        batch.delete(doc(db, 'evaluations', evalItem.id));
      });
      await batch.commit();

      setSelectedPlayer(null);
      setCurrentView('dashboard');
    } catch (err) {
      console.error('Error deleting player:', err);
      alert('Failed to delete player profile.');
    }
  };

  // CRUD: Delete specific Evaluation
  const handleEvaluationDelete = async (evaluationId: string) => {
    try {
      await deleteDoc(doc(db, 'evaluations', evaluationId));
    } catch (err) {
      console.error('Error deleting evaluation:', err);
      alert('Failed to delete evaluation record.');
    }
  };

  // CRUD: Save Evaluation
  const handleEvaluationSubmit = async (evaluationData: Omit<PlayerEvaluation, 'id' | 'playerId' | 'date'>) => {
    if (!selectedPlayer) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'evaluations'), {
        ...evaluationData,
        playerId: selectedPlayer.id,
        date: new Date().toISOString()
      });
      setCurrentView('player-profile');
    } catch (err) {
      console.error('Error saving evaluation:', err);
      alert('Failed to save player evaluation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Sleek Dynamic Header */}
      <header className="sticky top-0 bg-slate-900/85 backdrop-blur-md text-white border-b border-slate-800 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div 
            onClick={() => {
              setSelectedPlayer(null);
              setPlayerToEdit(null);
              setCurrentView('dashboard');
            }} 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition duration-250 shadow-lg shadow-emerald-500/20">
              <Shield className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <h1 className="text-md font-bold tracking-tight text-white font-display">
                PitchLink <span className="text-emerald-500 underline decoration-2 decoration-emerald-500/50">Pro</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium font-sans uppercase tracking-widest">FA 4-Corner Squad Tracker</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-emerald-400 font-mono font-medium tracking-wide">
              ● Club Coach Mode
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-slate-800 rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-400 font-mono">Syncing with secure cloud database...</p>
          </div>
        ) : (
          <>
            {currentView === 'dashboard' && (
              <SquadDashboard
                players={players}
                evaluations={evaluations}
                onSelectPlayer={(p) => {
                  setSelectedPlayer(p);
                  setCurrentView('player-profile');
                }}
                onNewPlayer={() => {
                  setPlayerToEdit(null);
                  setCurrentView('player-form');
                }}
                onNewEvaluation={(p) => {
                  setSelectedPlayer(p);
                  setCurrentView('evaluation-form');
                }}
              />
            )}

            {currentView === 'player-profile' && selectedPlayer && (
              <PlayerProfile
                player={selectedPlayer}
                evaluations={evaluations.filter((e) => e.playerId === selectedPlayer.id)}
                onBack={() => {
                  setSelectedPlayer(null);
                  setCurrentView('dashboard');
                }}
                onEdit={() => {
                  setPlayerToEdit(selectedPlayer);
                  setCurrentView('player-form');
                }}
                onDelete={handlePlayerDelete}
                onNewEvaluation={() => setCurrentView('evaluation-form')}
                onDeleteEvaluation={handleEvaluationDelete}
              />
            )}

            {currentView === 'player-form' && (
              <PlayerForm
                playerToEdit={playerToEdit}
                onClose={() => {
                  setPlayerToEdit(null);
                  setCurrentView(selectedPlayer ? 'player-profile' : 'dashboard');
                }}
                onSubmit={handlePlayerSubmit}
              />
            )}

            {currentView === 'evaluation-form' && selectedPlayer && (() => {
              const playerEvals = evaluations
                .filter((e) => e.playerId === selectedPlayer.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
              const latestEval = playerEvals.length > 0 ? playerEvals[0] : undefined;
              return (
                <EvaluationForm
                  player={selectedPlayer}
                  isSubmitting={isSubmitting}
                  onBack={() => setCurrentView('player-profile')}
                  onSubmit={handleEvaluationSubmit}
                  previousEvaluation={latestEval}
                />
              );
            })()}
          </>
        )}
      </main>

      {/* Humble Dark Footer */}
      <footer className="mt-20 py-10 border-t border-slate-800 bg-slate-900/30 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-medium">© 2026 PitchLink Pro. Aligned with the FA Youth Award Four Corner Model.</p>
          <div className="flex justify-center gap-4 mt-2 text-slate-400 font-mono font-bold uppercase tracking-widest text-[10px]">
            <span className="hover:text-emerald-400 transition cursor-pointer">Technical/Tactical</span>
            <span className="text-slate-700 font-normal">•</span>
            <span className="hover:text-blue-400 transition cursor-pointer">Physical</span>
            <span className="text-slate-700 font-normal">•</span>
            <span className="hover:text-purple-400 transition cursor-pointer">Psychological</span>
            <span className="text-slate-700 font-normal">•</span>
            <span className="hover:text-orange-400 transition cursor-pointer">Social</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
