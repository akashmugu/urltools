const path = require('path')
const fs = require('fs-extra')

const [cwd, src, tmp, tmpsrc, lib] = ['', 'src', 'tmp', 'tmp/src', 'lib'].map(dir => path.resolve(__dirname, dir))

const exec = command => require('util').promisify(require('child_process').exec)(command, { cwd })

const main = async () => {
  // init tmp
  await fs.emptyDir(tmp)

  // src -> tmp/src
  await fs.copy(src, tmpsrc)

  // tmp/src
  const schemas = (await fs.readdir(`${tmpsrc}/schema`)).map(f => f.slice(0, -5))
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
