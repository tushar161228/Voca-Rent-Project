/**
 * Limits the length of a given text and appends "..." if it exceeds the max length.
 * @param {string} text - The input text to limit.
 * @param {number} maxLength - The maximum allowed length of the text.
 * @returns {string} - The limited text with "..." appended if needed.
 */
export function limitTextLength(text = "", maxLength) {
  if (typeof text !== "string") {
    throw new Error("Input must be a string");
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength) + "...";
}
