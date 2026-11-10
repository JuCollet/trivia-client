/**
 * All the texts of the app. French is the reference: English must have exactly the same keys, which TypeScript checks.
 * Texts with values are functions, so that their parameters are typed too.
 */
const fr = {
  common: {
    rules: 'Règles',
    back: 'Retour',
    points: (points: number) => `${formatPoints(points)} pts`,
    loading: 'Chargement…',
  },
  join: {
    title: 'Rejoindre la partie',
    code: 'Code de la partie',
    codePlaceholder: 'ABCD',
    codeHint: 'Le code à 4 lettres affiché sur la TV.',
    name: 'Ton pseudo',
    namePlaceholder: 'Ex. : Roi du camembert',
    avatar: 'Ton avatar',
    submit: "C'est parti !",
    submitting: 'Connexion…',
    gameNotFound: "Aucune partie avec ce code. Vérifie l'écran de la TV.",
    gameStarted: 'Cette partie a déjà commencé.',
    gameFull: 'Cette partie est complète.',
    playersCount: (count: number, max: number) => `${count}/${max} joueurs`,
    resume: (code: string) => `Revenir dans la partie ${code}`,
  },
  lobby: {
    themesTitle: 'Tes thèmes secrets',
    themesTip: 'Choisis un thème que les autres peuvent connaître aussi : c’est bien plus drôle pour tout le monde.',
    themeLabel: (index: number) => `Thème du tour ${index + 1}`,
    themePlaceholder: 'Ex. : Les fromages',
    submit: 'Valider mes thèmes',
    update: 'Modifier mes thèmes',
    submitting: 'Envoi…',
    submissionsLeft: (count: number) =>
      count === 0
        ? 'Plus de modification possible.'
        : `Encore ${count} modification${count > 1 ? 's' : ''} possible${count > 1 ? 's' : ''}.`,
    themeConflict: 'Ce thème est trop proche de celui d’un autre joueur. Choisis-en un autre !',
    themesSent: 'Thèmes enregistrés, chut !',
    edit: 'Modifier',
    players: 'Joueurs',
    waitingForPlayers: (min: number) => `En attente d’au moins ${min} joueurs…`,
    waitingForHost: 'Tout le monde est prêt ? L’hôte lance la partie depuis la TV.',
    waitingForThemes: 'En attente des thèmes des autres joueurs…',
    themesReady: 'prêt',
    settings: (rounds: number, questions: number, seconds: number) =>
      `${rounds} tour${rounds > 1 ? 's' : ''} • ${questions} question${questions > 1 ? 's' : ''} par thème • ${seconds} s pour répondre`,
    roundsAdded: (rounds: number, missing: number) =>
      `L’hôte est passé à ${rounds} tours : ajoute ${missing} thème${missing > 1 ? 's' : ''}.`,
    roundsRemoved: (rounds: number, removed: number) =>
      `L’hôte est passé à ${rounds} tour${rounds > 1 ? 's' : ''} : ${removed > 1 ? 'tes derniers thèmes ont été retirés' : 'ton dernier thème a été retiré'}.`,
    completionIsFree: 'Compléter tes thèmes ne compte pas comme une modification.',
    complete: 'Compléter mes thèmes',
  },
  themeReveal: {
    round: (number: number, total: number) => `Manche ${number}/${total}`,
    finalRound: 'Question finale mystère',
    yourTheme: 'C’est ton thème ! Tu es le maître de cette manche.',
    masterRules:
      'Tu joues et tu marques tes points comme tout le monde. Mais à chaque question, le plus rapide à bien répondre avant toi te vole 200 points !',
    themeOf: (name: string) => `Le thème de ${name}`,
    themeReplaced: 'Thème remplacé par un thème proche.',
    preparing: 'Claude prépare les questions…',
    finalHint: 'Un thème choisi par personne. Points ×2 pour tout le monde !',
    lookAtTv: 'Regarde la TV !',
  },
  question: {
    number: (number: number, total: number) => `Question ${number}/${total}`,
    double: 'Points ×2',
    answered: 'Réponse envoyée',
    tooLate: 'Temps écoulé',
    reading: 'Lis bien la question, les réponses arrivent…',
    masterNote: 'Ton thème : réponds vite, sinon on te vole 200 points !',
    answeredCount: (count: number, total: number) => `${count}/${total} ont répondu`,
  },
  result: {
    correct: 'Bonne réponse !',
    wrong: 'Raté…',
    noAnswer: 'Pas de réponse',
    goodAnswer: 'La bonne réponse',
    basePoints: 'Bonne réponse',
    speedBonus: 'Bonus de rapidité',
    responseTime: (millis: number) => `en ${(millis / 1000).toFixed(1)} s`,
  },
  roundEnd: {
    title: 'Fin de manche',
    yourAwards: 'Tes prix',
    noAward: 'Pas de prix pour toi cette fois.',
    score: 'Ton score',
  },
  podium: {
    title: 'Fin de partie',
    yourRank: (rank: number) => (rank === 1 ? 'Tu as gagné !' : `Tu termines ${rank}e`),
    newGame: 'Nouvelle partie',
    correctAnswers: (count: number) => `${count} bonne${count > 1 ? 's' : ''} réponse${count > 1 ? 's' : ''}`,
  },
  awards: {
    plusViteQueSonOmbre: 'Plus vite que son ombre',
    outsider: 'L’Outsider',
    seulContreTous: 'Seul contre tous',
    pasMonTruc: 'Finalement pas mon truc',
    bonnetDane: 'Bonnet d’âne',
  },
  connection: {
    connecting: 'Connexion à la partie…',
    reconnecting: 'Connexion perdue, reconnexion…',
    gameGone: 'Cette partie n’existe plus.',
    followingNewGame: 'L’hôte a lancé une nouvelle partie, on t’y emmène…',
  },
  errors: {
    generic: 'Oups, quelque chose s’est mal passé. Réessaie.',
    network: 'Impossible de joindre le serveur. Vérifie ta connexion.',
    INVALID_GAME_CODE: 'Ce code n’est pas valide.',
    INVALID_PLAYER: 'Pseudo ou avatar invalide.',
    INVALID_THEMES: 'Un thème est vide ou trop long.',
    GAME_NOT_FOUND: 'Aucune partie avec ce code.',
    PLAYER_NOT_FOUND: 'Joueur inconnu dans cette partie.',
    GAME_FULL: 'Cette partie est complète.',
    PLAYER_NAME_TAKEN: 'Ce pseudo est déjà pris dans cette partie.',
    AVATAR_TAKEN: 'Cet avatar vient d’être pris, choisis-en un autre.',
    THEME_CONFLICT: 'Ce thème est trop proche de celui d’un autre joueur.',
    THEME_SUBMISSION_LIMIT: 'Tu ne peux plus modifier tes thèmes.',
    INVALID_PHASE: 'Ce n’est plus possible à ce stade de la partie.',
    ANSWER_REJECTED: 'Ta réponse n’a pas été prise en compte.',
  },
  rules: {
    title: 'Les règles',
    intro:
      'Chaque joueur choisit en secret un thème pour tout le groupe. À tour de rôle, un thème est révélé et Claude pose des questions dessus. Tout le monde répond depuis son téléphone.',
    sections: [
      {
        title: 'Le score',
        body: 'Une bonne réponse rapporte 500 points, plus un bonus de rapidité jusqu’à 500 points. Une mauvaise réponse ne fait perdre que la moitié du bonus de rapidité que tu aurais gagné en répondant juste au même moment : dans le doute, tente ta chance !',
      },
      {
        title: 'Le maître de la manche',
        body: 'Le joueur dont le thème est révélé devient le maître. Il joue et marque ses points comme tout le monde, mais il peut se faire voler des points.',
      },
      {
        title: 'Plus vite que son ombre',
        body: 'À chaque question, le challenger le plus rapide à bien répondre avant le maître (ou quand le maître se trompe) lui vole aussitôt 200 points.',
      },
      { title: 'L’Outsider', body: 'Un sans-faute sur la manche : +200 points.' },
      { title: 'Seul contre tous', body: 'Seul challenger à trouver une question : +150 points par question.' },
      {
        title: 'Finalement pas mon truc',
        body: 'Le maître ne trouve aucune réponse sur son propre thème : −200 points.',
      },
      { title: 'Bonnet d’âne', body: 'Aucune bonne réponse sur la manche : un badge, rien de plus.' },
      {
        title: 'La question finale mystère',
        body: 'Une dernière question sur un thème que personne n’a choisi. Points ×2 pour tout le monde. En cas d’égalité, le plus de bonnes réponses l’emporte, puis le temps de réponse le plus court.',
      },
    ],
  },
};

