import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quflfbtlkipmbgaqlqgo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZmxmYnRsa2lwbWJnYXFscWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTAxNTgsImV4cCI6MjA5NjU4NjE1OH0.mk-9FeXDI1AUOec9w0z2TnFSukY1d2D5Rf-3HOQg2aU';
const supabase = createClient(supabaseUrl, supabaseKey);

const names = [
  "Alex", "Budi", "Citra", "Dewi", "Eko", "Fajar", "Gita", "Hendra", 
  "Indra", "Joko", "Kartika", "Lina", "Mira", "Nadia", "Oka", "Putra", 
  "Rini", "Sinta", "Tono", "Wira"
];

const messages = [
  "Keren banget website-nya! Desainnya sangat modern.",
  "Suka banget sama animasinya, mulus banget.",
  "Wah, portofolionya inspiratif sekali, sukses terus ya!",
  "UI/UX-nya juara! Sangat mudah digunakan.",
  "Karya yang luar biasa, ditunggu project-project selanjutnya.",
  "Bagus! Kodingannya pasti rapi banget ini.",
  "Mantap! Teruskan karya-karya hebatmu.",
  "Sangat profesional dan eye-catching.",
  "Wah gila, smooth parah animasinya!",
  "Desainnya clean dan elegan, suka banget.",
  "Inspirasi baru buat bikin portofolio nih.",
  "Gokil, fiturnya lengkap banget.",
  "Top markotop! Keren abis.",
  "Semangat terus ngodingnya bang!",
  "Sangat responsif di mobile juga, mantap.",
  "Warnanya pas banget, gak bikin sakit mata.",
  "Detailnya diperhatikan banget, good job!",
  "Suka sama cara presentasi project-nya.",
  "Keren, semoga bisa sepro ini suatu saat nanti.",
  "Wow, bener-bener out of the box desainnya!"
];

async function seedComments() {
  const comments = [];
  
  // Create 20 random comments
  for (let i = 0; i < 20; i++) {
    // Generate random date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(date.getHours() - Math.floor(Math.random() * 24));
    
    comments.push({
      user_name: names[i],
      content: messages[i],
      profile_image: null,
      is_pinned: false,
      created_at: date.toISOString()
    });
  }

  const { error } = await supabase.from('portfolio_comments').insert(comments);
  
  if (error) {
    console.error('Error inserting comments:', error);
  } else {
    console.log('Successfully inserted 20 random comments!');
  }
}

seedComments();
