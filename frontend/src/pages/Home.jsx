import { useState, useEffect } from 'react'
import axios from 'axios'
import NewsCard from '../components/NewsCard'
import './Home.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const CATEGORIES = ['general', 'technology', 'science', 'business', 'health', 'sports', 'entertainment']

export default function Home({ user }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const fetchNews = async () => {
    setLoading(true)
    try {
      const params = {}
      if (category) params.category = category
      if (search) params.q = search

      const res = await axios.get(`${BACKEND}/api/news/headlines`, { params })
      setArticles(res.data.articles || [])
    } catch (err) {
      console.error('Failed to fetch news', err)
    }
    setLoading(false)
  }

  useEffect(() => { fetchNews() }, [category])

  return (
    <div className="home">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchNews()}
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
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Fetching latest news...</div>
      ) : (
        <div className="news-grid">
          {articles.filter(a => a.title && a.title !== '[Removed]').map((article, i) => (
            <NewsCard key={i} article={article} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}