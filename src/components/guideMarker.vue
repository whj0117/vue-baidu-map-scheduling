
<template>
  <div>
    <div v-for="(item, index) of guideMarkerList" :key="index">
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
            :callback="
              () =>
                deletePolyLine({ etfdId: item.etfdId, key: 'guideMarkerList' })
            "
            text="删除"
          ></bm-context-menu-item>
        </bm-context-menu>
      </bm-marker>
    </div>
  </div>
</template>

<script>
export default {
  name: "guideMarker",

  props: {
    guideMarkerList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
</style>