export const getCloudinaryPublicId = (imageUrl) => {
  try {
    if (!imageUrl) return null;

    const parts = imageUrl.split("/");
    // Remove empty strings and get the part before 'public'
    const publicIndex = parts.findIndex((part) => part === "public");

    if (publicIndex > 0) {
      return parts[publicIndex - 1]; // Return the segment just before 'public'
    }

    // Fallback: extract filename without extension (original behavior)
    const fallbackId = imageUrl.slice(
      imageUrl.lastIndexOf("/") + 1,
      imageUrl.lastIndexOf("."),
    );

    return fallbackId || null;
  } catch (error) {
    console.error("Error extracting Cloudinary public ID:", error);
    return null;
  }
};