export type Messages = typeof fr;

const en: Messages = {
  common: {
    rules: 'Rules',
    back: 'Back',
    points: (points) => `${formatPoints(points, 'en')} pts`,
    loading: 'Loading…',
  },
  join: {
    title: 'Join the game',
    code: 'Game code',
    codePlaceholder: 'ABCD',
    codeHint: 'The 4-letter code shown on the TV.',
    name: 'Your nickname',
    namePlaceholder: 'E.g. Cheese Wizard',
    avatar: 'Your avatar',
    submit: "Let's go!",
    submitting: 'Joining…',
    gameNotFound: 'No game with this code. Check the TV screen.',
    gameStarted: 'This game has already started.',
    gameFull: 'This game is full.',
    playersCount: (count, max) => `${count}/${max} players`,
    resume: (code) => `Back to game ${code}`,
  },
  lobby: {
    themesTitle: 'Your secret themes',
    themesTip: 'Pick a theme the others may know too: it’s way more fun for everyone.',
    themeLabel: (index) => `Round ${index + 1} theme`,
    themePlaceholder: 'E.g. Cheeses',
    submit: 'Send my themes',
    update: 'Update my themes',
    submitting: 'Sending…',
    submissionsLeft: (count) =>
      count === 0 ? 'No more changes allowed.' : `${count} more change${count > 1 ? 's' : ''} allowed.`,
    themeConflict: 'This theme is too close to another player’s. Pick another one!',
    themesSent: 'Themes saved, keep it secret!',
    edit: 'Edit',
    players: 'Players',
    waitingForPlayers: (min) => `Waiting for at least ${min} players…`,
    waitingForHost: 'Everybody ready? The host starts the game from the TV.',
    waitingForThemes: 'Waiting for the other players’ themes…',
    themesReady: 'ready',
    settings: (rounds, questions, seconds) =>
      `${rounds} round${rounds > 1 ? 's' : ''} • ${questions} question${questions > 1 ? 's' : ''} per theme • ${seconds} s to answer`,
    roundsAdded: (rounds, missing) =>
      `The host switched to ${rounds} rounds: add ${missing} theme${missing > 1 ? 's' : ''}.`,
    roundsRemoved: (rounds, removed) =>
      `The host switched to ${rounds} round${rounds > 1 ? 's' : ''}: ${removed > 1 ? 'your last themes were removed' : 'your last theme was removed'}.`,
    completionIsFree: 'Completing your themes does not count as a change.',
    complete: 'Complete my themes',
  },
  themeReveal: {
    round: (number, total) => `Round ${number}/${total}`,
    finalRound: 'Mystery final question',
    yourTheme: 'It’s your theme! You are the master of this round.',
    masterRules:
      'You play and score like everyone else. But on each question, the fastest correct answer ahead of you steals 200 of your points!',
    themeOf: (name) => `${name}’s theme`,
    themeReplaced: 'Theme replaced with a similar one.',
    preparing: 'Claude is writing the questions…',
    finalHint: 'A theme nobody picked. Double points for everyone!',
    lookAtTv: 'Look at the TV!',
  },
  question: {
    number: (number, total) => `Question ${number}/${total}`,
    double: 'Double points',
    answered: 'Answer sent',
    tooLate: 'Time’s up',
    reading: 'Read the question, the answers are coming…',
    masterNote: 'Your theme: answer fast, or someone steals 200 of your points!',
    answeredCount: (count, total) => `${count}/${total} answered`,
  },
  result: {
    correct: 'Correct!',
    wrong: 'Missed…',
    noAnswer: 'No answer',
    goodAnswer: 'The right answer',
    basePoints: 'Correct answer',
    speedBonus: 'Speed bonus',
    responseTime: (millis) => `in ${(millis / 1000).toFixed(1)} s`,
  },
  roundEnd: {
    title: 'End of the round',
    yourAwards: 'Your awards',
    noAward: 'No award for you this time.',
    score: 'Your score',
  },
  podium: {
    title: 'Game over',
    yourRank: (rank) => (rank === 1 ? 'You won!' : `You finished ${ordinal(rank)}`),
    newGame: 'New game',
    correctAnswers: (count) => `${count} correct answer${count > 1 ? 's' : ''}`,
  },
  awards: {
    plusViteQueSonOmbre: 'Faster than his shadow',
    outsider: 'The Outsider',
    seulContreTous: 'One against all',
    pasMonTruc: 'Not My Thing After All',
    bonnetDane: 'Dunce cap',
  },
  connection: {
    connecting: 'Connecting to the game…',
    reconnecting: 'Connection lost, reconnecting…',
    gameGone: 'This game no longer exists.',
    followingNewGame: 'The host started a new game, taking you there…',
  },
  errors: {
    generic: 'Oops, something went wrong. Try again.',
    network: 'Cannot reach the server. Check your connection.',
    INVALID_GAME_CODE: 'This code is not valid.',
    INVALID_PLAYER: 'Invalid nickname or avatar.',
    INVALID_THEMES: 'A theme is empty or too long.',
    GAME_NOT_FOUND: 'No game with this code.',
    PLAYER_NOT_FOUND: 'Unknown player in this game.',
    GAME_FULL: 'This game is full.',
    PLAYER_NAME_TAKEN: 'This nickname is already taken in this game.',
    AVATAR_TAKEN: 'This avatar was just taken, pick another one.',
    THEME_CONFLICT: 'This theme is too close to another player’s.',
    THEME_SUBMISSION_LIMIT: 'You cannot change your themes anymore.',
    INVALID_PHASE: 'Not possible at this stage of the game.',
    ANSWER_REJECTED: 'Your answer was not counted.',
  },
  rules: {
    title: 'The rules',
    intro:
      'Each player secretly picks a theme for the whole group. One by one, the themes are revealed and Claude asks questions about them. Everybody answers from their phone.',
    sections: [
      {
        title: 'Scoring',
        body: 'A correct answer is worth 500 points, plus a speed bonus of up to 500 points. A wrong answer only costs half the speed bonus you would have earned by answering right at the same moment: when in doubt, take a guess!',
      },
      {
        title: 'The round master',
        body: 'The player whose theme is revealed becomes the master. They play and score like everyone else, but their points can be stolen.',
      },
      {
        title: 'Faster than his shadow',
        body: 'On each question, the fastest challenger to answer correctly ahead of the master (or when the master is wrong) steals 200 points from them right away.',
      },
      { title: 'The Outsider', body: 'A perfect round: +200 points.' },
      { title: 'One against all', body: 'The only challenger to find a question: +150 points per question.' },
      { title: 'Not My Thing After All', body: 'The master finds no answer on their own theme: −200 points.' },
      { title: 'Dunce cap', body: 'No correct answer in the round: a badge, nothing more.' },
      {
        title: 'The mystery final question',
        body: 'One last question on a theme nobody picked. Double points for everyone. In case of a tie, the most correct answers wins, then the shortest response time.',
      },
    ],
  },
};

export type Language = 'fr' | 'en';

export const messages: Record<Language, Messages> = { fr, en };

export function formatPoints(points: number, language: Language = 'fr'): string {
  return new Intl.NumberFormat(language === 'fr' ? 'fr-BE' : 'en-GB', { signDisplay: 'auto' }).format(points);
}

function ordinal(rank: number): string {
  const suffix = new Intl.PluralRules('en', { type: 'ordinal' }).select(rank);
  return `${rank}${{ one: 'st', two: 'nd', few: 'rd', other: 'th' }[suffix as 'one' | 'two' | 'few' | 'other'] ?? 'th'}`;
}
