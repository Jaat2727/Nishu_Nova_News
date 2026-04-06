/**
 * NewsCard.jsx — A single news article card.
 *
 * Props:
 *   article       — The article object from NewsAPI (title, description, url, etc.)
 *   user          — The logged-in user (needed for saving)
 *   category      — Current category being viewed (saved along with the article)
 *   alreadySaved  — Boolean, true if the user already bookmarked this article
 *   onSaved       — Callback when an article is saved (parent updates its list)
 *
 * Features:
 *   - Shows thumbnail with fallback if image is missing/broken
 *   - Source name badge overlay
 *   - "Summarize" button → calls the AI backend
 *   - "Save" button → bookmarks to Supabase
 */

import { useState } from 'react'
import axios from 'axios'
import { supabase } from '../supabaseClient'
import './NewsCard.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function NewsCard({ article, user, category = 'general', alreadySaved = false, onSaved }) {
  // ───── State ─────
  const [summary, setSummary] = useState('')            // AI-generated summary text
  const [loadingSummary, setLoadingSummary] = useState(false)  // loading spinner for AI
  const [saved, setSaved] = useState(alreadySaved)      // whether this card is bookmarked
  const [imgError, setImgError] = useState(false)       // true if thumbnail failed to load

  // Determine if we have a valid image to show
  const hasImage = article.urlToImage && !imgError

  /**
   * Calls the backend AI endpoint to summarize this article.
   * The summary is shown inline below the description.
   */
  const getSummary = async () => {
    if (summary) return // already have one — skip

    setLoadingSummary(true)
    try {
      const res = await axios.post(`${BACKEND}/api/ai/summarize`, {
        title: article.title,
        description: article.description || article.title
      })
      setSummary(res.data.summary)
    } catch (err) {
      console.error('AI Summary failed:', err)
      setSummary('Could not generate summary. Please try again later.')
    }
    setLoadingSummary(false)
  }

  /**
   * Saves this article to the user's Supabase library.
   * Sends the JWT token for RLS authentication.
   */
  const saveArticle = async () => {
    if (saved) return // already saved

    try {
      // Get the current auth session for the JWT
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      await axios.post(`${BACKEND}/api/saved`, {
        user_id: user.id,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage || null,
        summary: summary || null,
        category: category   // ← save which category this article was in
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setSaved(true)
      if (onSaved) onSaved(article.url) // notify parent
    } catch (err) {
      console.error('Failed to save article:', err)
      alert("Couldn't save the article. Please try again.")
    }
  }

  // Extract source name for the badge
  const sourceName = article.source?.name || 'News'

  return (
    <div className="news-card">
      {/* ── Thumbnail ── */}
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
            <span className="thumb-fallback-icon">📰</span>
            <span className="thumb-fallback-text">No Image</span>
          </div>
        )}

        {/* Source badge (e.g., "BBC News") */}
        <span className="card-source">{sourceName}</span>

        {/* Green "Saved" badge if bookmarked */}
        {saved && <span className="card-saved-badge">Saved</span>}
      </div>

      {/* ── Content ── */}
      <div className="card-content">
        <h3>{article.title}</h3>
        {article.description && <p>{article.description}</p>}

        {/* AI Summary — shows after pressing Summarize */}
        {summary && (
          <div className="summary">
            <strong>Summary</strong>
            {summary}
          </div>
        )}

        {/* ── Action buttons ── */}
        <div className="card-actions">
          <a href={article.url} target="_blank" rel="noreferrer" className="btn-read">
            Read Article
          </a>

          <button
            onClick={getSummary}
            disabled={loadingSummary || !!summary}
            className={`btn-ai ${loadingSummary ? 'loading' : ''}`}
          >
            {loadingSummary ? 'Summarizing…' : summary ? 'Summarized' : 'Summarize'}
          </button>

          {/* Save button — only shown if user is logged in */}
          {user && (
            <button
              onClick={saveArticle}
              disabled={saved}
              className={`btn-save ${saved ? 'saved' : ''}`}
            >
              {saved ? 'Saved' : 'Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}