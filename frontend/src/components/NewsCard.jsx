import { useState } from 'react'
import axios from 'axios'
import { supabase } from '../supabaseClient'
import './NewsCard.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL

// Category-based fallback icons for when there's no image
const CATEGORY_ICONS = {
  technology: '💻', science: '🔬', business: '📊', health: '🏥',
  sports: '⚽', entertainment: '🎬', general: '📰'
}

export default function NewsCard({ article, user }) {
  const [summary, setSummary] = useState('')
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [saved, setSaved] = useState(false)
  const [imgError, setImgError] = useState(false)

  const hasImage = article.urlToImage && !imgError

  const getSummary = async () => {
    if (summary) return // Don't re-fetch if we already have one
    setLoadingSummary(true)
    try {
      const res = await axios.post(`${BACKEND}/api/ai/summarize`, {
        title: article.title,
        description: article.description || article.title
      })
      setSummary(res.data.summary)
    } catch (err) {
      console.error('AI Summary failed:', err)
      setSummary('Could not generate summary right now. Please try again. 🤖')
    }
    setLoadingSummary(false)
  }

  const saveArticle = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      await axios.post(`${BACKEND}/api/saved`, {
        user_id: user.id,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage || null,
        summary: summary || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSaved(true)
    } catch (err) {
      console.error('Failed to save article:', err)
      alert("Couldn't save the article. Please try again.")
    }
  }

  const sourceName = article.source?.name || 'Unknown Source'
  const fallbackIcon = CATEGORY_ICONS[article.category] || '📰'

  return (
    <div className="news-card">
      {/* Thumbnail area — always rendered, shows fallback if no valid image */}
      <div className="card-thumbnail">
        {hasImage ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="thumb-fallback">
            <span className="thumb-fallback-icon">{fallbackIcon}</span>
            <span className="thumb-fallback-text">No Image</span>
          </div>
        )}
        <span className="card-source">{sourceName}</span>
      </div>

      <div className="card-content">
        <h3>{article.title}</h3>
        {article.description && <p>{article.description}</p>}

        {summary && (
          <div className="summary">
            <strong>✨ AI Summary</strong>
            {summary}
          </div>
        )}

        <div className="card-actions">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="btn-read"
          >
            Read Article →
          </a>

          <button
            onClick={getSummary}
            disabled={loadingSummary || !!summary}
            className={`btn-ai ${loadingSummary ? 'loading' : ''}`}
          >
            {loadingSummary ? 'Summarizing…' : summary ? '✓ Summarized' : '✨ AI Summary'}
          </button>

          {user && (
            <button
              onClick={saveArticle}
              disabled={saved}
              className={`btn-save ${saved ? 'saved' : ''}`}
            >
              {saved ? '✓ Saved' : '🔖 Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}