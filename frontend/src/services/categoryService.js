/*Este nuevo servicio ya no llama a una ruta genérica /categories, sino
 que trabaja directamente con las tablas reales de Supabase que 
 representan tus categorías (universes, personality_tags y mbti_types). 
 Para leer, devuelve los tres grupos; y para crear, editar o borrar, 
 necesita que le indiques qué tipo de categoría quieres modificar,
  dejando que Supabase y las policies RLS controlen los permisos 
  automáticamente.*/

import { supabase } from '../lib/supabase'

const TABLE_MAP = {
  universes: 'universes',
  personality_tags: 'personality_tags',
  mbti_types: 'mbti_types',
}

const categoryService = {
  async getAll() {
    const [universesRes, tagsRes, mbtiRes] = await Promise.all([
      supabase.from('universes').select('*').order('name'),
      supabase.from('personality_tags').select('*').order('name'),
      supabase.from('mbti_types').select('*').order('code'),
    ])

    if (universesRes.error) throw universesRes.error
    if (tagsRes.error) throw tagsRes.error
    if (mbtiRes.error) throw mbtiRes.error

    return {
      universes: universesRes.data,
      personalityTags: tagsRes.data,
      mbtiTypes: mbtiRes.data,
    }
  },

  async getById(type, id) {
    const table = TABLE_MAP[type]
    if (!table) throw new Error('Tipo de categoría no válido')

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(type, values) {
    const table = TABLE_MAP[type]
    if (!table) throw new Error('Tipo de categoría no válido')

    const { data, error } = await supabase
      .from(table)
      .insert(values)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(type, id, values) {
    const table = TABLE_MAP[type]
    if (!table) throw new Error('Tipo de categoría no válido')

    const { data, error } = await supabase
      .from(table)
      .update(values)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async remove(type, id) {
    const table = TABLE_MAP[type]
    if (!table) throw new Error('Tipo de categoría no válido')

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },
}

export default categoryService