/**
 * LONDON HEISTALE: Game Types & Data Structures
 */

export type GameScreen = 
  | 'BOOT_SEQUENCE'
  | 'TITLE'
  | 'OVERWORLD_WALK'
  | 'INTRO_CUTSCENE'
  | 'STORY'
  | 'BATTLE'
  | 'SAD_ENDING'
  | 'SAVE_LOAD'
  | 'PROFILE_DOSSIER'
  | 'ACHIEVEMENTS'
  | 'SETTINGS';

export type VoiceType = 'narrator' | 'arthur' | 'dave' | 'dizzy' | 'police' | 'phone' | 'star';

export interface InventoryItem {
  id: string;
  name: string;
  desc: string;
  category: 'tool' | 'food' | 'valuable' | 'memory';
  heal?: number;
  value?: number;
}

export interface StoryChoice {
  id: string;
  label: string;
  subtext?: string;
  targetNodeId: string;
  requiresItem?: string;
  givesItem?: InventoryItem;
  karmaChange?: number; // positive = moral/peaceful, negative = reckless/ruthless
  suspicionChange?: number;
  crewTrustChange?: number;
  lootChange?: number;
  unlockAchievementId?: string;
}

export interface StoryNode {
  id: string;
  act: number;
  actTitle: string;
  location: string;
  speaker?: string;
  speakerRole?: string;
  speakerVoice?: VoiceType;
  speakerPortrait?: string;
  dialogueLines: string[];
  determinationQuote?: string; // Shows when finding save points
  hasSavePoint?: boolean;
  choices: StoryChoice[];
  cutsceneImage?: string;
  battleEncounterId?: string;
  isEnding?: boolean;
  endingKey?: 'sad_prison' | 'sad_waterloo_sacrifice' | 'sad_fugitive_exile' | 'sad_solitary_rain';
}

export interface BattleEnemy {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  currentHp: number;
  atk: number;
  def: number;
  dialoguePool: string[];
  spareThreshold: number; // 0-100%
  mercyProgress: number; // how close to being sparable
  actOptions: {
    label: string;
    description: string;
    mercyBonus: number;
    response: string;
  }[];
  patternType: 'truncheon' | 'siren_beams' | 'vault_lasers' | 'rain_drop_cascade' | 'handcuffs';
}

export interface PlayerProfile {
  id: string;
  alias: string;
  role: 'Mastermind' | 'Safecracker' | 'Getaway Driver' | 'Inside Man';
  pinCode: string;
  avatarIcon: string;
  createdAt: number;
  totalPlayTimeSeconds: number;
  choicesMadeCount: number;
  heistsCompleted: number;
  unlockedAchievements: string[];
}

export interface SaveSlotData {
  slotId: 'slot_0' | 'slot_1' | 'slot_2' | 'auto';
  profileId: string;
  profileAlias: string;
  savedAt: number;
  currentNodeId: string;
  locationName: string;
  actNumber: number;
  playTimeSeconds: number;
  hp: number;
  maxHp: number;
  lv: number;
  exp: number;
  goldLootPounds: number;
  suspicionLevel: number; // 0-100
  crewTrust: number; // 0-100
  karmaScore: number;
  inventory: InventoryItem[];
  choicesHistory: string[];
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  isSecret?: boolean;
  quote?: string;
}
