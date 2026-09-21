export type SynchronizationStatus = {
  decks: {
    importedFromAnki: number
    createdInAnki: number
    renamedFromAnki: number
    linkedToAnki: number
  }
  cards: {
    importedFromAnki: number
    updatedFromAnki: number
    pushedToAnki: number
    skippedUnsupported: number
    skippedLocalChanges: number
    skippedUnmappedDeck: number
  }
}

export type SynchronizationResponse = {
  ok: true
  stats: SynchronizationStatus
}
