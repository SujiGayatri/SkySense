// Pings the Render backend every 10 minutes to prevent it sleeping
const BACKEND = import.meta.env.VITE_API_URL || "";

export function startKeepAlive() {
  if (!BACKEND) return; // skip in local dev
  
  // Ping immediately on app load
  fetch(`${BACKEND}/api/health`).catch(() => {});
  
  // Then ping every 10 minutes
  setInterval(() => {
    fetch(`${BACKEND}/api/health`).catch(() => {});
  }, 10 * 60 * 1000);
}