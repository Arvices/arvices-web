export function getInitials(name: string): string {
  if (!name) return "";

  const words = name.trim().split(/\s+/);
  const initials = words.map((word) => word[0].toUpperCase()).slice(0, 2);
  return initials.join("");
}
