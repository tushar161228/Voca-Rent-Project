/**
 * Generates a slug from a given string.
 * @param {string} text - The input text to convert to a slug.
 * @returns {string} - The generated slug.
 */
export function generateSlug(text) {
  if (typeof text !== "string") {
    throw new Error("Input must be a string");
  }

  return text
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading and trailing whitespace
    .replace(/[^a-z0-9\s-]/g, "") // Remove invalid characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Collapse multiple hyphens
}
