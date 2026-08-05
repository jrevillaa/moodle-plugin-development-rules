import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const rulesDir = path.join(root, 'rules')
const metadataPath = path.join(root, 'metadata.json')
const agentsPath = path.join(root, 'AGENTS.md')
const indexPath = path.join(root, 'references', 'rules-index.md')

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

const agents = [
  '# Moodle Plugin Development Rules',
  '',
  `**Version ${metadata.version}**  `,
  `${metadata.organization}  `,
  `${metadata.date}`,
  '',
  '> **Note:**  ',
  '> This document is generated from the individual rule files in `rules/`.  ',
  '> It is a full catalog for humans and installers.  ',
  '> Agents should prefer `SKILL.md`, `references/rules-index.md`, and on-demand `rules/` files instead of loading this whole document.',
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
  agents.push(`- \`${rule.file}\` - ${rule.title}`)
}

agents.push('', '---', '', '## Full Rules', '')

for (const rule of rules) {
  agents.push(`### ${rule.title}`)
  agents.push('')
  agents.push(`**Impact:** ${rule.impact}${rule.impactDescription ? ` (${rule.impactDescription})` : ''}`)
  agents.push('')
  agents.push(rule.body)
  agents.push('')
}

agents.push('## References', '')
for (const ref of metadata.references) {
  agents.push(`- ${ref}`)
}
agents.push('')

await fs.writeFile(agentsPath, `${agents.join('\n')}\n`)

const byPrefix = new Map()
for (const rule of rules) {
  const prefix = rule.file.split('-')[0]
  if (!byPrefix.has(prefix)) {
    byPrefix.set(prefix, [])
  }
  byPrefix.get(prefix).push(rule)
}

const index = [
  '# Rules Index',
  '',
  `Generated catalog of ${rules.length} formal rules for version ${metadata.version}.`,
  '',
  'Use this index to choose the relevant rule file, then read only that file under `rules/`.',
  'Do not load `AGENTS.md` by default.',
  ''
]

for (const [prefix, prefixRules] of byPrefix) {
  index.push(`## \`${prefix}-\``)
  index.push('')
  for (const rule of prefixRules) {
    const impactBit = rule.impactDescription
      ? `${rule.impact} — ${rule.impactDescription}`
      : rule.impact
    index.push(`- [\`${rule.file}\`](../rules/${rule.file}) — **${rule.title}** (${impactBit})`)
  }
  index.push('')
}

await fs.writeFile(indexPath, `${index.join('\n')}\n`)

console.log(`Built ${path.relative(root, agentsPath)}`)
console.log(`Built ${path.relative(root, indexPath)}`)
