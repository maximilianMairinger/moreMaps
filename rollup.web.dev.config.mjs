import { merge } from "webpack-merge"
import commonMod from "./rollup.web.common.config.mjs"


export default merge(commonMod, {
  watch: {
    include: ['app/src/**', "repl/src/**"],
    exclude: 'node_modules/**'
  }
})
