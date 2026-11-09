export function parseMealTags(value: string): string[] {
  const seen = new Set<string>();

  return value
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => {
      if (!tag) return false;

      const normalizedTag = tag.toLowerCase();
      if (seen.has(normalizedTag)) return false;

      seen.add(normalizedTag);
      return true;
    });
}
