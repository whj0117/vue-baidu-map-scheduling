<template>
  <el-drawer
    title="线路编辑"
    :visible.sync="drawer"
    size="500px"
    direction="rtl"
    @close="tableIndex = null"
  >
    <template #title>
      <span style="font-size: 18px; color: #000; font-weight: bold"
        >线路编辑</span
      >
    </template>
    <template>
      <div class="polyLineEdit">
        <div class="btn-group">
          <el-button
            v-if="!drawerData.etdoNo"
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click.stop="deletePolyLine"
            >删除</el-button
          >
          <el-button
            v-if="!drawerData.etdoNo"
            icon="el-icon-truck"
            type="primary"
            size="small"
            @click.stop="addNewCar"
            >生成新车次并添加</el-button
          >
          <el-button
            v-if="!drawerData.etdoNo"
            icon="el-icon-truck"
            type="success"
            size="small"
            @click.stop="addCar"
            >添加到已有车次</el-button
          >
          <el-button
            v-if="drawerData.etdoNo"
            icon="el-icon-truck"
            type="primary"
            size="small"
            @click.stop="removeCar"
            >移除车次</el-button
          >
        </div>
        <!-- <div class="tag-group">
          <el-tag>总体积：{{ getShopSize.v }} </el-tag>
          <el-tag type="success">总重量：{{ getShopSize.w }} </el-tag>
          <el-tag type="warning">总数量：{{ getShopSize.q }} </el-tag>
        </div> -->
        <el-table
          :data="drawerData.tableData"
          @cell-mouse-enter="cellMouse($event, 'enter')"
          @cell-mouse-leave="cellMouse($event, 'leave')"
        >
          <el-table-column type="expand" width="40px" align="center">
            <template slot-scope="{ row: { shopInfo } }">
              <div
                v-for="(item, index) in shopInfo"
                :key="index"
                style="padding: 0 20px; box-sizing: border-box"
              >
                <el-descriptions
                  :column="3"
                  :title="
                    item.ettmEbmaNameCn + '（' + item.ettmMaterialNo + '）'
                  "
                  size="small"
                  border
                >
                  <el-descriptions-item label="体积:"
                    >{{ item.v }}
                  </el-descriptions-item>
                  <el-descriptions-item label="重量:"
                    >{{ item.w }}
                  </el-descriptions-item>
                  <el-descriptions-item label="数量:"
                    >{{ item.q }}
                  </el-descriptions-item>
                </el-descriptions>
                <el-divider v-if="index < shopInfo.length - 1"></el-divider>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="ettaSoNo"
            label="客户单号"
            align="center"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="ettaToEbrgAddress"
            label="客户地址"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center" width="80px">
            <template slot-scope="{ $index, row }">
              <el-button
                @click.native.prevent="deleteTableRow($index, row)"
                type="text"
                size="small"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="list-group">
          <div class="list">
            驾车路线：
            <div style="display: flex; align-items: center">
              <div v-if="drawerData.driveBool" style="margin-right: 20px">
                <el-tag size="small"
                  >里程：{{ drawerData.driveInfo.distance }}
                </el-tag>
                <el-tag size="small"
                  >耗时：{{ drawerData.driveInfo.duration }}
                </el-tag>
              </div>
              <el-switch
                @change="saveLineConfig()"
                v-model="drawerData.driveBool"
              >
              </el-switch>
            </div>
          </div>
          <div class="list">
            是否显示：
            <el-switch @change="saveLineConfig()" v-model="drawerData.bool">
            </el-switch>
          </div>
          <div class="list">
            线条颜色：<el-color-picker
              @change="saveLineConfig()"
              v-model="drawerData.strokeColor"
            ></el-color-picker>
          </div>
          <div class="list">
            线条名称：
            <el-input
              style="width: 215px"
              @change="saveLineConfig()"
              v-model="drawerData.name"
              size="small"
              placeholder="请输入"
            />
          </div>
          <div class="list">
            线条宽度：
            <div
              class="line-width"
              v-if="drawerData.strokeWeight"
              :style="{ height: drawerData.strokeWeight + 'px' }"
            ></div>
            <el-select
              v-model="drawerData.strokeWeight"
              @change="saveLineConfig()"
              size="small"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <div
                  class="lineWidth"
                  :style="{ height: item.value + 'px' }"
                ></div>
              </el-option>
            </el-select>
          </div>
          <div class="list">
            线条类型：
            <div
              class="line-type"
              v-if="drawerData.strokeStyle"
              :style="{ borderStyle: drawerData.strokeStyle }"
            ></div>
            <el-select
              v-model="drawerData.strokeStyle"
              @change="saveLineConfig()"
              size="small"
              placeholder="请选择"
            >
              <el-option label="实线" value="solid">
                <div
                  style="width: 100%; margin-top: 16px; border: 1px solid #000"
                ></div>
              </el-option>
              <el-option label="虚线" value="dashed">
                <div
                  style="width: 100%; margin-top: 16px; border: 1px dashed #000"
                ></div>
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script>
import { LINEWIDTHOPTIONS } from "../utils/common";
export default {
  data() {
    return {
      drawer: false,
      drawerData: {},
      options: LINEWIDTHOPTIONS,
    };
  },
  methods: {
    handleOpen(item) {
      this.drawerData = item;
      this.drawer = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.polyLineEdit {
  .btn-group {
    padding: 0 20px;
    box-sizing: border-box;
  }

  .tag-group {
    margin: 20px 0;
    padding: 0 20px;
    box-sizing: border-box;
    font-weight: bold;
  }

  .list-group {
    padding: 0 20px;
    box-sizing: border-box;

    .list {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
      font-size: 12px;
    }
  }
}

.line-type {
  z-index: 1;
  position: absolute;
  width: 120px;
  height: 0;
  right: 30px;
  border: 1px solid #000;
}

.line-width {
  z-index: 1;
  position: absolute;
  width: 120px;
  right: 30px;
  background-color: #000;
}

.lineWidth {
  width: 100%;
  margin-top: 16px;
  background-color: #000;
}

.image-style {
  z-index: 1;
  position: absolute;
  top: 2px;
  left: 280px;
  cursor: pointer;
}
</style>