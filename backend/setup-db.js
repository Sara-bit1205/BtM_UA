#!/usr/bin/env node

/**
 * Script para inicializar la base de datos en Supabase
 * Uso: npm run setup-db
 */

const fs = require('fs')
const path = require('path')
const { Client } = require('pg')
require('dotenv').config()

async function setupDatabase() {
  const client = new Client({
    host: 'db.jdthbbjskzkunjpwwzvh.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('🔗 Conectando a Supabase PostgreSQL...')
    await client.connect()
    console.log('✅ Conexión exitosa\n')

    // Leer el script SQL
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'BD', 'init_supabase.sql'),
      'utf-8'
    )

    console.log('📊 Ejecutando script de inicialización...\n')
    
    // Ejecutar el script completo
    await client.query(sqlScript)
    
    console.log('✅ Base de datos inicializada correctamente\n')
    console.log('📋 Tablas creadas:')
    console.log('  ✓ universes')
    console.log('  ✓ universe_categories')
    console.log('  ✓ personality_tags')
    console.log('  ✓ mbti_types')
    console.log('  ✓ users')
    console.log('  ✓ characters')
    console.log('  ✓ character_universe_categories')
    console.log('  ✓ character_personality_tags')
    console.log('  ✓ filmography')
    console.log('  ✓ audios')
    console.log('  ✓ comments')
    console.log('  ✓ community_photos')
    console.log('  ✓ favorites')
    console.log('  ✓ mbti_results\n')

    console.log('📊 Datos iniciales insertados:')
    console.log('  ✓ 16 Tipos MBTI')
    console.log('  ✓ 10 Personalidades')
    console.log('  ✓ 5 Universos\n')

    console.log('🎉 ¡Listo! Tu base de datos está configurada y lista para usar.')

  } catch (error) {
    console.error('❌ Error al inicializar BD:', error.message)
    if (error.message.includes('password')) {
      console.error('\n💡 Tip: Parece que la contraseña no está configurada.')
      console.error('   Agrega DB_PASSWORD a tu archivo .env')
    }
    process.exit(1)
  } finally {
    await client.end()
  }
}

setupDatabase()
