/*
 * @Description: 
 * @Author: wanghongjian
 * @github: https://github.com/whj0117
 * @Date: 2022-12-07 11:14:55
 * @LastEditTime: 2022-12-07 14:45:56
 * @LastEditors:  
 */
const { defineConfig } = require('@vue/cli-service')
const path = require("path")
function resolve(dir){
  return path.join(__dirname,dir)
}
module.exports = defineConfig({
  publicPath:'/',
  transpileDependencies: true,
  lintOnSave:false,
  chainWebpack:config=>{
    config.resolve.alias
      .set("@",resolve("src"))
      .set("@assets",resolve("src/assets"))
  }
})
