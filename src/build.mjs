import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const rulesDir = path.join(root, 'rules')
const metadataPath = path.join(root, 'metadata.json')
const outputPath = path.join(root, 'AGENTS.md')

const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'))
const files = (await fs.readdir(rulesDir))
  .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
  .sort()

const rules = await Promise.all(
  files.map(async (file) => {
    const fullpath = path.join(rulesDir, file)
    const content = await fs.readFile(fullpath, 'utf8')
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/)
    const body = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim()
    const attrs = {}

    if (frontmatterMatch) {
      for (const line of frontmatterMatch[1].split('\n')) {
        const idx = line.indexOf(':')
        if (idx === -1) continue
        const key = line.slice(0, idx).trim()
        const value = line.slice(idx + 1).trim()
        attrs[key] = value
      }
    }

    return {
      file,
      title: attrs.title || file.replace(/\.md$/, ''),
      impact: attrs.impact || 'MEDIUM',
      impactDescription: attrs.impactDescription || '',
      tags: attrs.tags || '',
      body
    }
  })
)

const lines = [
  '# Moodle Plugin Development Rules',
  '',
  `**Version ${metadata.version}**  `,
  `${metadata.organization}  `,
  `${metadata.date}`,
  '',
  '> **Note:**  ',
  '> This document is generated from the individual rule files in `rules/`.  ',
  '> It is primarily intended for agents and LLMs reviewing or generating Moodle plugin code.',
  '',
  '---',
  '',
  '## Abstract',
  '',
  metadata.abstract,
  '',
  '---',
  '',
  '## Rule Files',
  ''
]

for (const rule of rules) {
  lines.push(`- \`${rule.file}\` - ${rule.title}`)
}

lines.push('', '---', '', '## Full Rules', '')

for (const rule of rules) {
  lines.push(`### ${rule.title}`)
  lines.push('')
  lines.push(`**Impact:** ${rule.impact}${rule.impactDescription ? ` (${rule.impactDescription})` : ''}`)
  lines.push('')
  lines.push(rule.body)
  lines.push('')
}

lines.push('## References', '')
for (const ref of metadata.references) {
  lines.push(`- ${ref}`)
}
lines.push('')

await fs.writeFile(outputPath, `${lines.join('\n')}\n`)
console.log(`Built ${path.relative(root, outputPath)}`)
