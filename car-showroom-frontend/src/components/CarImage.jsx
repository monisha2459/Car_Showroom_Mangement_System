import { useState } from 'react'
import './CarImage.css'

// Map Honda model names to reliable image URLs
const HONDA_IMAGES = {
  'City':    'https://www.hondacarindia.com/content/dam/honda-car-india/images/all-cars/city/city-overview/new-city/honda-new-city.png',
  'Amaze':   'https://www.hondacarindia.com/content/dam/honda-car-india/images/all-cars/amaze/overview/amaze-new/honda-amaze.png',
  'Elevate': 'https://www.hondacarindia.com/content/dam/honda-car-india/images/all-cars/elevate/overview/elevate-2024/honda-elevate.png',
  'WR-V':    'https://www.hondacarindia.com/content/dam/honda-car-india/images/all-cars/wr-v/overview/honda-wrv.png',
  'Jazz':    'https://www.hondacarindia.com/content/dam/honda-car-india/images/all-cars/jazz/overview/honda-jazz.png',
  'CR-V':    'https://www.hondacarindia.com/content/dam/honda-car-india/images/all-cars/cr-v/overview/honda-crv.png',
  'HR-V':    'https://www.hondacarindia.com/content/dam/honda-car-india/images/all-cars/hr-v/overview/honda-hrv.png',
}

// Color map for card backgrounds
const MODEL_COLORS = {
  'City':    { bg: '#e8f4fd', accent: '#1a6fb0', emoji: '🚗' },
  'Amaze':   { bg: '#fde8e8', accent: '#cc0000', emoji: '🚘' },
  'Elevate': { bg: '#e8fdf0', accent: '#1a7a3c', emoji: '🚙' },
  'WR-V':    { bg: '#fdf6e8', accent: '#b07a1a', emoji: '🚕' },
  'Jazz':    { bg: '#f0e8fd', accent: '#6b1ab0', emoji: '🚖' },
  'CR-V':    { bg: '#e8fdf9', accent: '#1a7a6b', emoji: '🛻' },
  'HR-V':    { bg: '#fde8f5', accent: '#b01a7a', emoji: '🚐' },
}

function getModelKey(model) {
  for (const key of Object.keys(HONDA_IMAGES)) {
    if (model && model.includes(key)) return key
  }
  return null
}

export default function CarImage({ model, imageUrl, className = '', style = {} }) {
  const [imgFailed, setImgFailed] = useState(false)
  const modelKey = getModelKey(model)
  const fallbackUrl = modelKey ? HONDA_IMAGES[modelKey] : null
  const colors = MODEL_COLORS[modelKey] || { bg: '#f0f0f0', accent: '#cc0000', emoji: '🚗' }

  const srcToUse = (!imgFailed && imageUrl) ? imageUrl
                 : (!imgFailed && fallbackUrl) ? fallbackUrl
                 : null

  if (srcToUse && !imgFailed) {
    return (
      <img
        src={srcToUse}
        alt={model}
        className={className}
        style={style}
        onError={() => setImgFailed(true)}
      />
    )
  }

  // Styled fallback card
  return (
    <div className="car-img-fallback" style={{ background: colors.bg, ...style }}>
      <div className="car-img-emoji">{colors.emoji}</div>
      <div className="car-img-model" style={{ color: colors.accent }}>
        Honda {modelKey || model}
      </div>
      <div className="car-img-badge" style={{ background: colors.accent }}>
        2024
      </div>
    </div>
  )
}
