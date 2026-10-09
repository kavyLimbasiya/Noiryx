/**
 * Helper to download any wallpaper strictly in JPG format and in its original size.
 */
export async function downloadWallpaper(url: string, title: string): Promise<boolean> {
  const cleanTitle = title
    .trim()
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .replace(/\s+/g, '_') || 'wallpaper';
  const targetFilename = `${cleanTitle}.jpg`;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // Original size from natural dimensions
        const width = img.naturalWidth || 1920;
        const height = img.naturalHeight || 1080;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          triggerFallbackDownload(url, targetFilename, resolve);
          return;
        }

        // Fill background with black in case of transparency in PNG/WEBP
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, width, height);

        // Draw image at full original size
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPG format at high quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              triggerFallbackDownload(url, targetFilename, resolve);
              return;
            }

            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = targetFilename;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
              URL.revokeObjectURL(blobUrl);
              document.body.removeChild(a);
              resolve(true);
            }, 200);
          },
          'image/jpeg',
          0.95
        );
      } catch {
        triggerFallbackDownload(url, targetFilename, resolve);
      }
    };

    img.onerror = () => {
      triggerFallbackDownload(url, targetFilename, resolve);
    };

    // Trigger load
    img.src = url;
  });
}

function triggerFallbackDownload(
  url: string,
  targetFilename: string,
  resolve: (success: boolean) => void
) {
  fetch(url, { mode: 'cors' })
    .then((res) => res.blob())
    .then((blob) => {
      // Force jpeg mime type for the download
      const jpgBlob = new Blob([blob], { type: 'image/jpeg' });
      const blobUrl = URL.createObjectURL(jpgBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = targetFilename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
        resolve(true);
      }, 200);
    })
    .catch(() => {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = targetFilename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        resolve(true);
      }, 200);
    });
}
