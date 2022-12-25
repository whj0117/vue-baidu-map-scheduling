<!--
 * @Description: 
 * @Author: wanghongjian
 * @github: https://github.com/whj0117
 * @Date: 2022-12-07 11:14:55
 * @LastEditTime: 2022-12-25 15:25:47
 * @LastEditors: wanghongjian
-->
<template>
  <div class="wrapper">
    <div class="left-content">
      <el-tabs class="elTabs" v-model="activeName">
        <el-tab-pane label="全部车次" name="first">
          <el-scrollbar style="height: calc(100vh - 55px)" class="elScrollBar">
            <el-menu
              :unique-opened="true"
              @open="handleOpen"
              @close="handleClose"
            >
              <el-submenu
                :index="item.etdoNo"
                v-for="item in trainNoList"
                :key="item.etdoNo"
              >
                <template slot="title">
                  <img
                    v-if="
                      markerIcon.find(
                        (type) =>
                          type.etdoNoList &&
                          type.etdoNoList.includes(item.etdoNo)
                      )
                    "
                    :src="
                      'images/' +
                      markerIcon.find(
                        (type) =>
                          type.etdoNoList &&
                          type.etdoNoList.includes(item.etdoNo)
                      ).icon +
                      '_car.png'
                    "
                  />
                  {{ item.etdoNo }}
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    :index="item.etdoNo + '-' + t.ettaNo"
                    v-for="(t, i) in item.children"
                    :key="i"
                    @click="handleClick(t)"
                  >
                    <i class="el-icon-tickets"></i>
                    {{ t.ettaNo }}
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="全部订单" name="second">
          <el-scrollbar style="height: calc(100vh - 55px)" class="elScrollBar">
            <el-menu
              style="border-right: none"
              @open="handleOpen"
              @close="handleClose"
            >
              <el-menu-item
                v-for="t in markerPoint"
                :key="t.ettaNo"
                :index="t.ettaNo"
                @click="handleClick(t)"
              >
                <i class="el-icon-tickets"></i>
                {{ t.ettaNo }}
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="right-content">
      <div class="searchAddress">
        <el-select
          v-model="address"
          @change="changeAddress"
          @keyup.enter.native="addGuideMarker"
          :filter-method="filterMethod"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in selectOption"
            :key="item.ettaNo"
            :label="item.label"
            :value="item.ettaNo"
          >
          </el-option>
        </el-select>
      </div>
      <baidu-map
        class="bm-view"
        :center="center"
        :zoom="zoom"
        :scroll-wheel-zoom="true"
        :double-click-zoom="false"
        @mousemove="syncPolyline"
        @rightclick="newPolyline"
        @click="handleBaiduMap"
        @ready="init"
      >
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
        <div v-for="(item, index) in markerPoint" :key="index">
          <bm-marker
            v-if="item.bool"
            :position="item.p"
            :title="item.title"
            :icon="{
              url: getMarkerIcon(item),
              size: getMarkerSize(item.size, item.etdoNo),
            }"
            :animation="item.isAn ? 'BMAP_ANIMATION_BOUNCE' : ''"
            @click="clickMarker(item)"
          >
            <bm-context-menu>
              <bm-context-menu-item
                v-if="!item.etdoNo"
                :callback="() => addTask([item])"
                text="创建新车次并添加运输任务"
              ></bm-context-menu-item>
              <bm-context-menu-item
                v-if="!item.etdoNo"
                :callback="() => openChooseCar([item])"
                text="选择已有车次"
              ></bm-context-menu-item>
              <bm-context-menu-item
                v-else
                :callback="() => removeTask([item])"
                text="移除运输任务"
              ></bm-context-menu-item>
              <bm-context-menu-item
                v-if="!item.etdoNo"
                :callback="() => editTask(item)"
                text="编辑"
              ></bm-context-menu-item>
            </bm-context-menu>
          </bm-marker>
          <bm-marker
            v-if="item.bool && item.ettaType == 'TRUNK'"
            :position="item.s"
            :title="item.title"
            :icon="{
              url: getMarkerIcon(item),
              size: getMarkerSize(item.size, item.etdoNo),
            }"
            :animation="item.isAn ? 'BMAP_ANIMATION_BOUNCE' : ''"
            @click="clickMarker(item)"
          >
            <bm-context-menu>
              <bm-context-menu-item
                v-if="!item.etdoNo"
                :callback="() => addTask([item])"
                text="创建新车次并添加运输任务"
              ></bm-context-menu-item>
              <bm-context-menu-item
                v-if="!item.etdoNo"
                :callback="() => openChooseCar([item])"
                text="选择已有车次"
              ></bm-context-menu-item>
              <bm-context-menu-item
                v-else
                :callback="() => removeTask([item])"
                text="移除运输任务"
              ></bm-context-menu-item>
              <bm-context-menu-item
                v-if="!item.etdoNo"
                :callback="() => editTask(item)"
                text="编辑标记点"
              ></bm-context-menu-item>
            </bm-context-menu>
          </bm-marker>
        </div>
        <div v-for="(item, index) of polylineList" :key="item.timeStamp">
          <div>
            <bm-polyline
              v-if="item.bool"
              :path="item.path"
              :editing="item.editing"
              :stroke-color="item.strokeColor"
              :stroke-weight="item.strokeWeight"
              :stroke-style="item.strokeStyle"
              @mouseout="handlePolyLine($event, item, 'mouseout')"
              @mouseover="handlePolyLine($event, item, 'mouseover')"
              @click="handlePolyLine($event, item, 'click', index)"
              @lineupdate="handlePolyLine($event, item, 'lineupdate')"
              @mouseup="handlePolyLine($event, item, 'mouseup')"
            />
          </div>
          <div>
            <bm-driving
              v-if="item.driveBool && item.path.length > 1"
              :start="item.path[0]"
              :end="item.path[item.path.length - 1]"
              :auto-viewport="false"
              :panel="false"
              :waypoints="item.waypoints"
              @searchcomplete="searchcomplete($event, item)"
            />
          </div>
        </div>
        <!-- 辅助点 -->
        <div v-for="item of guideMarkerList" :key="item.timeStamp">
          <bm-marker
            v-if="item.bool"
            :position="item.p"
            :title="item.title"
            :dragging="true"
            :icon="{ url: getMarkerIcon(item), size: getMarkerSize(item.size) }"
            :animation="item.isAn ? 'BMAP_ANIMATION_BOUNCE' : ''"
            @dragend="dragendGuideMarker($event, item)"
          >
            <bm-context-menu>
              <bm-context-menu-item
                :callback="() => editTask(item)"
                text="编辑"
              ></bm-context-menu-item>
              <bm-context-menu-item
                :callback="() => deleteGuideMarker(item.timeStamp)"
                text="删除"
              ></bm-context-menu-item>
            </bm-context-menu>
          </bm-marker>
        </div>
        <!-- 辅助线 -->
        <div v-for="item of guideLineList" :key="item.timeStamp">
          <div>
            <bm-polyline
              v-if="item.bool"
              :path="item.path"
              :editing="true"
              :stroke-color="item.strokeColor"
              :stroke-weight="item.strokeWeight"
              :stroke-style="item.strokeStyle"
              @click="handleGuideLine($event, item, 'click')"
              @lineupdate="handleGuideLine($event, item, 'lineupdate')"
            />
          </div>
          <div>
            <bm-driving
              v-if="item.driveBool && item.path.length > 1"
              :start="item.path[0]"
              :end="item.path[item.path.length - 1]"
              :auto-viewport="false"
              :panel="false"
              :waypoints="item.waypoints"
              @searchcomplete="searchcomplete($event, item)"
            />
          </div>
        </div>
        <div v-for="(item, index) in getTrunkData" :key="index">
          <div>
            <bm-label
              v-if="item.bool"
              :content="'提' + (index + 1)"
              :position="item.s"
              :offset="{ width: -10, height: -35 }"
            />
          </div>
          <div>
            <bm-label
              v-if="item.bool"
              :content="'送' + (index + 1)"
              :position="item.p"
              :offset="{ width: -10, height: -35 }"
            />
          </div>
        </div>
      </baidu-map>
    </div>
    <chooseCar ref="chooseCar" @emitChooseCar="emitChooseCar" />
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
              @click.stop="addTask(drawerData.tableData)"
              >生成新车次并添加</el-button
            >
            <el-button
              v-if="!drawerData.etdoNo"
              icon="el-icon-truck"
              type="success"
              size="small"
              @click.stop="openChooseCar(drawerData.tableData)"
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
          <!-- <el-table
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
            prop="ettaEtorToEbrgAddress"
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
        </el-table> -->
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
                  <div style="
                      width: 100%;
                      margin-top: 16px;
                      border: 1px solid #000;
                    "
                  ></div>
                </el-option>
                <el-option label="虚线" value="dashed">
                  <div
                    style="
                      width: 100%;
                      margin-top: 16px;
                      border: 1px dashed #000;
                    "
                  ></div>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </template>
    </el-drawer>
    <!-- <editPolyLine
      ref="editPolyLine"
      @cellMouse="cellMouse"
      @deletePolyLine="deletePolyLine"
      @addTask="addTask"
      @openChooseCar="openChooseCar"
    /> -->
    <el-drawer
      title="标记点编辑"
      :visible.sync="markerDrawer"
      size="500px"
      direction="rtl"
    >
      <template #title>
        <span style="font-size: 18px; color: #000; font-weight: bold"
          >标记点编辑</span
        >
      </template>
      <template>
        <div class="polyLineEdit">
          <div class="list-group">
            <div class="list">
              是否显示：
              <el-switch v-model="markerDrawerData.bool" />
            </div>
            <div class="list">
              当前位置：
              <div v-if="markerDrawerData.isTrunk">
                <el-input
                  style="width: 215px"
                  :disabled="!!markerDrawerData.ettaNo"
                  @change="editGuideMarker(markerDrawerData)"
                  v-model="markerDrawerData.ettaFromEbrgAddress"
                  size="small"
                  placeholder="请输入"
                />
              </div>
              <div v-else>
                <el-input
                  style="width: 215px"
                  :disabled="!!markerDrawerData.ettaNo"
                  @change="editGuideMarker(markerDrawerData)"
                  v-model="markerDrawerData.ettaEtorToEbrgAddress"
                  size="small"
                  placeholder="请输入"
                />
              </div>
            </div>
            <div class="list">
              经纬度：
              <span v-if="markerDrawerData.isTrunk"
                >{{ markerDrawerData.s.lng }},{{ markerDrawerData.s.lat }}</span
              >
              <span v-else
                >{{ markerDrawerData.p.lng }},{{ markerDrawerData.p.lat }}</span
              >
            </div>
            <div class="list">
              标记名称：
              <el-input
                style="width: 215px"
                v-model="markerDrawerData.name"
                size="small"
                placeholder="请输入"
              />
            </div>
            <div class="list">
              标记样式：
              <div
                class="image-style"
                v-if="markerDrawerData.icon"
                @click.stop="$refs['markerSelect'].visible = true"
              >
                <img
                  :src="
                    getMarkerIcon({
                      icon: markerDrawerData.icon,
                      size: 'small',
                    })
                  "
                />
              </div>
              <el-select
                ref="markerSelect"
                class="elSelectLine"
                v-model="markerDrawerData.icon"
                size="small"
                placeholder=""
              >
                <el-option
                  v-for="(item, index) in markerIcon"
                  :key="index.icon"
                  :label="item.icon"
                  :value="item.icon"
                >
                  <img
                    :src="getMarkerIcon({ icon: item.icon, size: 'small' })"
                  />
                </el-option>
              </el-select>
            </div>
            <div class="list">
              标记大小：
              <el-select
                v-model="markerDrawerData.size"
                size="small"
                placeholder="请选择"
              >
                <el-option label="小" value="small"></el-option>
                <el-option label="大" value="big"></el-option>
              </el-select>
            </div>
            <div class="list">
              备注：
              <el-input
                style="width: 215px"
                v-model="markerDrawerData.title"
                size="small"
                placeholder="请输入"
              />
            </div>
          </div>
        </div>
      </template>
    </el-drawer>
    <el-drawer
      title="辅助线编辑"
      :visible.sync="guideLineDrawer"
      size="500px"
      direction="rtl"
      @close="tableIndex = null"
    >
      <template #title>
        <span style="font-size: 18px; color: #000; font-weight: bold"
          >辅助线编辑</span
        >
      </template>
      <template>
        <div class="polyLineEdit">
          <div class="btn-group">
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="small"
              @click.stop="
                deleteGuideLine
              "
              >删除</el-button
            >
          </div>
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
                  @change="saveLineConfig(drawerData, 'guideLine')"
                  v-model="drawerData.driveBool"
                >
                </el-switch>
              </div>
            </div>
            <div class="list">
              是否显示：
              <el-switch
                @change="saveLineConfig(drawerData, 'guideLine')"
                v-model="drawerData.bool"
              >
              </el-switch>
            </div>
            <div class="list">
              线条颜色：<el-color-picker
                @change="saveLineConfig(drawerData, 'guideLine')"
                v-model="drawerData.strokeColor"
              ></el-color-picker>
            </div>
            <div class="list">
              线条名称：
              <el-input
                style="width: 215px"
                @change="saveLineConfig(drawerData, 'guideLine')"
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
                @change="saveLineConfig(drawerData, 'guideLine')"
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
                @change="saveLineConfig(drawerData, 'guideLine')"
                size="small"
                placeholder="请选择"
              >
                <el-option label="实线" value="solid">
                  <div
                    style="
                      width: 100%;
                      margin-top: 16px;
                      border: 1px solid #000;
                    "
                  ></div>
                </el-option>
                <el-option label="虚线" value="dashed">
                  <div
                    style="
                      width: 100%;
                      margin-top: 16px;
                      border: 1px dashed #000;
                    "
                  ></div>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </template>
    </el-drawer>
    <el-drawer
									title="全览"
									:visible.sync="detailVisible"
									size="100%"
									direction="rtl">
									<template #title>
										<span style="font-size:18px;color:#000;font-weight:bold">全览</span>
									</template>
									<template>
										<div style="padding:0 50px">
											<div v-if="polylineList.length" style="margin-top:30px;margin-bottom:10px;font-size:16px;color:#000;font-weight:bold">线：</div>
											<el-table v-if="polylineList.length" :data="polylineList" border>
												<el-table-column prop="name" label="线条名称" align="center">
													<template slot-scope="{$index,row}">
														<el-input v-model="row.name" size="small" />
													</template>
												</el-table-column>
												<el-table-column prop="strokeWeight" label="线条宽度" align="center">
													<template slot-scope="{$index,row}">
														<div class="line-width" style="width:45%;top:0;bottom:0;margin:auto 10% auto 0" v-if="row.strokeWeight" :style="{height:row.strokeWeight + 'px'}"></div>
														<el-select v-model="row.strokeWeight" size="small" placeholder="请选择">
															<el-option
																v-for="item in options"
																:key="item.value"
																:label="item.label"
																:value="item.value">
																<div class="lineWidth" :style="{height:item.value + 'px'}"></div>
															</el-option>
														</el-select>
													</template>
												</el-table-column>
												<el-table-column prop="strokeColor" label="线条颜色" align="center">
													<template slot-scope="{$index,row}">
														<el-color-picker v-model="row.strokeColor"></el-color-picker>
													</template>
												</el-table-column>
												<el-table-column prop="strokeStyle" label="线条类型" align="center">
													<template slot-scope="{$index,row}">
														<div class="line-type" style="width:45%;top:0;bottom:0;margin:auto 10% auto 0" v-if="row.strokeStyle" :style="{borderStyle:row.strokeStyle}"></div>
														<el-select v-model="row.strokeStyle" size="small" placeholder="请选择">
															<el-option label="实线" value="solid">
																<div style="width:100%;margin-top:16px;border:1px solid #000"></div>
															</el-option>
															<el-option label="虚线" value="dashed">
																<div style="width:100%;margin-top:16px;border:1px dashed #000"></div>
															</el-option>
														</el-select>
													</template>
												</el-table-column>
												<el-table-column
													label="是否显示"
													align="center">
													<template slot-scope="{$index,row}">
														<el-switch
															v-model="row.bool"/>
													</template>
												</el-table-column>
												<el-table-column
													label="驾车路线"
													align="center">
													<template slot-scope="{$index,row}">
														<el-switch v-model="row.driveBool" />
													</template>
												</el-table-column>
												<el-table-column
													label="操作"
													align="center">
													<template slot-scope="{$index,row:{etfdId}}">
														<el-button
															@click.native.prevent="deletePolyLine({etfdId})"
															type="text"
															size="small">
															删除
														</el-button>
													</template>
												</el-table-column>
											</el-table>
											<div v-if="markerPoint.length" style="margin-top:30px;margin-bottom:10px;font-size:16px;color:#000;font-weight:bold">点：</div>
											<el-table v-if="markerPoint.length" :data="markerPoint" border>
												<el-table-column prop="ettaNo" label="订单编号" align="center"></el-table-column>
												<el-table-column label="标记样式" align="center">
													<template slot-scope="{$index,row}">
														<div class="image-style" style="left:15%;top:26%" v-if="row.icon" @click.stop="$refs['markerSelect_'+$index].visible = true">
															<img :src="getMarkerIcon({icon:row.icon,size:'small'})" />
														</div>
														<el-select :ref="'markerSelect_'+$index" class="elSelectLine" v-model="row.icon" @change="saveMarkerConfig(row)" size="small" placeholder="">
															<el-option
																v-for="(item,index) in markerIcon"
																:key="index.icon"
																:label="item.icon"
																:value="item.icon">
																<img :src="getMarkerIcon({icon:item.icon,size:'small'})" />
															</el-option>
														</el-select>
													</template>
												</el-table-column>
												<el-table-column prop="name" label="标记名称" align="center">
													<template slot-scope="{$index,row}">
														<el-input v-model="row.name" size="small" @change="saveMarkerConfig(row)" />
													</template>
												</el-table-column>
												<el-table-column prop="ettaEtorToEbrgAddress" label="详细地址" align="center" min-width="200px"></el-table-column>
												<el-table-column label="经纬度" align="center">
													<template slot-scope="{row:{p:{lng,lat}}}">{{lng}},{{lat}}
													</template>
												</el-table-column>
												<el-table-column
													label="是否显示"
													align="center">
													<template slot-scope="{row}">
														<el-switch
															v-model="row.bool" @change="saveMarkerConfig(row)">
														</el-switch>
													</template>
												</el-table-column>
												<el-table-column prop="title" label="备注" align="center">
													<template slot-scope="{$index,row}">
														<el-input v-model="row.title" size="small" @change="saveMarkerConfig(row)" />
													</template>
												</el-table-column>
											</el-table>
											<div v-if="guideLineList.length" style="margin-top:30px;margin-bottom:10px;font-size:16px;color:#000;font-weight:bold">辅助线：</div>
											<el-table v-if="guideLineList.length" :data="guideLineList" border>
												<el-table-column prop="name" label="线条名称" align="center">
													<template slot-scope="{$index,row}">
														<el-input v-model="row.name" size="small" @change="saveLineConfig(row,'guideLine')" />
													</template>
												</el-table-column>
												<el-table-column prop="strokeWeight" label="线条宽度" align="center">
													<template slot-scope="{$index,row}">
														<div class="line-width" style="width:45%;top:0;bottom:0;margin:auto 10% auto 0" v-if="row.strokeWeight" :style="{height:row.strokeWeight + 'px'}"></div>
														<el-select v-model="row.strokeWeight" @change="saveLineConfig(row,'guideLine')" size="small" placeholder="请选择">
															<el-option
																v-for="item in options"
																:key="item.value"
																:label="item.label"
																:value="item.value">
																<div class="lineWidth" :style="{height:item.value + 'px'}"></div>
															</el-option>
														</el-select>
													</template>
												</el-table-column>
												<el-table-column prop="strokeColor" label="线条颜色" align="center">
													<template slot-scope="{$index,row}">
														<el-color-picker v-model="row.strokeColor" @change="saveLineConfig(row,'guideLine')"></el-color-picker>
													</template>
												</el-table-column>
												<el-table-column prop="strokeStyle" label="线条类型" align="center">
													<template slot-scope="{$index,row}">
														<div class="line-type" style="width:45%;top:0;bottom:0;margin:auto 10% auto 0" v-if="row.strokeStyle" :style="{borderStyle:row.strokeStyle}"></div>
														<el-select v-model="row.strokeStyle" @change="saveLineConfig(row,'guideLine')" size="small" placeholder="请选择">
															<el-option label="实线" value="solid">
																<div style="width:100%;margin-top:16px;border:1px solid #000"></div>
															</el-option>
															<el-option label="虚线" value="dashed">
																<div style="width:100%;margin-top:16px;border:1px dashed #000"></div>
															</el-option>
														</el-select>
													</template>
												</el-table-column>
												<el-table-column
													label="是否显示"
													align="center">
													<template slot-scope="{$index,row}">
														<el-switch
															v-model="row.bool"
															@change="saveLineConfig(row,'guideLine')" />
													</template>
												</el-table-column>
												<el-table-column
													label="驾车路线"
													align="center">
													<template slot-scope="{$index,row}">
														<el-switch v-model="row.driveBool" @change="saveLineConfig(row,'guideLine')" />
													</template>
												</el-table-column>
												<el-table-column
													label="操作"
													align="center">
													<template slot-scope="{$index,row:{etfdId}}">
														<el-button
															@click.native.prevent="deletePolyLine({etfdId,key:'guideLineList'})"
															type="text"
															size="small">
															删除
														</el-button>
													</template>
												</el-table-column>
											</el-table>
											<div v-if="guideMarkerList.length" style="margin-top:30px;margin-bottom:10px;font-size:16px;color:#000;font-weight:bold">辅助点：</div>
											<el-table v-if="guideMarkerList.length" :data="guideMarkerList" border>
												<el-table-column label="标记样式" align="center">
													<template slot-scope="{$index,row}">
														<div class="image-style" style="left:15%;top:26%" v-if="row.icon" @click.stop="$refs['markerSelect_'+$index].visible = true">
															<img :src="getMarkerIcon({icon:row.icon,size:'small'})" />
														</div>
														<el-select :ref="'markerSelect_'+$index" class="elSelectLine" v-model="row.icon" @change="saveMarkerConfig(row)" size="small" placeholder="">
															<el-option
																v-for="(item,index) in markerIcon"
																:key="index.icon"
																:label="item.icon"
																:value="item.icon">
																<img :src="getMarkerIcon({icon:item.icon,size:'small'})" />
															</el-option>
														</el-select>
													</template>
												</el-table-column>
												<el-table-column prop="name" label="标记名称" align="center">
													<template slot-scope="{$index,row}">
														<el-input v-model="row.name" size="small" @change="saveMarkerConfig(row)" />
													</template>
												</el-table-column>
												<el-table-column prop="ettaEtorToEbrgAddress" label="详细地址" align="center" min-width="200px"></el-table-column>
												<el-table-column label="经纬度" align="center">
													<template slot-scope="{row:{p:{lng,lat}}}">{{lng}},{{lat}}
													</template>
												</el-table-column>
												<el-table-column
													label="是否显示"
													align="center">
													<template slot-scope="{row}">
														<el-switch
															v-model="row.bool" @change="saveMarkerConfig(row)">
														</el-switch>
													</template>
												</el-table-column>
												<el-table-column prop="title" label="备注" align="center">
													<template slot-scope="{$index,row}">
														<el-input v-model="row.title" size="small" @change="saveMarkerConfig(row)" />
													</template>
												</el-table-column>
												<el-table-column
													label="操作"
													align="center">
													<template slot-scope="{$index,row:{etfdId}}">
														<el-button
															@click.native.prevent="deletePolyLine({etfdId,key:'guideMarkerList'})"
															type="text"
															size="small">
															删除
														</el-button>
													</template>
												</el-table-column>
											</el-table>
										</div>
									</template>
								</el-drawer>
  </div>
