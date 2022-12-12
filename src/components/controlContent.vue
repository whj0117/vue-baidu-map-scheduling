<!--
 * @Description: 
 * @Author: wanghongjian
 * @github: https://github.com/whj0117
 * @Date: 2022-12-09 11:39:32
 * @LastEditTime: 2022-12-09 11:41:05
 * @LastEditors:  
-->
<template>
  <bm-control
          anchor="BMAP_ANCHOR_TOP_RIGHT"
          :offset="{ width: 20, height: 20 }"
        >
          <el-button-group>
            <el-button
              icon="el-icon-edit"
              @click="toggle"
              :type="editing ? 'success' : ''"
              size="small"
              >绘制运输路线</el-button
            >
            <el-button icon="el-icon-truck" size="small" @click="getPolyLine"
              >生成运输路线</el-button
            >
            <el-button
              icon="el-icon-location-outline"
              :type="guideMarkerBool ? 'success' : ''"
              size="small"
              @click="guidePoint"
              >辅助点</el-button
            >
            <el-button
              icon="el-icon-data-line"
              size="small"
              :type="guideLineBool ? 'success' : ''"
              @click="guideLine"
              >辅助线</el-button
            >
            <el-button
              icon="el-icon-document"
              size="small"
              @click="getPolyLineDetail"
              >全览</el-button
            >
          </el-button-group>
        </bm-control>
</template>

<script>
export default {

}
</script>

<style>

</style>