<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use InvalidArgumentException;

/**
 * Profile pictures.
 *
 * Deliberately separate from tenant media: an avatar belongs to a person, not
 * to a workspace, so it does not count against anyone's storage plan and is not
 * listed in the media library.
 *
 * Unlike the platform logo this refuses SVG. An avatar is rendered in the app
 * chrome beside other people's names, and an SVG is a document that can carry
 * script; the sanitiser is good but there is no reason to accept the format
 * here when a raster image does the job.
 */
class AvatarService
{
    private const DIRECTORY = 'avatars';

    /** @var array<string, string> mime => extension */
    private const ALLOWED = [
        'image/png' => 'png',
        'image/jpeg' => 'jpg',
        'image/webp' => 'webp',
        'image/gif' => 'gif',
    ];

    /** Max upload size in bytes. A profile picture has no business being larger. */
    private const MAX_BYTES = 2 * 1024 * 1024;

    /** Longest edge we keep, so one upload cannot be a 8000px original. */
    private const MAX_EDGE = 4000;

    /**
     * Stores an uploaded avatar for the user and returns its public URL.
     */
    public function store(User $user, UploadedFile $file): string
    {
        $mime = $file->getMimeType() ?: $file->getClientMimeType();
        if (! array_key_exists($mime, self::ALLOWED)) {
            throw new InvalidArgumentException('Use a PNG, JPEG, WebP or GIF image.');
        }

        $contents = $file->get();
        if ($contents === false || $contents === '') {
            throw new InvalidArgumentException('The uploaded file is empty.');
        }
        if (strlen($contents) > self::MAX_BYTES) {
            throw new InvalidArgumentException('Keep the picture under 2 MB.');
        }

        // The declared mime is the client's word for it. Reading the actual
        // image header is what stops a renamed script being stored as a .png.
        $info = @getimagesizefromstring($contents);
        if (! is_array($info) || empty($info[0]) || empty($info[1])) {
            throw new InvalidArgumentException('That file is not a valid image.');
        }
        if ($info[0] > self::MAX_EDGE || $info[1] > self::MAX_EDGE) {
            throw new InvalidArgumentException('That image is too large. Keep it under 4000 pixels on each side.');
        }

        $disk = Storage::disk($this->disk());
        $path = self::DIRECTORY.'/'.Str::uuid()->toString().'.'.self::ALLOWED[$mime];
        $disk->put($path, $contents, 'public');

        $this->deleteStoredFile($user);
        $user->forceFill(['avatar_url' => $path])->save();

        return $this->url($path) ?? '';
    }

    /**
     * Removes the avatar and its file, falling back to initials in the UI.
     */
    public function clear(User $user): void
    {
        $this->deleteStoredFile($user);
        $user->forceFill(['avatar_url' => null])->save();
    }

    /**
     * The public URL for a stored avatar.
     *
     * Google hands us an absolute URL to their CDN rather than a file, so a
     * stored value that is already a URL is passed straight through.
     */
    public function url(?string $path): ?string
    {
        $path = (string) $path;
        if ($path === '') {
            return null;
        }
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return Storage::disk($this->disk())->url($path);
    }

    private function deleteStoredFile(User $user): void
    {
        $previous = (string) ($user->avatar_url ?? '');
        // Nothing to delete for a Google CDN URL - we never stored that file.
        if ($previous === '' || str_starts_with($previous, 'http')) {
            return;
        }

        $disk = Storage::disk($this->disk());
        if ($disk->exists($previous)) {
            $disk->delete($previous);
        }
    }

    private function disk(): string
    {
        $disk = (string) config('uidesired.media_disk', 'public');

        return $disk !== '' ? $disk : 'public';
    }
}
