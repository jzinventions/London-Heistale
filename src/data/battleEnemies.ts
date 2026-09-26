import { BattleEnemy } from '../types/game';

export const BATTLE_ENEMIES: Record<string, BattleEnemy> = {
  'enemy_higgins': {
    id: 'enemy_higgins',
    name: 'Constable Higgins',
    title: 'Metropolitan Police Bobby on Night Patrol',
    maxHp: 120,
    currentHp: 120,
    atk: 10,
    def: 8,
    spareThreshold: 80,
    mercyProgress: 0,
    dialoguePool: [
      '"Oi! Step into the streetlight where I can see your mug!"',
      '"Bit late for carrying heavy iron tools, isn\'t it?"',
      '"My feet are frozen in these boots. Arsenal lost 2-0 today too. Miserable night."',
      '"Just tell me you\'re a plumber and show me some ID."'
    ],
    actOptions: [
      {
        label: 'Check',
        description: 'Analyze Higgins\' stats and emotional state.',
        mercyBonus: 0,
        response: 'CONSTABLE HIGGINS - ATK 10 DEF 8. A damp, weary London bobby. He would rather be having a warm cup of tea.'
      },
      {
        label: 'Offer Warm Tea',
        description: 'Share a sip of hot tea from your thermos in the rain.',
        mercyBonus: 35,
        response: 'You hand Higgins your warm flask. He takes a long sip, exhales steam, and his eyes soften. "God bless you, son. Proper tea, that."'
      },
      {
        label: 'Cockney Slang',
        description: 'Blag your way through with rapid Cockney rhyming slang.',
        mercyBonus: 30,
        response: 'You babble: "Just trot down the frog and toad to grab some bubble and squeak for me trouble and strife!" Higgins chuckles and scratches his helmet.'
      },
      {
        label: 'Feign Tourist',
        description: 'Pretend to be an American tourist looking for Big Ben.',
        mercyBonus: 25,
        response: 'You put on an exaggerated accent: "Say, officer, which way to London Bridge?" Higgins sighs: "You\'re three miles off, mate."'
      }
    ],
    patternType: 'truncheon'
  },

  'enemy_vance': {
    id: 'enemy_vance',
    name: 'Chief Inspector Vance',
    title: 'Head of the Scotland Yard Flying Squad',
    maxHp: 240,
    currentHp: 240,
    atk: 18,
    def: 16,
    spareThreshold: 85,
    mercyProgress: 0,
    dialoguePool: [
      '"You\'ve had a good run, Arthur. But nobody walks away from Hatton Garden."',
      '"The Thames never forgives, and neither does the law."',
      '"Surrender the holdalls. Don\'t make this harder than it has to be."',
      '"You hear those bells? That\'s St. Paul\'s welcoming you to the dock."'
    ],
    actOptions: [
      {
        label: 'Check',
        description: 'Inspect the grim detective in the heavy raincoat.',
        mercyBonus: 0,
        response: 'CHIEF INSPECTOR VANCE - ATK 18 DEF 16. Cold, disciplined, haunted by three decades chasing London crooks.'
      },
      {
        label: 'Appeal to Honor',
        description: 'Remind him of the old thief\'s code of no firearms.',
        mercyBonus: 25,
        response: 'You shout: "Not a single bullet was fired! No innocent civilians were touched!" Vance pauses and lowers his pistol slightly.'
      },
      {
        label: 'Plead for Dizzy',
        description: 'Beg him to let the twenty-year-old getaway driver go free.',
        mercyBonus: 30,
        response: 'You tell Vance that Dizzy was tricked by informants into carrying the beacon. Vance frowns: "...The system chews up boys like him."'
      },
      {
        label: 'Show Black Ledger',
        description: 'Wave the corrupt ledger found in locker #73.',
        mercyBonus: 40,
        response: 'Vance sees the ledger stamped by Commander V. His eyes widen in bitter recognition. "So that\'s where the rot was hiding..."'
      }
    ],
    patternType: 'siren_beams'
  }
};
