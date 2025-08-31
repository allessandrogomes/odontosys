import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// recriando __dirname no ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filePath = path.join(__dirname, "..", "last-update.json")
const date = new Date().toISOString()

fs.writeFileSync(filePath, JSON.stringify({ lastUpdate: date }, null, 2))

console.log("📅 Data de última atualização salva:", date)
