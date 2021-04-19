const path = require('path')
const fs = require('fs-extra')

// constants
const coreSchema = 'modifyUrl'
const extSchema = 'detectModifyUrl'
const [cwd, src, tmp, lib] = ['', 'src', 'tmp', 'lib'].map((dir) => path.resolve(__dirname, dir))

// utils
const isObject = (value) => value && typeof value === 'object' && value.constructor === Object
const exec = (command) => require('util').promisify(require('child_process').exec)(command, { cwd })

// detectModifyUrl.json has `{ "$ref": "modifyUrl.json" }`,
// replace that with contents of modifyUrl.json
const substituteCoreSchemaInExt = async (dir) => {
  const extSchemaContent = await fs.readFile(`${dir}/${extSchema}.json`)
  const coreSchemaContent = await fs.readFile(`${dir}/${coreSchema}.json`)

  const substitutedContent = JSON.parse(extSchemaContent, (key, value) => {
    if (isObject(value)) {
      const keys = Object.keys(value)
      if (keys.length === 1 && keys[0] === '$ref') {
        if (value['$ref'].slice(0, -5) === coreSchema) {
          return JSON.parse(coreSchemaContent)
        }
      }
    }

    return value
  })

  await fs.writeFile(`${dir}/${extSchema}.json`, JSON.stringify(substitutedContent, null, 2))
}

const main = async () => {
  // init tmp
  await fs.emptyDir(tmp)

  // src -> tmp
  await fs.copy(src, tmp)

  await substituteCoreSchemaInExt(`${tmp}/schema`)

  // generate schema types
  await fs.emptyDir(`${tmp}/types`)
  await Promise.all(
    [coreSchema, extSchema].map((schema) =>
      exec(`npm run json2ts -- ${tmp}/schema/${schema}.json ${tmp}/types/${schema}.d.ts`)
    )
  )

  // tmp -> lib
  await fs.copy(tmp, lib)

  // cleanup tmp
  await fs.remove(tmp)
}

process.on('unhandledRejection', (err) => {
  throw err
})

main()
