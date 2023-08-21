import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import path from "path"
import fs from "fs"
import * as console from "colorful-cli-logger"
console.setVerbose(true)


import nodeJsBuiltins from "builtins"
const nonPrefixedBuiltinModules = [...nodeJsBuiltins()]
const prefixedBuiltinModules = []
for (const mod of nonPrefixedBuiltinModules) {
  if (!mod.startsWith("node:")) prefixedBuiltinModules.push("node:"+mod)
}
const builtinModules = new Set([...nonPrefixedBuiltinModules, ...prefixedBuiltinModules])

const isCjsRegex = /(((module)((\[[`"'])|\.))?exports([`"']\])?((\.|(\[[`"']))[^\s\n"`']+([`"']\])?)?\s*=\s*[^\s\n]+)|require\(["'`][^\s\n"'`]+["'`]\)/m

const loggedAlready = new Set()
let nth = -1

const config = {
  input: './repl/src/repl.ts',
  output: {
    file: 'repl/dist/moreMaps-repl.js',
    format: 'cjs',
    sourcemap: false,
    exports: "named",
    interop: "auto"
  },
  plugins: [
    typescript({tsconfig: "./tsconfig.json", noEmitOnError: false, sourceMap: false}), 
    // these resolve options do not matter if resolveOnly is used. ModulesOnly does currently not prefer cjs exports if they exists, instead it finds the first esm version and transpiles it, which we want to avoid if we can.
    resolve({modulesOnly: true, preferBuiltins: true, exportConditions: ["node", 'default', 'module', 'import'], resolveOnly(mod) {
      nth++
      if (builtinModules.has(mod)) return false
      // this can happen when a module defines custom imports (e.g. chalk) in its package.json. We have no way tho to know here from where it was imported, so we just assume it was imported from a esm module and that it is esm as well. The only case that is known to not be covered here is when this module itself uses custom imports in package.json, to include this we would have to check if the given module is in local in this package. But I don't think that is worth the effort.
      if (!fs.existsSync(path.join("node_modules", mod))) {
        if (nth === 0 && (mod === "app" || mod === "repl")) return true 
        if (!loggedAlready.has(mod)) console.warn("may be resolved sub module:", mod)
        else loggedAlready.add(mod)
        return true
      }

      const json = JSON.parse(fs.readFileSync(path.join("node_modules", mod, "package.json"), "utf8"))
      const { type } = json

      

      

      const vals = getSpecificJsonProps(json, [
        ["exports", ".", "node", "require"],
        ["exports", ".", "require", "node"],
        ["exports", ".", "require", "default"],
        ["exports", ".", "require", "default"],

        ["exports", "node", "require"],
        ["exports", "require", "node"],
        ["exports", "require", "default"],
        ["exports", "require", "default"],

        ["exports", "require"],
        ["exports", "node"],
        ["exports", "default"],
        ["exports", ".", "default"],
        "files",
        "exports",
        "main"
      ])

      for (let _val of vals) {
        let _vals = _val instanceof Array ? _val : [_val]
        
        for (let val of _vals) {
          if (typeof val !== "string") continue
        
          if (val.endsWith(".cjs")) return false
          if (val.endsWith(".js") && type === "commonjs") return false
          
          if (val.endsWith(".mjs")) continue
          if (fs.existsSync(path.join("node_modules", mod, val))) {
            if (fs.statSync(path.join("node_modules", mod, val)).isDirectory()) val = path.join(val, "index.js")
            else if (!val.endsWith(".js")) val = val + ".js"

            if (!fs.existsSync(path.join("node_modules", mod, val))) continue
          }
          if (!val.endsWith(".js")) continue
          if (type === "module") continue
          


          const fileContent = fs.readFileSync(path.join("node_modules", mod, val), "utf8")
          const isCjs = isCjsRegex.test(fileContent)

          
          if (isCjs) return false
        }
      }

      
      if (!loggedAlready.has(mod)) console.error("resolved module:", mod)
      else loggedAlready.add(mod)

      return true
    }}),
    // do i even need this?
    commonJS({
      include: 'node_modules/**'
    }),
    json()
  ]
};

export default config

// console.log('resolved modules:', resolved)





function filterJsonProps(packageJsonParsed, whiteListOfPackageJsonProps/* (string | string[])[] */) {
  const ob = {}
  for (const keys of whiteListOfPackageJsonProps) {
    let keysAr = typeof keys === "string" ? keys.split(".") : keys
    let local = packageJsonParsed
    
    let failed = false
    for (const key of keysAr) {
      if (local[key] !== undefined) {
        local = local[key]
      }
      else {
        failed = true
        break
      }
    }
    if (failed) continue

    let localCopy = ob
    for (let i = 0; i < keysAr.length-1; i++) {
      const key = keysAr[i];
      if (localCopy[key] === undefined) localCopy[key] = {}
      localCopy = localCopy[key]
    }

    localCopy[keysAr[keysAr.length-1]] = local
  }
  return ob
}

function getSpecificJsonProps(packageJsonParsed, whiteListOfPackageJsonProps/* (string | string[])[] */) {
  const ar = []
  for (const keys of whiteListOfPackageJsonProps) {
    let keysAr = typeof keys === "string" ? keys.split(".") : keys
    let local = packageJsonParsed
    
    let failed = false
    for (const key of keysAr) {
      if (local[key] !== undefined) {
        local = local[key]
      }
      else {
        failed = true
        break
      }
    }
    if (failed) continue

    ar.push(local)
  }
  return ar
}









