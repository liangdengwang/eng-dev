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
    
    // 确保 chartData 已初始化且包含必要的属性
    const chartData = props.chartData || {};
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
        data: chartData.legendData || []
      },
      series: [
        {
          name: chartData.name || '',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: chartData.data || []
        }
      ]
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
  if (chart && newVal) {
    // 确保 newVal 存在且包含必要的属性
    const chartData = newVal || {};
    
    chart.setOption({
      legend: {
        data: chartData.legendData || []
      },
      series: [
        {
          name: chartData.name || '',
          data: chartData.data || []
        }
      ]
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
