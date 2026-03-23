import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const rulesDir = path.join(root, 'rules')
const files = (await fs.readdir(rulesDir))
  .filter((file) => file.endsWith('.md') && !file.startsWith('_'))

const required = ['title', 'impact', 'tags']
const errors = []

for (const file of files) {
  const content = await fs.readFile(path.join(rulesDir, file), 'utf8')
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/)
  if (!frontmatterMatch) {
    errors.push(`${file}: missing frontmatter`)
    continue
  }

  const frontmatter = frontmatterMatch[1]
  for (const field of required) {
    if (!new RegExp(`^${field}:`, 'm').test(frontmatter)) {
      errors.push(`${file}: missing ${field}`)
    }
  }

  if (!/\nWrong:\n/.test(content)) {
    errors.push(`${file}: missing Wrong section`)
  }
  if (!/\nPreferred:\n/.test(content)) {
    errors.push(`${file}: missing Preferred section`)
  }
  if (!/\nReference: /.test(content)) {
    errors.push(`${file}: missing Reference`)
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`Validated ${files.length} rule files`)
