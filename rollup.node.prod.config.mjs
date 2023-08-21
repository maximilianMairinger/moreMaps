import { merge } from "webpack-merge"
import commonMod from "./rollup.node.common.config.mjs"


export default merge(commonMod, {
  input: 'app/src/moreMaps.ts',
  output: {
    file: 'app/dist/cjs/moreMaps.js',
    format: 'cjs'
  },
})