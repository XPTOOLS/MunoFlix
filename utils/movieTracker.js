let currentSessionId = null;
let heartbeatInterval = null;

export const startMovieTracking = async (movieId, title, poster, userId, userIp, playerType) => {
  try {
    const response = await fetch('/api/movies/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movieId,
        title,
        poster,
        userId,
        userIp,
        playerType
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      currentSessionId = data.sessionId;
      
      // Start heartbeat every 30 seconds
      heartbeatInterval = setInterval(() => {
        sendHeartbeat();
      }, 30000);

      // Send heartbeat when page is closed
      window.addEventListener('beforeunload', sendHeartbeat);
      window.addEventListener('pagehide', sendHeartbeat);

      console.log('Movie tracking started:', data.sessionId);
      return data.sessionId;
    }
  } catch (error) {
    console.error('Failed to start movie tracking:', error);
  }
};

export const sendHeartbeat = async () => {
  if (!currentSessionId) return;

  try {
    await fetch('/api/movies/heartbeat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: currentSessionId
      }),
    });
  } catch (error) {
    console.error('Failed to send heartbeat:', error);
  }
};

export const stopMovieTracking = async (completed = false) => {
  if (!currentSessionId) return;

  try {
    // Clear heartbeat interval
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }

    // Remove event listeners
    window.removeEventListener('beforeunload', sendHeartbeat);
    window.removeEventListener('pagehide', sendHeartbeat);

    // Send stop event
    await fetch('/api/movies/stop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: currentSessionId,
        completed
      }),
    });

    console.log('Movie tracking stopped:', currentSessionId);
    currentSessionId = null;
  } catch (error) {
    console.error('Failed to stop movie tracking:', error);
  }
};

// Get user IP address
export const getUserIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to get IP address:', error);
    return 'unknown';
  }
};