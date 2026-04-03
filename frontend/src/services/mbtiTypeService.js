import { supabase } from '../lib/supabase'

const mbtiTypeService = {
  async getPopular(limit = 4) {
    const { data, error } = await supabase
      .from('mbti_types')
      .select('*')
      .order('code')
      .limit(limit)

    if (error) throw error
    return data
  },
}

export default mbtiTypeService