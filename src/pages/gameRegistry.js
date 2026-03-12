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
 *  FEATURED GAME (BIG CARD — 500 pts):
 *  ────────────────────────────────────
 *  There is exactly ONE featured game at the top of the grid.
 *  It is identified by  featured: true  in its registry entry.
 *  It uses type: 'external' and an externalUrl to open in a new tab.
 *  To set it up:
 *    1. Replace YOUR_FEATURED_GAME_NAME with the game's display name
 *    2. Replace YOUR_FEATURED_GAME_TAGLINE with a short one-liner
 *    3. Replace YOUR_FEATURED_GAME_DESCRIPTION with a longer description
 *    4. Replace /images/games/featured-cover.jpg with your cover image path
 *       (place the image in public/images/games/)
 *    5. Replace https://your-featured-game-url.com with the external link
 *    6. Adjust cost if needed (default: 500)
 *
 *  MEDIUM EXTERNAL GAME:
 *  ─────────────────────
 *  Identified by  mediumCard: true  in its registry entry.
 *  Same setup steps as the featured game above but uses medium sizing.
 *    1. Replace YOUR_MEDIUM_GAME_NAME, tagline, description
 *    2. Replace /images/games/medium-cover.jpg with your cover image
 *    3. Replace https://your-medium-game-url.com with the external link
 *    4. Set your desired cost (default: 150)
 *
 *  GAME ENTRY FIELDS:
 *  ──────────────────
 *  id           string   Unique identifier. Must match game_unlocks DB value.
 *  name         string   Display name
 *  tagline      string   Short one-liner shown on card
 *  description  string   Longer description shown on card
 *  type         'react' | 'iframe' | 'external'
 *  component    ReactComponent   (only for type: 'react')
 *  iframeSrc    string           (only for type: 'iframe') path under /public
 *  externalUrl  string           (only for type: 'external') opens in new tab
 *  coverImage   string           (for external type) path to cover image
 *  iframeSize   object           (optional) { width, height } defaults to full
 *  engine       string           (optional) 'unity' | 'godot' | 'construct' | 'custom'
 *  emoji        string   Emoji icon (used on non-cover cards)
 *  cost         number   AquaPoints needed to unlock. 0 = free.
 *  difficulty   'Easy' | 'Medium' | 'Hard' | 'Expert'
 *  tags         string[]
 *  features     string[]  Up to 4 bullet-point features shown on card
 *  accentColor  string   Hex color for card glow/button accent
 *  gradient     string   Tailwind gradient classes for card background
 *  featured     boolean  Renders as the large hero card at the top
 *  mediumCard   boolean  Renders as a medium-sized card
 *  engineBadge  boolean  Whether to show a "Made with [Engine]" badge
 *  newBadge     boolean  Show a "NEW" badge on the card
 *  comingSoon   boolean  Card shows "Coming Soon" overlay instead of play
 * ═══════════════════════════════════════════════════════════════════
 */

import { Brain, Puzzle, Droplets, Shield, Sparkles, Award, Gamepad2, Star } from 'lucide-react'
import WaterTrivia from './games/WaterTrivia'
import PipelinePuzzle from './games/PipelinePuzzle'
import WaterSorter from './games/WaterSorter'
import WaterMemory from './games/WaterMemory'
import FloodDefense from './games/FloodDefense'
import EcoDecisions from './games/EcoDecisions'

export const GAME_REGISTRY = [

  {
    id: 'featured-game',
    name: 'Water Quest',                
    tagline: 'A Stardew Valley Adventure',           
    description: 'In a world where no one cares about their water consumption, your goal is to decrease your water consumption as much as you can. "Save water today to secure tomorrow."',   // ← replace
    type: 'external',
    externalUrl: 'https://daniel-geo.itch.io/water-quest', 
    coverImage: 'https://i.ibb.co/XxW9K3DM/sunset-valley.jpg',  
    emoji: '🎮',
    icon: Gamepad2,
    cost: 500,
    difficulty: 'Expert',
    accentColor: '#f59e0b',
    gradient: 'from-amber-600/40 to-orange-900/60',
    tags: ['Featured', 'Premium', 'External'],
    features: ['Premium Experience', 'Full Game Access', 'Leaderboards', 'Water Education'],
    featured: true,
    newBadge: true,
  },

  {
    id: 'medium-game',
    name: 'Water Dispatch',                   
    tagline: 'Fix, Learn, Earn',            
    description: 'Help the water management team solve real-world water challenges through strategic decision-making and problem-solving!',     
    type: 'external',
    externalUrl: 'https://le-sinister.itch.io/water-patch',  
    coverImage: 'https://i.ibb.co/sv5GmzRT/water-dispatch.jpg',     
    emoji: '🕹️',
    icon: Gamepad2,
    cost: 250,                                      
    difficulty: 'Hard',
    accentColor: '#6366f1',
    gradient: 'from-indigo-600/40 to-violet-900/60',
    tags: ['Premium', 'External'],
    features: ['Unique Gameplay', 'Water Themed', 'Score Tracking', 'Community Play'],
    mediumCard: true,
    newBadge: true,
  },

  // ── STANDARD REACT GAMES ─────────────────────────────────────────────────

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
    cost: 10,
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
    cost: 10,
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
    cost: 20,
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
    cost: 20,
    difficulty: 'Hard',
    accentColor: '#10b981',
    gradient: 'from-emerald-700/40 to-green-900/60',
    tags: ['Scenarios', 'Decision-Making', 'Real-World'],
    features: ['5 Real Scenarios', 'Branching Outcomes', 'Eco-Score System', 'Expert Explanations'],
  },

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