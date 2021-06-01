<template>
 <div class="css-gradient-wrapper" :id="rootNodeId">
  <div class="control">
   <div
    class="gradient"
    :style="{
     background: css,
    }"
   ></div>
   <div class="gradient-slide">
    <label
     class="slide"
     :style="{ left: slide.percentage + '%' }"
     v-for="slide in colors"
     :id="slide.id"
     :key="slide.id"
    >
     <input type="color" v-model="slide.rgba" />
    </label>
   </div>
  </div>
  <div class="demo">
   <pre>{{ css }}</pre>
  </div>
 </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useColors } from "./drag-slide";
export default defineComponent({
 name: "App",
 setup() {
  const rootNodeId = `gradient${Math.random().toString(36).substring(2)}`;
  const colors = useColors(rootNodeId);

  const css = computed(() => {
   let css = colors.value
    .sort((a, b) => {
     return a.percentage - b.percentage;
    })
    .map((item) => {
     return `${item.rgba} ${item.percentage}%`;
    })
    .join(",");
   return `linear-gradient(90deg, ${css})`;
  });
  return {
   rootNodeId,
   colors,
   css,
  };
 },
});
</script>

<style scoped lang="less">
.css-gradient-wrapper {
 width: 100%;
 height: 100%;
 display: flex;
 flex: 1 1 0;
 font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
  Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
 * {
  box-sizing: border-box;
 }
 > .control {
  flex: 1 1 0;
  position: relative;
  > .gradient {
   height: 80px;
   border: solid 1px #000;
  }
  > .gradient-slide {
   position: relative;
   > .slide {
    position: absolute;
    top: 0;
    width: 18px;
    height: 80px;
    border: solid 1px red;
    background: #aaa;
    transform: translateX(-50%);
   }
  }
 }
 > .demo {
  flex: 1 1 0;
 }
}
</style>