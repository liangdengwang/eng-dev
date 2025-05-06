<template>
  <div class="analytics">
    <!-- Filter Bar -->
    <el-card shadow="hover" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="default"
          style="width: 100%"
        />
        
        <el-select v-model="selectedProduct" placeholder="选择产品" style="width: 100%">
          <el-option label="所有产品" value="all" />
          <el-option label="电子产品" value="electronics" />
          <el-option label="服装" value="clothing" />
          <el-option label="食品" value="food" />
          <el-option label="家居" value="home" />
        </el-select>
        
        <el-select v-model="selectedRegion" placeholder="选择地区" style="width: 100%">
          <el-option label="所有地区" value="all" />
          <el-option label="华东" value="east" />
          <el-option label="华南" value="south" />
          <el-option label="华北" value="north" />
          <el-option label="华中" value="central" />
          <el-option label="西部" value="west" />
        </el-select>
        
        <el-button type="primary" @click="applyFilters" style="width: 100%">应用筛选</el-button>
      </div>
    </el-card>
    
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6" v-loading="summaryLoading">
      <el-card shadow="hover" class="summary-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-gray-500 text-sm">总销售额</div>
            <div class="text-2xl font-bold mt-1">¥{{ summary.totalSales }}</div>
            <div class="text-xs" :class="summary.salesGrowth >= 0 ? 'text-green-500' : 'text-red-500'" mt-1>
              <el-icon v-if="summary.salesGrowth >= 0"><ArrowUp /></el-icon>
              <el-icon v-else><ArrowDown /></el-icon> {{ Math.abs(summary.salesGrowth) }}% 较上期
            </div>
          </div>
          <div class="summary-icon bg-blue-100 text-blue-600">
            <el-icon><Money /></el-icon>
          </div>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="summary-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-gray-500 text-sm">订单数量</div>
            <div class="text-2xl font-bold mt-1">{{ summary.totalOrders }}</div>
            <div class="text-xs" :class="summary.ordersGrowth >= 0 ? 'text-green-500' : 'text-red-500'" mt-1>
              <el-icon v-if="summary.ordersGrowth >= 0"><ArrowUp /></el-icon>
              <el-icon v-else><ArrowDown /></el-icon> {{ Math.abs(summary.ordersGrowth) }}% 较上期
            </div>
          </div>
          <div class="summary-icon bg-green-100 text-green-600">
            <el-icon><ShoppingCart /></el-icon>
          </div>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="summary-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-gray-500 text-sm">客单价</div>
            <div class="text-2xl font-bold mt-1">¥{{ summary.averageOrderValue }}</div>
            <div class="text-xs" :class="summary.aovGrowth >= 0 ? 'text-green-500' : 'text-red-500'" mt-1>
              <el-icon v-if="summary.aovGrowth >= 0"><ArrowUp /></el-icon>
              <el-icon v-else><ArrowDown /></el-icon> {{ Math.abs(summary.aovGrowth) }}% 较上期
            </div>
          </div>
          <div class="summary-icon bg-purple-100 text-purple-600">
            <el-icon><PriceTag /></el-icon>
          </div>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="summary-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-gray-500 text-sm">转化率</div>
            <div class="text-2xl font-bold mt-1">{{ summary.conversionRate }}%</div>
            <div class="text-xs" :class="summary.conversionGrowth >= 0 ? 'text-green-500' : 'text-red-500'" mt-1>
              <el-icon v-if="summary.conversionGrowth >= 0"><ArrowUp /></el-icon>
              <el-icon v-else><ArrowDown /></el-icon> {{ Math.abs(summary.conversionGrowth) }}% 较上期
            </div>
          </div>
          <div class="summary-icon bg-orange-100 text-orange-600">
            <el-icon><Finished /></el-icon>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- Main Charts -->
    <div class="grid grid-cols-1 gap-6 mb-6">
      <el-card shadow="hover" class="chart-card">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-medium">销售趋势分析</span>
            <div class="flex space-x-2">
              <el-radio-group v-model="salesTrendType" size="small" class="ml-4" @change="handleSalesTrendTypeChange">
                <el-radio-button label="daily">日</el-radio-button>
                <el-radio-button label="weekly">周</el-radio-button>
                <el-radio-button label="monthly">月</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </template>
        <LineChart :chart-data="salesTrendData" height="400px" v-loading="chartLoading" />
      </el-card>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <el-card shadow="hover" class="chart-card">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-medium">产品类别销售分布</span>
          </div>
        </template>
        <PieChart :chart-data="categorySalesData" />
      </el-card>
      
      <el-card shadow="hover" class="chart-card">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-medium">地区销售分布</span>
          </div>
        </template>
        <BarChart :chart-data="regionSalesData" />
      </el-card>
    </div>
    
    <!-- Sales Funnel -->
    <div class="grid grid-cols-1 gap-6 mb-6">
      <el-card shadow="hover" class="chart-card">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-medium">销售漏斗</span>
          </div>
        </template>
        <div ref="funnelChartContainer" style="width: 100%; height: 400px;"></div>
      </el-card>
    </div>
    
    <!-- Data Table -->
    <el-card shadow="hover">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="font-medium">销售详细数据</span>
          <el-button type="primary" size="small" plain @click="exportData">导出数据</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%" size="small" v-loading="loading">
        <el-table-column prop="date" label="日期" sortable />
        <el-table-column prop="product" label="产品" sortable />
        <el-table-column prop="category" label="类别" sortable />
        <el-table-column prop="region" label="地区" sortable />
        <el-table-column prop="sales" label="销售额" sortable>
          <template #default="scope">
            ¥{{ scope.row.sales.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" sortable />
        <el-table-column prop="growth" label="同比增长" sortable>
          <template #default="scope">
            <span :class="scope.row.growth >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ scope.row.growth >= 0 ? '+' : '' }}{{ scope.row.growth }}%
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-center mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import LineChart from '../components/charts/LineChart.vue';
import { analyticsApi } from '../services/mockApi';
import BarChart from '../components/charts/BarChart.vue';
import PieChart from '../components/charts/PieChart.vue';
import { ArrowUp, ArrowDown, Money, ShoppingCart, PriceTag, Finished } from '@element-plus/icons-vue';

// Filters
const dateRange = ref([new Date(2025, 4, 1), new Date(2025, 4, 6)]);
const selectedProduct = ref('all');
const selectedRegion = ref('all');
const salesTrendType = ref('daily');

// Pagination
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(100);

// 加载状态
const loading = ref(false);
const chartLoading = ref(false);
const summaryLoading = ref(false);

// 数据摘要
const summary = reactive({
  totalSales: 0,
  totalOrders: 0,
  averageOrderValue: 0,
  conversionRate: 0,
  salesGrowth: 0,
  ordersGrowth: 0,
  aovGrowth: 0,
  conversionGrowth: 0
});

// 图表数据
const salesTrendData = reactive({
  xAxis: ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日'],
  yAxis: [
    {
      type: 'value',
      name: '销售额',
      position: 'left',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#2b7fff'
        }
      },
      axisLabel: {
        formatter: '{value} 元'
      }
    },
    {
      type: 'value',
      name: '订单数',
      position: 'right',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#73d13d'
        }
      },
      axisLabel: {
        formatter: '{value} 单'
      }
    }
  ],
  series: [
    {
      name: '销售额',
      type: 'line',
      smooth: true,
      data: [
        42000, 38000, 35000, 30000, 32000, 40000, 48000,
        45000, 42000, 40000, 38000, 35000, 34000, 32000,
        36000, 38000, 40000, 45000, 48000, 50000, 52000,
        48000, 45000, 40000, 42000, 44000, 46000, 48000,
        50000, 52000
      ],
      itemStyle: {
        color: '#2b7fff'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(43, 127, 255, 0.3)' },
            { offset: 1, color: 'rgba(43, 127, 255, 0.1)' }
          ]
        }
      }
    },
    {
      name: '订单数',
      type: 'line',
      smooth: true,
      yAxisIndex: 1,
      data: [
        420, 380, 350, 300, 320, 400, 480,
        450, 420, 400, 380, 350, 340, 320,
        360, 380, 400, 450, 480, 500, 520,
        480, 450, 400, 420, 440, 460, 480,
        500, 520
      ],
      itemStyle: {
        color: '#73d13d'
      }
    }
  ]
});

