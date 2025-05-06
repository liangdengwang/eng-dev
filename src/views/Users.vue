<template>
  <div class="users-page">
    <!-- Header with search and actions -->
    <div
      class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
    >
      <div class="flex-1">
        <el-input
          v-model="searchQuery"
          placeholder="搜索人员..."
          class="w-full md:max-w-md"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <div class="flex gap-2">
        <el-button type="primary" @click="showAddUserDialog">
          <el-icon><Plus /></el-icon> 添加人员
        </el-button>
        <el-button type="success" @click="exportUsers">
          <el-icon><Download /></el-icon> 导出
        </el-button>
        <el-button
          type="danger"
          :disabled="selectedUsers.length === 0"
          @click="confirmDeleteUsers"
        >
          <el-icon><Delete /></el-icon> 删除
        </el-button>
      </div>
    </div>

    <!-- Filters -->
    <el-card shadow="hover" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <el-select v-model="filterRole" placeholder="职位" clearable>
          <el-option label="全部职位" value="" />
          <el-option label="后勤管理员" value="admin" />
          <el-option label="维修工程师" value="editor" />
          <el-option label="安保人员" value="user" />
          <el-option label="临时工" value="visitor" />
        </el-select>

        <el-select v-model="filterStatus" placeholder="在职状态" clearable>
          <el-option label="全部状态" value="" />
          <el-option label="在职" value="active" />
          <el-option label="离职" value="disabled" />
          <el-option label="试用期" value="pending" />
        </el-select>

        <el-date-picker
          v-model="filterDate"
          type="daterange"
          range-separator="至"
          start-placeholder="入职开始日期"
          end-placeholder="入职结束日期"
          style="width: 100%"
        />

        <el-button type="primary" @click="applyFilters" style="width: 100%">
          应用筛选
        </el-button>
      </div>
    </el-card>

    <!-- Users Table -->
    <el-card shadow="hover" class="mb-6">
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" />

        <el-table-column label="人员信息" min-width="200">
          <template #default="scope">
            <div class="flex items-center">
              <el-avatar :size="40" :src="scope.row.avatar" />
              <div class="ml-3">
                <div class="font-medium">{{ scope.row.name }}</div>
                <div class="text-gray-500 text-sm">{{ scope.row.email }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="role" label="职位" width="120">
          <template #default="scope">
            <el-tag
              :type="getRoleType(scope.row.role)"
              effect="light"
              size="small"
            >
              {{ getRoleLabel(scope.row.role) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="在职状态" width="100">
          <template #default="scope">
            <el-tag
              :type="getStatusType(scope.row.status)"
              effect="light"
              size="small"
            >
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="registerDate" label="入职日期" width="120" />

        <el-table-column prop="lastLogin" label="最近签到" width="180" />

        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button
                type="primary"
                size="small"
                plain
                @click="editUser(scope.row)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                :type="scope.row.status === 'active' ? 'warning' : 'success'"
                size="small"
                plain
                @click="toggleUserStatus(scope.row)"
              >
                <el-icon v-if="scope.row.status === 'active'"><Lock /></el-icon>
                <el-icon v-else><Unlock /></el-icon>
              </el-button>
              <el-button
                type="danger"
                size="small"
                plain
                @click="deleteUser(scope.row)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-center mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          class="mt-4 flex justify-end"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <!-- User Statistics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" v-loading="chartLoading">
      <el-card shadow="hover">
        <template #header>
          <div class="font-medium">后勤人员职位分布</div>
        </template>
        <PieChart :data="roleDistributionData" />
      </el-card>

      <el-card shadow="hover">
        <template #header>
          <div class="font-medium">人员入职趋势</div>
        </template>
        <LineChart :data="registrationTrendData" />
      </el-card>
    </div>

    <!-- Add/Edit User Dialog -->
    <el-dialog
      v-model="userDialogVisible"
      :title="isEditMode ? '编辑人员信息' : '添加后勤人员'"
      width="500px"
    >
      <el-form
        :model="userForm"
        label-width="100px"
        :rules="userFormRules"
        ref="userFormRef"
      >
        <el-form-item label="头像">
          <el-avatar :size="64" :src="userForm.avatar" />
          <el-button type="primary" size="small" plain class="ml-4">
            上传头像
          </el-button>
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="密码" prop="password" v-if="!isEditMode">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="职位" prop="role">
          <el-select
            v-model="userForm.role"
            placeholder="请选择职位"
            style="width: 100%"
          >
            <el-option label="后勤管理员" value="admin" />
            <el-option label="维修工程师" value="editor" />
            <el-option label="安保人员" value="user" />
            <el-option label="临时工" value="visitor" />
          </el-select>
        </el-form-item>

        <el-form-item label="在职状态" prop="status">
          <el-select
            v-model="userForm.status"
            placeholder="请选择在职状态"
            style="width: 100%"
          >
            <el-option label="在职" value="active" />
            <el-option label="离职" value="disabled" />
            <el-option label="试用期" value="pending" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end">
          <el-button @click="userDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Delete Confirmation Dialog -->
    <el-dialog v-model="deleteDialogVisible" title="确认删除" width="400px">
      <div>
        <p>
          {{
            deleteMultiple
              ? `确定要删除选中的 ${selectedUsers.length} 个用户吗？`
              : "确定要删除此用户吗？"
          }}
        </p>
        <p class="text-red-500 mt-2">此操作不可逆，请谨慎操作！</p>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确认删除</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import {
  Search,
  Delete,
  Edit,
  Plus,
  Download,
  Refresh,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import PieChart from "../components/charts/PieChart.vue";
import LineChart from "../components/charts/LineChart.vue";
import { usersApi } from "../services/mockApi";

// Data
const searchQuery = ref("");
const filterRole = ref("");
const filterStatus = ref("");
const filterDate = ref(null);
const loading = ref(false);
const chartLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const selectedUsers = ref([]);
const userDialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const isEditMode = ref(false);
const deleteMultiple = ref(false);
const currentUser = ref(null);
const userFormRef = ref(null);
const userForm = reactive({
  id: null,
  name: "",
  email: "",
  password: "",
  role: "user",
  status: "active",
  avatar: "https://placekitten.com/200/200",
});

const userFormRules = {
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度不能小于6个字符", trigger: "blur" },
  ],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
};

// 表格数据
const tableData = ref([]);

// 用户角色分布数据（饼图）
const roleDistributionData = reactive({
  name: "用户角色分布",
  legendData: [],
  data: [],
});

// 用户注册趋势数据（折线图）
const registrationTrendData = reactive({
  xAxis: [],
  series: [],
});

// Methods
const loadUsers = async () => {
  loading.value = true;
  try {
    const filters = {
      search: searchQuery.value,
      status: filterStatus.value,
      role: filterRole.value,
      dateRange: filterDate.value,
    };

    const response = await usersApi.getUsers(
      currentPage.value,
      pageSize.value,
      filters
    );
    tableData.value = response.data;
    total.value = response.total;
  } catch (error) {
    console.error("加载用户数据失败:", error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  loadUsers();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  loadUsers();
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
  loadUsers();
};

const showAddUserDialog = () => {
  isEditMode.value = false;
  Object.keys(userForm).forEach((key) => {
    if (key !== "role" && key !== "status" && key !== "avatar") {
      userForm[key] = "";
    }
  });
  userForm.role = "user";
  userForm.status = "active";
  userForm.avatar = "https://placekitten.com/200/200";
  userDialogVisible.value = true;
};

const editUser = (user) => {
  isEditMode.value = true;
  currentUser.value = user;

  Object.keys(userForm).forEach((key) => {
    if (key in user) {
      userForm[key] = user[key];
    }
  });

  userDialogVisible.value = true;
};

const saveUser = () => {
  userFormRef.value.validate((valid) => {
    if (valid) {
      // 实际应用中这里会调用API保存用户
      if (isEditMode.value) {
        // ...
      } else {
        // ...
      }

      userDialogVisible.value = false;
      loadUsers(); // 刷新列表
      loadChartData(); // 刷新图表
    }
  });
};

const toggleUserStatus = (user) => {
  // 实际应用中这里会调用API修改用户状态
  // ...
};

const deleteUser = (user) => {
  deleteMultiple.value = false;
  currentUser.value = user;
  deleteDialogVisible.value = true;
};

const confirmDeleteUsers = () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning("请选择要删除的用户");
    return;
  }

  deleteMultiple.value = true;
  deleteDialogVisible.value = true;
};

const confirmDelete = () => {
  // 实际应用中这里会调用API删除用户
  // ...
};

const exportUsers = () => {
  // 这里通常会生成CSV或Excel文件
  console.log("导出用户数据...");
  // 模拟实现 - 仅显示消息
  ElMessage({
    message: "用户数据导出成功",
    type: "success",
  });
};

// 角色和状态相关的辅助函数
const getRoleType = (role) => {
  const types = {
    admin: "danger",
    editor: "warning",
    user: "success",
    visitor: "info",
  };
  return types[role] || "info";
};

const getRoleLabel = (role) => {
  const labels = {
    admin: "后勤管理员",
    editor: "维修工程师",
    user: "安保人员",
    visitor: "临时工",
  };
  return labels[role] || role;
};

const getStatusType = (status) => {
  const types = {
    active: "success",
    disabled: "danger",
    pending: "warning",
  };
  return types[status] || "info";
};

const getStatusLabel = (status) => {
  const labels = {
    active: "在职",
    disabled: "离职",
    pending: "试用期",
  };
  return labels[status] || status;
};

// 加载图表数据
const loadChartData = async () => {
  chartLoading.value = true;
  try {
    // 并行请求图表数据
    const [roleDistribution, registerTrend] = await Promise.all([
      usersApi.getUserRoleDistribution(),
      usersApi.getUserRegisterTrend(),
    ]);

    // 更新角色分布数据
    roleDistributionData.legendData = roleDistribution.map((item) => item.name);
    roleDistributionData.data = roleDistribution;

    // 更新注册趋势数据
    Object.assign(registrationTrendData, registerTrend);
  } catch (error) {
    console.error("加载图表数据失败:", error);
  } finally {
    chartLoading.value = false;
  }
};

onMounted(() => {
  // 加载用户数据和图表数据
  loadUsers();
  loadChartData();
});
</script>

<style scoped>
.users-page {
  min-height: calc(100vh - 180px);
  height: auto;
  overflow-y: visible;
}

:deep(.el-card__header) {
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
