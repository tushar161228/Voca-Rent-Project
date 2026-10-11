export function slugToReadableText(slug) {
  // Split the slug into words
  const words = slug?.split(/[-_]/);

  // Capitalize the first letter of each word and join them
  return words
    ?.map(
      (word) => word?.charAt(0).toUpperCase() + word?.slice(1)?.toLowerCase(),
    )
    ?.join(" ");
}
