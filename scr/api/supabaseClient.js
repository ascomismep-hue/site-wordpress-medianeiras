mport { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.'quyaqhapujunxtkibchk.supabase.co'
const supabaseAnonKey = import.meta.'env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1eWFxaGFwdWp1bnh0a2liY2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyOTEyMTMsImV4cCI6MjA5OTg2NzIxM30.n9F00pKSGLHrFR3n5gqpmjoBqQWqhwYLo5EtWPh83xk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
