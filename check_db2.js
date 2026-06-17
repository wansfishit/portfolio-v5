import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quflfbtlkipmbgaqlqgo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZmxmYnRsa2lwbWJnYXFscWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTAxNTgsImV4cCI6MjA5NjU4NjE1OH0.mk-9FeXDI1AUOec9w0z2TnFSukY1d2D5Rf-3HOQg2aU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { error: err1 } = await supabase.from('projects').insert([{ title: 'Test' }]);
  console.log('Lowercase title insert error:', err1);
  const { error: err2 } = await supabase.from('projects').insert([{ description: 'Test' }]);
  console.log('Lowercase description insert error:', err2);
  const { error: err3 } = await supabase.from('projects').insert([{ img: 'Test' }]);
  console.log('Lowercase img insert error:', err3);
  
  // Try retrieving schema by doing an empty select with options to get the error if possible, or just trying different column names.
  // Another way: if RLS is failing, we'll see RLS errors.
  
  // What about certificates?
  const { error: cErr } = await supabase.from('certificates').insert([{ img: 'Test' }]);
  console.log('Certificates lowercase img error:', cErr);
}
check();