</template>

<script>
import {
  TRAINNOLIST,
  MARKERPOINT,
  CARICON,
  RESETPATHS,
  RESETGUIDELINE,
  LINEWIDTHOPTIONS,
} from "../utils/common";
import chooseCar from "../components/chooseCar.vue";
import editPolyLine from "../components/editPolyLine.vue";
import Sortable from "sortablejs";
export default {
  name: "HelloWorld",
  props: {},
  components: { chooseCar, editPolyLine },
  computed: {
    // 获取提送地址
    getTrunkData() {
      var arr = [];
      this.markerPoint.forEach((item) => {
        if (item.ettaType === "TRUNK") {
          arr.push(item);
        }
      });
      return arr;
    },
  },
  data() {
    return {
      BMap: null,
      activeName: "first",
      trainNoList: TRAINNOLIST(),
      markerPoint: MARKERPOINT(),
      markerIcon: CARICON(),
      selectOption: MARKERPOINT(), //选择输入框
      center: { lng: 116.4, lat: 39.91 },
      zoom: 10,
      address: "",
      editing: false,
      guideMarkerBool: false,
      guideLineBool: false,
      guideLineList: [],
      guideLineDrawer: false,//辅助线弹窗开关
      pathsConfig: RESETPATHS(),
      polylineList: [],
      activeMarker: [], //右键打开已有车次
      markerDrawerData: {
        p: {},
      },
      markerDrawer: false,
      guideMarkerList: [], //辅助点
      guideMarkerBool: false,
      drawer: false,
      drawerData: {},
      options: LINEWIDTHOPTIONS,
      detailVisible:false,
    };
  },
  methods: {
    // 地图初始化完成
    init({ BMap, map }) {
      this.BMap = BMap;
      this.getTrainMarker();
    },
    // 打开选择车次dialog
    openChooseCar(item) {
      this.activeMarker = item;
      this.$refs["chooseCar"].carDialogVisible = true;
    },
    // 添加已有车次dialog确认按钮
    emitChooseCar(currentCar) {
      try {
        this.polylineList[this.tableIndex].etdoNo = currentCar;
        this.trainNoList.forEach((item) => {
          if (item.etdoNo == currentCar) {
            const { children } = item;
            this.activeMarker.forEach((a) => {
              a.etdoNo = currentCar;
            });
            item.children = [...children, ...this.activeMarker];
          }
        });
      } catch (err) {}
      console.log(this.trainNoList);
    },
    // 获取驾车结果
    searchcomplete(evt, item) {
      if (!evt.getNumPlans()) return false;
      var obj = {
        duration: evt.getPlan(0).getDuration(true),
        distance: evt.getPlan(0).getDistance(true),
      };
      item.driveInfo = obj;
    },
    // 移除车次
    removeCar() {
      const { tableData } = this.polylineList[this.tableIndex];
      this.removeTask(tableData);
    },
    // 标记点编辑按钮
    editTask(item) {
      this.markerDrawerData = item;
      this.markerDrawer = true;
    },
    cellMouse(ettaNo, val) {
      const { markerPoint } = this;
      try {
        markerPoint.forEach((item) => {
          if (ettaNo == item.ettaNo) {
            item.isAn = val === "enter";
            throw new Error();
          }
        });
      } catch (err) {}
    },
    // 删除当前运输线
    deletePolyLine() {
      this.polylineList.splice(this.tableIndex, 1);
      this.$message({
        message: "删除成功",
        type: "success",
      });
    },
    // 删除辅助点
    deleteGuideMarker(timeStamp) {
      this.guideMarkerList.splice(
        this.guideMarkerList.findIndex((type) => type.timeStamp == timeStamp),
        1
      );
      this.$message({
        message: "删除成功",
        type: "success",
      });
    },
    // 删除辅助线
    deleteGuideLine(){
      const {timeStamp} = this.drawerData
      this.guideLineList.splice(this.guideLineList.findIndex(type=>type.timeStamp == timeStamp),1)
      this.$message({
        message: "删除成功",
        type: "success",
      });
      this.guideLineDrawer = false
    },
    // 拖拽辅助点结束
    dragendGuideMarker({ type, target, pixel, point }, item) {
      var gc = new BMap.Geocoder();
      gc.getLocation(point, (res) => {
        item.p = point;
        item.ettaEtorToEbrgAddress = res.address;
      });
    },
    handleOpen() {},
    handleClose() {},
    // 获取车次显示图标
    getTrainMarker() {
      // this.markerIcon = resetMarkerIcon()
      const { trainNoList, markerIcon } = this;
      trainNoList.forEach(({ etdoNo }, i) => {
        try {
          var find = markerIcon.find(
            (type) => type.etdoNoList && type.etdoNoList.includes(etdoNo)
          );
          if (!find) {
            var maxList = markerIcon.map((item, index) => {
              return {
                len: !item.etdoNoList ? 0 : item.etdoNoList.length,
                index,
              };
            });
            var maxObj = maxList.find(
              (type) =>
                type.len ==
                Math.min.apply(
                  Math,
                  maxList.map((ele) => {
                    return ele.len;
                  })
                )
            );
            if (!this.markerIcon[maxObj.index].etdoNoList)
              this.$set(this.markerIcon[maxObj.index], "etdoNoList", []);
            this.markerIcon[maxObj.index].etdoNoList.push(etdoNo);
            throw new Error();
          }
        } catch (err) {}
      });
    },
    trainNoData({ handle, etdoNo, pro = [] }) {
      try {
        etdoNo = etdoNo || pro[0].etdoNo;
        let findIndex = this.trainNoList.findIndex(
          (type) => type.etdoNo == etdoNo
        );
        if (handle == "add") {
          if (findIndex > -1) {
            this.trainNoList[findIndex].children = [
              ...this.trainNoList[findIndex].children,
              ...pro,
            ];
          } else {
            this.trainNoList.push({
              etdoNo,
              children: pro,
            });
          }
        } else {
          if (pro.length == this.trainNoList[findIndex].children.length) {
            this.trainNoList.splice(findIndex, 1);
          } else {
            try {
              let { children } = this.trainNoList[findIndex];
              pro.forEach((item) => {
                children((c, ci) => {
                  if (c.ettaNo == item.ettaNo) {
                    children.splice(ci, 1);
                  }
                });
              });
            } catch (err) {}
          }
        }
      } catch (err) {}
      this.getTrainMarker();
    },
    saveLineConfig() {},
    // 添加运输任务
    addTask(pro) {
      const { polylineList, tableIndex, trainNoList } = this;
      const { currentCar } = this;
      const etdoNo = currentCar || "T" + Date.now();
      this.trainNoData({ handle: "add", etdoNo, pro });
      pro.forEach((item) => {
        try {
          this.markerPoint.forEach((m) => {
            if (item.ettaNo == m.ettaNo) {
              item.etdoNo = etdoNo;
              m.etdoNo = etdoNo;
              throw new Error();
            }
          });
        } catch (err) {}
      });
      if (pro.length > 1) {
        // 批量添加
        try {
          // 判断批量添加之前，该车次是否已存在订单
          polylineList.forEach((item) => {
            if (item.etdoNo == etdoNo) {
              // 已有订单并且存在polylineList里面加入该车
              item.path = [...item.path, ...pro.map((item) => item.p)];
              item.tableData = [...item.tableData, ...pro];
              item.waypoints = that.getWayPoints(item.path);
              that.deletePolyLine({ isMessage: false }); //合并到一辆车，删除当前线
              that.saveLineConfig(item);
              throw new Error();
            }
          });
          var find = trainNoList.find((type) => type.etdoNo == etdoNo);
          if (find) {
            var diff = find.children.filter(
              (x) =>
                !polylineList[tableIndex].tableData.some(
                  (y) => y.ettaNo == x.ettaNo
                )
            );
            if (diff.length) {
              const { path, tableData } = polylineList[tableIndex];
              polylineList[tableIndex].path = [
                ...diff.map((d) => d.p),
                ...path,
              ];
              polylineList[tableIndex].tableData = [...diff, ...tableData];
              polylineList[tableIndex].waypoints = that.getWayPoints(
                polylineList[tableIndex].path
              );
            }
          }
          this.$set(polylineList[tableIndex], "etdoNo", etdoNo);
          this.saveLineConfig();
        } catch (err) {}
        this.carDialogVisible = false;
      } else {
        // 右键单个添加
        polylineList.forEach((item) => {
          if (item.etdoNo == etdoNo) {
            item.path.push(pro[0].p);
            item.tableData.push({
              etdoNo,
              ettaId: pro[0].ettaId,
              ettaNo: pro[0].ettaNo,
              ettaType: pro[0].ettaType,
              p: pro[0].p,
              ettaSoNo: pro[0].ettaSoNo,
              ettaToEbrgAddress: pro[0].ettaToEbrgAddress,
            });
            item.waypoints = that.getWayPoints(item.path);
            this.saveLineConfig(item);
          }
        });
      }
      this.$message({
        message: "添加运输任务成功",
        type: "success",
      });
    },
    // 移除运输任务
    removeTask(pro) {
      const { polylineList, tableIndex } = this;
      this.$notify.closeAll();
      this.$message({
        message: "运输任务移除成功",
        type: "success",
      });
      this.trainNoData({ handle: "remove", pro });
      pro.forEach((item) => {
        try {
          this.markerPoint.forEach((m) => {
            if (item.ettaNo == m.ettaNo) {
              // item.etdoNo = null;
              m.etdoNo = null;
              if (!m.isEditIcon && m.icon == "blue") m.icon = "red"; //说明原本是蓝色，没有修改过marker样式
              // m.icon = 'red'
              throw new Error();
            }
          });
        } catch (err) {}
      });
      if (pro.length > 1) {
        // 批量移除
        polylineList[tableIndex].etdoNo = null;
        this.saveLineConfig();
        // that.drawer = false
      } else if (pro.length == 1) {
        if (polylineList[tableIndex]) {
          // 弹窗表格移除
          pro.isAn = false;
          var findIndex = polylineList[tableIndex].path.findIndex(
            (type) => type.lng == pro[0].p.lng && type.lat == pro[0].p.lat
          );
          var driveBool = polylineList[tableIndex].driveBool;
          polylineList[tableIndex].path.splice(findIndex, 1);
          polylineList[tableIndex].tableData.splice(findIndex, 1);
          console.log(
            "表格删除",
            this.getWayPoints(polylineList[tableIndex].path)
          );
          polylineList[tableIndex].waypoints = this.getWayPoints(
            polylineList[tableIndex].path
          );
          if (driveBool) polylineList[tableIndex].driveBool = false;
          this.$nextTick(() => {
            if (driveBool) polylineList[tableIndex].driveBool = true;
            this.saveLineConfig();
            if (!polylineList[tableIndex].path.length) this.drawer = false;
          });
        } else {
          // 标点右键移除
          try {
            polylineList.forEach((item) => {
              const { path } = item;
              path.forEach((p, i) => {
                if (p.lng == pro[0].p.lng && p.lat == pro[0].p.lat) {
                  var driveBool = item.driveBool;
                  if (driveBool) item.driveBool = false;
                  path.splice(i, 1);
                  item.tableData.splice(i, 1);
                  item.waypoints = this.getWayPoints(path);
                  this.$nextTick(() => {
                    if (path.length <= 1) {
                      this.deletePolyLine({
                        etfdId: item.etfdId,
                        isMessage: false,
                      });
                    } else {
                      if (driveBool) item.driveBool = true;
                      this.saveLineConfig(item);
                    }
                  });
                  throw new Error();
                }
              });
            });
          } catch (err) {}
        }
      }
    },
    // 点击左侧运输单
    handleClick({ p, ettaNo }) {
      const { markerPoint } = this;
      this.center = p;
      this.zoom = 15;
      var find = markerPoint.find((type) => type.ettaNo == ettaNo);
      console.log("111111111", find);
      if (find) {
        this.$set(find, "isAn", true);
        setTimeout(() => {
          find.isAn = false;
        }, 40);
      }
    },
    // 点搜索按照条件有，客户订单号，客户地址，客户姓名，客户手机号
    filterMethod(val) {
      const { markerPoint } = this;
      this.address = val;
      if (val) {
        this.selectOption = markerPoint.filter((item) => {
          const {
            ettaSoNo,
            ettaToEbrgAddress,
            ettaToContactMobile,
            ettaConsigneeEbspNameCn,
          } = item;
          if (
            !!~ettaSoNo.toUpperCase().indexOf(val.toUpperCase()) ||
            !!~ettaToEbrgAddress.indexOf(val) ||
            !!~ettaToContactMobile.indexOf(val) ||
            !!~ettaConsigneeEbspNameCn.indexOf(val)
          ) {
            return true;
          }
        });
      } else {
        this.selectOption = markerPoint;
      }
    },
    // 选择地址搜索
    changeAddress(val) {
      const { markerPoint } = this;
      if (val) {
        var find = markerPoint.find((type) => type.ettaNo == val);
        this.center = find.p;
        this.zoom = 15;
        find.isAn = true;
        setTimeout(() => {
          find.isAn = false;
        }, 40);
      } else {
        this.zoom = 10;
        this.selectOption = markerPoint;
      }
    },
    toggle() {
      this.guideMarkerBool = false;
      this.guideLineBool = false;
      this.editing = !this.editing;
      if (!this.editing) this.pathsConfig = RESETPATHS();
    },
    // 点击marker
    clickMarker(item) {
      if (this.editing) {
        const { icon, ettaNo, etdoNo, ettaType } = item;
        if (etdoNo) {
          this.$message.error("该订单已有车次，不能重复加入");
          return false;
        }
        const {
          pathsConfig: { tableData, path },
        } = this;
        var p = ettaType == "TRUNK" ? { ...item.s } : { ...item.p };
        var iconList = icon.split("&");
        if (iconList.length > 1) {
          item.icon = iconList[0];
          var splicePathIndex = path.splice(
            (type) => type.lng == p.lng && type.lat == p.lat
          );
          var spliceTableIndex = tableData.findIndex(
            (type) => type.ettaNo == ettaNo
          );
          path.splice(splicePathIndex, 1);
          tableData.splice(spliceTableIndex, 1);
        } else {
          item.icon += "&green";
          path.push(p);
          tableData.push(item);
        }
      } else {
        this.getGoodsInfo(item.ettaNo);
      }
    },
    // 根据点生成线
    getPolyLine() {
      this.markerPoint.forEach((item) => {
        const { icon } = item;
        var len = icon.split("&").length;
        if (len > 1) item.icon = item.icon.split("&")[0];
      });
      const { polylineList, pathsConfig } = this;
      if (pathsConfig.path.length <= 1) {
        this.$message.error("请至少选择两个点进行连线");
        return false;
      }

      try {
        polylineList.forEach((item) => {
          const { path } = item;
          path.forEach((i) => {
            pathsConfig.path.forEach((p, index) => {
              if (i.lng == p.lng && i.lat == p.lat) {
                pathsConfig.path.splice(index, 1);
                pathsConfig.tableData.splice(index, 1);
                item.path = [...item.path, ...pathsConfig.path];
                item.tableData = [...item.tableData, ...pathsConfig.tableData];
                item.waypoints = this.getWayPoints(item.path);
                this.saveLineConfig(item);
                this.pathsConfig = RESETPATHS();
                this.editing = false;
                throw new Error("存在");
              }
            });
          });
        });
        pathsConfig.waypoints = this.getWayPoints(pathsConfig.path);
        this.polylineList.push(pathsConfig);
        // this.saveLineConfig(pathsConfig);
        this.editing = false;
        this.pathsConfig = RESETPATHS();
        console.log("11111111111111", this.polylineList);
      } catch (err) {}
    },
    // 线的操作事件
    handlePolyLine(evt, item, handle, index) {
      switch (handle) {
        case "mouseout":
          break;
        case "mouseover":
          break;
        case "click":
          this.tableIndex = index;
          this.drawerData = item;
          this.drawer = true;
          // this.rowDrop()
          // this.getTotalInfo()
          break;
        case "lineupdate":
          const { markerPoint } = this;
          const getPath = evt.target.getPath();
          var difference = null;
          if (getPath.length != item.path.length) {
            if (getPath.length > item.path.length) {
              difference = this.getArrDifference(getPath, item.path);
            } else {
              difference = this.getArrDifference(item.path, getPath);
            }
            // console.log(difference)
            markerPoint.forEach(({ p }) => {
              if (p.lng == difference.lng && p.lat == difference.lat) {
                // console.log(p)
              }
            });
          }
          // item.path = evt.target.getPath()
          break;
        case "mouseup":
          break;
      }
    },
    // 获取途径点
    getWayPoints(path) {
      return path.length > 2 ? path.slice(1, path.length - 1) : [];
    },
    getGoodsInfo() {},
    syncPolyline({ type, target, point, pixel, overlay }) {
      if (!this.guideLineBool) return;
      const { guideLineList } = this;
      if (!guideLineList.length) return;
      const { path = [] } = guideLineList[guideLineList.length - 1];
      if (!path.length) return;
      if (path.length == 1) {
        path.push(point);
      }
      this.$set(path, path.length - 1, point);
    },
    newPolyline() {
      if (!this.guideLineBool) return;
      const { guideLineList } = this;
      if (!guideLineList.length) {
        guideLineList.push(RESETGUIDELINE());
      }
      const { path } = guideLineList[guideLineList.length - 1];
      path.pop();
      this.saveLineConfig(guideLineList[guideLineList.length - 1], "guideLine");
      if (path.length) {
        guideLineList.push(RESETGUIDELINE());
      }
      this.guideLineBool = false;
    },
    handleGuideLine(evt, item, handle) {
      switch (handle) {
        case "click":
          this.drawerData = item;
          this.guideLineDrawer = true;
          break;
        case "lineupdate":
          const getPath = evt.target.getPath();
          if (JSON.stringify(getPath) != JSON.stringify(item.path)) {
            item.path = getPath;
            this.saveLineConfig(item, "guideLine");
          }
          break;
      }
    },
    // 点击地图操作事件
    handleBaiduMap({ type, target, point, pixel, overlay }) {
      if (this.guideMarkerBool) {
        var gc = new BMap.Geocoder();
        gc.getLocation(point, (rs) => {
          var addComp = rs.addressComponents;
          var obj = {
            p: point,
            bool: true,
            ettaEtorToEbrgAddress:
              addComp.province +
              addComp.city +
              addComp.district +
              addComp.street +
              addComp.streetNumber,
            name: "我是辅助点",
            icon: "black",
            size: "small",
            title: "",
            isAn: false,
            timeStamp: Date.now(),
          };
          // this.saveLineConfig(obj, (etfdType = "guideMarker"));
          this.guideMarkerList.push(obj);
        });
      } else if (this.guideLineBool) {
        const { guideLineList } = this;
        !guideLineList.length && guideLineList.push(RESETGUIDELINE());
        if (!guideLineList[guideLineList.length - 1].path)
          guideLineList[guideLineList.length - 1].path = [];
        guideLineList[guideLineList.length - 1].path.push(point);
        guideLineList[guideLineList.length - 1].waypoints = this.getWayPoints(
          guideLineList[guideLineList.length - 1].path
        );
      }
    },
    // 打开辅助点
    guidePoint() {
      this.editing = false;
      this.guideLineBool = false;
      this.guideMarkerBool = !this.guideMarkerBool;
    },
    // 打开辅助线
    guideLine() {
      this.editing = false;
      this.guideMarkerBool = false;
      this.guideLineBool = !this.guideLineBool;
    },
    // 获取线详情
    getPolyLineDetail() {
      this.detailVisible = true;
    },
    // 获取marker图标大小和颜色
    getMarkerIcon({ icon = "red", size = "small", etdoNo = null }) {
      var iconList = icon.split("&");
      var len = iconList[iconList.length - 1];
      var find = this.markerIcon.find(
        (type) => type.etdoNoList && type.etdoNoList.includes(etdoNo)
      );
      if (etdoNo && find) {
        var icon = find.icon;
        return `images/${icon}_car.png`;
      }
      return `images/${size}_${len}.png`;
    },
    // 根据图标大小不同渲染不同大小marker
    getMarkerSize(size = "small", etdoNo) {
      var findIndex =
        this.trainNoList.findIndex((type) => type.etdoNo == etdoNo) > -1; //判断是否为当天的车
      if (findIndex) {
        return { width: 28, height: 19 };
      } else if (size === "big") {
        return { width: 25, height: 35 };
      }
      return { width: 19, height: 27 };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;

  .left-content {
    width: 240px;
    height: 100%;
    .elScrollBar {
      ::v-deep .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    .elTabs {
      ::v-deep .el-tabs__header {
        .el-tabs__nav-scroll {
          display: flex;
          justify-content: center;
        }
      }
    }
  }

  .right-content {
    flex: 1;
    height: 100%;
    .searchAddress {
      z-index: 1;
      position: fixed;
      top: 20px;
      left: 260px;
    }
    .bm-view {
      width: 100%;
      height: 100%;
    }
  }
}

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
  left: 260px;
  cursor: pointer;
}

.elSelectLine {
  ::v-deep .el-input__inner {
    color: transparent;
    text-indent: -100px;
  }
}
</style>
