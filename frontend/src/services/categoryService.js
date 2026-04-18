/*Este nuevo servicio ya no llama a una ruta genérica /categories, sino
 que trabaja directamente con las tablas reales de Supabase que 
 representan tus categorías (universes, personality_tags y mbti_types). 
 Para leer, devuelve los tres grupos; y para crear, editar o borrar, 
 necesita que le indiques qué tipo de categoría quieres modificar,
  dejando que Supabase y las policies RLS controlen los permisos 
  automáticamente.*/

import { supabase } from '../lib/supabase'
import { getPublicUrl, STORAGE_BUCKETS } from '../lib/storage'
import { getRelationValue } from '../utils/relation'

//Es un mapa que traduce el tipo de categoría → tabla real.
const TABLE_MAP = {
  universes: 'universes',
  personality_tags: 'personality_tags',
  mbti_types: 'mbti_types',
}


const categoryService = {
  //Obtenemos tds las categorías
  async getAll() {
    //trae los datos de las 3 tablas a la vez y Promise.all espera a que las 3 respuestas lleguen para continuar(en paralelo)
    const [universesRes, tagsRes, mbtiRes] = await Promise.all([
      supabase.from('universes').select('*').order('name'),
      supabase.from('personality_tags').select('*').order('name'),
      supabase.from('mbti_types').select('*').order('code'),
    ])

    //validamos cada respuesta y si hay error, lo lanzamos
    if (universesRes.error) throw universesRes.error
    if (tagsRes.error) throw tagsRes.error
    if (mbtiRes.error) throw mbtiRes.error

    return {
      universes: universesRes.data,
      personalityTags: tagsRes.data,
      mbtiTypes: mbtiRes.data,
    }
  },

  //Busca una categoría por su id, necesita saber el tipo(universes, personality_tags o mbti_types) para saber en qué tabla buscar
  async getById(type, id) {
    const table = TABLE_MAP[type]
    if (!table) throw new Error('Tipo de categoría no válido')
    
    //.from(table) → selecciona la tabla correcta
    //.select('*') → selecciona todas las columnas
    //.eq('id', id) → filtra por id (FIltro WHERE id = ?)
    //.single() → espera un solo resultado (en vez de una lista)
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single()

    if (error) throw error
    return data
  },

  //Inserta una nueva categoría, necesita el tipo para saber en qué tabla insertar y los valores a insertar
  async create(type, values) {
    const table = TABLE_MAP[type]
    if (!table) throw new Error('Tipo de categoría no válido')
    
    // .insert(values) → inserta los valores en la tabla
    // .select().single() → devuelve el nuevo registro insertado (con su id generado)
    const { data, error } = await supabase.from(table).insert(values).select().single()

    if (error) throw error
    return data
  },

  //Actualiza una categoría existente, necesita el tipo para saber en qué tabla actualizar, el id de la categoría y los valores a actualizar
  async update(type, id, values) {
    const table = TABLE_MAP[type]
    if (!table) throw new Error('Tipo de categoría no válido')

    const { data, error } = await supabase.from(table).update(values).eq('id', id).select().single()

    if (error) throw error
    return data
  },

  //Elimina una categoría, necesita el tipo para saber en qué tabla eliminar y el id de la categoría
  async remove(type, id) {
    const table = TABLE_MAP[type]
    if (!table) throw new Error('Tipo de categoría no válido')
    
    // .delete() → elimina el registro
    // .eq('id', id) → filtra por id (WHERE id = ?)
    const { error } = await supabase.from(table).delete().eq('id', id)

    if (error) throw error
    return true
  },

  async getUniverseDetail(universeName) {
    const { data: universeData, error: universeError } = await supabase
      .from('universes')
      .select(`
        name,
        description,
        image_path,
        characters (
          id,
          name,
          slug,
          cover_path,
          mbti_types (code)
        )
      `)
      .eq('name', universeName)
      .single()

    if (universeError) throw universeError
    if (!universeData) return null

    const characterIds = (universeData.characters || []).map((c) => c.id)

    let favData = []

    if (characterIds.length > 0) {
      const { data: favCharacters, error: favError } = await supabase
        .from('character_favorite_counts')
        .select('character_id, total_favorites')
        .in('character_id', characterIds)

      if (favError) throw favError
      favData = favCharacters || []
    }

    const todosLosPersonajes = (universeData.characters || []).map((personaje) => {
      const fav = favData.find((f) => f.character_id === personaje.id)

      return {
        id: personaje.id,
        name: personaje.name,
        slug: personaje.slug,
        coverUrl: getPublicUrl(STORAGE_BUCKETS.characterCovers, personaje.cover_path),
        mbtiType: getRelationValue(personaje.mbti_types, 'code') || '—',
        totalFavorites: fav ? fav.total_favorites : 0,
      }
    })

    todosLosPersonajes.sort((a, b) => b.totalFavorites - a.totalFavorites)

    const personajesPopulares = todosLosPersonajes.slice(0, 3)
    const personajesRestantes = todosLosPersonajes.slice(3)

    return {
      name: universeData.name,
      description: universeData.description,
      imageUrl: universeData.image_path
        ? getPublicUrl(STORAGE_BUCKETS.universesImages, universeData.image_path)
        : todosLosPersonajes[0]?.coverUrl || null,
      populares: personajesPopulares,
      explorar: personajesRestantes,
    }
  },

}

export default categoryService