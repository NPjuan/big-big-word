import type { Word } from '@/types/word.types'

export const defaultWords: Word[] = [
  {
    id: 'default-1',
    word: 'serendipity',
    phonetic: '/ˌserənˈdɪpəti/',
    audioUrl: '',
    partOfSpeech: 'noun',
    chineseMeaning: [
      {
        partOfSpeech: 'n.',
        definitions: ['意外发现珍奇事物的本领', '偶然发现', '机缘巧合'],
        examples: ['Finding this book was pure serendipity.'],
      },
    ],
    englishMeaning: [
      {
        partOfSpeech: 'noun',
        definitions: [
          'The occurrence of events by chance in a happy or beneficial way',
          'A fortunate happenstance',
        ],
        examples: [
          'A fortunate stroke of serendipity brought the two old friends together.',
          'The discovery was a happy serendipity.',
        ],
      },
    ],
    etymology: {
      roots: [
        {
          root: 'serendip',
          meaning: 'Sri Lanka (former name)',
          language: 'Persian',
        },
      ],
      origin:
        'Coined by Horace Walpole in 1754 from the Persian fairy tale "The Three Princes of Serendip"',
      evolution: 'From a fairy tale about princes who made fortunate discoveries',
      relatedWords: ['serendipitous', 'serendipitously'],
      mnemonic: 'Think of "serene dip" - a peaceful moment leading to unexpected joy',
      generatedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    mastery: 0,
  },
  {
    id: 'default-2',
    word: 'ephemeral',
    phonetic: '/ɪˈfemərəl/',
    audioUrl: '',
    partOfSpeech: 'adjective',
    chineseMeaning: [
      {
        partOfSpeech: 'adj.',
        definitions: ['短暂的', '瞬息的', '朝生暮死的'],
        examples: ['The beauty of cherry blossoms is ephemeral.'],
      },
    ],
    englishMeaning: [
      {
        partOfSpeech: 'adjective',
        definitions: ['Lasting for a very short time', 'Transitory, fleeting'],
        examples: [
          'Fame in the modern world is ephemeral.',
          'The ephemeral nature of social media trends.',
        ],
      },
    ],
    etymology: {
      roots: [
        {
          root: 'epi',
          meaning: 'upon, over',
          language: 'Greek',
        },
        {
          root: 'hemera',
          meaning: 'day',
          language: 'Greek',
        },
      ],
      origin: 'From Greek ephemeros "lasting only a day"',
      evolution: 'Originally used for insects that live only one day',
      relatedWords: ['ephemera', 'ephemerality'],
      mnemonic: 'E-femoral: Even femoral (thigh) beauty fades quickly',
      generatedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    mastery: 0,
  },
  {
    id: 'default-3',
    word: 'resilience',
    phonetic: '/rɪˈzɪliəns/',
    audioUrl: '',
    partOfSpeech: 'noun',
    chineseMeaning: [
      {
        partOfSpeech: 'n.',
        definitions: ['恢复力', '弹性', '韧性', '适应力'],
        examples: ['She showed great resilience in the face of adversity.'],
      },
    ],
    englishMeaning: [
      {
        partOfSpeech: 'noun',
        definitions: [
          'The capacity to recover quickly from difficulties',
          'The ability to spring back into shape; elasticity',
        ],
        examples: [
          'The resilience of the human spirit is remarkable.',
          'Building resilience helps us cope with stress.',
        ],
      },
    ],
    etymology: {
      roots: [
        {
          root: 're',
          meaning: 'back, again',
          language: 'Latin',
        },
        {
          root: 'salire',
          meaning: 'to jump, leap',
          language: 'Latin',
        },
      ],
      origin: 'From Latin resilire "to rebound, recoil"',
      evolution: 'Originally a physics term, now widely used in psychology',
      relatedWords: ['resilient', 'resiliency'],
      mnemonic: 'Re-silence: After silence (difficulty), you bounce back',
      generatedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    mastery: 0,
  },
  {
    id: 'default-4',
    word: 'eloquent',
    phonetic: '/ˈeləkwənt/',
    audioUrl: '',
    partOfSpeech: 'adjective',
    chineseMeaning: [
      {
        partOfSpeech: 'adj.',
        definitions: ['雄辩的', '有说服力的', '富于表现力的'],
        examples: ['She gave an eloquent speech about climate change.'],
      },
    ],
    englishMeaning: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          'Fluent or persuasive in speaking or writing',
          'Clearly expressing or indicating something',
        ],
        examples: [
          'An eloquent speaker can move an audience to tears.',
          'His silence was eloquent.',
        ],
      },
    ],
    etymology: {
      roots: [
        {
          root: 'e',
          meaning: 'out',
          language: 'Latin',
        },
        {
          root: 'loqui',
          meaning: 'to speak',
          language: 'Latin',
        },
      ],
      origin: 'From Latin eloquens "speaking out, eloquent"',
      evolution: 'From speaking well to expressing ideas powerfully',
      relatedWords: ['eloquence', 'eloquently', 'elocution'],
      mnemonic: 'E-lo-quent: Excellent Low-key Queen speaks eloquently',
      generatedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    mastery: 0,
  },
]
