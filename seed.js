import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quflfbtlkipmbgaqlqgo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZmxmYnRsa2lwbWJnYXFscWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTAxNTgsImV4cCI6MjA5NjU4NjE1OH0.mk-9FeXDI1AUOec9w0z2TnFSukY1d2D5Rf-3HOQg2aU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding projects...');
  const { error: pError } = await supabase.from('projects').insert([
    {
      Title: 'E-Commerce Website',
      Description: 'A full-stack e-commerce application built with React, Node.js, and Supabase. Features include product browsing, shopping cart, and secure checkout.',
      Img: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
      TechStack: ['React', 'Tailwind', 'Supabase', 'Node.js'],
      Features: ['Authentication', 'Shopping Cart', 'Payment Integration'],
      Link: 'https://example.com/ecommerce',
      Github: 'https://github.com/example/ecommerce'
    },
    {
      Title: 'Task Management App',
      Description: 'A productivity app for managing daily tasks and projects. Includes real-time updates and team collaboration features.',
      Img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      TechStack: ['Vue.js', 'Firebase', 'CSS'],
      Features: ['Real-time DB', 'Kanban Board', 'Drag & Drop'],
      Link: 'https://example.com/taskapp',
      Github: 'https://github.com/example/taskapp'
    },
    {
      Title: 'AI Portfolio Generator',
      Description: 'An artificial intelligence tool that generates customized developer portfolios automatically based on GitHub activity.',
      Img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      TechStack: ['Next.js', 'OpenAI', 'Tailwind CSS'],
      Features: ['AI Generation', 'Markdown Export', 'Vercel Deployment'],
      Link: 'https://example.com/ai-portfolio',
      Github: 'https://github.com/example/ai-portfolio'
    }
  ]);

  if (pError) console.error('Error inserting projects:', pError.message);
  else console.log('Successfully inserted projects!');

  console.log('Seeding certificates...');
  const { error: cError } = await supabase.from('certificates').insert([
    { Img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80' },
    { Img: 'https://images.unsplash.com/photo-1560523159-4a9692d222f9?w=800&q=80' }
  ]);

  if (cError) console.error('Error inserting certificates:', cError.message);
  else console.log('Successfully inserted certificates!');
}

seed();
