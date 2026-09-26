import { StoryNode, StoryChoice } from '../types/game';

// Image asset references
export const STORY_IMAGES = {
  cover: '/src/assets/images/uk_robbery_cover_1790416667228.jpg',
  vault: '/src/assets/images/uk_heist_cutscene_1790416683855.jpg',
  crew: '/src/assets/images/uk_robber_crew_1790416695204.jpg',
  sadEnding: '/src/assets/images/uk_court_rain_ending_1790416707539.jpg',
};

export const STORY_NODES: Record<string, StoryNode> = {
  // ==========================================
  // ACT 0: PROLOGUE - THE BLIND BEGGAR
  // ==========================================
  'node_start': {
    id: 'node_start',
    act: 0,
    actTitle: 'PROLOGUE',
    location: 'The Blind Beggar Pub, Whitechapel',
    speaker: 'Arthur "The Fox"',
    speakerRole: 'The Mastermind',
    speakerVoice: 'arthur',
    dialogueLines: [
      'Shut that door behind you, mate. The London rain smells like wet coal and bad decisions tonight.',
      'Take a pew. We\'ve only got forty-eight hours before the Easter bank holiday shuts down Hatton Garden.',
      'Two hundred security deposit boxes in a concrete subterranean vault. Uncut diamonds, Krugerrands, cold bundles of twenty-pound notes.',
      'Before we talk steel and drills, look me in the eye. What\'s your angle on this job?'
    ],
    cutsceneImage: STORY_IMAGES.cover,
    choices: [
      {
        id: 'c1',
        label: '"I need the cash. Clean slate, family debts paid."',
        subtext: 'Arthur nods with quiet understanding.',
        targetNodeId: 'node_intro_motive_family',
        crewTrustChange: 10,
        karmaChange: 5,
        unlockAchievementId: 'first_step'
      },
      {
        id: 'c2',
        label: '"I want the legend. The greatest heist since the Great Train Robbery."',
        subtext: 'Dizzy whistles from the corner.',
        targetNodeId: 'node_intro_motive_glory',
        crewTrustChange: 5,
        karmaChange: -5,
        unlockAchievementId: 'first_step'
      },
      {
        id: 'c3',
        label: '"One last turn with the old firm. For loyalty."',
        subtext: 'Big Dave stirs his tea softly.',
        targetNodeId: 'node_intro_motive_loyalty',
        crewTrustChange: 15,
        karmaChange: 10,
        unlockAchievementId: 'first_step'
      },
      {
        id: 'c4',
        label: '"Pour me a pint first. My hands are still frozen from the Tube."',
        subtext: 'Take a moment before committing.',
        targetNodeId: 'node_intro_pint',
        crewTrustChange: 5,
        karmaChange: 0,
        unlockAchievementId: 'tea_time'
      }
    ]
  },

  'node_intro_motive_family': {
    id: 'node_intro_motive_family',
    act: 0,
    actTitle: 'PROLOGUE',
    location: 'The Blind Beggar Pub, Back Snug',
    speaker: 'Arthur "The Fox"',
    speakerRole: 'The Mastermind',
    speakerVoice: 'arthur',
    dialogueLines: [
      '"A clean slate... Aye. We all started wanting that."',
      'Arthur rubs his weathered knuckles. His eyes carry the weight of thirty years dodging Scotland Yard.',
      '"Dave here is in for his daughter\'s clinic in Zurich. Dizzy... well, Dizzy wants a red Jaguar and a ticket to Marbella."'
    ],
    choices: [
      {
        id: 'c5',
        label: 'Ask Big Dave about the vault blueprints',
        subtext: 'Review the technical specs of Hatton Garden Safe Deposit.',
        targetNodeId: 'node_briefing_blueprints',
      },
      {
        id: 'c6',
        label: 'Ask Dizzy about our getaway route',
        subtext: 'Check how we outrun the Metropolitan Police.',
        targetNodeId: 'node_briefing_getaway',
      },
      {
        id: 'c7',
        label: 'Touch the glowing yellow star on the wooden table',
        subtext: 'A strange warmth radiates from the carved pub wood.',
        targetNodeId: 'node_save_point_pub',
      }
    ]
  },

  'node_intro_motive_glory': {
    id: 'node_intro_motive_glory',
    act: 0,
    actTitle: 'PROLOGUE',
    location: 'The Blind Beggar Pub, Back Snug',
    speaker: 'Dizzy',
    speakerRole: 'The Wheelman',
    speakerVoice: 'dizzy',
    dialogueLines: [
      '"Proper movie stuff! That\'s what I\'m talking about!"',
      'Dizzy tosses a set of stolen Ford Transit keys in the air and catches them with a grin.',
      '"The Flying Squad won\'t even finish their morning bacon butties before we\'ve cleared out Farringdon!"'
    ],
    choices: [
      {
        id: 'c8',
        label: '"Keep it down, kid. Walls in Whitechapel have ears."',
        subtext: 'Enforce professional caution.',
        targetNodeId: 'node_briefing_blueprints',
        suspicionChange: -5,
        crewTrustChange: 5
      },
      {
        id: 'c9',
        label: '"What van are we running with, Dizzy?"',
        subtext: 'Inspect the getaway vehicle preparation.',
        targetNodeId: 'node_briefing_getaway',
      },
      {
        id: 'c10',
        label: 'Examine the glowing yellow star carved into the table',
        subtext: 'The warm glow feels familiar...',
        targetNodeId: 'node_save_point_pub',
      }
    ]
  },

  'node_intro_motive_loyalty': {
    id: 'node_intro_motive_loyalty',
    act: 0,
    actTitle: 'PROLOGUE',
    location: 'The Blind Beggar Pub, Back Snug',
    speaker: 'Big Dave',
    speakerRole: 'The Safecracker',
    speakerVoice: 'dave',
    dialogueLines: [
      'Big Dave places a massive, calloused hand on your shoulder.',
      '"Loyalty is worth more than all the sparklers in London, pal.',
      'We stick together in the basement. Nobody panics. Nobody leaves anyone behind. That\'s the firm\'s creed."'
    ],
    choices: [
      {
        id: 'c11',
        label: '"What kind of safe are we cracking, Dave?"',
        subtext: 'Get the lowdown on the vault door.',
        targetNodeId: 'node_briefing_blueprints',
      },
      {
        id: 'c12',
        label: '"Let\'s verify our timing with Arthur."',
        subtext: 'Ensure the operational timeline is airtight.',
        targetNodeId: 'node_briefing_timing',
      },
      {
        id: 'c13',
        label: 'Inspect the glowing yellow star on the table',
        subtext: 'Save your file before heading into the London fog.',
        targetNodeId: 'node_save_point_pub',
      }
    ]
  },

  'node_intro_pint': {
    id: 'node_intro_pint',
    act: 0,
    actTitle: 'PROLOGUE',
    location: 'The Blind Beggar Pub, Bar Snug',
    speaker: 'Arthur "The Fox"',
    speakerRole: 'The Mastermind',
    speakerVoice: 'arthur',
    dialogueLines: [
      'Arthur slides over a foaming pint of warm brown bitter and a chipped mug of builder\'s tea.',
      '"Drink up. Once we breach that underground vault, there won\'t be no tea breaks."',
      '"Thirty hours of concrete dust, hydraulic oil, and the fear of God."'
    ],
    choices: [
      {
        id: 'c14',
        label: 'Drink the tea and review the blueprints',
        subtext: 'Heal up and study the blueprints.',
        targetNodeId: 'node_briefing_blueprints',
        givesItem: {
          id: 'item_tea',
          name: 'Hot Builder\'s Tea',
          desc: 'Strong British tea with two sugars. Restores 15 HP and steels the nerves.',
          category: 'food',
          heal: 15
        }
      },
      {
        id: 'c15',
        label: 'Save at the glowing star and get to business',
        subtext: 'Record your state.',
        targetNodeId: 'node_save_point_pub'
      }
    ]
  },

  'node_save_point_pub': {
    id: 'node_save_point_pub',
    act: 0,
    actTitle: 'PROLOGUE',
    location: 'The Blind Beggar Pub, Corner Table',
    speaker: 'Narrator',
    speakerVoice: 'star',
    dialogueLines: [
      'A golden star glows upon the damp wood, casting warmth against the dark Victorian pub.',
      'The faint clinking of pint glasses and the distant rumble of the London Underground remind you of home.',
      'Knowing that tonight changes everything, you are filled with DETERMINATION.'
    ],
    hasSavePoint: true,
    determinationQuote: 'The smell of wet wool and bitter ale fills you with DETERMINATION.',
    choices: [
      {
        id: 'c16',
        label: 'Proceed to the blueprint briefing',
        subtext: 'Examine the vault layout.',
        targetNodeId: 'node_briefing_blueprints',
        unlockAchievementId: 'determination'
      }
    ]
  },

  'node_briefing_blueprints': {
    id: 'node_briefing_blueprints',
    act: 0,
    actTitle: 'PROLOGUE',
    location: 'The Blind Beggar Pub, Map Table',
    speaker: 'Arthur "The Fox"',
    speakerRole: 'The Mastermind',
    speakerVoice: 'arthur',
    dialogueLines: [
      'Arthur unrolls a greasy blueprint labeled: "HATTON GARDEN SAFE DEPOSIT LTD - BASEMENT VAULT".',
      '"Here\'s the layout. The building is flanked by high-end diamond merchants.',
      'The front street has CCTV and a night watchman named Higgins. But the rear fire escape over Greville Street is blind.',
      'Below is a fifty-centimeter wall of reinforced steel-mesh concrete. We bore three adjoining holes with a Hilti diamond core drill to step through."'
    ],
    choices: [
      {
        id: 'c17',
        label: '"What about the alarm system on the door?"',
        subtext: 'Address the electronic defenses.',
        targetNodeId: 'node_briefing_alarms',
      },
      {
        id: 'c18',
        label: '"How do we handle the night watchman, Higgins?"',
        subtext: 'Decide our stance on encounters.',
        targetNodeId: 'node_briefing_watchman',
      },
      {
        id: 'c19',
        label: '"Let\'s talk drills and equipment."',
        subtext: 'Equip the necessary burglary tools.',
        targetNodeId: 'node_briefing_equipment',
      }
    ]
  },

  'node_briefing_getaway': {
    id: 'node_briefing_getaway',
    act: 0,
    actTitle: 'PROLOGUE',
    location: 'The Blind Beggar Pub, Corner',
    speaker: 'Dizzy',
    speakerRole: 'The Wheelman',
    speakerVoice: 'dizzy',
    dialogueLines: [
      '"Right, listen up: We\'ve got a white 1992 Ford Transit. False plates: K729 YHV.',
      'Once we bag the gear, we shoot straight down Farringdon Road, hit the Blackfriars underpass, then duck into Rotherhithe Tunnel.',
      'Scotland Yard\'s dispatch takes at least nine minutes to mobilize out of New Scotland Yard. We\'ll be across the river eating fish and chips before they draw their batons."'
    ],
    choices: [
      {
        id: 'c20',
        label: '"Don\'t get cocky, Dizzy. The Met has traffic cameras now."',
        subtext: 'Urge disciplined focus.',
        targetNodeId: 'node_briefing_blueprints',
        suspicionChange: -5
      },
      {
        id: 'c21',
        label: '"Have a second set of plates ready under the seat."',
        subtext: 'Take professional precaution.',
        targetNodeId: 'node_briefing_blueprints',
        givesItem: {
          id: 'item_plates',
          name: 'Forged Number Plates',
          desc: 'Swappable UK plates. Useful for throwing off pursuit.',
          category: 'tool'
        }
      }
    ]
  },

  'node_briefing_timing': {
    id: 'node_briefing_timing',
    act: 0,
    actTitle: 'PROLOGUE',
    location: 'The Blind Beggar Pub, Back Room',
    speaker: 'Arthur "The Fox"',
    speakerRole: 'The Mastermind',
    speakerVoice: 'arthur',
    dialogueLines: [
      '"Timing is our greatest weapon. Good Friday at 9:00 PM, the staff locks up for the bank holiday.',
      'No one returns until Tuesday morning.',
      'We have three whole nights in that basement. But every hour we spend underground increases the chance a telephone alarm pings."'
    ],
    choices: [
      {
        id: 'c22',
        label: '"Then we move in fast and work clean."',
        subtext: 'Commit to the plan.',
        targetNodeId: 'node_briefing_alarms'
      }
    ]
  },

  'node_briefing_alarms': {
    id: 'node_briefing_alarms',
    act: 0,
    actTitle: 'PROLOGUE',
    location: 'The Blind Beggar Pub, Back Snug',
    speaker: 'Big Dave',
    speakerRole: 'The Safecracker',
    speakerVoice: 'dave',
    dialogueLines: [
      '"The alarm is a DualCom line wired straight to the Bishopsgate monitoring desk.',
      'Under the street in Farringdon, there\'s a British Telecom manhole. If we cut the trunk cable, it sends a \'line fault\' instead of a panic trip.',
      'The telecom company won\'t dispatch an engineer on a bank holiday weekend. It leaves the vault deaf and dumb."'
    ],
    choices: [
      {
        id: 'c23',
        label: 'Volunteer to cut the BT cable in the manhole',
        subtext: 'Stealth approach to disable alarms completely.',
        targetNodeId: 'node_act1_manhole',
        crewTrustChange: 10
      },
      {
        id: 'c24',
        label: 'Prefer to bypass the alarm box on-site at the building',
        subtext: 'Infiltrate directly through the back alley.',
        targetNodeId: 'node_act1_back_alley',
        suspicionChange: 5
      }
    ]
  },

  'node_briefing_watchman': {
    id: 'node_briefing_watchman',
    act: 0,
    actTitle: 'PROLOGUE',
    location: 'The Blind Beggar Pub',
    speaker: 'Arthur "The Fox"',
    speakerVoice: 'arthur',
    dialogueLines: [
      '"Constable Higgins. Retired Met copper working security for ninety quid a shift.',
      'He takes his rounds at midnight, then sits in the foyer listening to the football on a transistor radio.',
      'Remember: no hurting him. We are not bloody murderers. A cup of tea or a discreet fifty-pound note will do."'
    ],
    choices: [
      {
        id: 'c25',
        label: '"Understood. We stick to Undertale MERCY rules."',
        subtext: 'Pacifist mindset locked in.',
        targetNodeId: 'node_briefing_equipment',
        karmaChange: 15
      },
      {
        id: 'c26',
        label: '"If he gets in the way, I\'ll tie him to a chair."',
        subtext: 'Pragmatic physical stance.',
        targetNodeId: 'node_briefing_equipment',
        karmaChange: -5
      }
    ]
  },

  'node_briefing_equipment': {
    id: 'node_briefing_equipment',
    act: 0,
    actTitle: 'PROLOGUE',
    location: 'The Blind Beggar Pub, Equipment Crate',
    speaker: 'Big Dave',
    speakerVoice: 'dave',
    dialogueLines: [
      '"In the boot of the van, we\'ve got the gear:',
      '- A Hilti DD-EC1 diamond-core coring rig.',
      '- Hydraulic spreaders and angle grinders.',
      '- Heavy steel crowbars, dust masks, and three gallon jugs of cooling water.',
      'Pick your personal tool for the descent."'
    ],
    choices: [
      {
        id: 'c27',
        label: 'Take the Heavy Carbon-Steel Crowbar',
        subtext: 'Standard burglar\'s companion (+5 ATK in encounters).',
        targetNodeId: 'node_act1_journey',
        givesItem: {
          id: 'item_crowbar',
          name: 'Carbon-Steel Crowbar',
          desc: 'Heavy pry bar. Breaks locks and deals solid damage.',
          category: 'tool'
        }
      },
      {
        id: 'c28',
        label: 'Take the Lockpick & Feeler Gauge Set',
        subtext: 'Precision tool for silent entry.',
        targetNodeId: 'node_act1_journey',
        givesItem: {
          id: 'item_lockpicks',
          name: 'Master Lockpick Kit',
          desc: 'Tension wrenches and diamond rakes. Enables silent lockpicking.',
          category: 'tool'
        }
      },
      {
        id: 'c29',
        label: 'Take the Box of Cornish Pasties & Flask',
        subtext: 'Sustenance for the long underground hours.',
        targetNodeId: 'node_act1_journey',
        givesItem: {
          id: 'item_pasty',
          name: 'Warm Cornish Pasty',
          desc: 'Savory steak and potato pasty. Restores 30 HP in battle.',
          category: 'food',
          heal: 30
        }
      }
    ]
  },

  // ==========================================
  // ACT 1: CASING & INFILTRATION
  // ==========================================
  'node_act1_journey': {
    id: 'node_act1_journey',
    act: 1,
    actTitle: 'ACT I: THE MIDNIGHT RAIN',
    location: 'Aboard the White Transit Van, Farringdon',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      'The wiper blades scrape rhythmically across the fogged windshield: squeak... thud... squeak...',
      'London outside is a maze of wet black tarmac, yellow sodium streetlamps, and distant Big Ben chimes.',
      'Dizzy kills the headlights as the van rolls into an alleyway beside 88 Hatton Garden.',
      'The engine sputters silent. It is 10:14 PM. The job begins.'
    ],
    cutsceneImage: STORY_IMAGES.cover,
    choices: [
      {
        id: 'c30',
        label: 'Climb out into the rain and check the fire escape',
        subtext: 'Infiltrate from above.',
        targetNodeId: 'node_act1_fire_escape',
        suspicionChange: 5
      },
      {
        id: 'c31',
        label: 'Slip into the basement cellar grating from the side',
        subtext: 'Direct subterranean entry.',
        targetNodeId: 'node_act1_grating',
        crewTrustChange: 5
      },
      {
        id: 'c32',
        label: 'Check the manhole to silence the BT alarms first',
        subtext: 'Ensure the perimeter communication is dead.',
        targetNodeId: 'node_act1_manhole',
      }
    ]
  },

  'node_act1_manhole': {
    id: 'node_act1_manhole',
    act: 1,
    actTitle: 'ACT I: THE MIDNIGHT RAIN',
    location: 'Farringdon Street Manhole Cover',
    speaker: 'Arthur "The Fox"',
    speakerVoice: 'arthur',
    dialogueLines: [
      'Rain drips through the cast-iron rim as you lever open the heavy street manhole.',
      'Below is a thick bundle of thousands of copper lines carrying the alarm relays of every jeweler in Holborn.',
      '"Snip the braided yellow-and-black conduit," Arthur whispers through the rain.',
      'Your shears hover over the cables. One wrong cut could summon every squad car in Camden.'
    ],
    choices: [
      {
        id: 'c33',
        label: 'Carefully snip the yellow-and-black line with precision',
        subtext: 'Surgical cut. Disables alarms.',
        targetNodeId: 'node_act1_cable_success',
        unlockAchievementId: 'stealth_rat',
        suspicionChange: -15
      },
      {
        id: 'c34',
        label: 'Cut the entire master bundle to be safe',
        subtext: 'Cuts everything, but might trigger a local telephone outage.',
        targetNodeId: 'node_act1_cable_brute',
        suspicionChange: 15
      }
    ]
  },

  'node_act1_cable_success': {
    id: 'node_act1_cable_success',
    act: 1,
    actTitle: 'ACT I: THE MIDNIGHT RAIN',
    location: 'Farringdon Street',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      'SNIP.',
      'A quiet pop. Across the street, the tiny red indicator light above the jeweler\'s intercom blinks once, then goes totally dark.',
      'The alarms are dead. The Hatton Garden safe deposit box building is an island cut off from the world.',
      'You climb out into the rain and pull the manhole cover flush.'
    ],
    choices: [
      {
        id: 'c35',
        label: 'Regroup with the crew at the rear fire doors',
        subtext: 'Proceed to entry point.',
        targetNodeId: 'node_act1_lift_shaft'
      }
    ]
  },

  'node_act1_cable_brute': {
    id: 'node_act1_cable_brute',
    act: 1,
    actTitle: 'ACT I: THE MIDNIGHT RAIN',
    location: 'Farringdon Street',
    speaker: 'Arthur "The Fox"',
    speakerVoice: 'arthur',
    dialogueLines: [
      'CHOP! Sparks shower inside the damp conduit.',
      '"Bloody hell!" Arthur hisses. "You just severed the phone lines to the pub down the road as well!"',
      'A distant siren wails three avenues away, then turns south. That was too close.'
    ],
    choices: [
      {
        id: 'c36',
        label: 'Scramble into the shadows before anyone spots you',
        subtext: 'Rush inside the building.',
        targetNodeId: 'node_act1_lift_shaft',
        suspicionChange: 10
      }
    ]
  },

  'node_act1_fire_escape': {
    id: 'node_act1_fire_escape',
    act: 1,
    actTitle: 'ACT I: THE MIDNIGHT RAIN',
    location: 'Greville Street Fire Escape',
    speaker: 'Big Dave',
    speakerVoice: 'dave',
    dialogueLines: [
      'The iron fire escape stairs groan under Dave\'s massive frame.',
      'You jimmy the second-story sash window using your tools. Inside, the dark office smells of old paper and stale coffee.',
      'Ahead is the central elevator shaft. The lift car is currently parked at the top floor.'
    ],
    choices: [
      {
        id: 'c37',
        label: 'Peer down into the open lift shaft',
        subtext: 'The 30-foot drop leads straight to the vault basement.',
        targetNodeId: 'node_act1_lift_shaft'
      }
    ]
  },

  'node_act1_grating': {
    id: 'node_act1_grating',
    act: 1,
    actTitle: 'ACT I: THE MIDNIGHT RAIN',
    location: 'Hatton Garden Alleyway Cellar',
    speaker: 'Dizzy',
    speakerVoice: 'dizzy',
    dialogueLines: [
      'You slide beneath the iron pavement grating. Heavy rain filters through the metal slats, soaking your shoulders.',
      'Suddenly, heavy footsteps splash in the puddle just above your head.',
      'A flashlight beam sweeps across the alley. It\'s Constable Higgins on his midnight rounds!'
    ],
    choices: [
      {
        id: 'c38',
        label: 'Hold your breath and stay motionless in the shadows',
        subtext: 'Undertale stealth test.',
        targetNodeId: 'node_act1_higgins_stealth',
        suspicionChange: -5
      },
      {
        id: 'c39',
        label: 'Step out and engage Higgins before he raises an alarm!',
        subtext: 'Triggers the classic Undertale battle encounter!',
        targetNodeId: 'node_act1_higgins_battle'
      }
    ]
  },

  'node_act1_higgins_stealth': {
    id: 'node_act1_higgins_stealth',
    act: 1,
    actTitle: 'ACT I: THE MIDNIGHT RAIN',
    location: 'Basement Grating',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      'You press your back flat against the cold Victorian brickwork.',
      'Constable Higgins stops right above you, shakes his wet umbrella, murmurs "Bloody London weather," and turns toward the high street.',
      'You exhale a trembling breath of white steam. The way is clear.'
    ],
    choices: [
      {
        id: 'c40',
        label: 'Slip down into the elevator shaft',
        subtext: 'Meet Arthur and Dave at the basement approach.',
        targetNodeId: 'node_act1_lift_shaft'
      }
    ]
  },

  'node_act1_higgins_battle': {
    id: 'node_act1_higgins_battle',
    act: 1,
    actTitle: 'ACT I: ENCOUNTER',
    location: 'Greville Street Alleyway',
    speaker: 'Constable Higgins',
    speakerVoice: 'police',
    dialogueLines: [
      '"Oi! What you lot doing round the back of the deposit boxes at midnight?!"',
      'The Constable unsheathes his wooden truncheon and shines his torch into your face!',
      'Your red SOUL leaps into the fray!'
    ],
    battleEncounterId: 'enemy_higgins',
    choices: [
      {
        id: 'c41',
        label: 'Engage Constable Higgins [ENTER BATTLE]',
        subtext: 'Use ACT, FIGHT, ITEM or MERCY in the Undertale arena.',
        targetNodeId: 'node_act1_post_higgins'
      }
    ]
  },

  'node_act1_post_higgins': {
    id: 'node_act1_post_higgins',
    act: 1,
    actTitle: 'ACT I: THE DESCENT',
    location: 'Hatton Garden Elevator Shaft',
    speaker: 'Arthur "The Fox"',
    speakerVoice: 'arthur',
    dialogueLines: [
      '"That was a close shave. Now hurry—into the lift shaft before any more bobbies turn up."',
      'Arthur ties a thick climbing rope around the elevator pulley cables.',
      'Looking down, thirty feet below, the black pit descends into the subterranean vault level.'
    ],
    choices: [
      {
        id: 'c42',
        label: 'Abseil down the elevator shaft rope first',
        subtext: 'Lead the way into the abyss.',
        targetNodeId: 'node_act2_vault_outer',
        crewTrustChange: 10
      },
      {
        id: 'c43',
        label: 'Save at the glowing star nestled in the elevator motor',
        subtext: 'A star shines warmly between the steel cables.',
        targetNodeId: 'node_save_point_lift'
      }
    ]
  },

  'node_act1_lift_shaft': {
    id: 'node_act1_lift_shaft',
    act: 1,
    actTitle: 'ACT I: THE DESCENT',
    location: 'Hatton Garden Elevator Shaft',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      'The crew gathers at the elevator doors on the second floor.',
      'Big Dave uses a pry bar to slide the inner elevator car gates open with a low screech.',
      'The empty shaft yawns beneath your boots. Cool, damp air smells of ozone, diesel oil, and fifty years of secrets.',
      'A yellow star sparkles on the elevator pulley housing.'
    ],
    hasSavePoint: true,
    determinationQuote: 'Looking down into the thirty-foot dark shaft, you are filled with DETERMINATION.',
    choices: [
      {
        id: 'c44',
        label: 'Abseil down into the subterranean basement',
        subtext: 'Begin Act II: The Vault Approach.',
        targetNodeId: 'node_act2_vault_outer',
        unlockAchievementId: 'determination'
      }
    ]
  },

  'node_save_point_lift': {
    id: 'node_save_point_lift',
    act: 1,
    actTitle: 'ACT I: THE DESCENT',
    location: 'Elevator Pulley Housing',
    speaker: 'Narrator',
    speakerVoice: 'star',
    dialogueLines: [
      'The glowing star hums with quiet power amidst the greasy gears.',
      'Above, the London rain patters against the skylight. Below, millions in diamonds await in silence.',
      'You are filled with DETERMINATION.'
    ],
    hasSavePoint: true,
    determinationQuote: 'The cold steel cable in your hands fills you with DETERMINATION.',
    choices: [
      {
        id: 'c45',
        label: 'Descend to the vault basement',
        subtext: 'Climb down into the vault corridor.',
        targetNodeId: 'node_act2_vault_outer'
      }
    ]
  },

  // ==========================================
  // ACT 2: THE CONCRETE VAULT & THE DRILL
  // ==========================================
  'node_act2_vault_outer': {
    id: 'node_act2_vault_outer',
    act: 2,
    actTitle: 'ACT II: THE FORTRESS BENEATH',
    location: 'Sub-Basement Vault Chamber',
    speaker: 'Big Dave',
    speakerVoice: 'dave',
    dialogueLines: [
      'Your boots hit the concrete floor with a soft slap.',
      'You stand before the legendary Chubb vault door. It is five hundred millimeters of solid hardened manganese steel.',
      '"We don\'t touch the door," Dave whispers, tapping the adjacent wall. "We go through the concrete cheek beside it."',
      'Arthur unpacks the massive Hilti DD-EC1 diamond-tipped coring drill. It weighs seventy pounds and gleams like a weapon.'
    ],
    cutsceneImage: STORY_IMAGES.vault,
    choices: [
      {
        id: 'c46',
        label: 'Bolt the Hilti drill rig into the concrete wall',
        subtext: 'Begin the drilling process.',
        targetNodeId: 'node_act2_drilling_start',
        crewTrustChange: 5
      },
      {
        id: 'c47',
        label: 'Inspect the perimeter for seismic motion sensors first',
        subtext: 'Check for vibration traps.',
        targetNodeId: 'node_act2_sensors',
        suspicionChange: -10
      },
      {
        id: 'c48',
        label: 'Crack open a pasty and share with the crew to keep spirits high',
        subtext: 'Boost party morale before the grueling work.',
        targetNodeId: 'node_act2_crew_snack',
        crewTrustChange: 15,
        karmaChange: 5
      }
    ]
  },

  'node_act2_sensors': {
    id: 'node_act2_sensors',
    act: 2,
    actTitle: 'ACT II: THE FORTRESS BENEATH',
    location: 'Vault Corridor',
    speaker: 'Arthur "The Fox"',
    speakerVoice: 'arthur',
    dialogueLines: [
      'Your flashlight catches two tiny glass lenses mounted near the ceiling: seismic geophones.',
      '"Sharp eyes, son," Arthur mutters, pulling a roll of heavy acoustic insulating tape from his satchel.',
      'Carefully, you tape thick foam over the sensors. Any vibrations from the drill will now be muffled by eighty percent.'
    ],
    choices: [
      {
        id: 'c49',
        label: 'Mount the Hilti drill and begin coring',
        subtext: 'Proceed safely with dampened vibration.',
        targetNodeId: 'node_act2_drilling_start'
      }
    ]
  },

  'node_act2_crew_snack': {
    id: 'node_act2_crew_snack',
    act: 2,
    actTitle: 'ACT II: THE FORTRESS BENEATH',
    location: 'Vault Outer Chamber',
    speaker: 'Big Dave',
    speakerVoice: 'dave',
    dialogueLines: [
      'You break the pasty in half and pass a chunk to Dave and Arthur.',
      '"You\'re a good lad," Dave smiles, chewing the flaky crust. "My old man always said: a crew that eats together won\'t grass each other."',
      'The camaraderie warms the chilled damp basement.'
    ],
    choices: [
      {
        id: 'c50',
        label: 'Mount the drill and get to work',
        subtext: 'Start drilling the vault breach.',
        targetNodeId: 'node_act2_drilling_start'
      }
    ]
  },

  'node_act2_drilling_start': {
    id: 'node_act2_drilling_start',
    act: 2,
    actTitle: 'ACT II: THE DRILL SPINS',
    location: 'Vault Wall Breach Point',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      'WHUUUUUUUURRRRRRRRRRRR!',
      'The electric motor screams to life! Diamond-studded teeth bite into fifty centimeters of high-density aggregate concrete.',
      'Grey slurry and white steam pour down the wall as Big Dave pumps cooling water through the hose.',
      'First hole complete. Second hole overlapping. The wall is crumbling into an oval portal.'
    ],
    choices: [
      {
        id: 'c51',
        label: 'Drive the hydraulic ram into the concrete core to push it in!',
        subtext: 'Force the 2-ton concrete slug through.',
        targetNodeId: 'node_act2_slug_push',
        unlockAchievementId: 'heavy_metal'
      },
      {
        id: 'c52',
        label: 'The drill motor is overheating! Let it cool for 10 minutes.',
        subtext: 'Play it safe to avoid burning out the motor armature.',
        targetNodeId: 'node_act2_drill_cooldown',
        suspicionChange: 5
      }
    ]
  },

  'node_act2_drill_cooldown': {
    id: 'node_act2_drill_cooldown',
    act: 2,
    actTitle: 'ACT II: THE DRILL SPINS',
    location: 'Vault Wall',
    speaker: 'Arthur "The Fox"',
    speakerVoice: 'arthur',
    dialogueLines: [
      'The metal housing glows dull cherry red in the gloom.',
      'Arthur pours cold water over the gearbox. Steam hisses loudly against the low ceiling.',
      '"Ten minutes lost... but the motor survived. Now give it everything you\'ve got!"'
    ],
    choices: [
      {
        id: 'c53',
        label: 'Ram the concrete slug through!',
        subtext: 'Break into the vault interior.',
        targetNodeId: 'node_act2_slug_push',
        unlockAchievementId: 'heavy_metal'
      }
    ]
  },

  'node_act2_slug_push': {
    id: 'node_act2_slug_push',
    act: 2,
    actTitle: 'ACT II: THE BREACH',
    location: 'Hatton Garden Vault Interior',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      'CRRRRRUUUUNCH!',
      'The concrete plug collapses inward with a heavy, muffled thud, tumbling onto the rubber floor of the vault.',
      'Through the fifty-centimeter hole, your torch beam illuminates a sight out of Ali Baba\'s cave.',
      'Wall-to-wall security deposit boxes. Row upon row of brass keyholes and steel lockers.'
    ],
    cutsceneImage: STORY_IMAGES.vault,
    choices: [
      {
        id: 'c54',
        label: 'Squeeze through the hole into the vault interior',
        subtext: 'Step inside the inner sanctum.',
        targetNodeId: 'node_act3_vault_interior',
        crewTrustChange: 10
      },
      {
        id: 'c55',
        label: 'Save at the glowing star that manifested on a safe deposit box',
        subtext: 'A brilliant star shines in the vault.',
        targetNodeId: 'node_save_point_vault'
      }
    ]
  },

  'node_save_point_vault': {
    id: 'node_save_point_vault',
    act: 2,
    actTitle: 'ACT II: THE BREACH',
    location: 'Inside The Vault',
    speaker: 'Narrator',
    speakerVoice: 'star',
    dialogueLines: [
      'A golden star glows upon box #149, illuminating the glitter of dust and uncut stones.',
      'Standing inside the most secure vault in Europe, your pulse races with unbelievable power.',
      'You are filled with DETERMINATION.'
    ],
    hasSavePoint: true,
    determinationQuote: 'The golden gleam of uncounted fortune fills you with DETERMINATION.',
    choices: [
      {
        id: 'c56',
        label: 'Begin prying open the safe deposit boxes',
        subtext: 'Enter Act III: The Riches of London.',
        targetNodeId: 'node_act3_vault_interior'
      }
    ]
  },

  // ==========================================
  // ACT 3: THE SPOILS & THE MORAL FORK
  // ==========================================
  'node_act3_vault_interior': {
    id: 'node_act3_vault_interior',
    act: 3,
    actTitle: 'ACT III: THE RICHES OF LONDON',
    location: 'Inside Hatton Garden Vault',
    speaker: 'Arthur "The Fox"',
    speakerVoice: 'arthur',
    dialogueLines: [
      'Arthur squeezes his wiry frame through the hole and stands up, trembling slightly.',
      '"Lord Almighty... Look at it."',
      'Crowbars in hand, the crew begins popping the brass locker doors: POP! CLANG! POP!',
      'What section do you prioritize cracking first?'
    ],
    choices: [
      {
        id: 'c57',
        label: 'Section A: The Diamond Merchant Lockers (Raw gems & diamonds)',
        subtext: 'High value, portable, impossible to trace.',
        targetNodeId: 'node_act3_diamonds',
        lootChange: 4500000,
        unlockAchievementId: 'king_loot'
      },
      {
        id: 'c58',
        label: 'Section B: The Foreign Exchange Caches (Cash bundles in USD & Sterling)',
        subtext: 'Instant spendable currency.',
        targetNodeId: 'node_act3_cash',
        lootChange: 3200000
      },
      {
        id: 'c59',
        label: 'Section C: Personal Heirloom Boxes (Watches, diaries, gold rings)',
        subtext: 'Sentimental treasures of London families.',
        targetNodeId: 'node_act3_heirlooms',
        karmaChange: -10,
        lootChange: 1800000
      },
      {
        id: 'c60',
        label: 'Box #73: A faded leather-bound notebook marked "CONFIDENTIAL"',
        subtext: 'Curious document detailing corruption in the Met Police.',
        targetNodeId: 'node_act3_blackmail',
        karmaChange: 10
      }
    ]
  },

  'node_act3_diamonds': {
    id: 'node_act3_diamonds',
    act: 3,
    actTitle: 'ACT III: THE RICHES OF LONDON',
    location: 'Vault Locker 42',
    speaker: 'Dizzy',
    speakerVoice: 'dizzy',
    dialogueLines: [
      'Velvet trays slide out into your gloved hands. Hundreds of raw, brilliant-cut diamonds catch the halogen work light!',
      '"Look at the size of that rock! That\'s a ten-carat pear cut!" Dizzy gasps, stuffing handfuls into a canvas holdall.',
      'The weight of pure wealth feels cold against your fingers.'
    ],
    choices: [
      {
        id: 'c61',
        label: 'Pack only the flawless stones to travel light and fast',
        subtext: 'Efficiency preserves escape speed.',
        targetNodeId: 'node_act3_alarm_tripped',
        suspicionChange: -5
      },
      {
        id: 'c62',
        label: 'Grab every single jewel and ring in sight, filling four holdalls',
        subtext: 'Maximum greed increases encumbrance.',
        targetNodeId: 'node_act3_alarm_tripped',
        lootChange: 2000000,
        suspicionChange: 15
      }
    ]
  },

  'node_act3_cash': {
    id: 'node_act3_cash',
    act: 3,
    actTitle: 'ACT III: THE RICHES OF LONDON',
    location: 'Vault Locker 88',
    speaker: 'Big Dave',
    speakerVoice: 'dave',
    dialogueLines: [
      'Brick after brick of crisp, uncirculated Bank of England £50 notes wrapped in purple paper bands.',
      '"This is retirement, son. Real money you don\'t have to fence at forty percent discount."',
      'Dave stacks ten bricks into your duffel bag.'
    ],
    choices: [
      {
        id: 'c63',
        label: 'Secure the cash and check the time',
        subtext: 'Stay on schedule.',
        targetNodeId: 'node_act3_alarm_tripped'
      }
    ]
  },

  'node_act3_heirlooms': {
    id: 'node_act3_heirlooms',
    act: 3,
    actTitle: 'ACT III: THE RICHES OF LONDON',
    location: 'Vault Locker 112',
    speaker: 'Arthur "The Fox"',
    speakerVoice: 'arthur',
    dialogueLines: [
      'You open a silver locket with a photograph of a young bride in post-war London, 1948.',
      'Arthur catches your eye. His voice softens into a whisper.',
      '"We take the stones from the cartels and banks, mate. But family heirlooms... that\'s someone\'s grandmother."',
      'He watches what you do next with keen moral judgment.'
    ],
    choices: [
      {
        id: 'c64',
        label: 'Leave the personal locket and wedding rings in the box [MERCY]',
        subtext: 'Arthur\'s respect for you deepens profoundly.',
        targetNodeId: 'node_act3_alarm_tripped',
        karmaChange: 20,
        crewTrustChange: 15
      },
      {
        id: 'c65',
        label: 'Shove it all into the sack. Gold is gold [RUTHLESS]',
        subtext: 'Cold pragmatic theft.',
        targetNodeId: 'node_act3_alarm_tripped',
        karmaChange: -20,
        lootChange: 500000
      }
    ]
  },

  'node_act3_blackmail': {
    id: 'node_act3_blackmail',
    act: 3,
    actTitle: 'ACT III: THE RICHES OF LONDON',
    location: 'Vault Locker 73',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      'The notebook contains handwritten ledger entries: payments to high-ranking detectives in the Flying Squad, signed by "Commander V".',
      'This isn\'t just money. This is insurance. If the law ever closes in, this book holds the truth about Scotland Yard.'
    ],
    choices: [
      {
        id: 'c66',
        label: 'Tuck the black ledger inside your leather coat',
        subtext: 'Acquire crucial story asset.',
        targetNodeId: 'node_act3_alarm_tripped',
        givesItem: {
          id: 'item_ledger',
          name: 'The Black Ledger',
          desc: 'Names, dates, and bribes paid to Scotland Yard brass. Powerful leverage.',
          category: 'valuable'
        }
      }
    ]
  },

  'node_act3_alarm_tripped': {
    id: 'node_act3_alarm_tripped',
    act: 3,
    actTitle: 'ACT III: THE ALARM',
    location: 'Vault Corridor',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      'BZZZZZZZT! BZZZZZZT!',
      'An auxiliary backup silent radio relay—independent of the severed telecom lines—suddenly flashes red near the ceiling.',
      '"Bloody hell!" Arthur gasps. "Cellular backup relay! They know someone is in the vault!"',
      'In the panic to climb out through the concrete hole, a heavy steel shelving rack topples over with a thunderous CRASH!'
    ],
    choices: [
      {
        id: 'c67',
        label: 'Rush to the hole to pull Big Dave out from under the collapsed steel rack!',
        subtext: 'Risk capture to save your friend.',
        targetNodeId: 'node_act3_rescue_dave',
        unlockAchievementId: 'crew_brotherhood',
        crewTrustChange: 25,
        karmaChange: 15
      },
      {
        id: 'c68',
        label: 'Grab the heavy diamond bags and scramble out first',
        subtext: 'Prioritize the loot above all else.',
        targetNodeId: 'node_act3_leave_dave',
        crewTrustChange: -30,
        karmaChange: -25,
        suspicionChange: 10
      }
    ]
  },

  'node_act3_rescue_dave': {
    id: 'node_act3_rescue_dave',
    act: 3,
    actTitle: 'ACT III: THE RESCUE',
    location: 'Vault Floor',
    speaker: 'Big Dave',
    speakerVoice: 'dave',
    dialogueLines: [
      'Dave is pinned under half a ton of steel shelving, clutching his bruised leg.',
      '"Leave me, mate! Save yourself and the swag!"',
      'You plant your boots, dig your crowbar under the rack, and heave with all your might!',
      'The steel groans. With Arthur\'s help, you drag Dave free! He limps, but he\'s on his feet.'
    ],
    choices: [
      {
        id: 'c69',
        label: 'Support Dave\'s shoulder and haul him up the elevator rope',
        subtext: 'Begin the getaway together.',
        targetNodeId: 'node_act4_chase_start'
      }
    ]
  },

  'node_act3_leave_dave': {
    id: 'node_act3_leave_dave',
    act: 3,
    actTitle: 'ACT III: THE BETRAYAL',
    location: 'Elevator Shaft',
    speaker: 'Arthur "The Fox"',
    speakerVoice: 'arthur',
    dialogueLines: [
      'Arthur shoves you against the shaft wall, his eyes blazing with fury.',
      '"You cold-blooded bastard! We don\'t leave our own!"',
      'Arthur drops back down into the pit alone, straining his aging back to wrench Dave free while you stand holding the loot bags.',
      'A bitter silence hangs between you.'
    ],
    choices: [
      {
        id: 'c70',
        label: 'Scramble up to the getaway van in shameful silence',
        subtext: 'Begin Act IV: The Pursuit.',
        targetNodeId: 'node_act4_chase_start'
      }
    ]
  },

  // ==========================================
  // ACT 4: THE FLYING SQUAD PURSUIT
  // ==========================================
  'node_act4_chase_start': {
    id: 'node_act4_chase_start',
    act: 4,
    actTitle: 'ACT IV: SIREN SYMPHONY',
    location: 'Alleyway Behind Hatton Garden',
    speaker: 'Dizzy',
    speakerVoice: 'dizzy',
    dialogueLines: [
      'WEEE-WOOO! WEEE-WOOO! WEEE-WOOO!',
      'Blue flashing lights reflect off the rain-slicked shopfronts of Holborn.',
      'Dizzy revs the Transit van engine until the exhaust spits black smoke: "GET IN! THEY\'VE LOCKED DOWN THE BRIDGES!"',
      'You throw the bags in the back and slam the sliding door. The tyres scream as the van shoots into the rain!'
    ],
    cutsceneImage: STORY_IMAGES.cover,
    choices: [
      {
        id: 'c71',
        label: '"Take the Rotherhithe Tunnel! The low ceiling blocks their pursuit 4x4s!"',
        subtext: 'High-risk subterranean sprint.',
        targetNodeId: 'node_act4_tunnel',
        unlockAchievementId: 'speed_demon'
      },
      {
        id: 'c72',
        label: '"Blast straight across Blackfriars Bridge into South London!"',
        subtext: 'Broad bridge run, exposed to roadblock.',
        targetNodeId: 'node_act4_bridge'
      },
      {
        id: 'c73',
        label: '"Cut through the Smithfield Meat Market alleyways!"',
        subtext: 'Tight labyrinth maneuvers.',
        targetNodeId: 'node_act4_market'
      }
    ]
  },

  'node_act4_tunnel': {
    id: 'node_act4_tunnel',
    act: 4,
    actTitle: 'ACT IV: SIREN SYMPHONY',
    location: 'Rotherhithe Tunnel, River Thames',
    speaker: 'Dizzy',
    speakerVoice: 'dizzy',
    dialogueLines: [
      'The van plunges into the narrow tiled bore of the Rotherhithe Tunnel.',
      'Echoes of revving engines and howling two-tone sirens bounce off the curved white tiles like gunshots.',
      'A blue Rover SD1 Flying Squad cruiser pulls up alongside, its bullhorn roaring: "PULL OVER IMMEDIATELY!"'
    ],
    choices: [
      {
        id: 'c74',
        label: 'Throw an oil can and road flares out the rear doors [ACT]',
        subtext: 'Blind their pursuit without lethal harm.',
        targetNodeId: 'node_act4_tunnel_escape',
        crewTrustChange: 5,
        karmaChange: 5
      },
      {
        id: 'c75',
        label: '"Ram them into the tunnel curb, Dizzy! Hard left!" [RUTHLESS]',
        subtext: 'Brutal smash into the wall.',
        targetNodeId: 'node_act4_tunnel_ram',
        karmaChange: -15,
        suspicionChange: 15
      }
    ]
  },

  'node_act4_tunnel_escape': {
    id: 'node_act4_tunnel_escape',
    act: 4,
    actTitle: 'ACT IV: SIREN SYMPHONY',
    location: 'South Exit of Rotherhithe Tunnel',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      'The red smoke and oil slick send the police Rover into a sweeping three-sixty skid!',
      'It taps the tunnel kerb and stalls harmlessly, blocking the two patrol cars behind it.',
      'Your van bursts out into the wet Surrey Docks under the midnight drizzle. The siren wails fade into the foggy night.'
    ],
    choices: [
      {
        id: 'c76',
        label: 'Head toward the Bermondsey industrial safehouse',
        subtext: 'Lie low and count the haul.',
        targetNodeId: 'node_act5_safehouse'
      }
    ]
  },

  'node_act4_tunnel_ram': {
    id: 'node_act4_tunnel_ram',
    act: 4,
    actTitle: 'ACT IV: SIREN SYMPHONY',
    location: 'Rotherhithe Tunnel',
    speaker: 'Arthur "The Fox"',
    speakerVoice: 'arthur',
    dialogueLines: [
      'CRASH! Metal crumples violently. The police cruiser ricochets against the tiled tunnel arch with a shower of sparks.',
      'Arthur holds his head in his hands: "Madness... pure madness. Now Scotland Yard will hunt us with dogs."'
    ],
    choices: [
      {
        id: 'c77',
        label: 'Speed away into the Bermondsey darkness',
        subtext: 'Reach the hideout with high suspicion.',
        targetNodeId: 'node_act5_safehouse',
        suspicionChange: 20
      }
    ]
  },

  'node_act4_bridge': {
    id: 'node_act4_bridge',
    act: 4,
    actTitle: 'ACT IV: SIREN SYMPHONY',
    location: 'Blackfriars Bridge',
    speaker: 'Dizzy',
    speakerVoice: 'dizzy',
    dialogueLines: [
      'The black Thames waters churn forty feet below.',
      'Ahead, two police vans form a barricade across the southern lane!',
      '"Hold onto your teeth!" Dizzy screams, hopping the kerb and mounting the pedestrian footpath!',
      'The van squeezes past the bollards with inches to spare, spraying river water everywhere!'
    ],
    choices: [
      {
        id: 'c78',
        label: 'Duck into the maze of Bermondsey railway arches',
        subtext: 'Lose the trail under the railway bridges.',
        targetNodeId: 'node_act5_safehouse'
      }
    ]
  },

  'node_act4_market': {
    id: 'node_act4_market',
    act: 4,
    actTitle: 'ACT IV: SIREN SYMPHONY',
    location: 'Smithfield Market',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      'Dizzy whips the wheel through the narrow loading bays of the Victorian meat market.',
      'Forklifts, wooden pallets, and hanging sides of beef flash past the windows.',
      'The trailing squad cars get wedged between two meat delivery lorries, horn blaring in vain.',
      'Clean getaway.'
    ],
    choices: [
      {
        id: 'c79',
        label: 'Make for the safehouse south of the river',
        subtext: 'Proceed to Act V.',
        targetNodeId: 'node_act5_safehouse'
      }
    ]
  },

  // ==========================================
  // ACT 5: THE SAFEHOUSE & THE MOLE
  // ==========================================
  'node_act5_safehouse': {
    id: 'node_act5_safehouse',
    act: 5,
    actTitle: 'ACT V: THE SHADOW OF DOUBT',
    location: 'Abandoned Tannery, Bermondsey',
    speaker: 'Arthur "The Fox"',
    speakerVoice: 'arthur',
    dialogueLines: [
      'Rain drums incessantly on the corrugated tin roof of the old warehouse.',
      'A single bare bulb swings from a yellow cord over an iron workbench.',
      'The duffle bags are dumped out. Diamonds, bundles of fifty-pound notes, and foreign gold bars spill across the table.',
      'Fourteen million pounds. But nobody is smiling.'
    ],
    choices: [
      {
        id: 'c80',
        label: 'Tune the portable transistor radio to the police band',
        subtext: 'Check Scotland Yard dispatch chatter.',
        targetNodeId: 'node_act5_radio',
        crewTrustChange: 5
      },
      {
        id: 'c81',
        label: 'Inspect the equipment bags for tracking devices',
        subtext: 'Search for bugs or homing beacons.',
        targetNodeId: 'node_act5_search_bugs',
        unlockAchievementId: 'mole_unmasked'
      },
      {
        id: 'c82',
        label: 'Touch the glowing yellow star resting near the kettle',
        subtext: 'A comforting star glows among the tools.',
        targetNodeId: 'node_save_point_safehouse'
      }
    ]
  },

  'node_save_point_safehouse': {
    id: 'node_save_point_safehouse',
    act: 5,
    actTitle: 'ACT V: THE SHADOW OF DOUBT',
    location: 'Bermondsey Safehouse Workbench',
    speaker: 'Narrator',
    speakerVoice: 'star',
    dialogueLines: [
      'The star pulses with melancholy golden warmth against the shadows of the warehouse.',
      'You can smell the Thames mud and the cold tea. Fourteen million pounds sits before you, yet your chest aches.',
      'You are filled with DETERMINATION.'
    ],
    hasSavePoint: true,
    determinationQuote: 'The silence between four men with fourteen million pounds fills you with DETERMINATION.',
    choices: [
      {
        id: 'c83',
        label: 'Return to the workbench',
        subtext: 'Face the mounting tension.',
        targetNodeId: 'node_act5_safehouse'
      }
    ]
  },

  'node_act5_radio': {
    id: 'node_act5_radio',
    act: 5,
    actTitle: 'ACT V: THE SHADOW OF DOUBT',
    location: 'Bermondsey Safehouse',
    speaker: 'Narrator',
    speakerVoice: 'phone',
    dialogueLines: [
      'STATIC... CRACKLE...',
      '"All units, all units. Flying Squad intelligence reports the suspects are holed up in Sector 4, Bermondsey.',
      'Search warrants issued. Armed Tactical Support Group moving into position at first light."',
      'Arthur\'s face drains of all color. "How do they know we\'re in Bermondsey? Only four people in the entire world knew this address."'
    ],
    choices: [
      {
        id: 'c84',
        label: 'Search everyone\'s belongings immediately',
        subtext: 'Find the source of the leak.',
        targetNodeId: 'node_act5_search_bugs'
      }
    ]
  },

  'node_act5_search_bugs': {
    id: 'node_act5_search_bugs',
    act: 5,
    actTitle: 'ACT V: THE SHADOW OF DOUBT',
    location: 'Bermondsey Safehouse',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      'You tear open the lining of the spare tool roll.',
      'There, soldered neatly into the base of a torch battery, is a miniature Home Office radio beacon blinking a faint red dot.',
      'Dizzy steps back against the wall, trembling. Big Dave looks heartbroken.',
      'Arthur stands motionless: "Dizzy... where did you get that torch?"'
    ],
    choices: [
      {
        id: 'c85',
        label: 'Listen to Dizzy\'s explanation before anyone acts',
        subtext: 'Undertale MERCY approach.',
        targetNodeId: 'node_act5_dizzy_truth',
        karmaChange: 15,
        crewTrustChange: 10
      },
      {
        id: 'c86',
        label: 'Smash the bug with your crowbar and yell at Dizzy',
        subtext: 'Furious reaction.',
        targetNodeId: 'node_act5_dizzy_blame',
        karmaChange: -10,
        crewTrustChange: -10
      }
    ]
  },

  'node_act5_dizzy_truth': {
    id: 'node_act5_dizzy_truth',
    act: 5,
    actTitle: 'ACT V: THE SHADOW OF DOUBT',
    location: 'Bermondsey Safehouse',
    speaker: 'Dizzy',
    speakerVoice: 'dizzy',
    dialogueLines: [
      'Tears stream down Dizzy\'s dirty cheeks.',
      '"I didn\'t know! I swear on my mum\'s grave! Two coppers pinched me last week over an old joyriding charge.',
      'They gave me five hundred quid and that torch... told me it was just an inspection lamp or they\'d send my brother down!',
      'I didn\'t know it was a tracker! Arthur, I\'m so sorry... God, I\'m so sorry!"'
    ],
    choices: [
      {
        id: 'c87',
        label: '"He\'s just a kid, Arthur. We forgive him. But we move NOW."',
        subtext: 'Unconditional brotherhood.',
        targetNodeId: 'node_act6_standoff_prep',
        crewTrustChange: 20,
        karmaChange: 20,
        unlockAchievementId: 'true_friendship'
      },
      {
        id: 'c88',
        label: '"He\'s compromised us. Leave him here with his share and let\'s go."',
        subtext: 'Sever ties to survive.',
        targetNodeId: 'node_act6_standoff_prep',
        crewTrustChange: -15,
        karmaChange: -15
      }
    ]
  },

  'node_act5_dizzy_blame': {
    id: 'node_act5_dizzy_blame',
    act: 5,
    actTitle: 'ACT V: THE SHADOW OF DOUBT',
    location: 'Bermondsey Safehouse',
    speaker: 'Big Dave',
    speakerVoice: 'dave',
    dialogueLines: [
      'Dave puts his massive arms between you and the weeping young driver.',
      '"Enough! Smashing things won\'t change the fact the Met is three minutes down Jamaica Road.',
      'We\'ve got twenty bags of diamonds, an hour until dawn, and a ferry ticket to Dover at Waterloo Station.',
      'Do we run together, or die separately in the mud?"'
    ],
    choices: [
      {
        id: 'c89',
        label: '"We run together. Waterloo Station. Now!"',
        subtext: 'Prepare for the final chapter.',
        targetNodeId: 'node_act6_standoff_prep'
      }
    ]
  },

  // ==========================================
  // ACT 6: THE WATERLOO AMBUSH & FINAL BATTLE
  // ==========================================
  'node_act6_standoff_prep': {
    id: 'node_act6_standoff_prep',
    act: 6,
    actTitle: 'ACT VI: THE FALL OF WATERLOO',
    location: 'Waterloo Station, Concourse in the Rain',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      '5:42 AM. Dawn breaks over the River Thames in shades of bruised purple and slate grey.',
      'Rain hammers through the Victorian iron-and-glass vault of Waterloo Station.',
      'Steam hisses from the early morning boat train to the coast.',
      'Suddenly, heavy steel gates on both sides of Platform 3 slam shut with a resounding CLANG!'
    ],
    choices: [
      {
        id: 'c90',
        label: 'Step forward into the center of the platform',
        subtext: 'Confront the inevitable cordon.',
        targetNodeId: 'node_act6_vance_encounter',
        unlockAchievementId: 'tragic_waterloo'
      }
    ]
  },

  'node_act6_vance_encounter': {
    id: 'node_act6_vance_encounter',
    act: 6,
    actTitle: 'ACT VI: THE FINAL ENCOUNTER',
    location: 'Waterloo Station, Platform 3',
    speaker: 'Chief Inspector Vance',
    speakerVoice: 'police',
    dialogueLines: [
      'Dozens of armed Met officers in heavy waterproof coats step out of the shadows, batons and shields raised.',
      'At the front walks Chief Inspector Vance, his trench coat soaked, smoking a cigarette in the rain.',
      '"End of the line, gentlemen. Hatton Garden is closed. Drop the bags and step away from the train."',
      'Your SOUL burns brightly in the center of your chest!'
    ],
    battleEncounterId: 'enemy_vance',
    choices: [
      {
        id: 'c91',
        label: 'Stand against Chief Inspector Vance [ENTER FINAL BATTLE]',
        subtext: 'The climactic Undertale battle on Waterloo Bridge.',
        targetNodeId: 'node_act6_post_battle'
      }
    ]
  },

  'node_act6_post_battle': {
    id: 'node_act6_post_battle',
    act: 6,
    actTitle: 'ACT VI: THE CLIMAX',
    location: 'Waterloo Station, The Wet Tracks',
    speaker: 'Arthur "The Fox"',
    speakerVoice: 'arthur',
    dialogueLines: [
      'The train whistle sounds a mournful scream: WHOOOOOOOOO!',
      'The carriage doors are sliding shut! The train is beginning to roll south toward Dover and freedom.',
      'There is only enough time for ONE person to block the armed officers at the gate, while the others jump aboard.',
      'Arthur looks at you. Dave looks at you. Dizzy is already half through the open door.'
    ],
    choices: [
      {
        id: 'c92',
        label: 'SACRIFICE YOURSELF: Turn and face the police cordon alone so the crew escapes',
        subtext: 'The ultimate act of love and brotherhood.',
        targetNodeId: 'node_ending_sacrifice',
        karmaChange: 50,
        unlockAchievementId: 'sad_ending_reached'
      },
      {
        id: 'c93',
        label: 'SURRENDER PEACEFULLY: Drop the diamond holdall and raise your hands in the rain',
        subtext: 'Accept your fate together before the Old Bailey.',
        targetNodeId: 'node_ending_prison',
        karmaChange: 10,
        unlockAchievementId: 'belmarsh_bars'
      },
      {
        id: 'c94',
        label: 'PUSH PAST EVERYONE: Leap onto the train with the diamonds and leave them behind',
        subtext: 'Survival at the cost of your very humanity.',
        targetNodeId: 'node_ending_exile',
        karmaChange: -50,
        unlockAchievementId: 'sad_ending_reached'
      },
      {
        id: 'c95',
        label: 'HURL THE DIAMONDS INTO THE THAMES: Deny everyone the bloodied spoils',
        subtext: 'Toss the £14M off the Waterloo bridge into the black river.',
        targetNodeId: 'node_ending_river',
        karmaChange: 30,
        unlockAchievementId: 'sad_ending_reached'
      }
    ]
  },

  // ==========================================
  // ACT 7: THE SAD ENDINGS (THE HEARTBREAK)
  // ==========================================
  'node_ending_sacrifice': {
    id: 'node_ending_sacrifice',
    act: 7,
    actTitle: 'EPILOGUE: THE SAD SACRIFICE',
    location: 'Waterloo Station, In The Rain',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      'You step back and shove the heavy iron security gate shut behind Dave and Dizzy.',
      'You drop the latch and throw your weight against the bars.',
      'Through the carriage window, you see Big Dave press his palm against the glass, weeping openly.',
      'Dizzy holds up his hand in a trembling salute as the boat train glides away into the London fog.'
    ],
    cutsceneImage: STORY_IMAGES.sadEnding,
    isEnding: true,
    endingKey: 'sad_waterloo_sacrifice',
    choices: [
      {
        id: 'c96',
        label: 'Read the final monologue in the cold English rain...',
        subtext: 'Complete your journey.',
        targetNodeId: 'node_epilogue_reading_sacrifice'
      }
    ]
  },

  'node_epilogue_reading_sacrifice': {
    id: 'node_epilogue_reading_sacrifice',
    act: 7,
    actTitle: 'EPILOGUE: THE SAD SACRIFICE',
    location: 'HMP Belmarsh, High Security Wing',
    speaker: 'Arthur "The Fox" (Letter)',
    speakerVoice: 'arthur',
    dialogueLines: [
      'Ten years later. A damp cell in Belmarsh.',
      'A letter arrives with a Spanish postmark and a pressed cornflower inside.',
      '"Dear old friend... Dave\'s girl is a doctor now. She has children who laugh in the sunshine.',
      'We kept our promise. But every time it rains in Malaga, I close my eyes and see you standing at Waterloo.',
      'We got our freedom. But what we stole was your life. And none of the diamonds in the world could ever pay you back."'
    ],
    cutsceneImage: STORY_IMAGES.sadEnding,
    isEnding: true,
    endingKey: 'sad_waterloo_sacrifice',
    choices: []
  },

  'node_ending_prison': {
    id: 'node_ending_prison',
    act: 7,
    actTitle: 'EPILOGUE: HER MAJESTY\'S PLEASURE',
    location: 'Courtroom No. 1, The Old Bailey',
    speaker: 'The Judge',
    speakerVoice: 'police',
    dialogueLines: [
      'You drop the bag. It thuds against the wet platform. Handcuffs click cold and tight around all eight wrists.',
      'At the Old Bailey, the oak paneling smells of hundred-year-old tobacco and sorrow.',
      '"Guilty of conspiracy to burgle. Twenty years imprisonment at Her Majesty\'s Pleasure."',
      'Arthur smiles weakly at you from across the dock: "Well, son... at least we gave London something to talk about."'
    ],
    cutsceneImage: STORY_IMAGES.sadEnding,
    isEnding: true,
    endingKey: 'sad_prison',
    choices: [
      {
        id: 'c97',
        label: 'Watch the cell door slide shut forever...',
        subtext: 'Bitter melancholy conclusion.',
        targetNodeId: 'node_epilogue_prison_closing'
      }
    ]
  },

  'node_epilogue_prison_closing': {
    id: 'node_epilogue_prison_closing',
    act: 7,
    actTitle: 'EPILOGUE: HER MAJESTY\'S PLEASURE',
    location: 'Cell 42, HMP Belmarsh',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      'The years blur into cold porridge, iron bars, and the ceaseless tapping of rain on the frosted glass.',
      'Arthur passes away quietly in the infirmary during the harsh winter of 2004.',
      'Big Dave\'s hands grow too stiff with arthritis to ever hold a wrench again.',
      'All fourteen million in jewels sit locked in a police evidence locker, unspent, untouched.',
      'In the end, you realize: time was the only thing you could never steal back.'
    ],
    cutsceneImage: STORY_IMAGES.sadEnding,
    isEnding: true,
    endingKey: 'sad_prison',
    choices: []
  },

  'node_ending_exile': {
    id: 'node_ending_exile',
    act: 7,
    actTitle: 'EPILOGUE: THE HOLLOW EXILE',
    location: 'Motel Room, Fuengirola, Spain',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      'You sit on an unmade bed in a dim coastal motel. Outside, an unnatural torrential downpour lashes the palm trees.',
      'On the floor sits the canvas bag packed with four million pounds in uncut diamonds.',
      'On the television, the BBC news shows pictures of Arthur, Dave, and young Dizzy being led away in chains at Waterloo.',
      'You have all the money you ever dreamed of. But you have no one to share a pint with.',
      'You are completely, utterly, and perpetually alone.'
    ],
    cutsceneImage: STORY_IMAGES.sadEnding,
    isEnding: true,
    endingKey: 'sad_fugitive_exile',
    choices: []
  },

  'node_ending_river': {
    id: 'node_ending_river',
    act: 7,
    actTitle: 'EPILOGUE: THE RAIN AND THE RIVER',
    location: 'Waterloo Bridge, Center Span',
    speaker: 'Narrator',
    speakerVoice: 'narrator',
    dialogueLines: [
      'With a mighty heave, you hoist the heavy bags of diamonds and cast them over the iron parapet of Waterloo Bridge.',
      'SPLASH.',
      'Fourteen million pounds in diamonds sink into the black, silent mud of the River Thames, lost forever.',
      'Inspector Vance stares in disbelief as the rain pours down his face: "Why did you do that?!"',
      'You look up into the grey London clouds and smile through the tears.',
      '"Because none of it was worth a single drop of my friends\' blood."'
    ],
    cutsceneImage: STORY_IMAGES.sadEnding,
    isEnding: true,
    endingKey: 'sad_solitary_rain',
    choices: []
  }
};

// Initial starting equipment
export const STARTING_INVENTORY = [
  {
    id: 'item_lighter',
    name: 'Old Zippo Lighter',
    desc: 'Engraved with "London 1989". Provides a dim flame in the dark.',
    category: 'tool' as const
  },
  {
    id: 'item_coin',
    name: 'Lucky 1971 Shilling',
    desc: 'Kept in your pocket for good luck on every job.',
    category: 'memory' as const
  }
];
