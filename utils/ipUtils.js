export function getClientIP(request) {
  // Try different headers that might contain the real IP
  const headers = [
    'x-real-ip',
    'x-forwarded-for', 
    'cf-connecting-ip',
    'fastly-client-ip',
    'x-cluster-client-ip',
    'x-forwarded',
    'forwarded-for',
    'forwarded'
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      return value.split(',')[0].trim();
    }
  }

  // Fallback to a default or empty string
  return 'unknown';
}