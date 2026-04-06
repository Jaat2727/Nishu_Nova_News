/**
 * Home.jsx — Main news feed page.
 *
 * Features:
 *   - Fetches top headlines from the backend (which proxies NewsAPI)
 *   - Category filter buttons (General, Tech, Science, etc.)
 *   - Search bar to find articles by keyword
 *   - Tracks which articles the user already saved (green badge)
 *   - Passes the current category to NewsCard so it's saved in the DB
 *
 * Data flow:
 *   1. On mount → fetch user's saved URLs from Supabase
 *   2. On mount & category change → fetch headlines from backend
 *   3. Each NewsCard can trigger a save → updates the savedUrls set
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { supabase } from '../supabaseClient'
import NewsCard from '../components/NewsCard'
import './Home.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL

// Available news categories from NewsAPI
const CATEGORIES = ['general', 'technology', 'science', 'business', 'health', 'sports', 'entertainment']

export default function Home({ user }) {
  // ───── State ─────
  const [articles, setArticles] = useState([])        // list of news articles
  const [loading, setLoading] = useState(false)        // fetching indicator
  const [error, setError] = useState(null)             // error message
  const [search, setSearch] = useState('')             // search input value
  const [category, setCategory] = useState('')         // active category filter
  const [savedUrls, setSavedUrls] = useState(new Set()) // URLs user already saved

  /**
   * On mount: load the URLs the user has already bookmarked.
   * This lets us show "Saved" badges on cards that are in their library.
   */
  useEffect(() => {
    const fetchSavedUrls = async () => {
      try {
        const { data } = await supabase
          .from('saved_articles')
          .select('url')
          .eq('user_id', user.id)

        if (data) setSavedUrls(new Set(data.map(a => a.url)))
      } catch (e) {
        console.error('Failed to load saved URLs:', e)
      }
    }
    if (user) fetchSavedUrls()
  }, [user])

  /**
   * Called when a card is saved — add its URL to the set
   * so it immediately shows the green "Saved" badge.
   */
  const onArticleSaved = (url) => {
    setSavedUrls(prev => new Set(prev).add(url))
  }

  /**
   * Fetch news headlines from the backend.
   * Supports optional category and search query params.
   */
  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (category) params.category = category
      if (search.trim()) params.q = search.trim()

      const res = await axios.get(`${BACKEND}/api/news/headlines`, { params })

      // Filter out removed/blank articles
      const filtered = (res.data.articles || []).filter(
        a => a.title && a.title !== '[Removed]'
      )
      setArticles(filtered)
    } catch (err) {
      console.error('Failed to fetch news:', err)
      setError("Couldn't load news. Check your connection or backend server.")
    }
    setLoading(false)
  }

  // Re-fetch when category changes
  useEffect(() => { fetchNews() }, [category])

  return (
    <div className="home">
      {/* ── Hero heading ── */}
      <div className="home-hero">
        <h2>Today's Headlines</h2>
        <p>The stories that matter, right now.</p>
      </div>

      {/* ── Search bar ── */}
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

      {/* ── Category filter pills ── */}
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

      {/* ── Content area: loading / error / empty / grid ── */}
      {loading ? (
        <div className="state-msg">
          <div className="loading-spinner" />
          <span>Fetching latest headlines…</span>
        </div>
      ) : error ? (
        <div className="state-msg error">
          <span>{error}</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="state-msg">
          <span>No articles found. Try a different search or category.</span>
        </div>
      ) : (
        <>
          {/* Results count */}
          <div className="results-header">
            <span className="results-count">{articles.length} articles found</span>
          </div>

          {/* News card grid */}
          <div className="news-grid">
            {articles.map((article, i) => (
              <NewsCard
                key={`${article.url}-${i}`}
                article={article}
                user={user}
                category={category || 'general'}
                alreadySaved={savedUrls.has(article.url)}
                onSaved={onArticleSaved}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}