import { useState, useRef, useEffect } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { addToHistory, getHistory, deleteFromHistory, clearHistory } from '../utils/history'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

const PLACEHOLDER = `Paste any text here — meeting notes, an article, an email thread, a document — and Synapse AI will summarize it into clear, actionable bullet points instantly.

Example: "The Q3 planning meeting covered three main topics. First, the product team presented the new onboarding flow which reduced drop-off by 22%. Marketing proposed a co-campaign with two partners for the holiday season. Engineering flagged a delay in the API v2 rollout due to security review, pushing the launch to mid-October. Action items: Alice to finalize partner contracts by Friday, Bob to reschedule the API launch timeline, and Carol to share onboarding metrics with stakeholders."`

export default function AIDemo() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMockMode, setIsMockMode] = useState(true)
  
  const [inputMode, setInputMode] = useState('text')
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfExtracting, setPdfExtracting] = useState(false)
  const [pdfPageCount, setPdfPageCount] = useState(0)
  
  // New features state
  const [lengthPref, setLengthPref] = useState('medium') // brief, medium, detailed
  const [tonePref, setTonePref] = useState('professional') // professional, casual, academic, bullet-heavy
  const [historyOpen, setHistoryOpen] = useState(false)
  const [history, setHistory] = useState([])
  
  const [copied, setCopied] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory())
  }, [])

  // Keyboard shortcut Ctrl+Enter or Cmd+Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (input.trim() && !loading && !pdfExtracting) {
          summarize()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [input, loading, pdfExtracting, lengthPref, tonePref])

  const renderMarkdown = (text) => {
    if (!text) return null
    return text.split('\n').map((line, i) => {
      const tokens = line.split(/(\*\*.*?\*\*)/g)
      const formattedLine = tokens.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} style={{ color: 'var(--cyan)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>
        }
        return part
      })

      if (line.match(/^#{1,3}\s/)) {
        const level = line.indexOf(' ')
        const fontSize = 24 - level * 2
        return <h3 key={i} style={{ 
          fontSize, color: 'var(--cyan)', 
          margin: '24px 0 12px', fontWeight: 700, 
          letterSpacing: '-0.01em', lineHeight: 1.2 
        }}>{line.replace(/^#+\s*/, '').trim()}</h3>
      }
      
      if (line.match(/^([•\-*]|\d+\.)\s/)) {
        return <li key={i} style={{ 
          marginLeft: 20, marginBottom: 10, listStyleType: 'none', 
          position: 'relative', paddingLeft: 4 
        }}>
          <span style={{ position: 'absolute', left: -20, color: 'var(--cyan)', fontWeight: 800 }}>
            {line.match(/^\d+\./) ? line.match(/^\d+\./)[0] : '•'}
          </span>
          {formattedLine.map(el => typeof el === 'string' ? el.replace(/^([•\-*]|\d+\.)\s*/, '') : el)}
        </li>
      }

      if (line.startsWith('---')) {
        return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0', opacity: 0.5 }} />
      }

      if (!line.trim()) return <div key={i} style={{ height: 12 }} />
      return <p key={i} style={{ marginBottom: 14, color: 'var(--text-secondary)' }}>{formattedLine}</p>
    })
  }

  const getSettingsPrompt = () => {
    let prompt = ''
    if (tonePref === 'professional') prompt += 'Use a highly professional, business-appropriate executive tone. '
    if (tonePref === 'casual') prompt += 'Use a casual, easy-to-understand, conversational tone. Avoid jargon. '
    if (tonePref === 'academic') prompt += 'Use an academic tone, preserving technical accuracy and nuances. '
    if (tonePref === 'bullet-heavy') prompt += 'Format almost entirely as a nested bulleted list. Keep sentences strictly actionable. '

    if (lengthPref === 'brief') prompt += 'Provide a very brief, high-level summary (max 3 bullets). '
    if (lengthPref === 'medium') prompt += 'Provide a medium-length summary with 4-5 key points. '
    if (lengthPref === 'detailed') prompt += 'Provide a highly detailed, comprehensive summary capturing all nuances. '
    return prompt
  }

  const mockSummarize = (text) => {
    const points = [
      "Extracted key milestones and strategic objectives for the upcoming quarter.",
      "Identified critical path items and potential resource bottlenecks.",
      "Synthesized technical requirements into actionable development tasks.",
      "Outlined leadership responsibilities and ownership for priority initiatives.",
      "Consolidated stakeholder feedback into a unified execution plan."
    ]
    const limit = lengthPref === 'brief' ? 2 : lengthPref === 'detailed' ? 5 : 3
    return `### ⚡ Synapse AI Summary (Demo)\n\n` + 
           points.sort(() => Math.random() - 0.5).slice(0, limit).map(p => `• ${p}`).join('\n') + 
           `\n\n---\n*Using AI-simulated results for demo purposes.*`
  }

  const extractPdfText = async (file) => {
    setPdfExtracting(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      setPdfPageCount(pdf.numPages)
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map(item => item.str).join(' ')
        fullText += pageText + '\n\n'
      }
      const trimmed = fullText.trim()
      if (!trimmed) throw new Error('No extractable text found in this PDF.')
      setInput(trimmed)
      return trimmed
    } catch (e) {
      setError('PDF extraction failed: ' + e.message)
      return null
    } finally {
      setPdfExtracting(false)
    }
  }

  const handleFileSelect = async (file) => {
    if (!file) return
    if (file.type !== 'application/pdf') { setError('Please select a valid PDF file.'); return }
    if (file.size > 20 * 1024 * 1024) { setError('Maximum size is 20MB.'); return }
    setPdfFile(file)
    setError('')
    setOutput('')
    await extractPdfText(file)
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0])
  }

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = () => setDragOver(false)

  const summarize = async () => {
    if (!input.trim()) return
    setLoading(true)
    setOutput('')
    setError('')
    setCopied(false)
    
    await new Promise(r => setTimeout(r, 600))

    try {
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!geminiKey) throw new Error('VITE_GEMINI_API_KEY is not defined.')

      const baseContext = inputMode === 'pdf' ? 'The following text was extracted from a PDF document.' : ''
      const settingsPrompt = getSettingsPrompt()
      
      const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${baseContext}. ${settingsPrompt}. Use **bold** for key terms:\n\n${input.slice(0, 30000)}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'API Error')

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) {
        setOutput(text)
        setIsMockMode(false)
        setError('')
        // Save to history
        const updatedHistory = addToHistory({
          input, output: text, mode: inputMode,
          fileName: pdfFile?.name, tone: tonePref, length: lengthPref
        })
        setHistory(getHistory()) // refresh history state
      } else {
        throw new Error('No content returned.')
      }
    } catch (e) {
      console.warn('AI Error:', e.message)
      setError(e.message) 
      const mockOut = mockSummarize(input)
      setOutput(mockOut)
      setIsMockMode(true)
      
      // Save demo to history too
      addToHistory({ input, output: mockOut, mode: inputMode, fileName: pdfFile?.name, tone: tonePref, length: lengthPref })
      setHistory(getHistory())
    }
    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setPdfFile(null)
    setPdfPageCount(0)
    setCopied(false)
  }

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `synapse-summary-${Date.now()}.txt`; a.click();
    URL.revokeObjectURL(url)
  }

  const handleDeleteHistory = (id, e) => {
    e.stopPropagation()
    setHistory(deleteFromHistory(id))
  }

  const handleClearHistory = () => {
    setHistory(clearHistory())
  }

  return (
    <section id="ai-demo" className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(123,94,167,0.04), transparent)', position: 'relative' }}>
      
      {/* History Sidebar Toggle */}
      <button 
        onClick={() => setHistoryOpen(true)}
        style={{
          position: 'fixed', right: 0, top: 120, zIndex: 50,
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRight: 'none',
          padding: '12px 14px', borderRadius: '12px 0 0 12px',
          color: 'var(--text-secondary)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8, boxShadow: '-4px 0 20px rgba(0,0,0,0.5)',
        }}
      >
        <span>⏱️</span> History
      </button>

      {/* History Sidebar */}
      <div style={{
        position: 'fixed', top: 0, right: historyOpen ? 0 : '-400px', bottom: 0, width: 360,
        background: 'var(--bg-1)', borderLeft: '1px solid var(--border)', zIndex: 110,
        transition: 'right 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: historyOpen ? '-20px 0 80px rgba(0,0,0,0.8)' : 'none',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 18, margin: 0 }}>Summary History</h3>
          <button onClick={() => setHistoryOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 24, cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: 14 }}>
              No history yet.<br/>Your summaries will appear here.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ textAlign: 'right' }}>
                <button onClick={handleClearHistory} style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>Clear All</button>
              </div>
              {history.map(item => (
                <div 
                  key={item.id} 
                  style={{ 
                    padding: 16, background: 'var(--bg-2)', border: '1px solid var(--border)', 
                    borderRadius: 12, cursor: 'pointer', position: 'relative'
                  }}
                  onClick={() => {
                    setInput(item.inputPreview + '...')
                    setOutput(item.output)
                    setHistoryOpen(false)
                  }}
                >
                  <button 
                    onClick={(e) => handleDeleteHistory(item.id, e)}
                    style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >×</button>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--cyan)', marginBottom: 8, display: 'flex', gap: 8 }}>
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    <span>{item.mode === 'pdf' ? '📄 PDF' : '✏️ Text'}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.fileName ? `${item.fileName}\n` : ''}
                    {item.inputPreview}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {historyOpen && (
        <div 
          onClick={() => setHistoryOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 105, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        />
      )}

      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            // live demo
            <span style={{ 
              fontSize: 9, padding: '2px 8px', 
              background: isMockMode ? 'rgba(255,255,255,0.05)' : 'linear-gradient(90deg, rgba(0,229,255,0.2), rgba(123,94,167,0.2))', 
              color: isMockMode ? 'var(--text-muted)' : 'var(--cyan)', 
              borderRadius: 20, letterSpacing: '0.05em', border: '1px solid currentColor',
              fontWeight: 600, textTransform: 'uppercase'
            }}>
              {isMockMode ? 'DEMO MODE' : 'AI POWERED'}
            </span>
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', marginTop: 16 }}>
            AI Text & PDF Summarizer
          </h2>
        </div>

        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          
          {/* Controls Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'end', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-2)', borderRadius: 'var(--radius)', padding: 4 }}>
              <button
                onClick={() => { setInputMode('text'); setPdfFile(null); setPdfPageCount(0); }}
                style={{
                  padding: '8px 20px', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'all 0.25s',
                  background: inputMode === 'text' ? 'var(--cyan)' : 'transparent',
                  color: inputMode === 'text' ? '#03050a' : 'var(--text-muted)',
                }}
              >✏️ Text</button>
              <button
                onClick={() => setInputMode('pdf')}
                style={{
                  padding: '8px 20px', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'all 0.25s',
                  background: inputMode === 'pdf' ? 'var(--cyan)' : 'transparent',
                  color: inputMode === 'pdf' ? '#03050a' : 'var(--text-muted)',
                }}
              >📄 PDF</button>
            </div>

            {/* Summary Settings */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Length</label>
                <select 
                  value={lengthPref} onChange={e => setLengthPref(e.target.value)}
                  style={{ background: 'var(--bg-2)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', cursor: 'pointer' }}
                >
                  <option value="brief">Brief</option>
                  <option value="medium">Medium</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Format Tone</label>
                <select 
                  value={tonePref} onChange={e => setTonePref(e.target.value)}
                  style={{ background: 'var(--bg-2)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', cursor: 'pointer' }}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="academic">Academic</option>
                  <option value="bullet-heavy">Bullet Heavy</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 24, boxShadow: isMockMode ? 'none' : '0 0 40px rgba(0,229,255,0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 32 }}>

              {/* Input Area */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {inputMode === 'pdf' ? (
                  <div>
                    <div
                      onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: `2px dashed ${dragOver ? 'var(--cyan)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius)', padding: '30px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s',
                        background: dragOver ? 'rgba(0,229,255,0.05)' : 'rgba(255,255,255,0.02)', marginBottom: 16, height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center'
                      }}
                    >
                      <input ref={fileInputRef} type="file" accept=".pdf" onChange={(e) => handleFileSelect(e.target.files[0])} style={{ display: 'none' }} />
                      <div style={{ fontSize: 32, marginBottom: 10 }}>{pdfExtracting ? '⏳' : pdfFile ? '✅' : '📄'}</div>
                      {pdfExtracting ? (
                        <p style={{ color: 'var(--cyan)', fontSize: 14 }}>Extracting text<span style={{ animation: 'blink 1.2s infinite' }}>...</span></p>
                      ) : pdfFile ? (
                        <div>
                          <p style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600 }}>{pdfFile.name}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>{(pdfFile.size / 1024).toFixed(1)} KB • {pdfPageCount} pages</p>
                        </div>
                      ) : (
                        <div>
                          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Drop your PDF or <span style={{ color: 'var(--cyan)' }}>browse</span></p>
                        </div>
                      )}
                    </div>
                    {input && (
                      <textarea
                        className="input" rows={6} value={input} onChange={e => setInput(e.target.value)}
                        placeholder="Extracted text will appear here..."
                        style={{ resize: 'vertical', minHeight: 120, fontFamily: 'var(--font-body)', fontSize: 13, padding: 16, opacity: 0.8, flex: 1 }}
                      />
                    )}
                  </div>
                ) : (
                  <textarea
                    className="input"
                    placeholder={PLACEHOLDER}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    style={{ resize: 'vertical', minHeight: 320, fontFamily: 'var(--font-body)', lineHeight: 1.6, fontSize: 14, padding: 16, flex: 1 }}
                  />
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button
                    className="btn-primary" onClick={summarize} disabled={loading || !input.trim() || pdfExtracting}
                    style={{ flex: 1, justifyContent: 'center' }} id="summarize-btn"
                  >
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="spinner" style={{ width: 14, height: 14, border: '2px solid #03050a', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                        Analyzing...
                      </span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>⚡ Summarize {inputMode === 'pdf' ? 'PDF' : 'Content'}</span>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontFamily: 'var(--font-mono)' }}>Ctrl+Enter</div>
                      </div>
                    )}
                  </button>
                  <button className="btn-outline" onClick={handleClear} disabled={!input && !output} style={{ padding: '14px', fontSize: 14 }} title="Clear all">
                    ✕
                  </button>
                </div>
              </div>

              {/* Output Area */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  background: isMockMode ? 'rgba(0,229,255,0.02)' : 'rgba(0,229,255,0.05)', 
                  border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, flex: 1,
                  fontSize: 15, lineHeight: 1.7, color: output ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-body)', overflow: 'auto', minHeight: 320,
                }}>
                  {!output && !loading && !error && '// AI processing results will appear here'}
                  {loading && <div style={{ color: 'var(--cyan)', marginTop: 4 }}>Synthesizing content<span style={{ animation: 'blink 1.2s infinite' }}>...</span></div>}
                  {error && isMockMode && (
                    <div style={{ fontSize: 11, background: 'rgba(255,100,100,0.1)', color: '#ff6b6b', padding: '8px 12px', borderRadius: 6, marginBottom: 16, border: '1px solid rgba(255,100,100,0.2)' }}>
                      ⚠️ {error}
                    </div>
                  )}
                  {renderMarkdown(output)}
                </div>
                
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="btn-outline" onClick={handleCopy} disabled={!output} style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
                    {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
                  </button>
                  <button className="btn-outline" onClick={handleDownload} disabled={!output} style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
                    💾 Download .txt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </section>
  )
}
