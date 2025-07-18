import { writeFileSync } from "fs"

const timestamp = new Date().toISOString()
const content = `// Gerado automaticamente\nexport const lastUpdate = '${timestamp}'\n`

writeFileSync("src/lastUpdate.ts", content)