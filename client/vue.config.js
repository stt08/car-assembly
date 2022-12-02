const { defineConfig } = require('@vue/cli-service')

const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
dotenvExpand.expand(dotenv.config({path: '../.env'}))

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir : '../pages'
})
