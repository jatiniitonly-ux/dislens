import type { ImageryMetadata } from '../domain/types';
import type { IndianLocation } from '../domain/types';

interface ImageryComparisonProps {
  location: IndianLocation;
  pre: ImageryMetadata;
  post: ImageryMetadata;
  position: number;
  onPositionChange: (position: number) => void;
}

export function ImageryComparison({ location, pre, post, position, onPositionChange }: ImageryComparisonProps) {
  return <section className="imagery-comparison" aria-label="Interactive pre and post imagery comparison">
    <div className="section-heading"><div><span className="eyebrow">INTERACTIVE PRE / POST COMPARISON</span><strong>Drag the divider to compare imagery</strong></div><span className="mode-pill">{position < 50 ? 'Pre-event emphasis' : position > 50 ? 'Post-event emphasis' : '50 / 50 split'}</span></div>
    <div className="comparison-stage">
      <div className="comparison-pane comparison-pre">{pre.catalogAssetHref && <img className="comparison-asset" src={pre.catalogAssetHref} alt="Pre-event satellite asset" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}<span className="comparison-label">PRE · {pre.label}</span><small>{pre.acquisitionDate}</small></div>
      <div className="comparison-pane comparison-post" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>{post.catalogAssetHref && <img className="comparison-asset" src={post.catalogAssetHref} alt="Post-event satellite asset" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}<span className="comparison-label">POST · {post.label}</span><small>{post.acquisitionDate}</small></div>
      <div className="comparison-divider" style={{ left: `${position}%` }} aria-hidden="true" />
    </div>
    <label className="comparison-slider"><span>Pre</span><input type="range" min="0" max="100" value={position} aria-label="Pre and post imagery comparison position" onChange={(event) => onPositionChange(Number(event.target.value))} /><span>Post</span></label>
    <small className="comparison-source">AOI: {location.name}, {location.state} · Sources: {pre.source} · {post.source} · CRS {post.crs} · {post.resolution}</small>
  </section>;
}
