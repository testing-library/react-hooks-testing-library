import fs from 'fs'
import path from 'path'

type Template = (submodule: string) => string

const templates = {
  index: {
    '.js': (submodule: string) => `module.exports = require('../lib/${submodule}')`,
    '.d.ts': (submodule: string) => `export * from '../lib/${submodule}'`
  },
  pure: {
    '.js': (submodule: string) => `module.exports = require('../lib/${submodule}/pure')`,
    '.d.ts': (submodule: string) => `export * from '../lib/${submodule}/pure'`
  }
}

const submodules = ['dom', 'native', 'server', 'pure']

function cleanDirectory(directory: string) {
  const files = fs.readdirSync(directory)
  files.forEach((file) => fs.unlinkSync(path.join(directory, file)))
}

function makeDirectory(submodule: string) {
  const submoduleDir = path.join(process.cwd(), submodule)

  if (fs.existsSync(submoduleDir)) {
    cleanDirectory(submoduleDir)
  } else {
    fs.mkdirSync(submoduleDir)
  }

  return submoduleDir
}

function requiredFile(submodule: string) {
  return ([name]: [string, unknown]) => {
    return name !== submodule
  }
}

function makeFile(directory: string, submodule: string) {
  return ([name, extensions]: [string, Record<string, Template>]) => {
    Object.entries(extensions).forEach(([extension, template]) => {
      const fileName = `${name}${extension}`
      console.log(`  - ${fileName}`)
      const filePath = path.join(directory, fileName)
      fs.writeFileSync(filePath, template(submodule))
    })
  }
}

function makeFiles(directory: string, submodule: string) {
  Object.entries(templates).filter(requiredFile(submodule)).forEach(makeFile(directory, submodule))
}

function createSubmodule(submodule: string) {
  console.log(`Generating submodule: ${submodule}`)
  const submoduleDir = makeDirectory(submodule)
  makeFiles(submoduleDir, submodule)
}

submodules.forEach(createSubmodule)
