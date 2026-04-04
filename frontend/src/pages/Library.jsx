import { useState, useEffect } from 'react'
import axios from 'axios'
import { supabase } from '../supabaseClient'
import './Library.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function Library({ user }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

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
        console.error('Failed to fetch library')
      }
      setLoading(false)
    }
    fetchSaved()
  }, [user.id])

  const removeArticle = async (id) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      await axios.delete(`${BACKEND}/api/saved/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setArticles(articles.filter(a => a.id !== id))
    } catch (err) {
      console.error('Failed to remove article')
    }
  }

  if (loading) return <div className="loading">Loading your library...</div>

  return (
    <div className="library">
      <h2>📚 My Library</h2>
      {articles.length === 0 ? (
        <p>No saved articles yet. Go save some news!</p>
      ) : (
        <div className="library-grid">
          {articles.map(article => (
            <div key={article.id} className="library-card">
              {article.urlToImage && <img src={article.urlToImage} alt={article.title} />}
              <div className="card-content">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                {article.summary && (
                  <div className="summary"><strong>AI Summary:</strong> {article.summary}</div>
                )}
                <div className="card-actions">
                  <a href={article.url} target="_blank" rel="noreferrer">Read Full Article</a>
                  <button onClick={() => removeArticle(article.id)} className="remove-btn">
                    🗑️ Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}