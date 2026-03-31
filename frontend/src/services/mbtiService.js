/*QUESTIONS en PersonalityTestPage ✅
cálculo visual del test en PersonalityTestPage ✅
mbtiService solo para persistencia en Supabase ✅*/

import { supabase } from '../lib/supabase'

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

const mbtiService = {
  async submitResult(answers) {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

    const mbtiCode = calculateMbtiType(answers)

    const { data: mbtiType, error: mbtiTypeError } = await supabase
      .from('mbti_types')
      .select('id, code, title, description')
      .eq('code', mbtiCode)
      .single()

    if (mbtiTypeError) throw mbtiTypeError

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

  async getMyResults() {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const userId = userData?.user?.id
    if (!userId) throw new Error('No hay usuario autenticado')

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