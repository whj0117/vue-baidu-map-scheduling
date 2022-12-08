<!--
 * @Description: 
 * @Author: wanghongjian
 * @github: https://github.com/whj0117
 * @Date: 2022-12-08 14:15:55
 * @LastEditTime: 2022-12-08 14:18:00
 * @LastEditors:  
-->
<template>
  <el-dialog
    title="选择车次"
    :visible.sync="carDialogVisible"
    width="500px"
    @close="currentCar = null"
  >
    <template>
      <el-select
        style="width: 100%"
        v-model="currentCar"
        filterable
        placeholder="请选择"
      >
        <el-option
          v-for="item in carTableData"
          :key="item.etdoNo"
          :label="item.etdoNo"
          :value="item.etdoNo"
        >
        </el-option>
      </el-select>
    </template>
    <span slot="footer" class="dialog-footer">
      <el-button @click="carDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="chooseCar">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
    data(){
        return{
            carDialogVisible:false,
            carTableData:[{
                etdoNo:'T202212071400'
            },{
                etdoNo:'T202212071500'
            }],
            currentCar:null,
        }
    },
    methods:{
        chooseCar(){}
    }
};
</script>

<style>
</style>