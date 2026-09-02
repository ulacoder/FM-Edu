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

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

// Tables that should exist according to SETUP_DATABASE.sql
const expectedTables = [
  'profiles',
  'students',
  'users',
  'project_requests',
  'team_rooms',
  'team_room_members',
  'team_chat_messages'
];

async function checkTables() {
  console.log('🔍 Checking which tables exist in Supabase...\n');

  const results = {};

  for (const table of expectedTables) {
    try {
      // Try to query each table
      const { data, error } = await supabase.from(table).select('count').limit(1);

      if (error) {
        if (error.code === '42P01') {
          results[table] = { exists: false, error: 'Table does not exist' };
        } else {
          results[table] = { exists: false, error: error.message };
        }
      } else {
        results[table] = { exists: true, count: data[0]?.count || 0 };
      }
    } catch (err) {
      results[table] = { exists: false, error: err.message };
    }
  }

  // Print results
  console.log('📊 TABLE STATUS:');
  console.log('──────────────────────────────────');

  let tablesExist = 0;
  let tablesMissing = 0;

  for (const [table, info] of Object.entries(results)) {
    if (info.exists) {
      console.log(`✅ ${table.padEnd(20)} | ✅ EXISTS | Count: ${info.count}`);
      tablesExist++;
    } else {
      console.log(`❌ ${table.padEnd(20)} | ❌ MISSING | ${info.error}`);
      tablesMissing++;
    }
  }

  console.log('──────────────────────────────────');
  console.log(`📈 Summary: ${tablesExist} tables exist, ${tablesMissing} tables missing`);

  if (tablesMissing > 0) {
    console.log('\n⚠️  ACTION REQUIRED:');
    console.log('To create missing tables, you need to:');
    console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/vjzchdkiitiujyslydyn');
    console.log('2. Open SQL Editor');
    console.log('3. Copy and paste the SQL from supabase/SETUP_DATABASE.sql');
    console.log('4. Run the script');
  } else {
    console.log('\n✅ All tables exist! Ready for data migration.');
  }

  // Check if data directory exists
  const dataDir = path.join(__dirname, 'data');
  if (fs.existsSync(dataDir)) {
    console.log('\n📂 Checking JSON data files...');
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    console.log(`Found ${files.length} JSON data files:`);
    files.forEach(file => {
      const filePath = path.join(dataDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      console.log(`   📄 ${file}: ${data.length} records`);
    });
  }
}

checkTables();