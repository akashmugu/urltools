const path = require('path')
const fs = require('fs-extra')

const [cwd, src, tmp, tmpsrc, lib] = ['', 'src', 'tmp', 'tmp/src', 'lib'].map(dir => path.resolve(__dirname, dir))

const exec = command => require('util').promisify(require('child_process').exec)(command, { cwd })

// 1 level sub schema substitution
// e.g. if schema1.json has `{ "$ref": "schema2.json" }`,
// that will be replaced by contents of schema2.json
// this is a workaround as ajv-cli and json-schema-to-typescript
// currently don't support json schema $ref
const transformSchemas = (dir, schemas) => {
  const isObject = value => value && typeof value === 'object' && value.constructor === Object

  schemas.forEach(currSchema => {
    const data = JSON.parse(fs.readFileSync(`${dir}/${currSchema}.json`).toString(), (key, value) => {
      if (isObject(value)) {
        const keys = Object.keys(value)
        if (keys.length === 1 && keys[0] === '$ref') {
          const refSchema = value['$ref'].slice(0, -5)
          if (refSchema !== currSchema && schemas.includes(refSchema)) {
            return JSON.parse(fs.readFileSync(`${dir}/${refSchema}.json`).toString())
          }
        }
      }

      return value
    })

    fs.writeFileSync(`${dir}/${currSchema}.json`, JSON.stringify(data, null, 2))
  })
}

const main = async () => {
  // init tmp
  await fs.emptyDir(tmp)

  // src -> tmp/src
  await fs.copy(src, tmpsrc)

  // tmp/src
  const schemas = (await fs.readdir(`${tmpsrc}/schema`)).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5))
  transformSchemas(`${tmpsrc}/schema`, schemas)
  await fs.emptyDir(`${tmpsrc}/validate`)
  await fs.emptyDir(`${tmpsrc}/types`)
  await Promise.all(
    schemas.map(async schema => {
      await exec(`npm run ajv -- compile -s ${tmpsrc}/schema/${schema}.json -o ${tmpsrc}/validate/${schema}.js`)
      await exec(`npm run compile -- ${tmpsrc}/validate/${schema}.js -d ${tmp}/dist --cache-dir ${tmp}/cache`)
      await fs.copy(`${tmp}/dist/${schema}.js`, `${tmpsrc}/validate/${schema}.js`, { overwrite: true })
      await fs.copy(`${tmpsrc}/misc/validatorTypes.d.ts`, `${tmpsrc}/validate/${schema}.d.ts`)
      await exec(`npm run json2ts -- ${tmpsrc}/schema/${schema}.json ${tmpsrc}/types/${schema}.d.ts`, { cwd })
    })
  )
  await fs.remove(`${tmpsrc}/misc`)

  // tmp/src -> lib
  await fs.copy(tmpsrc, lib)

  // cleanup tmp
  await fs.remove(tmp)
}

process.on('unhandledRejection', err => {
  throw err
})

main()
