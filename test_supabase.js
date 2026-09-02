const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

const envVars = {};
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function testConnection() {
  console.log('\n🔗 Testing Supabase connection...');

  try {
    // Try to query a table that should exist
    const { data, error } = await supabase.from('profiles').select('count').limit(1);

    if (error) {
      console.log('❌ Error:', error.message);
      console.log('Error code:', error.code);

      if (error.code === '42P01') {
        console.log('\n⚠️ Table "profiles" does not exist. You need to:');
        console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/vjzchdkiitiujyslydyn');
        console.log('2. Run the SQL script from supabase/SETUP_DATABASE.sql in the SQL Editor');
      } else if (error.code === '42501') {
        console.log('\n⚠️ Permission error - RLS policies may be blocking access');
      }
    } else {
      console.log('✅ Connected successfully!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.log('❌ Exception:', err.message);
  }
}

testConnection();