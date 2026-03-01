/**
 * ═══════════════════════════════════════════════════════════════════
 *  AQUAWATCH GAME REGISTRY
 *  ─────────────────────────────────────────────────────────────────
 *  This is the ONLY file you need to edit to add a new game.
 *
 *  HOW TO ADD A REACT GAME:
 *  ────────────────────────
 *  1. Create your component in src/pages/games/YourGame.jsx
 *     It should accept: { onExit, onScoreEarned, userPoints, onSpendPoints }
 *  2. Add an entry below with type: 'react' and set component: YourGame
 *
 *  HOW TO ADD A GAME ENGINE GAME (Unity / Godot / Construct3 / etc.):
 *  ───────────────────────────────────────────────────────────────────
 *  1. Export your game to web (WebGL for Unity, HTML5 for Godot)
 *  2. Place the exported folder inside: public/games/your-game-id/
 *     The folder must contain an index.html (the game's entry point)
 *  3. Add an entry below with type: 'iframe'
 *     Set iframeSrc: '/games/your-game-id/index.html'
 *  4. (Optional) Add postMessage bridge for score reporting — see
 *     docs/GAME_BRIDGE.md for the message format your game should emit.
 *
 *  GAME ENTRY FIELDS:
 *  ──────────────────
 *  id          string   Unique identifier. Must match game_unlocks DB value.
 *  name        string   Display name
 *  tagline     string   Short one-liner shown on card
 *  description string   Longer description shown on card
 *  type        'react' | 'iframe'
 *  component   ReactComponent   (only for type: 'react')
 *  iframeSrc   string           (only for type: 'iframe') path under /public
 *  iframeSize  object           (optional) { width, height } defaults to full
 *  engine      string           (optional) 'unity' | 'godot' | 'construct' | 'custom'
 *  emoji       string   Emoji icon
 *  cost        number   AquaPoints needed to unlock. 0 = free.
 *  difficulty  'Easy' | 'Medium' | 'Hard' | 'Expert'
 *  tags        string[]
 *  features    string[]  Up to 4 bullet-point features shown on card
 *  accentColor string   Hex color for card glow/button accent
 *  gradient    string   Tailwind gradient classes for card background
 *  engineBadge boolean  Whether to show a "Made with [Engine]" badge
 *  newBadge    boolean  Show a "NEW" badge on the card
 *  comingSoon  boolean  Card shows "Coming Soon" overlay instead of play
 * ═══════════════════════════════════════════════════════════════════
 */

import { Brain, Puzzle, Droplets, Shield, Sparkles, Award, Gamepad2 } from 'lucide-react'
import WaterTrivia from './games/WaterTrivia'
import PipelinePuzzle from './games/PipelinePuzzle'
import WaterSorter from './games/WaterSorter'
import WaterMemory from './games/WaterMemory'
import FloodDefense from './games/FloodDefense'
import EcoDecisions from './games/EcoDecisions'