const categorySalesData = reactive({
  name: '产品类别销售',
  legendData: ['电子产品', '服装', '食品', '家居', '其他'],
  data: [
    { value: 420000, name: '电子产品' },
    { value: 320000, name: '服装' },
    { value: 240000, name: '食品' },
    { value: 180000, name: '家居' },
    { value: 124350, name: '其他' }
  ]
});

const regionSalesData = reactive({
  xAxis: ['华东', '华南', '华北', '华中', '西部'],
  series: [
    {
      name: '销售额',
      type: 'bar',
      data: [380000, 320000, 290000, 184350, 110000],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#2b7fff' },
            { offset: 1, color: '#bfdbff' }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      }
    }
  ]
});

// Funnel chart
const funnelChartContainer = ref(null);
let funnelChart = null;

// 表格数据
const tableData = ref([]);

// 加载数据摘要
const loadSummary = async () => {
  summaryLoading.value = true;
  try {
    const summaryData = await analyticsApi.getSummary();
    Object.assign(summary, summaryData);
  } catch (error) {
    console.error('加载数据摘要失败:', error);
  } finally {
    summaryLoading.value = false;
  }
};

// 加载销售趋势数据
const loadSalesTrend = async () => {
  chartLoading.value = true;
  try {
    const trendData = await analyticsApi.getSalesTrend(salesTrendType.value);
    Object.assign(salesTrendData, trendData);
  } catch (error) {
    console.error('加载销售趋势数据失败:', error);
  } finally {
    chartLoading.value = false;
  }
};

