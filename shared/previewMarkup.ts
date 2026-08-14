export const ALLOWED_PREVIEW_TAGS = [
  'b',
  'br',
  'der',
  'die',
  'das',
  'nom',
  'akk',
  'dat',
  'refl'
] as const

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function renderPreviewMarkup(value: string): string {
  let html = escapeHtml(value)

  for (const tag of ALLOWED_PREVIEW_TAGS) {
    if (tag === 'br') {
      html = html
        .replaceAll(/&lt;br\s*\/&gt;/gi, '<br />')
        .replaceAll(/&lt;br&gt;/gi, '<br />')
      continue
    }

    html = html
      .replaceAll(new RegExp(`&lt;${tag}&gt;`, 'gi'), `<${tag}>`)
      .replaceAll(new RegExp(`&lt;/${tag}&gt;`, 'gi'), `</${tag}>`)
  }

  return html
}
