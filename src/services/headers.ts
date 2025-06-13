export function createHeaders(token?: string) {
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  if (token) headers.append('Authorization', `Bearer ${token}`);
  return headers;
}