import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cdvekfckygwkcvxxvqtg.supabase.co'
const supabaseAnonKey = 'sb_publishable_Q2UHO4pjfPbegXE7P_VFeA_nb1CdV8k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)