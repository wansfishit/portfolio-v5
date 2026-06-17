import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quflfbtlkipmbgaqlqgo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZmxmYnRsa2lwbWJnYXFscWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTAxNTgsImV4cCI6MjA5NjU4NjE1OH0.mk-9FeXDI1AUOec9w0z2TnFSukY1d2D5Rf-3HOQg2aU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: pData, error: pError } = await supabase.from('projects').select('*').limit(1);
  console.log('Projects error:', pError);
  console.log('Projects data columns:', pData && pData.length > 0 ? Object.keys(pData[0]) : 'No data');

  // Insert a minimal project to see if it fails
  const { error: minError } = await supabase.from('projects').insert([{ Title: 'Test' }]);
  console.log('Minimal insert error:', minError);
}
check();
