<template>
  <div class="dashboard">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <el-card shadow="hover" class="stat-card">
        <div class="flex items-center">
          <div class="stat-icon bg-blue-100 text-blue-600">
            <el-icon><User /></el-icon>
          </div>
          <div class="ml-4">
            <div class="text-gray-500 text-sm">后勤人员</div>
            <div class="text-2xl font-bold mt-1">{{ stats.totalUsers }}</div>
            <div class="text-xs text-green-500 mt-1">
              <el-icon><ArrowUp /></el-icon> {{ stats.userGrowth }}% 较上月
            </div>
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="stat-card">
        <div class="flex items-center">
          <div class="stat-icon bg-green-100 text-green-600">
            <el-icon><ShoppingCart /></el-icon>
          </div>
          <div class="ml-4">
            <div class="text-gray-500 text-sm">维修工单</div>
            <div class="text-2xl font-bold mt-1">{{ stats.totalOrders }}</div>
            <div class="text-xs text-green-500 mt-1">
              <el-icon><ArrowUp /></el-icon> {{ stats.orderGrowth }}% 较上月
            </div>
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="stat-card">
        <div class="flex items-center">
          <div class="stat-icon bg-purple-100 text-purple-600">
            <el-icon><Money /></el-icon>
          </div>
          <div class="ml-4">
            <div class="text-gray-500 text-sm">设备总值</div>
            <div class="text-2xl font-bold mt-1">¥{{ stats.totalRevenue }}</div>
            <div
              class="text-xs"
              :class="
                stats.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'
              "
              mt-1
            >
              <el-icon v-if="stats.revenueGrowth >= 0"><ArrowUp /></el-icon>
              <el-icon v-else><ArrowDown /></el-icon>
              {{ Math.abs(stats.revenueGrowth) }}% 较上季度
            </div>
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="stat-card">
        <div class="flex items-center">
          <div class="stat-icon bg-orange-100 text-orange-600">
            <el-icon><Star /></el-icon>
          </div>
          <div class="ml-4">
            <div class="text-gray-500 text-sm">服务满意度</div>
            <div class="text-2xl font-bold mt-1">
              {{ stats.averageRating }}/5.0
            </div>
            <div class="text-xs text-green-500 mt-1">
              <el-icon><ArrowUp /></el-icon> {{ stats.ratingGrowth }} 较上月
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <el-card shadow="hover" class="chart-card">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-medium">维修支出趋势</span>
            <el-select
              v-model="revenueTimeRange"
              size="small"
              placeholder="Select"
              style="width: 120px"
            >
              <el-option label="本周" value="week" />
              <el-option label="本月" value="month" />
              <el-option label="本季度" value="quarter" />
              <el-option label="本年" value="year" />
            </el-select>
          </div>
        </template>
        <LineChart :chart-data="revenueChartData" />
      </el-card>

      <el-card shadow="hover" class="chart-card">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-medium">用户增长</span>
            <el-select
              v-model="userGrowthTimeRange"
              size="small"
              placeholder="Select"
              style="width: 120px"
            >
              <el-option label="本周" value="week" />
              <el-option label="本月" value="month" />
              <el-option label="本季度" value="quarter" />
              <el-option label="本年" value="year" />
            </el-select>
          </div>
        </template>
        <BarChart :chart-data="userGrowthChartData" />
      </el-card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <el-card shadow="hover" class="chart-card">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-medium">维修类别分布</span>
          </div>
        </template>
        <PieChart :chart-data="categoryDistributionData" />
      </el-card>

      <el-card shadow="hover" class="chart-card lg:col-span-2">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-medium">最近维修</span>
            <el-button type="primary" size="small" plain>查看全部</el-button>
          </div>
        </template>
        <el-table
          :data="recentOrders"
          style="width: 100%"
          size="small"
          v-loading="loading"
        >
          <el-table-column prop="id" label="维修号" width="100" />
          <el-table-column prop="customer" label="维修员" />
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="amount" label="开销" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)" size="small">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- Activity Timeline -->
    <el-card shadow="hover" class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="font-medium">最近维修</span>
        </div>
      </template>
      <el-timeline v-loading="loading">
        <el-timeline-item
          v-for="(activity, index) in recentActivities"
          :key="index"
          :type="activity.type"
          :color="getActivityColor(activity.type)"
          :timestamp="activity.time"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElLoading } from "element-plus";
