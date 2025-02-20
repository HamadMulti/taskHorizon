export const decodeToken = (token: string) => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.warn(error);
    return null;
  }
};

export const isTokenExpired = (token: string) => {
  const decoded = decodeToken(token);
  if (!decoded) {
    return true;
  }
  const expiry = decoded.exp * 1000;
  return Date.now() > expiry;
};

export const expireDate = (token: string): number | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return null;
  }

  const expiry = decoded.exp * 1000;
  const now = Date.now();

  const timeDifference = expiry - now;

  const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return daysRemaining;
};
