// Eigene Antworttexte. Die Reihenfolge bevorzugt spezifische Themen.
const strategyTopics = [
  {
    topic: "Herkunft und Zugehörigkeit",
    match: /(?=.*\b(?:akzent|herkunft|ausländer\w*|migrant\w*|geflüchtet\w*)\b)(?=.*(?:gehört|gehören|raus|nichts verloren|nicht hierher|dazugehör))/u,
    variants: [
      ["Was hat die Herkunft für dich damit zu tun, wer hier dazugehören kann?", "Zugehörigkeit gibt es zum Glück auch ohne Herkunftsstempel.", "Ich lasse Menschen nicht nach Herkunft aussortieren. Für mich endet das Gespräch hier."],
      ["Welche konkrete Situation meinst du, wenn du sagst, jemand gehöre nicht hierher?", "Ein Akzent ist kein Türsteher.", "Hier ist Platz für Menschen mit verschiedenen Geschichten. Über ihr Dazugehören diskutiere ich nicht weiter."],
      ["Woran würdest du merken, dass jemand hier dazugehört, wenn du die Herkunft außen vor lässt?", "Wer dazugehören will, braucht keinen Geburtsort als Empfehlungsschreiben.", "Für mich zählt, wie wir miteinander umgehen. Ich lasse es damit gut sein."],
      ["Was würdest du an der Person konkret anders beurteilen, wenn du ihre Herkunft nicht kennen würdest?", "Eine Herkunft verrät weniger über einen Menschen als ein Gespräch mit ihm.", "Ich möchte, dass Menschen hier willkommen sind. An der Ausgrenzung beteilige ich mich nicht weiter."],
    ],
  },
  {
    topic: "Geschlecht und Können",
    match: /(?=.*(?:frauen|mädchen|männer|jungen))(?=.*(?:können kein|können nicht|zu emotional|gehören in die küche|führung ungeeignet|nicht für technik))/u,
    variants: [
      ["An welcher konkreten Fähigkeit machst du das fest?", "Kompetenz hat sich für deine Schublade leider zu breit gemacht.", "Ich beurteile Menschen nach ihrem Können. Für mich ist die Diskussion hier beendet."],
      ["Welche Anforderung hat diese Aufgabe, die du mit Geschlecht verbindest?", "Für gute Arbeit zählt Können. Das Etikett kann zu Hause bleiben.", "Ich möchte nicht, dass Geschlecht über Chancen entscheidet. Ich gehe darauf nicht weiter ein."],
      ["Bei welcher Person hast du das beobachtet, und was genau ist passiert?", "Eine Schublade ist ein ziemlich kleiner Ort, um Talent zu suchen.", "Ich traue Menschen unabhängig von ihrem Geschlecht etwas zu. Für mich ist damit alles gesagt."],
      ["Welche Leistung würdest du erwarten, wenn das Geschlecht gar nicht zur Sprache gekommen wäre?", "Talent hat sich in der falschen Spalte eingetragen und ist trotzdem da.", "Ich lasse Menschen ihre Fähigkeiten selbst zeigen. Das Gespräch darüber beende ich hier."],
    ],
  },
  {
    topic: "Abwertung als Witz",
    match: /(?:war doch nur (?:ein witz|spaß)|verstehst? keinen spaß|wird man doch mal lachen dürfen|witz muss man abkönnen)/u,
    variants: [
      ["Was daran sollte für die Person lustig sein, über die gesprochen wurde?", "Wenn der Witz einen Fußabtreter braucht, fehlt ihm eine Pointe.", "Ich mag Humor, der Menschen nicht kleinmacht. Ich lasse das Gespräch hier enden."],
      ["Wie könnte der Spruch bei jemandem ankommen, der selbst gemeint ist?", "Die Pointe darf gern auf eigenen Beinen stehen.", "Für mich war die Grenze überschritten. Ich rede darüber jetzt nicht weiter."],
      ["Was wolltest du mit dem Witz treffen: die Situation oder die Person?", "Ein guter Witz bringt Menschen zum Lachen und niemanden unter die Räder.", "Mir ist wichtig, dass alle mitlachen können. Für mich ist das damit gesagt."],
      ["Wie würde dieselbe Idee als Witz klingen, ohne jemanden zum Ziel zu machen?", "Spaß ist willkommen. Den Seitenhieb kann er an der Garderobe abgeben.", "Ich möchte da nicht mitlachen. Ich beende das Thema für mich."],
    ],
  },
  {
    topic: "Geld und Sozialleistungen",
    match: /(?=.*(?:bürgergeld|sozialhilfe|arbeitslos\w*))(?=.*(?:alle faul|nur faul|zu faul|wollen nicht arbeiten|wollen einfach nicht arbeiten|liegen uns auf der tasche))/u,
    variants: [
      ["Welche konkrete Person oder Situation meinst du mit dieser Behauptung?", "Ein Kontostand taugt schlecht als Charakterzeugnis.", "Ich möchte Menschen mit wenig Geld respektvoll behandeln. Über pauschale Urteile rede ich nicht weiter."],
      ["Was weißt du in dem konkreten Fall darüber, welche Arbeit die Person sucht?", "Für ein gutes Urteil braucht es mehr als einen Blick aufs Konto.", "Für mich verdienen Menschen auch ohne Arbeit Respekt. Ich schließe das Gespräch hier ab."],
      ["Was würdest du über eine dir nahestehende Person wissen wollen, bevor du dasselbe über sie sagst?", "Wer alles über eine Person aus einem Bescheid liest, hat ein sehr kurzes Buch gefunden.", "Ich halte diese Pauschalisierung für unfair. Für mich ist das Thema damit beendet."],
      ["An welcher Beobachtung machst du fest, warum jemand gerade keine Arbeit hat?", "Ein fehlender Job ist noch keine fertige Lebensgeschichte.", "Ich rede über konkrete Situationen gern respektvoll. Diese Pauschalisierung lasse ich stehen und steige aus."],
    ],
  },
  {
    topic: "Behinderung und Teilhabe",
    match: /(?=.*(?:behindert\w*|behinderung|rollstuhl))(?=.*(?:kann doch nichts|können doch nichts|kann sowieso nicht|können sowieso nicht|gehören hier nicht|sollten nicht mitmachen|nur eine last))/u,
    variants: [
      ["Was wäre nötig, damit die Person bei der konkreten Aufgabe mitmachen kann?", "Eine Stufe verrät mehr über den Eingang als über die Person davor.", "Für mich hat jede Person eine faire Chance verdient. Ich beende das Gespräch an dieser Stelle."],
      ["Hast du die Person gefragt, wie sie selbst gern teilnehmen möchte?", "Über jemanden hinwegzuplanen ist keine besonders barrierefreie Art zu denken.", "Ich respektiere, dass die Person selbst bestimmt, was sie sich zutraut. Damit schließe ich ab."],
      ["Welche Fähigkeit braucht man für die Aufgabe, und woran machst du deine Einschätzung fest?", "Wer die Tür zu früh zumacht, sieht wenig von dem, was dahinter möglich ist.", "Ich möchte Teilhabe ermöglichen. Über pauschale Ausschlüsse diskutiere ich nicht weiter."],
      ["Welche Hürde liegt in der Aufgabe selbst und welche im Ablauf?", "Vielleicht ist hier der Ablauf festgefahren und braucht etwas Bewegung.", "Für mich zählt, was die Person selbst will und mitbringt. Ich lasse es damit gut sein."],
    ],
  },
  {
    topic: "Widerspruch und Meinungsfreiheit",
    match: /(?:sagen darf man|darf man nichts mehr sagen|wird man ja wohl noch sagen dürfen|man darf ja nichts mehr sagen)/u,
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
  const normalized = statement.normalize('NFC').toLocaleLowerCase('de-DE');
  const match = strategyTopics.find(entry => entry.match.test(normalized));
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
