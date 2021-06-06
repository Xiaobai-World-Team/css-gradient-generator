<template>
 <div class="css-gradient-wrapper" :id="rootNodeId">
  <div class="control">
   <div
    class="gradient"
    :style="{
     background: css,
    }"
   ></div>
   <div class="gradient-slide" ref="gradientSlide">
    <div
     class="slide"
     :class="{
      selected: slide.selected,
     }"
     :style="{ left: slide.percentage + '%' }"
     v-for="(slide, idx) in colors"
     :id="slide.id"
     :key="slide.id"
    >
     <label :style="{ background: `rgb(${slide.r}, ${slide.g}, ${slide.b})` }">
      <rgbaInput type="color" v-model="colors[idx]" />
     </label>
     <input
      v-show="slide.selected"
      step="0.01"
      type="range"
      min="0"
      max="1"
      v-model.number="colors[idx].a"
     />
    </div>
   </div>
  </div>
  <div class="demo" @click="copy">
   <div class="copied" v-if="copied">{{ copiedText }}</div>
   <pre>{{ css }}</pre>
  </div>
 </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { useColors } from "./drag-slide";
import rgbaInput from "./rgba-input.vue";

export default defineComponent({
 name: "App",
 components: {
  rgbaInput,
 },
 setup() {
  const rootNodeId = `gradient${Math.random().toString(36).substring(2)}`;
  const colors = useColors(rootNodeId);

  const css = computed(() => {
   let css = Array.from(colors.value)
    .sort((a, b) => {
     return a.percentage - b.percentage;
    })
    .map((item) => {
     return `rgba(${item.r},${item.g},${item.b},${item.a}) ${item.percentage}%`;
    })
    .join(",");

   return `linear-gradient(90deg, ${css})`;
  });

  const copiedText = ref("copied!");
  const copied = ref(false);

  watch(css, () => {
   copied.value = false;
  });

  const copy = () => {
   navigator.clipboard.writeText(css.value);
   copied.value = true;
  };

  return {
   rootNodeId,
   colors,
   css,
   copy,
   copied,
   copiedText,
  };
 },
 mounted() {
  let node = <HTMLDivElement>this.$refs.gradientSlide;
  node.addEventListener("click", (ev: MouseEvent) => {
   if (ev.target !== node) {
    return;
   }
   this.colors.forEach((c) => (c.selected = false));
   this.colors.push({
    id: Math.random().toString(36),
    r: parseInt((Math.random() * 255).toString(), 10),
    g: parseInt((Math.random() * 255).toString(), 10),
    b: parseInt((Math.random() * 255).toString(), 10),
    a: 1,
    percentage: parseFloat(((ev.offsetX / node.offsetWidth) * 100).toFixed(2)),
    selected: true,
   });
  });
 },
});
</script>

<style scoped lang="less">
.css-gradient-wrapper {
 width: 100%;
 height: 100%;
 display: flex;
 flex-direction: column;
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
   height: 50px;
   cursor: copy;
   > .slide {
    position: absolute;
    top: 0;
    width: 16px;
    height: 36px;
    margin-left: -8px;
    background: #555;
    box-shadow: inset 0 0 0 1px #000, inset 0 0 0 2px #fff;
    border-radius: 5px;
    transition: transform 0.2s;
    transform-origin: center center;
    cursor: ew-resize;
    &.selected {
     transform: scale(1.5);
     transform-origin: center center;
    }
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
    input[type="range"] {
     position: absolute;
     left: 0;
     bottom: -20px;
     transform: translateX(-50%);
    }
   }
  }
 }
 > .demo {
  background: #555;
  color: #fff;
  padding: 1em;
  margin-top: 2em;
  border-radius: 0.2em;
  pre {
   font-size: 140%;
   white-space: pre-wrap;
   line-height: 150%;
   font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  .copied {
   color: greenyellow;
  }
 }
}
</style>