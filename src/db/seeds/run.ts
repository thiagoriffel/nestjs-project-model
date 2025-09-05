// src/db/seeds/run.ts
import dataSource from '../typeorm.datasource-config'
import { createAdmin } from './create-admin.seed'

async function run() {
  await dataSource.initialize()

  try {
    const seeds = [
      { name: 'create-admin', run: createAdmin },
    ]

    for (const s of seeds) {
      console.log(`➡️  Rodando seeder: ${s.name}`)
      await s.run(dataSource)
    }

    console.log('✅ Seeds executados com sucesso.')
  } catch (err) {
    console.error('❌ Erro ao executar seeds:', err)
    process.exitCode = 1
  } finally {
    await dataSource.destroy()
  }
}

run()