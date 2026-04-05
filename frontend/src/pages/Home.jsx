import { useState, useEffect } from 'react'
import axios from 'axios'
import NewsCard from '../components/NewsCard'
import './Home.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const CATEGORIES = ['general', 'technology', 'science', 'business', 'health', 'sports', 'entertainment']

const CAT_EMOJIS = {
  general: '🌐', technology: '💻', science: '🔬',
  business: '📊', health: '🏥', sports: '⚽', entertainment: '🎬'
}

export default function Home({ user }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (category) params.category = category
      if (search) params.q = search

      const res = await axios.get(`${BACKEND}/api/news/headlines`, { params })
      const filtered = (res.data.articles || []).filter(
        a => a.title && a.title !== '[Removed]'
      )
      setArticles(filtered)
    } catch (err) {
      console.error('Failed to fetch news', err)
      setError("Couldn't load news. Check your connection or backend server.")
    }
    setLoading(false)
  }

  useEffect(() => { fetchNews() }, [category])

  return (
    <div className="home">
      <div className="home-hero">
        <h2>Your World, Curated by AI</h2>
        <p>Stay informed with the latest news, summarized intelligently.</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          id="news-search"
          placeholder="Search headlines, topics, or keywords..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchNews()}
          autoComplete="off"
        />
        <button onClick={fetchNews}>Search</button>
      </div>

      <div className="categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={category === cat ? 'active' : ''}
            onClick={() => setCategory(cat === category ? '' : cat)}
          >
            {CAT_EMOJIS[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="state-msg">
          <div className="loading-spinner" />
          <span>Fetching latest headlines…</span>
        </div>
      ) : error ? (
        <div className="state-msg error">
          <span style={{ fontSize: '2rem' }}>⚠️</span>
          <span>{error}</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="state-msg">
          <span style={{ fontSize: '2rem' }}>🔍</span>
          <span>No articles found. Try a different search or category.</span>
        </div>
      ) : (
        <>
          <div className="results-header">
            <span className="results-count">{articles.length} articles found</span>
          </div>
          <div className="news-grid">
            {articles.map((article, i) => (
              <NewsCard key={`${article.url}-${i}`} article={article} user={user} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}