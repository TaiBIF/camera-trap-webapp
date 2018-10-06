<template>
  <div class="input-group date">
    <select :value="value" class="form-control">
      <option :value="opt.value" v-for="(opt, idx) in timeOpt" :key="`time-opt-${idx}`">{{ opt.text }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "TimeInput",
  props: {
    value: {
      default: null
    }
  },
  data() {
    return {
      timeOpt: []
    }
  },
  beforeMount () {
    for(let i=0; i<24; i++) {
      let h = i>12 ? i-12 : i,
          d = i>12 ? '下午' : '上午';
      this.timeOpt.push({
        value: `${i}:00`, 
        text: `${d} ${i}:00`
      });
      this.timeOpt.push({
        value: `${i}:00`, 
        text: `${d} ${i}:30`
      }) 
    }
  }
}
</script>
