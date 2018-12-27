<template>
  <table
    class="site-table"
    :class="{'normal': type===0, 'identify': type===1}"
  >
    <tbody v-if="type===0">
      <tr
        v-for="(d, dIdx) in chartData"
        :key="`trow-${dIdx}`"
        :class="{'is-active': d.id==current}"
        @click="setCurrent(d, dIdx)"
      >
        <th>{{d.name}}</th>
        <td
          v-for="(data, rid) in d.retrievedData"
          :key="`retrievedStatus-${type}-${rid}`"
        >
          <span
            class="progress"
            v-if="data !== 0"
            :class="{
            'is-complete': data>0,
            'not-complete': data==-1
          }"
          ></span>
        </td>
      </tr>
    </tbody>
    <tbody v-if="type===1">
      <tr
        v-for="(d, dIdx) in chartData"
        :key="`trow-${dIdx}`"
        :class="{'is-active': d.id==current}"
        @click="setCurrent(d, dIdx)"
      >
        <th>{{d.name}}</th>
        <td
          v-for="(data, rid) in d.identifiedData"
          :key="`identifiedStatus-${type}-${rid}`"
        >
          <span
            class="progress"
            v-if="data !== 0"
            :class="{
              'is-complete': data>0,
              'not-complete': data<0
            }"
          ></span>
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
        <span class="text">當月資料已回收，但未完成辨識</span>
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
      default: () => [],
    },
  },
  methods: {
    setCurrent(d, dIdx) {
      this.$emit('update', d, dIdx);
    },
  },
  computed: {
    chartData() {
      return this.chart.map(data => {
        /*
        const latestRetrievedMonth = data.retrievedStatus.reduce(
          (max, num, index) => {
            if (num > 0) {
              return index;
            }
            return max;
          },
          0,
        );
        //*/

        // https://github.com/TaiBIF/camera-trap-webapp/issues/16#issuecomment-442069580
        const retrievedData = data.retrievedStatus.map((num, index) => {
          if (data.cameraAbnormalStatus[index]) {
            return -1;
          }
          if (num > 0) {
            return 1;
          }
          return 0;
        });

        //console.log(retrievedData);

        // https://github.com/TaiBIF/camera-trap-webapp/issues/16#issuecomment-441432809
        const identifiedData = data.retrievedStatus.map(
          (retrievedNum, index) => {
            const identifiedNum = data.identifiedStatus[index];
            if (identifiedNum === 0 && retrievedNum === 0) {
              // 未收資料
              return 0;
            } else if (identifiedNum >= retrievedNum) {
              // 鑑定完成
              return 1;
            }
            // 鑑定未完成
            return -1;
          },
        );

        return {
          retrievedData,
          identifiedData,
          ...data,
        };
      });
    },
  },
};
</script>
