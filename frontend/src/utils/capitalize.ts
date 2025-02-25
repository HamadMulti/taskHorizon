function capitalizeUsername(username: string): string {
  return username.charAt(0).toUpperCase() + username.slice(1);
}

export default capitalizeUsername;