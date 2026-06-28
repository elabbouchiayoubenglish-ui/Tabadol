import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gfofxaerynsrqmviyvje.supabase.co';

const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmb2Z4YWVyeW5zcnFtdml5dmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTM4NDQsImV4cCI6MjA5NzQ2OTg0NH0.oBB4vUqOA-f0iXhz9tN_dzKKurbNZvpD_CIoZpnCSxs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);