// ============================================================
// Referencia: De Mongoose a Supabase
// ============================================================

// ANTES (Mongoose):
// const userSchema = new Schema({
//   username: String,
//   email: String,
//   password: String,
//   role: { type: String, enum: ['user', 'admin'], default: 'user' },
//   createdAt: { type: Date, default: Date.now }
// })

// AHORA (Supabase):

const { getSupabase } = require('../config/db')

// ============================================================
// USERS
// ============================================================

// Crear usuario
async function createUser(userData) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('users')
    .insert([{
      username: userData.username,
      email: userData.email,
      password: userData.password, // IMPORTANTE: Hashéalo con bcryptjs antes
      name: userData.name,
      role: userData.role || 'user',
      birth_date: userData.birthDate,
      is_active: true
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

// Obtener usuario por email
async function getUserByEmail(email) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
  
  if (error) throw error
  return data
}

// Obtener usuario por ID
async function getUserById(userId) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// Actualizar usuario
async function updateUser(userId, updates) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
  
  if (error) throw error
  return data[0]
}

// ============================================================
// CHARACTERS
// ============================================================

// Crear personaje
async function createCharacter(characterData) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('characters')
    .insert([{
      name: characterData.name,
      slug: characterData.slug,
      cover_image: characterData.coverImage,
      description: characterData.description,
      story: characterData.story,
      creation_date: characterData.creationDate,
      first_appearance: characterData.firstAppearance,
      biological_origin: characterData.biologicalOrigin,
      mbti_type_id: characterData.mbtiTypeId,
      created_by: characterData.createdBy
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

// Obtener todos los personajes
async function getAllCharacters() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('characters')
    .select(`
      *,
      mbti_types(*),
      universes_categories:character_universe_categories(
        universe_categories(*)
      ),
      personality_tags:character_personality_tags(
        personality_tags(*)
      )
    `)
  
  if (error) throw error
  return data
}

// Obtener personaje por ID con todo
async function getCharacterById(characterId) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('characters')
    .select(`
      *,
      mbti_types(*),
      universes_categories:character_universe_categories(universe_categories(*)),
      personality_tags:character_personality_tags(personality_tags(*)),
      filmography(*),
      audios(*),
      community_photos(*),
      comments(*, users(username, avatar))
    `)
    .eq('id', characterId)
    .single()
  
  if (error) throw error
  return data
}

// Obtener personaje por slug
async function getCharacterBySlug(slug) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  return data
}

// Actualizar personaje
async function updateCharacter(characterId, updates) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('characters')
    .update(updates)
    .eq('id', characterId)
    .select()
  
  if (error) throw error
  return data[0]
}

// Buscar personajes por nombre o descripción
async function searchCharacters(query) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
  
  if (error) throw error
  return data
}

// ============================================================
// MBTI TYPES
// ============================================================

// Obtener todos los tipos MBTI
async function getAllMBTITypes() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('mbti_types')
    .select('*')
  
  if (error) throw error
  return data
}

// Obtener tipo MBTI por código
async function getMBTITypeByCode(code) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('mbti_types')
    .select('*')
    .eq('code', code)
    .single()
  
  if (error) throw error
  return data
}

// ============================================================
// FAVORITES
// ============================================================

// Agregar a favoritos
async function addToFavorites(userId, characterId) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('favorites')
    .insert([{
      user_id: userId,
      character_id: characterId
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

// Eliminar de favoritos
async function removeFromFavorites(userId, characterId) {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('character_id', characterId)
  
  if (error) throw error
}

// Obtener favoritos del usuario
async function getUserFavorites(userId) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('favorites')
    .select('characters(*)')
    .eq('user_id', userId)
  
  if (error) throw error
  return data.map(fav => fav.characters)
}

// Verificar si un personaje es favorito
async function isFavorite(userId, characterId) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('character_id', characterId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data !== null
}

// ============================================================
// COMMENTS
// ============================================================

// Crear comentario
async function createComment(userId, characterId, comment) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('comments')
    .insert([{
      user_id: userId,
      character_id: characterId,
      comment: comment
    }])
    .select('*, users(username, avatar)')
  
  if (error) throw error
  return data[0]
}

// Obtener comentarios del personaje
async function getCharacterComments(characterId) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('comments')
    .select('*, users(username, avatar, id)')
    .eq('character_id', characterId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Eliminar comentario
async function deleteComment(commentId) {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
  
  if (error) throw error
}

// ============================================================
// PERSONALITY TAGS
// ============================================================

// Obtener todos los tags
async function getAllPersonalityTags() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('personality_tags')
    .select('*')
  
  if (error) throw error
  return data
}

// Agregar tag a personaje
async function addTagToCharacter(characterId, tagId) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('character_personality_tags')
    .insert([{
      character_id: characterId,
      personality_tag_id: tagId
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

// ============================================================
// COMMUNITY PHOTOS
// ============================================================

// Subir foto de comunidad
async function uploadCommunityPhoto(userId, characterId, imageUrl, description) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('community_photos')
    .insert([{
      user_id: userId,
      character_id: characterId,
      image_url: imageUrl,
      description: description,
      approved: false
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

// Obtener fotos aprobadas de un personaje
async function getApprovedPhotos(characterId) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('community_photos')
    .select('*, users(username, avatar)')
    .eq('character_id', characterId)
    .eq('approved', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Aprobar foto
async function approvePhoto(photoId) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('community_photos')
    .update({ approved: true })
    .eq('id', photoId)
    .select()
  
  if (error) throw error
  return data[0]
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  createCharacter,
  getAllCharacters,
  getCharacterById,
  getCharacterBySlug,
  updateCharacter,
  searchCharacters,
  getAllMBTITypes,
  getMBTITypeByCode,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  isFavorite,
  createComment,
  getCharacterComments,
  deleteComment,
  getAllPersonalityTags,
  addTagToCharacter,
  uploadCommunityPhoto,
  getApprovedPhotos,
  approvePhoto
}
