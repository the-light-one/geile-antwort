// Eigene Antworttexte. Die Reihenfolge bevorzugt spezifische Themen.
const strategyTopics = [
  {
    topic: "Herkunft und Arbeit",
    anchors: /(?:ausländer|migrant|geflüchtet|flüchtling|zugewander|zuwander|aus dem ausland)/u,
    cues: /(?:nehm(?:en|t) (?:[\p{L}]+ ){0,4}(?:jobs?|arbeit(?:splätze)?) weg|klau(?:en|t) (?:[\p{L}]+ ){0,4}(?:jobs?|arbeit(?:splätze)?)|(?:verdrängen|verdrängt) (?:[\p{L}]+ ){0,3}(?:einheimische|deutsche|arbeiter))/u,
    variants: [
      ["Welche Stelle meinst du konkret, und wie wurde sie vergeben?", "Ein Arbeitsvertrag hat keine Spalte für „den anderen weggenommen“.", "Wer sich auf eine Stelle bewirbt, ist für mich kein Sündenbock. Ich beende das Gespräch hier."],
      ["Was ist in dem Betrieb passiert, auf den du dich beziehst?", "Ein Betrieb hat eine Personalabteilung. Die Herkunft der Bewerbenden ist keine Erklärung für jede Entscheidung.", "Über Arbeitsbedingungen kann man reden. Menschen wegen ihrer Herkunft die Schuld zu geben, mache ich nicht mit."],
      ["Woran erkennst du, dass die Herkunft bei der Stellenvergabe eine Rolle gespielt hat?", "Eine Bewerbung ist kein Überfall auf den Stellenmarkt.", "Ich finde faire Chancen für alle wichtig. Die pauschale Schuldzuweisung diskutiere ich nicht weiter."],
      ["Geht es dir um einen konkreten Arbeitsplatz oder um die Lage in einer ganzen Branche?", "Für die Jobsuche wäre eine gute Stelle hilfreicher als ein bequemer Sündenbock.", "Menschen dürfen sich unabhängig von ihrer Herkunft auf Arbeit bewerben. Für mich ist das Thema hier beendet."],
    ],
  },
  {
    topic: "Herkunft und pauschaler Verdacht",
    anchors: /(?:ausländer|migrant|geflüchtet|flüchtling|zugewander|zuwander)/u,
    cues: /(?:sind (?:doch |ja |eh |sowieso )?(?:alle |nur |immer )?kriminell|werden (?:doch |ja |eh |sowieso )?(?:alle |nur |immer )?kriminell|alles (?:verbrecher|kriminelle))/u,
    variants: [
      ["Von welchem konkreten Vorfall sprichst du, und was weißt du darüber?", "Herkunft ist kein Vorstrafenregister.", "Ich rede über Taten, wenn es um Taten geht. Über einen Generalverdacht gegen Menschen diskutiere ich nicht weiter."],
      ["Wie kommst du von dem Fall, den du meinst, zu einem Urteil über so viele Menschen?", "Eine ganze Gruppe passt schlecht auf die Anklagebank für eine einzelne Tat.", "Für mich zählt, was eine Person getan hat. An pauschalen Verdächtigungen beteilige ich mich nicht."],
      ["Würdest du denselben Maßstab anlegen, wenn die beschuldigte Person hier aufgewachsen wäre?", "Mit einem einzigen Etikett hat noch niemand einen Fall aufgeklärt.", "Ich möchte, dass für alle dieselben Maßstäbe gelten. Damit beende ich das Gespräch für mich."],
      ["Welche Information würde dir helfen, einen konkreten Fall von einer Vermutung zu unterscheiden?", "Für einen Vorwurf braucht es einen Grund. Ein Sammelbegriff ist keiner.", "Ich halte diesen Generalverdacht für unfair. Mehr möchte ich dazu nicht sagen."],
    ],
  },
  {
    topic: "Herkunft und Zugehörigkeit",
    anchors: /(?:akzent|herkunft|ausländer|migrant|geflüchtet|flüchtling|zugewander|zuwander|aus dem ausland)/u,
    cues: /(?:gehört hier nicht|gehören hier nicht|nicht hierher|nicht zu uns|sollen raus|müssen raus|nichts verloren|nach hause schicken|(?:gehört|gehören) nicht (?:hier|dazu))/u,
    variants: [
      ["Was hat die Herkunft für dich damit zu tun, wer hier dazugehören kann?", "Zugehörigkeit gibt es zum Glück auch ohne Herkunftsstempel.", "Ich lasse Menschen nicht nach Herkunft aussortieren. Für mich endet das Gespräch hier."],
      ["Welche konkrete Situation meinst du, wenn du sagst, jemand gehöre nicht hierher?", "Ein Akzent ist kein Türsteher.", "Hier ist Platz für Menschen mit verschiedenen Geschichten. Über ihr Dazugehören diskutiere ich nicht weiter."],
      ["Woran würdest du merken, dass jemand hier dazugehört, wenn du die Herkunft außen vor lässt?", "Wer dazugehören will, braucht keinen Geburtsort als Empfehlungsschreiben.", "Für mich zählt, wie wir miteinander umgehen. Ich lasse es damit gut sein."],
      ["Was würdest du an der Person konkret anders beurteilen, wenn du ihre Herkunft nicht kennen würdest?", "Eine Herkunft verrät weniger über einen Menschen als ein Gespräch mit ihm.", "Ich möchte, dass Menschen hier willkommen sind. An der Ausgrenzung beteilige ich mich nicht weiter."],
    ],
  },
  {
    topic: "Geschlecht und Können",
    anchors: /\b(?:frauen?|mädchen|männer|mann|jungen?|jungs)\b/u,
    cues: /(?:könn(?:en|t) (?:doch |eh |sowieso )?(?:kein|nicht)|zu emotional|in die küche|zum führen ungeeignet|nicht für (?:technik|führung)|für (?:technik|führung) (?:nicht geeignet|ungeeignet)|(?:keine ahnung|nichts verstehen) von (?:technik|computern)|(?:sind|ist) schlecht (?:in|mit) (?:technik|mathe|computern))/u,
    variants: [
      ["An welcher konkreten Fähigkeit machst du das fest?", "Kompetenz hat sich für deine Schublade leider zu breit gemacht.", "Ich beurteile Menschen nach ihrem Können. Für mich ist die Diskussion hier beendet."],
      ["Welche Anforderung hat diese Aufgabe, die du mit Geschlecht verbindest?", "Für gute Arbeit zählt Können. Das Etikett kann zu Hause bleiben.", "Ich möchte nicht, dass Geschlecht über Chancen entscheidet. Ich gehe darauf nicht weiter ein."],
      ["Bei welcher Person hast du das beobachtet, und was genau ist passiert?", "Eine Schublade ist ein ziemlich kleiner Ort, um Talent zu suchen.", "Ich traue Menschen unabhängig von ihrem Geschlecht etwas zu. Für mich ist damit alles gesagt."],
      ["Welche Leistung würdest du erwarten, wenn das Geschlecht gar nicht zur Sprache gekommen wäre?", "Talent hat sich in der falschen Spalte eingetragen und ist trotzdem da.", "Ich lasse Menschen ihre Fähigkeiten selbst zeigen. Das Gespräch darüber beende ich hier."],
    ],
  },
  {
    topic: "Abwertung als Witz",
    cues: /(?:\bnur (?:ein(?:en)? )?(?:witz|scherz|spaß|spass)(?![\p{L}\p{N}])|verstehst? (?:(?:auch|wohl|etwa) )?keinen (?:spaß|spass)(?![\p{L}\p{N}])|war (?:doch )?(?:witzig|lustig) gemeint|wird man doch mal lachen dürfen|witz muss man abkönnen)/u,
    variants: [
      ["Was daran sollte für die Person lustig sein, über die gesprochen wurde?", "Wenn der Witz einen Fußabtreter braucht, fehlt ihm eine Pointe.", "Ich mag Humor, der Menschen nicht kleinmacht. Ich lasse das Gespräch hier enden."],
      ["Wie könnte der Spruch bei jemandem ankommen, der selbst gemeint ist?", "Die Pointe darf gern auf eigenen Beinen stehen.", "Für mich war die Grenze überschritten. Ich rede darüber jetzt nicht weiter."],
      ["Was wolltest du mit dem Witz treffen: die Situation oder die Person?", "Ein guter Witz bringt Menschen zum Lachen und niemanden unter die Räder.", "Mir ist wichtig, dass alle mitlachen können. Für mich ist das damit gesagt."],
      ["Wie würde dieselbe Idee als Witz klingen, ohne jemanden zum Ziel zu machen?", "Spaß ist willkommen. Den Seitenhieb kann er an der Garderobe abgeben.", "Ich möchte da nicht mitlachen. Ich beende das Thema für mich."],
    ],
  },
  {
    topic: "Geld und Sozialleistungen",
    anchors: /(?:bürgergeld|sozialhilfe|hartz\s*(?:4|iv)|arbeitslos|grundsicherung)/u,
    cues: /(?:\bfaul(?:e|er|en|es)?\b|w(?:ollen|ill) (?:\w+ ){0,4}nicht arbeiten|(?:liegen|lebt|leben) (?:uns )?auf (?:der|unserer) tasche|sich (?:nur )?durchfüttern lassen)/u,
    variants: [
      ["Welche konkrete Person oder Situation meinst du mit dieser Behauptung?", "Ein Kontostand taugt schlecht als Charakterzeugnis.", "Ich möchte Menschen mit wenig Geld respektvoll behandeln. Über pauschale Urteile rede ich nicht weiter."],
      ["Was weißt du in dem konkreten Fall darüber, welche Arbeit die Person sucht?", "Für ein gutes Urteil braucht es mehr als einen Blick aufs Konto.", "Für mich verdienen Menschen auch ohne Arbeit Respekt. Ich schließe das Gespräch hier ab."],
      ["Was würdest du über eine dir nahestehende Person wissen wollen, bevor du dasselbe über sie sagst?", "Wer alles über eine Person aus einem Bescheid liest, hat ein sehr kurzes Buch gefunden.", "Ich halte diese Pauschalisierung für unfair. Für mich ist das Thema damit beendet."],
      ["An welcher Beobachtung machst du fest, warum jemand gerade keine Arbeit hat?", "Ein fehlender Job ist noch keine fertige Lebensgeschichte.", "Ich rede über konkrete Situationen gern respektvoll. Diese Pauschalisierung lasse ich stehen und steige aus."],
    ],
  },
  {
    topic: "Behinderung und Teilhabe",
    anchors: /(?:behinder|rollstuhl|beeinträchtig)/u,
    cues: /(?:k(?:ann|önnen) (?:doch |sowieso |eh )?(?:nichts|nicht)|(?:sollten?|darf|dürfen) (?:(?:da|dort|hier|gar|doch|eh|sowieso|einfach|überhaupt) )*nicht (?:mitmachen|teilnehmen)|gehören hier nicht|nur eine last|schaffen? das (?:doch |eh |sowieso )?nicht)/u,
    variants: [
      ["Was wäre nötig, damit die Person bei der konkreten Aufgabe mitmachen kann?", "Eine Stufe verrät mehr über den Eingang als über die Person davor.", "Für mich hat jede Person eine faire Chance verdient. Ich beende das Gespräch an dieser Stelle."],
      ["Hast du die Person gefragt, wie sie selbst gern teilnehmen möchte?", "Über jemanden hinwegzuplanen ist keine besonders barrierefreie Art zu denken.", "Ich respektiere, dass die Person selbst bestimmt, was sie sich zutraut. Damit schließe ich ab."],
      ["Welche Fähigkeit braucht man für die Aufgabe, und woran machst du deine Einschätzung fest?", "Wer die Tür zu früh zumacht, sieht wenig von dem, was dahinter möglich ist.", "Ich möchte Teilhabe ermöglichen. Über pauschale Ausschlüsse diskutiere ich nicht weiter."],
      ["Welche Hürde liegt in der Aufgabe selbst und welche im Ablauf?", "Vielleicht ist hier der Ablauf festgefahren und braucht etwas Bewegung.", "Für mich zählt, was die Person selbst will und mitbringt. Ich lasse es damit gut sein."],
    ],
  },
  {
    topic: "Widerspruch und Meinungsfreiheit",
    cues: /(?:darf (?:man|ich|doch|ja)?\s*(?:ja |doch |überhaupt |heute |hier )*(?:gar )?nichts mehr sagen|wird man (?:ja |doch )?(?:wohl )?noch sagen dürfen|darf man denn (?:überhaupt )?noch was sagen|sagen wird man (?:das )?(?:ja |wohl |doch )?noch dürfen)/u,
    variants: [
      ["Welche konkrete Aussage möchtest du machen, und welchen Widerspruch hast du erlebt?", "Meinungsfreiheit hat keinen Knopf zum Stummschalten der anderen.", "Deine Meinung steht dir frei, meine auch. Für mich ist dieses Gespräch hier zu Ende."],
      ["Über welchen Satz reden wir gerade, und was genau ist danach passiert?", "Wer das Wort nimmt, kann auch mit einem Echo rechnen.", "Mir ist ein respektvoller Austausch wichtig. Ich lasse es an dieser Stelle gut sein."],
      ["Was für eine Reaktion hättest du dir auf deine Aussage gewünscht?", "Ein Mikrofon mit Rückkanal wäre hier kein Fehler.", "Ich finde, Widerspruch gehört zu einem offenen Gespräch. Mehr möchte ich dazu jetzt nicht sagen."],
      ["Welche Rückmeldung war für dich schwierig, und was wurde darin kritisiert?", "Das letzte Wort gehört selten zum Lieferumfang einer Meinung.", "Ich akzeptiere unterschiedliche Sichtweisen. Diese Runde beende ich für mich."],
    ],
  },
];

