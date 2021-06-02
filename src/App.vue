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
    <div
     class="slide"
     :style="{ left: slide.percentage + '%' }"
     v-for="slide in colors"
     :id="slide.id"
     :key="slide.id"
    >
     <label :style="{ background: slide.rgba }">
      <input type="color" v-model="slide.rgba" />
     </label>
    </div>
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
   border-radius: 1em;
  }
  > .gradient-slide {
   position: relative;
   > .slide {
    position: absolute;
    top: 0;
    width: 16px;
    height: 36px;
    background: #555;
    box-shadow:inset 0 0 0 1px #000, inset 0 0 0 2px #fff;
    border-radius: 5px;
    transform: translateX(-50%);
    > label {
     position: absolute;
     left: -2px;
     top: -10px;
     width: 20px;
     height: 20px;
     overflow: hidden;
     border-radius: 50%;
     box-shadow: 0 0 0 1px #fff, 0 0 0 2px #000;
     input {
      opacity: 0;
     }
    }
   }
  }
 }
 > .demo {
  flex: 1 1 0;
  overflow: hidden;
 }
}
</style>