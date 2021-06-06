<template>
 <input type="text" :value="val" @input="handleChange" :val="val" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "@vue/runtime-core";
import { Color } from "./drag-slide";
export default defineComponent({
 props: {
  modelValue: {
   type: Object as PropType<Color>,
   required: true,
  },
 },
 setup(props, context) {
  function colorToHex(color: number): string {
   let c = color.toString(16);
   if (c.length === 1) {
    return `0${c}`;
   }
   return c;
  }

  const val = computed(() => {
   const r = colorToHex(props.modelValue.r);
   const g = colorToHex(props.modelValue.g);
   const b = colorToHex(props.modelValue.b);

   return `#${r}${g}${b}`;
  });

  const handleChange = (event: Event) => {
   const input = <HTMLInputElement>event.target;
   // #rrggbb => [rr, gg, bb]
   const val = input.value
    .replace("#", "")
    .replace(/(\w{2})/g, "$1 ")
    .trim()
    .split(/\s+/);
   context.emit(
    "update:modelValue",
    Object.assign(
     {
      ...props.modelValue,
     },
     {
      r: parseInt(val[0], 16),
      g: parseInt(val[1], 16),
      b: parseInt(val[2], 16),
     }
    )
   );
  };
  return {
   val,
   handleChange,
  };
 },
});
</script>
