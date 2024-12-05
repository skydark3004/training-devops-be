export function decodeBase64CredentialsFromVietQr(encodedCredentials: string): { username: string; password: string } {
  const decoded = atob(encodedCredentials);

  const [username, password] = decoded.split(':');

  return { username, password };
}
