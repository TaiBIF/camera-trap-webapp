<template>
  <table class="site-table" :class="{'normal': type=='normal', 'identify': type=='identify'}">
    <tbody>
      <tr 
      v-for="(d, dIdx) in chart" 
      :key="`trow-${dIdx}`" 
      :class="{'is-active': d.id==current}"
      @click="setCurrent(d)">
        <th>{{d.name}}</th>
        <td v-for="(p, pIdx) in d.progress" :key="`trow-${dIdx}-${pIdx}`">
          <span class="progress" v-if="!p==false && p>0" :class="{
            'is-complete': p==2,
            'not-complete': p==1,
            'is-cancel': p==-1
          }"></span>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th></th>
        <td>1 月</td>
        <td>2 月</td>
        <td>3 月</td>
        <td>4 月</td>
        <td>5 月</td>
        <td>6 月</td>
        <td>7 月</td>
        <td>8 月</td>
        <td>9 月</td>
        <td>10 月</td>
        <td>11 月</td>
        <td>12 月</td>
      </tr>
    </tfoot>
    <caption v-if="type=='normal'">
      <span class="legend">
        <span class="progress float-left is-complete"></span> 
        <span class="text">當月資料完整</span>
      </span>
      <span class="legend">
        <span class="progress float-left not-complete"></span> 
        <span class="text">當月資料不完整 (相機故障、失竊等因素)</span>
      </span>
      <span class="legend">
        <span class="progress float-left is-cancel"></span> 
        <span class="text">相機撤除</span>
      </span>
    </caption>
    <caption v-else>
      <span class="legend">
        <span class="progress float-left is-complete"></span> 
        <span class="text">當月資料已辨識</span>
      </span>
      <span class="legend">
        <span class="progress float-left not-complete"></span> 
        <span class="text">當月資料已辨識，但資料未完整</span>
      </span>
    </caption>
  </table>
</template>

<script>
export default {
  name: "SiteChart",
  props: {
    type: {
      type: String,
      default: 'normal'
    },
    current: {
      type: Number,
      default: null
    },
    chart: {
      type: Array,
      default: null
    }
  },
  methods: {
    setCurrent(d) {
      this.$emit('update', {
        value: d.id,
        label: d.name
      })
    }
  }
}
</script>

