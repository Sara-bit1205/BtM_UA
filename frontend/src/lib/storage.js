import { supabase } from './supabase'

export const STORAGE_BUCKETS = {
  avatars: 'avatars',
  characterCovers: 'character-covers',
  filmsCover: 'films-cover',
  universesImages: 'universes_images',
  gallery: 'gallery',
  characterMedia: 'character-media',
  audioFiles: 'audio-files',
}

export function getPublicUrl(bucket, path) {
  if (!path) return null

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data?.publicUrl ?? null
}

export function getAvatarUrl(value, defaultAvatar = 'default-avatar.jpg') {
  const finalValue = value || defaultAvatar

  if (!finalValue) return null

  if (finalValue.startsWith('http://') || finalValue.startsWith('https://')) {
    return finalValue
  }

  return getPublicUrl(STORAGE_BUCKETS.avatars, finalValue)
}


export async function removeFiles(bucket, paths = []) {
  const validPaths = paths.filter(Boolean)
  if (validPaths.length === 0) return true

  const { error } = await supabase.storage.from(bucket).remove(validPaths)
  if (error) throw error

  return true
}

export async function uploadFile(bucket, filePath, file, options = {}) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, options)

  if (error) throw error
  return data
}

export async function downloadFile(bucket, path) {
  const { data, error } = await supabase.storage.from(bucket).download(path)
  if (error) throw error
  return data
}

export function getFileExtension(path) {
  if (!path) return ''
  return path.split('.').pop() || ''
}
