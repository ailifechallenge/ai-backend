import fs from 'node:fs'
import postcss from 'postcss'
const source=fs.readFileSync(new URL('../src/integrated/styles.css',import.meta.url),'utf8')
const ast=postcss.parse(source)
ast.walkAtRules('import',rule=>rule.remove())
ast.walkRules(rule=>{
 if(rule.parent.type==='atrule'&&rule.parent.name.endsWith('keyframes'))return
 rule.selectors=rule.selectors.map(selector=>{
  if(selector===':root')return '.integrated-feature'
  if(/^\.view-(chat|itinerary|home)\b/.test(selector))return '.integrated-feature'+selector
  if(/\.app\b/.test(selector))return selector.replace(/\.app\b/g,'.integrated-feature')
  if(selector==='body'||selector==='html')return '.integrated-feature'
  return '.integrated-feature '+selector
 })
})
fs.writeFileSync(new URL('../src/styles/features.css',import.meta.url),'/* Generated from integrated/styles.css; npm run sync:styles */\n'+ast.toString())