import LineChart from "../components/charts/LineChart.vue";
import BarChart from "../components/charts/BarChart.vue";
import PieChart from "../components/charts/PieChart.vue";
import {
  ArrowUp,
  ArrowDown,
  User,
  ShoppingCart,
  Money,
  Star,
} from "@element-plus/icons-vue";
import { dashboardApi } from "../services/mockApi";

// 加载状态
const loading = ref(false);

// 统计数据
const stats = reactive({
  totalUsers: 0,
  totalOrders: 0,
  totalRevenue: 0,
  averageRating: 0,
  userGrowth: 0,
  orderGrowth: 0,
  revenueGrowth: 0,
  ratingGrowth: 0,
});

// Time range selectors
const revenueTimeRange = ref("month");
const userGrowthTimeRange = ref("month");

// Chart data
const revenueChartData = reactive({
  xAxis: [],
  series: [],
});

const userGrowthChartData = reactive({
  xAxis: [],
  series: [],
});

const categoryDistributionData = reactive({
  name: "",
  legendData: [],
  data: [],
});

// Recent Orders & Activities
const recentOrders = ref([]);
const recentActivities = ref([]);

// 加载仪表盘数据
const loadDashboardData = async () => {
  loading.value = true;

  try {
    // 并行请求所有数据
    const [
      statsData,
      revenueData,
      userGrowthData,
      categoryData,
      ordersData,
      activitiesData,
    ] = await Promise.all([
      dashboardApi.getStats(),
      dashboardApi.getRevenueChart(revenueTimeRange.value),
      dashboardApi.getUserGrowthChart(userGrowthTimeRange.value),
      dashboardApi.getCategoryDistribution(),
      dashboardApi.getRecentOrders(),
      dashboardApi.getRecentActivities(),
    ]);

    // 更新统计数据
    Object.assign(stats, statsData);

    // 更新图表数据
    Object.assign(revenueChartData, revenueData);
    Object.assign(userGrowthChartData, userGrowthData);
    Object.assign(categoryDistributionData, categoryData);

    // 更新列表数据
    recentOrders.value = ordersData;
    recentActivities.value = activitiesData;
  } catch (error) {
    console.error("加载仪表盘数据失败:", error);
  } finally {
    loading.value = false;
  }
};

// 监听时间范围变化
const handleRevenueTimeRangeChange = async () => {
  try {
    const revenueData = await dashboardApi.getRevenueChart(
      revenueTimeRange.value
    );
    Object.assign(revenueChartData, revenueData);
  } catch (error) {
    console.error("加载收入趋势数据失败:", error);
  }
};

const handleUserGrowthTimeRangeChange = async () => {
  try {
    const userGrowthData = await dashboardApi.getUserGrowthChart(
      userGrowthTimeRange.value
    );
    Object.assign(userGrowthChartData, userGrowthData);
  } catch (error) {
    console.error("加载用户增长数据失败:", error);
  }
};

// Helper functions
const getStatusType = (status) => {
  const statusMap = {
    已完成: "success",
    处理中: "info",
    已发货: "warning",
    已取消: "danger",
  };
  return statusMap[status] || "info";
};

const getActivityColor = (type) => {
  const colorMap = {
    success: "#67c23a",
    warning: "#e6a23c",
    danger: "#f56c6c",
    info: "#909399",
  };
  return colorMap[type] || "#909399";
};

// 组件挂载时加载数据
onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.dashboard {
  min-height: calc(100vh - 180px);
  height: auto;
  overflow-y: visible;
}

.stat-card {
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
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

:deep(.el-timeline-item__node) {
  left: -1px;
}

:deep(.el-timeline-item__wrapper) {
  padding-left: 20px;
}

:deep(.el-timeline-item__timestamp) {
  color: #909399;
  font-size: 12px;
}
</style>
