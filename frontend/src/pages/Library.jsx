import { useState, useEffect } from 'react'
import axios from 'axios'
import { supabase } from '../supabaseClient'
import './Library.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function Library({ user }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token

        const res = await axios.get(`${BACKEND}/api/saved/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setArticles(res.data)
      } catch (err) {
        console.error('Failed to fetch library', err)
        setError("Couldn't load your saved articles. Try refreshing.")
      }
      setLoading(false)
    }

    if (user?.id) fetchSaved()
  }, [user.id])

  const removeArticle = async (id) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      await axios.delete(`${BACKEND}/api/saved/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setArticles(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      console.error('Failed to remove article', err)
      alert('Failed to remove the article. Please try again.')
    }
  }

  if (loading) return (
    <div className="state-msg">
      <div className="loading-spinner" />
      <span>Loading your library…</span>
    </div>
  )

  if (error) return (
    <div className="state-msg error">
      <span style={{ fontSize: '2rem' }}>⚠️</span>
      <span>{error}</span>
    </div>
  )

  return (
    <div className="library">
      <div className="library-header">
        <h2>My Library</h2>
        <p>{articles.length} saved article{articles.length !== 1 ? 's' : ''}</p>
      </div>

      {articles.length === 0 ? (
        <div className="state-msg">
          <span style={{ fontSize: '2.5rem' }}>📚</span>
          <span>Your library is empty. Save articles from the Home page to read later!</span>
        </div>
      ) : (
        <div className="library-grid">
          {articles.map(article => {
            // DB stores column as urltoimage (lowercase) — map to standard name
            const thumbnail = article.urltoimage || article.urlToImage || null
            const savedDate = article.created_at
              ? new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : null

            return (
              <div key={article.id} className="library-card">
                <div className="card-thumbnail">
                  {thumbnail ? (
                    <img src={thumbnail} alt={article.title} loading="lazy" />
                  ) : (
                    <div className="thumb-fallback">
                      <span className="thumb-fallback-icon">📰</span>
                      <span className="thumb-fallback-text">No Image</span>
                    </div>
                  )}
                </div>

                <div className="card-content">
                  <h3>{article.title}</h3>
                  {article.description && <p>{article.description}</p>}
                  {article.summary && (
                    <div className="summary">
                      <strong>✨ AI Summary</strong>
                      {article.summary}
                    </div>
                  )}
                  {savedDate && <span className="saved-date">Saved {savedDate}</span>}
                  <div className="card-actions">
                    <a href={article.url} target="_blank" rel="noreferrer" className="btn-read">
                      Read Article →
                    </a>
                    <button onClick={() => removeArticle(article.id)} className="remove-btn">
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}