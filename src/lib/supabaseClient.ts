import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wdogjybyarekxzwhtlln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2dqeWJ5YXJla3h6d2h0bGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDgxODcsImV4cCI6MjA4ODYyNDE4N30.JY6jinI5VRD0zkY6XnPvyaqAmigDNsvwnJgaCLjT1bQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
