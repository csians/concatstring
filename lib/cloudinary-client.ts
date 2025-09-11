// Client-side Cloudinary upload utility
export const uploadToCloudinary = async (
  file: File,
  type: "blog" | "contact" // choose preset type
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    // Add file
    formData.append("file", file);

    // Choose preset based on type
    const uploadPreset =
      type === "blog"
        ? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_BLOG
        : process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_CONTACT;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    // Debug logging
    console.log("Cloudinary config:", {
      cloudName,
      uploadPreset,
      type,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Validate required environment variables
    if (!cloudName) {
      reject(new Error("Cloudinary cloud name is not configured"));
      return;
    }

    if (!uploadPreset) {
      reject(new Error(`Upload preset for ${type} is not configured`));
      return;
    }

    formData.append("upload_preset", uploadPreset);

    // Cloud name
    formData.append("cloud_name", cloudName);

    // Folder name (dynamic)
    const folderName =
      type === "blog" ? "blog-submissions" : "contact-submissions";
    formData.append("folder", folderName);

    // Upload to Cloudinary
    fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Cloudinary response:", data);
        
        if (data.secure_url) {
          resolve(data.secure_url);
        } else if (data.url) {
          // Fallback to regular URL if secure_url is not available
          resolve(data.url);
        } else {
          console.error("Unexpected Cloudinary response:", data);
          reject(new Error(`Upload failed: No URL returned. Response: ${JSON.stringify(data)}`));
        }
      })
      .catch((error) => {
        console.error("Upload error:", error);
        reject(new Error(`Upload failed: ${error.message}`));
      });
  });
};
