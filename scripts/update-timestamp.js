import { writeFileSync } from "fs"

// Script para atualizar a data da última atualização

const timestamp = new Date().toISOString()
const content = `// Gerado automaticamente\nexport const lastUpdate = '${timestamp}'\n`

writeFileSync("src/lastUpdate.ts", content)