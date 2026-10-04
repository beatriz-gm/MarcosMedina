// Injects the server-rendered markup into dist/index.html so crawlers, link previews
// and the first paint get real content before JavaScript loads.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const templatePath = path.join(root, 'dist/index.html')
const serverEntry = path.join(root, 'dist-ssr/entry-server.js')

const { render } = await import(pathToFileURL(serverEntry).href)
const template = fs.readFileSync(templatePath, 'utf-8')

fs.writeFileSync(templatePath, template.replace('<!--app-html-->', render()))
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true })

console.log('Prerendered dist/index.html')
