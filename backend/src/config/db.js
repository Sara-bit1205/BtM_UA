/*Es el archivo que conecta el backend con Supabase.
Crea el cliente de Supabase usando SUPABASE_URL y SUPABASE_KEY, y expone connectDB() y getSupabase().

Eso significa que todos los _supabase.js dependen de este archivo para hacer consultas.*/

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

let supabase

const connectDB = async () => {
  try {
    supabase = createClient(supabaseUrl, supabaseKey)
    // Verificar conexión haciendo una query simple a tabla pública (no bloqueada por RLS)
    const { data, error } = await supabase.from('mbti_types').select('count', { count: 'exact', head: true })
    
    if (error) throw error
    console.log('Supabase PostgreSQL conectado')
  } catch (error) {
    console.error('Error al conectar Supabase:', error.message)
    process.exit(1)
  }
}

const getSupabase = () => {
  if (!supabase) {
    throw new Error('Base de datos no inicializada. Llama connectDB() primero.')
  }
  return supabase
}

module.exports = { connectDB, getSupabase }
