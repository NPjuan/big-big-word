/**
 * Word Forms API Service
 * Fetches word inflections and related forms
 */

export interface WordFormsData {
  pastTense?: string
  pastParticiple?: string
  presentParticiple?: string
  thirdPersonSingular?: string
  plural?: string
  singular?: string
  comparative?: string
  superlative?: string
  noun?: string
  verb?: string
  adjective?: string
  adverb?: string
}

/**
 * Fetch word forms from Words API
 * Using RapidAPI Words API (free tier available)
 * Alternative: Use rule-based approach for common patterns
 */
export const fetchWordForms = async (word: string): Promise<WordFormsData> => {
  try {
    // Try to fetch from Words API (requires API key)
    // For now, we'll use a rule-based approach for common patterns
    const forms = await generateWordFormsRuleBased(word)
    return forms
  } catch (error) {
    console.error('Failed to fetch word forms:', error)
    return {}
  }
}

/**
 * Generate word forms using rule-based approach
 * This is a simplified version that handles common English patterns
 */
const generateWordFormsRuleBased = async (word: string): Promise<WordFormsData> => {
  const forms: WordFormsData = {}
  const lowerWord = word.toLowerCase()

  // Try to detect word type and generate forms
  // This is a simplified approach - real implementation would need more sophisticated logic

  // Common verb patterns
  if (await isLikelyVerb(lowerWord)) {
    forms.pastTense = generatePastTense(lowerWord)
    forms.pastParticiple = generatePastParticiple(lowerWord)
    forms.presentParticiple = generatePresentParticiple(lowerWord)
    forms.thirdPersonSingular = generateThirdPerson(lowerWord)
  }

  // Common noun patterns
  if (await isLikelyNoun(lowerWord)) {
    forms.plural = generatePlural(lowerWord)
  }

  // Common adjective patterns
  if (await isLikelyAdjective(lowerWord)) {
    forms.comparative = generateComparative(lowerWord)
    forms.superlative = generateSuperlative(lowerWord)
  }

  // Try to find related forms
  const relatedForms = await findRelatedForms(lowerWord)
  Object.assign(forms, relatedForms)

  return forms
}

/**
 * Check if word is likely a verb
 */
const isLikelyVerb = async (word: string): Promise<boolean> => {
  // Common verb endings
  const verbEndings = ['ate', 'ify', 'ize', 'en']
  return verbEndings.some((ending) => word.endsWith(ending))
}

/**
 * Check if word is likely a noun
 */
const isLikelyNoun = async (word: string): Promise<boolean> => {
  // Common noun endings
  const nounEndings = ['tion', 'sion', 'ment', 'ness', 'ity', 'er', 'or', 'ist', 'ism']
  return nounEndings.some((ending) => word.endsWith(ending))
}

/**
 * Check if word is likely an adjective
 */
const isLikelyAdjective = async (word: string): Promise<boolean> => {
  // Common adjective endings
  const adjEndings = ['ful', 'less', 'ous', 'ive', 'able', 'ible', 'al', 'ic']
  return adjEndings.some((ending) => word.endsWith(ending))
}

/**
 * Generate past tense form
 */
