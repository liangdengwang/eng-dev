<template>
  <div ref="chartContainer" :style="{ width: width, height: height }" class="chart-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '350px'
  }
});

const chartContainer = ref(null);
let chart = null;

const initChart = () => {
  if (chartContainer.value) {
    chart = echarts.init(chartContainer.value);
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: props.chartData.xAxis || [],
        axisLine: {
          lineStyle: {
            color: '#eaeaea'
          }
        },
        axisLabel: {
          color: '#666'
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            color: '#f5f5f5'
          }
        }
      },
      series: props.chartData.series || []
    };
    
    chart.setOption(option);
    
    window.addEventListener('resize', handleResize);
  }
};

const handleResize = () => {
  if (chart) {
    chart.resize();
  }
};

watch(() => props.chartData, (newVal) => {
  if (chart) {
    chart.setOption({
      xAxis: {
        data: newVal.xAxis || []
      },
      series: newVal.series || []
    });
  }
}, { deep: true });

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  if (chart) {
    chart.dispose();
    window.removeEventListener('resize', handleResize);
  }
});
</script>

<style scoped>
.chart-container {
  border-radius: 8px;
}
</style>
