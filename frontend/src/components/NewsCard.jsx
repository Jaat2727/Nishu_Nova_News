import { useState } from 'react'
import axios from 'axios'
import { supabase } from '../supabaseClient'
import './NewsCard.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function NewsCard({ article, user }) {
  const [summary, setSummary] = useState('')
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [saved, setSaved] = useState(false)

  const getSummary = async () => {
    setLoadingSummary(true)
    try {
      const res = await axios.post(`${BACKEND}/api/ai/summarize`, {
        title: article.title,
        description: article.description || article.title
      })
      setSummary(res.data.summary)
    } catch (err) {
      setSummary('Could not generate summary.')
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
        urlToImage: article.urlToImage,
        summary: summary
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSaved(true)
    } catch (err) {
      console.error('Failed to save article')
    }
  }

  return (
    <div className="news-card">
      {article.urlToImage && (
        <img src={article.urlToImage} alt={article.title} />
      )}
      <div className="card-content">
        <h3>{article.title}</h3>
        <p>{article.description}</p>

        {summary && <div className="summary"><strong>AI Summary:</strong> {summary}</div>}

        <div className="card-actions">
          <a href={article.url} target="_blank" rel="noreferrer">Read Full Article</a>
          <button onClick={getSummary} disabled={loadingSummary}>
            {loadingSummary ? 'Summarizing...' : '✨ AI Summary'}
          </button>
          {user && (
            <button onClick={saveArticle} disabled={saved} className="save-btn">
              {saved ? '✅ Saved' : '🔖 Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}