const generatePastTense = (word: string): string => {
  // Handle irregular verbs (common ones)
  const irregularVerbs: Record<string, string> = {
    go: 'went',
    have: 'had',
    do: 'did',
    say: 'said',
    get: 'got',
    make: 'made',
    know: 'knew',
    think: 'thought',
    take: 'took',
    see: 'saw',
    come: 'came',
    want: 'wanted',
    use: 'used',
    find: 'found',
    give: 'gave',
    tell: 'told',
    work: 'worked',
    call: 'called',
    try: 'tried',
    ask: 'asked',
    need: 'needed',
    feel: 'felt',
    become: 'became',
    leave: 'left',
    put: 'put',
    mean: 'meant',
    keep: 'kept',
    let: 'let',
    begin: 'began',
    seem: 'seemed',
    help: 'helped',
    show: 'showed',
    hear: 'heard',
    play: 'played',
    run: 'ran',
    move: 'moved',
    live: 'lived',
    believe: 'believed',
    bring: 'brought',
    happen: 'happened',
    write: 'wrote',
    sit: 'sat',
    stand: 'stood',
    lose: 'lost',
    pay: 'paid',
    meet: 'met',
    include: 'included',
    continue: 'continued',
    set: 'set',
    learn: 'learned',
    change: 'changed',
    lead: 'led',
    understand: 'understood',
    watch: 'watched',
    follow: 'followed',
    stop: 'stopped',
    create: 'created',
    speak: 'spoke',
    read: 'read',
    spend: 'spent',
    grow: 'grew',
    open: 'opened',
    walk: 'walked',
    win: 'won',
    teach: 'taught',
    offer: 'offered',
    remember: 'remembered',
    consider: 'considered',
    appear: 'appeared',
    buy: 'bought',
    serve: 'served',
    die: 'died',
    send: 'sent',
    build: 'built',
    stay: 'stayed',
    fall: 'fell',
    cut: 'cut',
    reach: 'reached',
    kill: 'killed',
    raise: 'raised',
    pass: 'passed',
    sell: 'sold',
    decide: 'decided',
    return: 'returned',
    explain: 'explained',
    hope: 'hoped',
    develop: 'developed',
    carry: 'carried',
    break: 'broke',
    receive: 'received',
    agree: 'agreed',
    support: 'supported',
    hit: 'hit',
    produce: 'produced',
    eat: 'ate',
    cover: 'covered',
    catch: 'caught',
    draw: 'drew',
  }

  if (irregularVerbs[word]) {
    return irregularVerbs[word]
  }

  // Regular verb rules
  if (word.endsWith('e')) {
    return word + 'd'
  }
  if (word.endsWith('y') && !isVowel(word[word.length - 2])) {
    return word.slice(0, -1) + 'ied'
  }
  if (shouldDoubleConsonant(word)) {
    return word + word[word.length - 1] + 'ed'
  }
  return word + 'ed'
}

/**
 * Generate past participle form
 */
const generatePastParticiple = (word: string): string => {
  // For most regular verbs, past participle = past tense
  // Handle some irregular cases
  const irregularParticiples: Record<string, string> = {
    go: 'gone',
    do: 'done',
    see: 'seen',
    take: 'taken',
    give: 'given',
    know: 'known',
    come: 'come',
    show: 'shown',
    write: 'written',
    speak: 'spoken',
    break: 'broken',
    choose: 'chosen',
    fall: 'fallen',
    eat: 'eaten',
    draw: 'drawn',
    grow: 'grown',
    throw: 'thrown',
    fly: 'flown',
    drive: 'driven',
    ride: 'ridden',
    rise: 'risen',
    hide: 'hidden',
    bite: 'bitten',
    forget: 'forgotten',
  }

  if (irregularParticiples[word]) {
    return irregularParticiples[word]
  }

  // Default to past tense form
  return generatePastTense(word)
}

/**
 * Generate present participle form (-ing)
 */
const generatePresentParticiple = (word: string): string => {
  if (word.endsWith('ie')) {
    return word.slice(0, -2) + 'ying'
  }
  if (word.endsWith('e') && !word.endsWith('ee') && !word.endsWith('ye')) {
    return word.slice(0, -1) + 'ing'
  }
  if (shouldDoubleConsonant(word)) {
    return word + word[word.length - 1] + 'ing'
  }
  return word + 'ing'
}

/**
 * Generate third person singular form
 */
const generateThirdPerson = (word: string): string => {
  if (
    word.endsWith('s') ||
    word.endsWith('x') ||
    word.endsWith('z') ||
    word.endsWith('ch') ||
    word.endsWith('sh')
  ) {
    return word + 'es'
  }
  if (word.endsWith('y') && !isVowel(word[word.length - 2])) {
    return word.slice(0, -1) + 'ies'
  }
  if (word.endsWith('o')) {
    return word + 'es'
  }
  return word + 's'
}

/**
 * Generate plural form
 */
const generatePlural = (word: string): string => {
  // Irregular plurals
  const irregularPlurals: Record<string, string> = {
    man: 'men',
    woman: 'women',
    child: 'children',
    tooth: 'teeth',
    foot: 'feet',
    person: 'people',
    mouse: 'mice',
    goose: 'geese',
    ox: 'oxen',
    sheep: 'sheep',
    deer: 'deer',
    fish: 'fish',
    series: 'series',
    species: 'species',
  }

  if (irregularPlurals[word]) {
    return irregularPlurals[word]
  }

  // Regular plural rules
  if (
    word.endsWith('s') ||
    word.endsWith('x') ||
    word.endsWith('z') ||
    word.endsWith('ch') ||
    word.endsWith('sh')
  ) {
    return word + 'es'
  }
  if (word.endsWith('y') && !isVowel(word[word.length - 2])) {
    return word.slice(0, -1) + 'ies'
  }
  if (word.endsWith('f')) {
    return word.slice(0, -1) + 'ves'
  }
  if (word.endsWith('fe')) {
    return word.slice(0, -2) + 'ves'
  }
  if (word.endsWith('o') && !isVowel(word[word.length - 2])) {
    return word + 'es'
  }
  return word + 's'
}