export function strategyAnswer(statement, variation = 0) {
  if (typeof statement !== 'string') return null;
  const normalized = statement.normalize('NFC').toLocaleLowerCase('de-DE')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  // A concrete group and a claim take precedence over a stock phrase such as
  // “war nur Spaß” that can appear at the end of an otherwise specific claim.
  const match = strategyTopics.find(entry => entry.anchors?.test(normalized) && entry.cues.test(normalized))
    ?? strategyTopics.find(entry => !entry.anchors && entry.cues.test(normalized));
  if (!match) return null;

  const offset = Number.isSafeInteger(variation) ? variation : 0;
  const index = ((offset % match.variants.length) + match.variants.length) % match.variants.length;
  const [green, yellow, red] = match.variants[index];

  return {
    green: { answer: green, bridge: '', why: 'Die Frage lenkt den Blick auf einen konkreten Fall.' },
    yellow: { answer: yellow, bridge: '', why: 'Ein Bild bringt den Denkfehler auf den Punkt.' },
    red: { answer: red, bridge: '', why: 'Du formulierst eine Grenze und schließt den Austausch ab.' },
    care: 'Du entscheidest, ob du antworten möchtest und welcher Ton zu dir passt.',
    safety: '',
    topic: match.topic,
    matched: true,
  };
}
