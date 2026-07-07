import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvPath = new URL('./tasks.csv', import.meta.url)

const stream = fs.createReadStream(csvPath)

const parser = stream.pipe(
  parse({
    delimiter: ',',
    columns: true,
    skip_empty_lines: true,
  })
)

async function run(){
  for await (const record of parser){
    const { title, description } = record

    const response = await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ title, description }),
    })

    if (response.ok) {
      console.log(`✅ Tarefa criada: ${title}`)
    } else {
      console.error(`❌ Erro ao criar tarefa: ${title}`)
    }
  }

  console.log('Importação Finalizada!')
}

run()