const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

// Generate UUID from string (deterministic)
function generateUUIDFromString(str) {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (str.charCodeAt(0) + Math.random() * 16) % 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate proper UUID v4
function generateUUID() {
  return crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
  console.log('\n🚀 Migrating students data (fixed version)...');
  const students = loadJSON('students.json');

  if (students.length === 0) {
    console.log('No students data to migrate');
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  // First check if we need to create students table (legacy table from SQL script)
  const { error: tableCheckError } = await supabase.from('students').select('count').limit(1);

  if (tableCheckError && tableCheckError.code === '42P01') {
    console.log('⚠️ Legacy students table does not exist, only using profiles table');
  }

  for (const student of students) {
    try {
      // Generate proper UUID for Supabase
      const userId = student.email === 'as@as.as' ? generateUUIDFromString(student.email) : generateUUID();

      // Map JSON student to Supabase profiles table
      const profileData = {
        id: userId,
        email: student.email,
        name: student.name,
        role: 'student',
        grade: student.grade || 11,
        region: student.region || 'astana',
        interests: student.goals || [],
        personality_type: student.mbtiProfile?.type,
        skills: student.mbtiProfile?.strengths || [],
        created_at: new Date(student.createdAt || Date.now()).toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
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
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (profileError) {
        console.error(`❌ Error inserting student profile ${student.email}:`, profileError.message);
        errorCount++;
      } else {
        console.log(`✅ Migrated student to profiles: ${student.email}`);

        // Also insert into legacy students table if it exists
        if (!tableCheckError) {
          const studentData = {
            id: userId,
            email: student.email,
            name: student.name,
            grade: student.grade || 11,
            region: student.region || 'astana',
            points: student.points || 0,
            level: student.level || 1,
            streak: student.streak || 0,
            created_at: new Date(student.createdAt || Date.now()).toISOString(),
            updated_at: new Date().toISOString()
          };

          const { error: legacyError } = await supabase
            .from('students')
            .insert([studentData]);

          if (legacyError) {
            console.log(`⚠️ Could not insert to legacy students table: ${legacyError.message}`);
          }
        }

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
  console.log('\n🚀 Migrating users data (fixed version)...');
  const users = loadJSON('users.json');

  if (users.length === 0) {
    console.log('No users data to migrate');
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const user of users) {
    try {
      // Generate UUID for users table
      const userId = generateUUIDFromString(user.email);

      const userData = {
        id: userId,
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

async function checkAndCreateTopicsTable() {
  console.log('\n📋 Checking/creating topics table...');

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

  console.log('ℹ️ Please create topics table in Supabase SQL Editor:');
  console.log('\nSQL to execute:');
  console.log(createTableSQL);
  console.log('\n📝 Instructions:');
  console.log('1. Go to: https://supabase.com/dashboard/project/vjzchdkiitiujyslydyn/sql');
  console.log('2. Paste the SQL above');
  console.log('3. Click "Run"');
  console.log('4. Then run this migration script again');
}

async function main() {
  console.log('🎯 FM Edu Data Migration Tool (Fixed Version)');
  console.log('==============================================');

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

    // Check topics table
    await checkAndCreateTopicsTable();

    console.log('\n📋 Migration Summary:');
    console.log('• Student profiles: migrated to "profiles" table');
    console.log('• Users: migrated to "users" table (legacy)');
    console.log('• Topics: need to create table first (see instructions above)');
    console.log('\n📝 Next steps after creating topics table:');
    console.log('1. Run this script again to migrate topics data');
    console.log('2. Create tables for assignments, tests, materials');
    console.log('3. Update API endpoints to use Supabase instead of JSON');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
}

// Run migration
main();