import {ArrowPathIcon, PhotoIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {FC, memo, useRef} from 'react';

export const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

interface PhotoUploadAreaProps {
  file: File | null;
  previewUrl: string | null;
  error?: string;
  uploading: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

/**
 * Profile photo picker. Renders a tappable upload area (or a live preview with
 * Change/Remove controls). The hidden file input uses type="file" + accept,
 * so mobile browsers open the photo gallery naturally. No bytes are stored as
 * base64 — the file is uploaded to Neon Object Storage and only the public URL
 * is saved with the testimonial.
 */
const PhotoUploadArea: FC<PhotoUploadAreaProps> = memo(({file, previewUrl, error, uploading, onSelect, onRemove}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = (): void => {
    if (!uploading) inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (selected) onSelect(selected);
  };

  return (
    <div>
      <input
        accept={ACCEPTED_PHOTO_TYPES.join(',')}
        aria-label="Profile photo"
        className="sr-only"
        onChange={handleChange}
        ref={inputRef}
        type="file"
      />

      {file && previewUrl ? (
        <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-neutral-900/60 p-3.5">
          <div className="relative h-14 w-14 shrink-0">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-orange-500 to-cyan-500 opacity-50" />
            <img
              alt="Profile photo preview"
              className="relative h-14 w-14 rounded-full border-2 border-neutral-900 object-cover"
              src={previewUrl}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{file.name}</p>
            <p className="text-xs text-neutral-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              aria-label="Choose a different photo"
              className="rounded-md p-2 text-neutral-400 transition-colors duration-200 hover:bg-white/5 hover:text-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              disabled={uploading}
              onClick={openPicker}
              title="Change photo"
              type="button">
              <ArrowPathIcon className="h-5 w-5" />
            </button>
            <button
              aria-label="Remove photo"
              className="rounded-md p-2 text-neutral-400 transition-colors duration-200 hover:bg-white/5 hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              disabled={uploading}
              onClick={onRemove}
              title="Remove photo"
              type="button">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-white/15 bg-neutral-900/40 px-4 py-6 text-center transition-colors duration-200 hover:border-orange-500/50 hover:bg-neutral-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          disabled={uploading}
          onClick={openPicker}
          type="button">
          <PhotoIcon className="h-7 w-7 text-neutral-500" />
          <span className="text-sm text-neutral-300">Click to choose a profile photo</span>
          <span className="text-xs text-neutral-600">JPG, PNG, or WEBP · up to 5 MB</span>
        </button>
      )}

      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </div>
  );
});

PhotoUploadArea.displayName = 'PhotoUploadArea';
export default PhotoUploadArea;
