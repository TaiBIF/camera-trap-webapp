<template>
  <table class="site-table"
  :class="{'normal': type===0, 'identify': type===1}">
    <tbody v-if="type===0">
      <tr
      v-for="(d, dIdx) in chart"
      :key="`trow-${dIdx}`"
      :class="{'is-active': d.id==current}"
      @click="setCurrent(d, dIdx)">
        <th>{{d.name}}</th>
        <td
        v-for="(data, rid) in d.retrievedStatus"
        :key="`retrievedStatus-${type}-${rid}`">
          <span class="progress"
          v-if="data !== 0"
          :class="{
            'is-complete': data>0,
            'not-complete': d.cameraAbnormalStatus[rid] > 0,
            'is-cancel': data==-1
          }"></span>
        </td>
      </tr>
    </tbody>
    <tbody v-if="type===1">
      <tr
      v-for="(d, dIdx) in chart"
      :key="`trow-${dIdx}`"
      :class="{'is-active': d.id==current}"
      @click="setCurrent(d, dIdx)">
        <th>{{d.name}}</th>
        <td
        v-for="(data, rid) in d.identifiedStatus"
        :key="`identifiedStatus-${type}-${rid}`">
          <span class="progress"
          v-if="data !== 0"
          :class="{
            'is-complete': data === d.retrievedStatus[rid],
            'not-complete': data < d.retrievedStatus[rid],
            'is-cancel': data==-1
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
    <caption v-if="type===0">
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
  name: 'SiteChart',
  props: {
    type: {
      type: Number,
      default: 0,
    },
    current: {
      type: [Number, String],
      default: null,
    },
    chart: {
      type: Array,
      default: null,
    },
  },
  methods: {
    setCurrent(d, dIdx) {
      this.$emit('update', d, dIdx);
    },
  },
};
</script>
