/**
 * Resolves local media paths to absolute backend URLs or returns external URLs.
 */
export const getMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const baseUrl = apiUrl.split("/api")[0];
  return `${baseUrl}${url}`;
};

/**
 * Converts standard YouTube links to embeddable formats for iframes.
 * Returns the embed URL if successful, otherwise returns the original URL.
 */
export const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";

  try {
    // If it's already an embed URL, return it directly
    if (url.includes("/embed/")) return url;

    const youtubeWatchMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    );
    if (youtubeWatchMatch) {
      return `https://www.youtube.com/embed/${youtubeWatchMatch[1]}`;
    }
    return url; // If not a recognized YouTube format, return original URL
  } catch {
    return url; // If URL parsing fails, return original URL
  }
};
