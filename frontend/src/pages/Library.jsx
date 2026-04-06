/**
 * Library.jsx — User's saved articles page.
 *
 * Features:
 *   - Fetches all bookmarked articles from Supabase (via backend)
 *   - Search bar to filter saved articles by title or description
 *   - Category filter pills (based on categories present in saved articles)
 *   - Remove button to delete an article from the library
 *   - Shows AI summary if one was saved with the article
 *
 * Data flow:
 *   1. On mount → fetch all saved articles for the logged-in user
 *   2. Search + category filters work client-side (no extra API calls)
 *   3. Remove sends a DELETE request, then removes from local state
 */

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { supabase } from '../supabaseClient'
import './Library.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function Library({ user }) {
  // ───── State ─────
  const [articles, setArticles] = useState([])   // all saved articles from DB
  const [loading, setLoading] = useState(true)    // initial fetch loading
  const [error, setError] = useState(null)        // error message
  const [search, setSearch] = useState('')        // search input
  const [activeCategory, setActiveCategory] = useState('')  // selected category filter

  /**
   * Fetch all saved articles for this user on mount.
   */
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
        console.error('Failed to fetch library:', err)
        setError("Couldn't load your saved articles. Try refreshing.")
      }
      setLoading(false)
    }

    if (user?.id) fetchSaved()
  }, [user.id])

  /**
   * Delete a saved article by its database ID.
   */
  const removeArticle = async (id) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      await axios.delete(`${BACKEND}/api/saved/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Remove from local state so the UI updates instantly
      setArticles(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      console.error('Failed to remove article:', err)
      alert('Failed to remove the article. Please try again.')
    }
  }

  /**
   * Build a list of unique categories from the saved articles.
   * This powers the category filter pills dynamically.
   */
  const availableCategories = useMemo(() => {
    const cats = new Set()
    articles.forEach(a => {
      if (a.category) cats.add(a.category)
    })
    return Array.from(cats).sort()
  }, [articles])

  /**
   * Filter articles based on search query and active category.
   * This runs client-side so there's no extra API call.
   */
  const filteredArticles = useMemo(() => {
    let result = articles

    // Filter by category
    if (activeCategory) {
      result = result.filter(a => a.category === activeCategory)
    }

    // Filter by search text (checks title and description)
    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter(a =>
        (a.title || '').toLowerCase().includes(query) ||
        (a.description || '').toLowerCase().includes(query)
      )
    }

    return result
  }, [articles, search, activeCategory])

  // ─── Loading state ───
  if (loading) return (
    <div className="state-msg">
      <div className="loading-spinner" />
      <span>Loading your library…</span>
    </div>
  )

  // ─── Error state ───
  if (error) return (
    <div className="state-msg error">
      <span>{error}</span>
    </div>
  )

  return (
    <div className="library">
      {/* ── Header ── */}
      <div className="library-header">
        <h2>My Library</h2>
        <p>{articles.length} saved article{articles.length !== 1 ? 's' : ''}</p>
      </div>

      {/* ── Search & filter controls ── */}
      {articles.length > 0 && (
        <div className="library-controls">
          {/* Search bar */}
          <div className="library-search">
            <input
              type="text"
              placeholder="Search your saved articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Category filter pills — only shown if we have categories */}
          {availableCategories.length > 1 && (
            <div className="library-categories">
              <button
                className={activeCategory === '' ? 'active' : ''}
                onClick={() => setActiveCategory('')}
              >
                All
              </button>
              {availableCategories.map(cat => (
                <button
                  key={cat}
                  className={activeCategory === cat ? 'active' : ''}
                  onClick={() => setActiveCategory(cat === activeCategory ? '' : cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Content ── */}
      {articles.length === 0 ? (
        <div className="state-msg">
          <span>Your library is empty. Save articles from the Home page to read later!</span>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="state-msg">
          <span>No articles match your search. Try different keywords.</span>
        </div>
      ) : (
        <div className="library-grid">
          {filteredArticles.map(article => {
            // DB stores column as "urltoimage" (lowercase)
            const thumbnail = article.urltoimage || article.urlToImage || null
            const savedDate = article.created_at
              ? new Date(article.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })
              : null

            return (
              <div key={article.id} className="library-card">
                {/* Thumbnail */}
                <div className="card-thumbnail">
                  {thumbnail ? (
                    <img src={thumbnail} alt={article.title} loading="lazy" />
                  ) : (
                    <div className="thumb-fallback">
                      <span className="thumb-fallback-icon">📰</span>
                      <span className="thumb-fallback-text">No Image</span>
                    </div>
                  )}
                  {/* Category badge if available */}
                  {article.category && (
                    <span className="card-source">
                      {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="card-content">
                  <h3>{article.title}</h3>
                  {article.description && <p>{article.description}</p>}

                  {/* AI Summary if saved */}
                  {article.summary && (
                    <div className="summary">
                      <strong>Summary</strong>
                      {article.summary}
                    </div>
                  )}

                  {/* Saved date */}
                  {savedDate && <span className="saved-date">Saved {savedDate}</span>}

                  {/* Actions */}
                  <div className="card-actions">
                    <a href={article.url} target="_blank" rel="noreferrer" className="btn-read">
                      Read Article
                    </a>
                    <button onClick={() => removeArticle(article.id)} className="remove-btn">
                      Remove
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