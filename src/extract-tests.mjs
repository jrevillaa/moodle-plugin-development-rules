import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const rulesDir = path.join(root, 'rules')
const outputPath = path.join(root, 'test-cases.json')
const files = (await fs.readdir(rulesDir))
  .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
  .sort()

const testcases = []

for (const file of files) {
  const content = await fs.readFile(path.join(rulesDir, file), 'utf8')
  const title = (content.match(/^title:\s*(.+)$/m) || [null, file])[1].replace(/^"|"$/g, '')
  const impact = (content.match(/^impact:\s*(.+)$/m) || [null, 'MEDIUM'])[1]
  const wrongMatch = content.match(/Wrong:\n\n```[a-z]*\n([\s\S]*?)\n```/)
  const preferredMatch = content.match(/Preferred:\n\n```[a-z]*\n([\s\S]*?)\n```/)
  if (!wrongMatch || !preferredMatch) continue

  testcases.push({
    id: file.replace(/\.md$/, ''),
    title,
    impact,
    input: wrongMatch[1].trim(),
    expected_shape: preferredMatch[1].trim()
  })
}

await fs.writeFile(outputPath, `${JSON.stringify(testcases, null, 2)}\n`)
console.log(`Extracted ${testcases.length} test cases`)