/**
 * Generate comparative form
 */
const generateComparative = (word: string): string => {
  // Short adjectives (1-2 syllables)
  if (word.length <= 6) {
    if (word.endsWith('e')) {
      return word + 'r'
    }
    if (word.endsWith('y') && !isVowel(word[word.length - 2])) {
      return word.slice(0, -1) + 'ier'
    }
    if (shouldDoubleConsonant(word)) {
      return word + word[word.length - 1] + 'er'
    }
    return word + 'er'
  }
  // Long adjectives use "more"
  return `more ${word}`
}

/**
 * Generate superlative form
 */
const generateSuperlative = (word: string): string => {
  // Short adjectives (1-2 syllables)
  if (word.length <= 6) {
    if (word.endsWith('e')) {
      return word + 'st'
    }
    if (word.endsWith('y') && !isVowel(word[word.length - 2])) {
      return word.slice(0, -1) + 'iest'
    }
    if (shouldDoubleConsonant(word)) {
      return word + word[word.length - 1] + 'est'
    }
    return word + 'est'
  }
  // Long adjectives use "most"
  return `most ${word}`
}

/**
 * Find related word forms (noun, verb, adjective, adverb)
 */
const findRelatedForms = async (word: string): Promise<Partial<WordFormsData>> => {
  const forms: Partial<WordFormsData> = {}

  // Common suffixes for word form conversion
  const conversions: Record<string, Record<string, string>> = {
    // Verb to noun
    ate: { noun: 'ation' },
    ify: { noun: 'ification' },
    ize: { noun: 'ization' },
    // Adjective to noun
    able: { noun: 'ability' },
    ible: { noun: 'ibility' },
    // Adjective to adverb
    // Most adjectives can add 'ly'
  }

  // Try to find related forms based on endings
  for (const [ending, forms_map] of Object.entries(conversions)) {
    if (word.endsWith(ending)) {
      const base = word.slice(0, -ending.length)
      if (forms_map.noun) {
        forms.noun = base + forms_map.noun
      }
    }
  }

  // If word ends in 'ly', it might be an adverb
  if (word.endsWith('ly') && word.length > 3) {
    forms.adjective = word.slice(0, -2)
  }

  // If word ends in common adjective suffixes, try to generate adverb
  const adjSuffixes = ['ful', 'less', 'ous', 'ive', 'able', 'ible', 'al', 'ic']
  for (const suffix of adjSuffixes) {
    if (word.endsWith(suffix)) {
      if (word.endsWith('le')) {
        forms.adverb = word.slice(0, -1) + 'y'
      } else if (word.endsWith('ic')) {
        forms.adverb = word + 'ally'
      } else if (word.endsWith('y')) {
        forms.adverb = word.slice(0, -1) + 'ily'
      } else {
        forms.adverb = word + 'ly'
      }
      break
    }
  }

  return forms
}

/**
 * Helper: Check if character is a vowel
 */
const isVowel = (char: string | undefined): boolean => {
  if (!char) return false
  return ['a', 'e', 'i', 'o', 'u'].includes(char.toLowerCase())
}

/**
 * Helper: Check if consonant should be doubled
 */
const shouldDoubleConsonant = (word: string): boolean => {
  if (word.length < 3) return false

  const lastChar = word[word.length - 1]
  const secondLastChar = word[word.length - 2]
  const thirdLastChar = word[word.length - 3]

  // Check if lastChar exists before using it
  if (!lastChar) return false

  // CVC pattern (consonant-vowel-consonant) in stressed syllable
  return (
    !isVowel(lastChar) &&
    isVowel(secondLastChar) &&
    !isVowel(thirdLastChar) &&
    !['w', 'x', 'y'].includes(lastChar)
  )
}
