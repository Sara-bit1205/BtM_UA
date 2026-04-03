/*QUESTIONS en PersonalityTestPage 
cálculo visual del test en PersonalityTestPage 
mbtiService solo para persistencia en Supabase */

import { supabase } from '../lib/supabase'

//función que calcula el tipo MBTI a partir de las respuestas del test, devuelve un código como "INTJ"
function calculateMbtiType(answers = []) {
  const scores = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  }

  answers.forEach((answer) => {
    if (scores[answer] !== undefined) {
      scores[answer] += 1
    }
  })

  return [
    scores.E >= scores.I ? 'E' : 'I',
    scores.S >= scores.N ? 'S' : 'N',
    scores.T >= scores.F ? 'T' : 'F',
    scores.J >= scores.P ? 'J' : 'P',
  ].join('')
}

//Definimos el servicio de MBTI, que tiene funciones para enviar el resultado del test y obtener los resultados del usuario
const mbtiService = {
  //Envía el resultado del test a Supabase, guardándolo en la tabla mbti_results con el id del usuario y el id del tipo MBTI correspondiente
  async submitResult(answers) {
    //Primero obtenemos el usuario autenticado para saber su id, si no hay usuario autenticado lanzamos un error
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    //Luego calculamos el tipo MBTI a partir de las respuestas usando la función calculateMbtiType
    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    //Calculamos el código del tipo MBTI a partir de las respuestas usando la función calculateMbtiType
    const mbtiCode = calculateMbtiType(answers)

    //Luego obtenemos el id del tipo MBTI a partir de su código, porque en la tabla mbti_results necesitamos guardar el id, no el código
    const { data: mbtiType, error: mbtiTypeError } = await supabase
      .from('mbti_types')
      .select('id, code, title, description')
      .eq('code', mbtiCode)
      .single()

    if (mbtiTypeError) throw mbtiTypeError

    //Finalmente, insertamos el resultado en la tabla mbti_results con el user_id, mbti_type_id y la fecha de creación automática, y devolvemos el resultado insertado
    const { data, error } = await supabase
      .from('mbti_results')
      .insert({
        user_id: userId,
        mbti_type_id: mbtiType.id,
      })
      .select(`
        *,
        mbti_types (
          id,
          code,
          title,
          description
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  //Obtiene los resultados del test del usuario autenticado, devolviendo una lista de resultados con su tipo MBTI relacionado
  async getMyResults() {
    //Primero obtenemos el usuario autenticado para saber su id, si no hay usuario autenticado lanzamos un error
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    //Luego obtenemos los resultados de la tabla mbti_results filtrando por el id del usuario, e incluyendo los datos relacionados del tipo MBTI, ordenados por fecha de creación (los más nuevos primero)
    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    //Obtenemos los resultados de la tabla mbti_results filtrando por el id del usuario, e incluyendo los datos relacionados del tipo MBTI, ordenados por fecha de creación (los más nuevos primero)
    const { data, error } = await supabase
      .from('mbti_results')
      .select(`
        *,
        mbti_types (
          id,
          code,
          title,
          description
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },
}

export default mbtiService