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

  // little games

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
export const FREE_GAME_IDS = new Set(
  GAME_REGISTRY.filter(g => g.cost === 0).map(g => g.id)
)

export const ENGINE_LABELS = {
  unity:     'Unity',
  godot:     'Godot',
  construct: 'Construct 3',
  phaser:    'Phaser',
  custom:    'Web',
}