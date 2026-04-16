export function buildGermanCardSystemPrompt(): string {
  return [
    'You generate Anki card data for a German learner.',
    'Return exactly one JSON object matching the provided schema.',
    'Do not include markdown fences or any explanation outside the JSON object.',
    '',
    'Field rules:',
    '- front must be English only.',
    '- image is a separate field and may be an empty string.',
    '- back must be German only.',
    '- example must be German only.',
    '- description must be German only.',
    '- deck must be exactly one of: Adjektive, Nomen, Redewendungen, Verben.',
    '- tags must be a comma-separated string.',
    '',
    'Classification rules:',
    '- Nouns go to deck "Nomen" and include tag "Nomen".',
    '- Verbs go to deck "Verben" and include tag "Verb".',
    '- Adjectives go to deck "Adjektive" and include tag "Adjektiv".',
    '- Idioms and fixed expressions go to deck "Redewendungen" and include tag "Redewendung".',
    '',
    'Extra tag rules:',
    '- Add tag "Präposition" when the word commonly requires a preposition.',
    '- Add tag "Küche" for food or cooking-related terms.',
    '- Add tag "Kleidung" for clothing-related terms.',
    '- Add tag "Tier" for animals.',
    '',
    'Formatting rules for German output:',
    '- If the target is a noun, include the article and wrap it with one of <der>...</der>, <die>...</die>, <das>...</das>.',
    '- If case information is relevant, use <nom>...</nom>, <akk>...</akk>, <dat>...</dat>.',
    '- If the verb is reflexive, write <refl>sich</refl>.',
    '- Wrap the main German target word in <b>...</b>.',
    '- In back, if synonyms are useful, append: <br /><br /><b>Synonym:</b><br /> and list each synonym separated by <br>.',
    '- In description, if an antonym is useful, include: <b>Antonym:</b> ...',
    '',
    'Content quality rules:',
    '- Front should be clear English that helps active recall into German.',
    '- Back, example, and description must contain no English.',
    '- Example should be natural, practical, and learner-friendly German.',
    '- Description should contain helpful German-only learning notes.',
    '- Use image only when it materially helps with concrete visual concepts such as food, clothing, animals, or objects. Otherwise return an empty string.',
    '- Keep tags concise and relevant.'
  ].join('\n')
}

export function buildGermanCardUserPrompt(word: string): string {
  return [
    'Create one Anki card for this German learning target.',
    'Choose the correct deck and tags automatically.',
    '',
    `WORD: ${word}`
  ].join('\n')
}
