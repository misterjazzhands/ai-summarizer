const HISTORY_KEY = 'synapse_history'
const MAX_ITEMS = 50

export function getHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addToHistory(entry) {
  const history = getHistory()
  const item = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: new Date().toISOString(),
    inputPreview: entry.input.slice(0, 200),
    inputLength: entry.input.length,
    output: entry.output,
    mode: entry.mode, // 'text' or 'pdf'
    fileName: entry.fileName || null,
    tone: entry.tone || 'professional',
    length: entry.length || 'medium',
  }
  history.unshift(item)
  if (history.length > MAX_ITEMS) history.pop()
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  return item
}

export function deleteFromHistory(id) {
  const history = getHistory().filter(h => h.id !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  return history
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
  return []
}