export const GAME_REGISTRY = [

  {
    id: 'trivia',
    name: 'Water Trivia',
    tagline: 'Test your water knowledge!',
    description: 'Answer 10 timed questions about water science, conservation, and global water issues. Beat the clock for bonus points!',
    type: 'react',
    component: WaterTrivia,
    emoji: '🧠',
    icon: Brain,
    cost: 0,
    difficulty: 'Easy',
    accentColor: '#0ea5e9',
    gradient: 'from-ocean-600/40 to-ocean-800/60',
    tags: ['Educational', 'Trivia', 'Timed'],
    features: ['10 Random Questions', 'Streak Bonuses', 'Time Bonus Points', 'Water Facts'],
  },

  {
    id: 'memory',
    name: 'Memory Match',
    tagline: 'Find matching water pairs!',
    description: 'Flip cards to find matching water-themed pairs. Unlock premium card packs with your AquaPoints for more fun themes!',
    type: 'react',
    component: WaterMemory,
    emoji: '🃏',
    icon: Sparkles,
    cost: 0,
    difficulty: 'Easy',
    accentColor: '#14b8a6',
    gradient: 'from-teal-600/40 to-teal-900/60',
    tags: ['Memory', 'Relaxing', 'Unlockable Packs'],
    features: ['8 Card Pairs', 'Premium Theme Packs', 'Combo Scoring', 'Ocean & Eco Themes'],
    premiumFeature: 'Card packs unlockable with points',
  },

  {
    id: 'pipeline',
    name: 'Pipeline Puzzle',
    tagline: 'Connect the water flow!',
    description: 'Rotate pipe segments to create a complete water pipeline from source to drain. Engineering puzzles that teach water infrastructure!',
    type: 'react',
    component: PipelinePuzzle,
    emoji: '🔧',
    icon: Puzzle,
    cost: 50,
    difficulty: 'Medium',
    accentColor: '#f59e0b',
    gradient: 'from-amber-700/40 to-orange-900/60',
    tags: ['Puzzle', 'Engineering', 'Strategy'],
    features: ['3 Increasing Levels', 'Rotation Mechanics', 'Move Counter', 'Flow Simulation'],
  },

  {
    id: 'sorter',
    name: 'Water Sorter',
    tagline: 'Sort contaminated water!',
    description: 'Pour colored water between tubes to sort each tube into a single pure color. Represents water purification and separation!',
    type: 'react',
    component: WaterSorter,
    emoji: '💧',
    icon: Droplets,
    cost: 80,
    difficulty: 'Medium',
    accentColor: '#22d3ee',
    gradient: 'from-cyan-600/40 to-blue-900/60',
    tags: ['Logic', 'Sorting', 'Purification'],
    features: ['3 Levels (3-5 colors)', 'Pour Mechanics', 'Undo System', 'Satisfying Animations'],
  },

  {
    id: 'flood',
    name: 'Flood Defense',
    tagline: 'Save homes from rising water!',
    description: 'Strategically place sandbags to protect houses from a rising flood. Race against time! Teaches real flood management strategies.',
    type: 'react',
    component: FloodDefense,
    emoji: '🌊',
    icon: Shield,
    cost: 120,
    difficulty: 'Hard',
    accentColor: '#3b82f6',
    gradient: 'from-blue-700/40 to-indigo-900/60',
    tags: ['Strategy', 'Real-time', 'Emergency'],
    features: ['60-Second Rounds', 'Flood Simulation', 'Sandbag Strategy', 'Home Protection'],
  },

  {
    id: 'eco',
    name: 'Eco Decisions',
    tagline: 'Make the right water choices!',
    description: 'Face real-world water management scenarios and make critical decisions. Every choice affects your eco-score and teaches you valuable lessons.',
    type: 'react',
    component: EcoDecisions,
    emoji: '🌍',
    icon: Award,
    cost: 100,
    difficulty: 'Hard',
    accentColor: '#10b981',
    gradient: 'from-emerald-700/40 to-green-900/60',
    tags: ['Scenarios', 'Decision-Making', 'Real-World'],
    features: ['5 Real Scenarios', 'Branching Outcomes', 'Eco-Score System', 'Expert Explanations'],
  },


  // ── IFRAME / GAME ENGINE EXAMPLES ─────────────────────────────────────────
  // Uncomment and configure these when you export your engine games.
  //
  // EXAMPLE 1 — Unity WebGL game:
  // {
  //   id: 'aqua-runner',
  //   name: 'AquaRunner',
  //   tagline: 'Run and collect clean water!',
  //   description: 'A 3D platformer where you collect water droplets while avoiding pollution. Built in Unity.',
  //   type: 'iframe',
  //   iframeSrc: '/games/aqua-runner/index.html',   // place files in public/games/aqua-runner/
  //   engine: 'unity',
  //   emoji: '🏃',
  //   icon: Gamepad2,
  //   cost: 150,
  //   difficulty: 'Medium',
  //   accentColor: '#8b5cf6',
  //   gradient: 'from-violet-700/40 to-purple-900/60',
  //   tags: ['3D', 'Platformer', 'Action'],
  //   features: ['Full 3D World', '10 Levels', 'Score System', 'Built with Unity'],
  //   engineBadge: true,
  //   newBadge: true,
  //   // scoreMessageKey: 'AQUAWATCH_SCORE',  // postMessage key your Unity game emits
  // },
  //
  // EXAMPLE 2 — Godot HTML5 game:
  // {
  //   id: 'water-hero',
  //   name: 'Water Hero',
  //   tagline: 'Fix the broken water system!',
  //   description: 'A top-down adventure game built with Godot. Fix pipes and clean up pollution to save the city.',
  //   type: 'iframe',
  //   iframeSrc: '/games/water-hero/index.html',    // place files in public/games/water-hero/
  //   engine: 'godot',
  //   emoji: '⚔️',
  //   icon: Gamepad2,
  //   cost: 200,
  //   difficulty: 'Expert',
  //   accentColor: '#ec4899',
  //   gradient: 'from-pink-700/40 to-rose-900/60',
  //   tags: ['Adventure', 'Top-Down', 'Story'],
  //   features: ['Story Campaign', 'Boss Fights', 'Water Lore', 'Built with Godot'],
  //   engineBadge: true,
  // },
  //
  // EXAMPLE 3 — Coming Soon placeholder:
  // {
  //   id: 'ocean-cleanup',
  //   name: 'Ocean Cleanup',
  //   tagline: 'Coming soon!',
  //   description: 'A massive multiplayer ocean cleanup simulation. Coming in the next update!',
  //   type: 'iframe',
  //   iframeSrc: '',
  //   emoji: '🌊',
  //   icon: Gamepad2,
  //   cost: 0,
  //   difficulty: 'Medium',
  //   accentColor: '#06b6d4',
  //   gradient: 'from-cyan-700/40 to-sky-900/60',
  //   tags: ['Multiplayer', 'Coming Soon'],
  //   features: ['Multiplayer', 'Real-Time', 'Ocean Theme', 'Leaderboards'],
  //   comingSoon: true,
  // },

]

/** IDs of games that are always free (never need a DB unlock entry) */
export const FREE_GAME_IDS = new Set(
  GAME_REGISTRY.filter(g => g.cost === 0).map(g => g.id)
)

/** Engine display names for the badge shown on iframe game cards */
export const ENGINE_LABELS = {
  unity:     'Unity',
  godot:     'Godot',
  construct: 'Construct 3',
  phaser:    'Phaser',
  custom:    'Web',
}
