const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
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

// Data directory
const dataDir = path.join(__dirname, 'data');

// Load JSON data
function loadJSON(fileName) {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${fileName}`);
    return [];
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Remove BOM if present
    const data = JSON.parse(content.replace(/^﻿/, ''));
    console.log(`📄 Loaded ${fileName}: ${Array.isArray(data) ? data.length + ' records' : 'object'}`);
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error(`❌ Error loading ${fileName}:`, error.message);
    return [];
  }
}

async function migrateStudents() {
  console.log('\n🚀 Migrating students data...');
  const students = loadJSON('students.json');

  if (students.length === 0) {
    console.log('No students data to migrate');
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const student of students) {
    try {
      // Map JSON student to Supabase profiles table
      const profileData = {
        id: student.id, // This should be auth user ID, but we use student.id for now
        email: student.email,
        name: student.name,
        role: 'student',
        grade: student.grade,
        region: student.region,
        interests: student.goals || [],
        personality_type: student.mbtiProfile?.type,
        created_at: new Date(student.createdAt || Date.now()).toISOString(),
        updated_at: new Date().toISOString()
      };

      // Check if profile already exists
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', student.email)
        .single();

      if (existing) {
        console.log(`⏭️ Skipping existing student: ${student.email}`);
        continue;
      }

      // Insert into profiles table
      const { error } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (error) {
        console.error(`❌ Error inserting student ${student.email}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Migrated student: ${student.email}`);
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing student ${student.email}:`, error.message);
      errorCount++;
    }
  }

  console.log(`📊 Students migration: ${successCount} successful, ${errorCount} errors`);
}

async function migrateUsers() {
  console.log('\n🚀 Migrating users data...');
  const users = loadJSON('users.json');

  if (users.length === 0) {
    console.log('No users data to migrate');
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const user of users) {
    try {
      // Map JSON user to Supabase users table
      const userData = {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role || 'student',
        created_at: new Date(user.createdAt || Date.now()).toISOString(),
        updated_at: new Date().toISOString()
      };

      // Check if user already exists
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (existing) {
        console.log(`⏭️ Skipping existing user: ${user.email}`);
        continue;
      }

      // Insert into users table
      const { error } = await supabase
        .from('users')
        .insert([userData]);

      if (error) {
        console.error(`❌ Error inserting user ${user.email}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Migrated user: ${user.email}`);
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing user ${user.email}:`, error.message);
      errorCount++;
    }
  }

  console.log(`📊 Users migration: ${successCount} successful, ${errorCount} errors`);
}

async function migrateTopics() {
  console.log('\n🚀 Migrating topics data...');
  const topics = loadJSON('topics.json');

  if (topics.length === 0) {
    console.log('No topics data to migrate');
    return;
  }

  console.log(`📚 Topics to migrate: ${topics.length}`);
  console.log('Note: Topics need a separate table in Supabase. Creating topics table first...');

  // First, check if topics table exists
  const { error: tableCheckError } = await supabase.from('topics').select('count').limit(1);

  if (tableCheckError && tableCheckError.code === '42P01') {
    console.log('📋 Creating topics table...');

    // Create topics table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS topics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        subject TEXT NOT NULL,
        grade INTEGER NOT NULL,
        quarter INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        youtube_url TEXT,
        ai_difficulty_level TEXT,
        learning_objectives TEXT[] DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    console.log('⚠️ Topics table does not exist. Please create it manually:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Run the SQL above to create topics table');
    console.log('3. Then run this migration script again');
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const topic of topics) {
    try {
      const topicData = {
        subject: topic.subject,
        grade: topic.grade,
        quarter: topic.quarter,
        title: topic.title,
        description: topic.description,
        youtube_url: topic.youtubeLink,
        ai_difficulty_level: topic.aiDifficultyLevel,
        learning_objectives: topic.learningObjectives || []
      };

      const { error } = await supabase
        .from('topics')
        .insert([topicData]);

      if (error) {
        console.error(`❌ Error inserting topic "${topic.title}":`, error.message);
        errorCount++;
      } else {
        successCount++;
        if (successCount % 10 === 0) {
          console.log(`✅ Migrated ${successCount} topics...`);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing topic:`, error.message);
      errorCount++;
    }
  }

  console.log(`📊 Topics migration: ${successCount} successful, ${errorCount} errors`);
}

async function main() {
  console.log('🎯 FM Edu Data Migration Tool');
  console.log('==============================');

  try {
    // First test connection
    console.log('🔗 Testing Supabase connection...');
    const { error: testError } = await supabase.from('profiles').select('count').limit(1);

    if (testError && testError.code !== '42P01') {
      console.error('❌ Cannot connect to Supabase:', testError.message);
      return;
    }

    console.log('✅ Connected to Supabase');

    // Run migrations
    await migrateStudents();
    await migrateUsers();
    await migrateTopics();

    console.log('\n🎉 Migration completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Update API endpoints to use Supabase instead of JSON data');
    console.log('2. Create missing tables for other data (assignments, tests, etc.)');
    console.log('3. Test the application with real database data');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
}

// Run migration
main();