// 加载销售数据
const loadSalesData = async () => {
  loading.value = true;
  try {
    const filters = {
      product: selectedProduct.value === 'all' ? '' : selectedProduct.value,
      region: selectedRegion.value === 'all' ? '' : selectedRegion.value,
      dateRange: dateRange.value
    };
    
    const response = await analyticsApi.getSalesData(currentPage.value, pageSize.value, filters);
    tableData.value = response.data;
    totalItems.value = response.total;
  } catch (error) {
    console.error('加载销售数据失败:', error);
  } finally {
    loading.value = false;
  }
};

// 初始化漏斗图
const initFunnelChart = async () => {
  if (funnelChartContainer.value) {
    funnelChart = echarts.init(funnelChartContainer.value);
    
    try {
      const funnelData = await analyticsApi.getSalesFunnel();
      
      const option = {
        title: {
          text: '销售转化漏斗',
          left: 'center',
          top: 0,
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        legend: {
          data: funnelData.map(item => item.name),
          bottom: 0
        },
        series: [
          {
            name: '转化率',
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside'
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 14
              }
            },
            data: funnelData
          }
        ]
      };
      
      funnelChart.setOption(option);
      
      window.addEventListener('resize', handleResize);
    } catch (error) {
      console.error('加载漏斗图数据失败:', error);
    }
  }
};

const handleResize = () => {
  if (funnelChart) {
    funnelChart.resize();
  }
};

const applyFilters = () => {
  currentPage.value = 1;
  loadSalesData();
  ElMessage.success('筛选条件已应用');
};

const exportData = () => {
  ElMessage.success('数据导出成功');
  // 实际应用中这里会导出数据到CSV或Excel
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
  loadSalesData();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  loadSalesData();
};

// 监听销售趋势类型变化
const handleSalesTrendTypeChange = () => {
  loadSalesTrend();
};

onMounted(() => {
  // 加载所有数据
  loadSummary();
  loadSalesTrend();
  loadSalesData();
  initFunnelChart();
});

onUnmounted(() => {
  if (funnelChart) {
    funnelChart.dispose();
    window.removeEventListener('resize', handleResize);
  }
});
</script>

<style scoped>
.analytics {
  min-height: calc(100vh - 180px);
  height: auto;
  overflow-y: visible;
}

.summary-card {
  transition: transform 0.3s;
}

.summary-card:hover {
  transform: translateY(-5px);
}

.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  font-size: 24px;
}

.chart-card {
  height: 100%;
}

:deep(.el-card__header) {
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
