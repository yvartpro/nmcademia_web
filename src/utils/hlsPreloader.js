/**
 * Utility to fetch and parse HLS playlists to preload initial video chunks.
 */
export async function preloadHlsVideo(url) {
  if (!url || typeof url !== 'string') return;
  
  try {
    const playlistText = await fetchPlaylist(url);
    if (!playlistText) return;

    let targetPlaylistUrl = url;
    let variantPlaylistText = playlistText;

    // Check if it's a master playlist
    if (playlistText.includes('#EXT-X-STREAM-INF')) {
      const variantUrl = extractFirstVariantPlaylist(playlistText, url);
      if (!variantUrl) return;
      targetPlaylistUrl = variantUrl;
      variantPlaylistText = await fetchPlaylist(variantUrl);
      if (!variantPlaylistText) return;
    }

    const segments = extractFirstSegments(variantPlaylistText, targetPlaylistUrl, 3);
    for (const segment of segments) {
      // Fetch and ignore result to put it in browser cache
      fetch(segment, { cache: 'force-cache' }).catch(() => {
        // Ignore fetch errors during preloading
      });
    }
  } catch (err) {
    console.warn('Failed to preload HLS video:', url, err);
  }
}

async function fetchPlaylist(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    return null;
  }
}

function extractFirstVariantPlaylist(masterText, baseUrl) {
  const lines = masterText.split('\n').map(l => l.trim());
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('#EXT-X-STREAM-INF')) {
      // The next non-empty line should be the playlist URL
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j];
        if (nextLine && !nextLine.startsWith('#')) {
          return new URL(nextLine, baseUrl).href;
        }
      }
    }
  }
  return null;
}

function extractFirstSegments(playlistText, baseUrl, maxSegments = 3) {
  const lines = playlistText.split('\n').map(l => l.trim());
  const segments = [];
  
  for (const line of lines) {
    if (line && !line.startsWith('#')) {
      segments.push(new URL(line, baseUrl).href);
      if (segments.length >= maxSegments) break;
    }
  }
  
  return segments;
}
