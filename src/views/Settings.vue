<template>
  <div class="settings-page">
    <el-card shadow="hover" class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="font-medium">系统设置</span>
          <el-button type="primary" @click="saveSettings">保存设置</el-button>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <!-- 基本设置 -->
        <el-tab-pane label="基本设置" name="basic">
          <div class="grid grid-cols-1 gap-6">
            <div>
              <h3 class="text-lg font-medium mb-4">系统信息</h3>
              <el-form label-position="top" :model="basicSettings" label-width="120px">
                <el-form-item label="系统名称">
                  <el-input v-model="basicSettings.systemName" placeholder="请输入系统名称" />
                </el-form-item>
                
                <el-form-item label="系统描述">
                  <el-input v-model="basicSettings.systemDescription" type="textarea" :rows="3" placeholder="请输入系统描述" />
                </el-form-item>
                
                <el-form-item label="Logo">
                  <div class="flex items-center">
                    <el-avatar :size="64" :src="basicSettings.logo" />
                    <el-button type="primary" size="small" plain class="ml-4">上传Logo</el-button>
                  </div>
                </el-form-item>
                
                <el-form-item label="Favicon">
                  <div class="flex items-center">
                    <img :src="basicSettings.favicon" alt="Favicon" class="w-8 h-8" />
                    <el-button type="primary" size="small" plain class="ml-4">上传Favicon</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            
            <el-divider />
            
            <div>
              <h3 class="text-lg font-medium mb-4">界面设置</h3>
              <el-form label-position="top" :model="basicSettings" label-width="120px">
                <el-form-item label="主题色">
                  <el-color-picker v-model="basicSettings.primaryColor" show-alpha />
                </el-form-item>
                
                <el-form-item label="布局">
                  <el-radio-group v-model="basicSettings.layout">
                    <el-radio label="sidebar">侧边栏布局</el-radio>
                    <el-radio label="topbar">顶部导航栏布局</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="默认语言">
                  <el-select v-model="basicSettings.language" placeholder="请选择默认语言" style="width: 100%">
                    <el-option label="简体中文" value="zh-CN" />
                    <el-option label="English" value="en-US" />
                    <el-option label="日本語" value="ja-JP" />
                    <el-option label="한국어" value="ko-KR" />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <div class="grid grid-cols-1 gap-6">
            <div>
              <h3 class="text-lg font-medium mb-4">密码策略</h3>
              <el-form label-position="top" :model="securitySettings" label-width="120px">
                <el-form-item label="密码最小长度">
                  <el-input-number v-model="securitySettings.minPasswordLength" :min="6" :max="20" />
                </el-form-item>
                
                <el-form-item label="密码复杂度要求">
                  <el-checkbox-group v-model="securitySettings.passwordRequirements">
                    <el-checkbox label="uppercase">必须包含大写字母</el-checkbox>
                    <el-checkbox label="lowercase">必须包含小写字母</el-checkbox>
                    <el-checkbox label="numbers">必须包含数字</el-checkbox>
                    <el-checkbox label="special">必须包含特殊字符</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                
                <el-form-item label="密码过期时间">
                  <el-select v-model="securitySettings.passwordExpiry" placeholder="请选择密码过期时间" style="width: 100%">
                    <el-option label="永不过期" value="never" />
                    <el-option label="30天" value="30days" />
                    <el-option label="60天" value="60days" />
                    <el-option label="90天" value="90days" />
                    <el-option label="180天" value="180days" />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            
            <el-divider />
            
            <div>
              <h3 class="text-lg font-medium mb-4">登录设置</h3>
              <el-form label-position="top" :model="securitySettings" label-width="120px">
                <el-form-item label="登录尝试限制">
                  <el-input-number v-model="securitySettings.loginAttempts" :min="3" :max="10" />
                </el-form-item>
                
                <el-form-item label="锁定时间（分钟）">
                  <el-input-number v-model="securitySettings.lockoutDuration" :min="5" :max="60" />
                </el-form-item>
                
                <el-form-item label="双因素认证">
                  <el-switch v-model="securitySettings.twoFactorAuth" />
                </el-form-item>
                
                <el-form-item label="记住登录状态时长">
                  <el-select v-model="securitySettings.rememberMeDuration" placeholder="请选择记住登录状态时长" style="width: 100%">
                    <el-option label="1天" value="1day" />
                    <el-option label="7天" value="7days" />
                    <el-option label="30天" value="30days" />
                    <el-option label="永久" value="forever" />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 通知设置 -->
        <el-tab-pane label="通知设置" name="notifications">
          <div class="grid grid-cols-1 gap-6">
            <div>
              <h3 class="text-lg font-medium mb-4">邮件通知</h3>
              <el-form label-position="top" :model="notificationSettings" label-width="120px">
                <el-form-item label="SMTP服务器">
                  <el-input v-model="notificationSettings.smtpServer" placeholder="请输入SMTP服务器地址" />
                </el-form-item>
                
                <el-form-item label="SMTP端口">
                  <el-input-number v-model="notificationSettings.smtpPort" :min="1" :max="65535" />
                </el-form-item>
                
                <el-form-item label="发件人邮箱">
                  <el-input v-model="notificationSettings.senderEmail" placeholder="请输入发件人邮箱" />
                </el-form-item>
                
                <el-form-item label="发件人名称">
                  <el-input v-model="notificationSettings.senderName" placeholder="请输入发件人名称" />
                </el-form-item>
                
                <el-form-item label="SMTP用户名">
                  <el-input v-model="notificationSettings.smtpUsername" placeholder="请输入SMTP用户名" />
                </el-form-item>
                
                <el-form-item label="SMTP密码">
                  <el-input v-model="notificationSettings.smtpPassword" type="password" placeholder="请输入SMTP密码" show-password />
                </el-form-item>
                
                <el-form-item label="加密方式">
                  <el-radio-group v-model="notificationSettings.encryption">
                    <el-radio label="none">无</el-radio>
                    <el-radio label="ssl">SSL</el-radio>
                    <el-radio label="tls">TLS</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="testEmailConnection">测试连接</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <el-divider />
            
            <div>
              <h3 class="text-lg font-medium mb-4">通知事件</h3>
              <el-form label-position="top" :model="notificationSettings" label-width="120px">
                <el-form-item label="用户注册">
                  <el-switch v-model="notificationSettings.events.userRegistration" />
                </el-form-item>
                
                <el-form-item label="密码重置">
                  <el-switch v-model="notificationSettings.events.passwordReset" />
                </el-form-item>
                
                <el-form-item label="新订单">
                  <el-switch v-model="notificationSettings.events.newOrder" />
                </el-form-item>
                
                <el-form-item label="订单状态变更">
                  <el-switch v-model="notificationSettings.events.orderStatusChange" />
                </el-form-item>
                
                <el-form-item label="系统警报">
                  <el-switch v-model="notificationSettings.events.systemAlert" />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 备份与恢复 -->
        <el-tab-pane label="备份与恢复" name="backup">
          <div class="grid grid-cols-1 gap-6">
            <div>
              <h3 class="text-lg font-medium mb-4">数据备份</h3>
              <el-form label-position="top" :model="backupSettings" label-width="120px">
                <el-form-item label="自动备份">
                  <el-switch v-model="backupSettings.autoBackup" />
                </el-form-item>
                
                <el-form-item label="备份频率" v-if="backupSettings.autoBackup">
                  <el-select v-model="backupSettings.backupFrequency" placeholder="请选择备份频率" style="width: 100%">
                    <el-option label="每天" value="daily" />
                    <el-option label="每周" value="weekly" />
                    <el-option label="每月" value="monthly" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="备份时间" v-if="backupSettings.autoBackup">
                  <el-time-picker v-model="backupSettings.backupTime" format="HH:mm" placeholder="请选择备份时间" style="width: 100%" />
                </el-form-item>
                
                <el-form-item label="保留备份数量" v-if="backupSettings.autoBackup">
                  <el-input-number v-model="backupSettings.keepBackups" :min="1" :max="30" />
                </el-form-item>
                
                <el-form-item label="备份存储位置">
                  <el-radio-group v-model="backupSettings.storageType">
                    <el-radio label="local">本地存储</el-radio>
                    <el-radio label="cloud">云存储</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="云存储配置" v-if="backupSettings.storageType === 'cloud'">
                  <el-select v-model="backupSettings.cloudProvider" placeholder="请选择云存储提供商" style="width: 100%">
                    <el-option label="阿里云 OSS" value="aliyun" />
                    <el-option label="腾讯云 COS" value="tencent" />
                    <el-option label="AWS S3" value="aws" />
                    <el-option label="七牛云" value="qiniu" />
                  </el-select>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="createBackupNow">立即备份</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <el-divider />
            
            <div>
              <h3 class="text-lg font-medium mb-4">备份历史</h3>
              <el-table :data="backupHistory" style="width: 100%" v-loading="loading.backup">
                <el-table-column prop="date" label="备份日期" width="180" />
                <el-table-column prop="size" label="大小" width="100" />
                <el-table-column prop="type" label="类型" width="100" />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="scope">
                    <el-tag
                      :type="scope.row.status === 'success' ? 'success' : 'danger'"
                      size="small"
                    >
                      {{ scope.row.status === 'success' ? '成功' : '失败' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button type="primary" size="small" plain @click="downloadBackup(scope.row)">下载</el-button>
                    <el-button type="success" size="small" plain @click="restoreBackup(scope.row)">恢复</el-button>
                    <el-button type="danger" size="small" plain @click="deleteBackup(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 系统日志 -->
        <el-tab-pane label="系统日志" name="logs">
          <div class="grid grid-cols-1 gap-6">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center space-x-2">
                <el-select v-model="logType" placeholder="日志类型" style="width: 120px">
                  <el-option label="全部" value="all" />
                  <el-option label="错误" value="error" />
                  <el-option label="警告" value="warning" />
                  <el-option label="信息" value="info" />
                </el-select>
                
                <el-date-picker
                  v-model="logDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 300px"
                />
                
                <el-button type="primary" @click="searchLogs">搜索</el-button>
              </div>
              
              <el-button type="primary" plain @click="exportLogs">导出日志</el-button>
            </div>
            
            <el-table :data="systemLogs" style="width: 100%" v-loading="loading.logs">
              <el-table-column prop="timestamp" label="时间" width="180" sortable />
              <el-table-column prop="level" label="级别" width="100">
                <template #default="scope">
                  <el-tag
                    :type="getLogLevelType(scope.row.level)"
                    size="small"
                  >
                    {{ scope.row.level }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="source" label="来源" width="150" />
              <el-table-column prop="message" label="消息" />
              <el-table-column prop="user" label="用户" width="120" />
              <el-table-column prop="ip" label="IP地址" width="120" />
            </el-table>
            
            <div class="flex justify-center">
              <el-pagination
                v-model:current-page="logCurrentPage"
                v-model:page-size="logPageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalLogs"
                @size-change="handleLogSizeChange"
                @current-change="handleLogCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { settingsApi } from '../services/mockApi';

// 加载状态
const loading = ref({
  basic: false,
  security: false,
  notification: false,
  backup: false,
  logs: false
});

// Active tab
const activeTab = ref('basic');

// Basic settings
const basicSettings = reactive({
  systemName: '',
  systemDescription: '',
  logo: '',
  favicon: '',
  primaryColor: '',
  layout: '',
  language: ''
});

// Security settings
const securitySettings = reactive({
  minPasswordLength: 8,
  passwordRequirements: [],
  passwordExpiry: '',
  loginAttempts: 5,
  lockoutDuration: 15,
  twoFactorAuth: false,
  rememberMeDuration: ''
});

// Notification settings
const notificationSettings = reactive({
  smtpServer: '',
  smtpPort: 587,
  senderEmail: '',
  senderName: '',
  smtpUsername: '',
  smtpPassword: '',
  encryption: '',
  events: {
    userRegistration: false,
    passwordReset: false,
    newOrder: false,
    orderStatusChange: false,
    systemAlert: false
  }
});

// Backup settings
const backupSettings = reactive({
  autoBackup: true,
  backupFrequency: '',
  backupTime: '',
  keepBackups: 7,
  storageType: '',
  cloudProvider: ''
});

// 备份历史
const backupHistory = ref([]);

// 日志筛选
const logType = ref('all');
const logDateRange = ref([new Date(2025, 4, 1), new Date(2025, 4, 6)]);
const logCurrentPage = ref(1);
const logPageSize = ref(10);
const totalLogs = ref(0);

// 系统日志
const systemLogs = ref([]);

// 加载基本设置
const loadBasicSettings = async () => {
  loading.value.basic = true;
  try {
    const data = await settingsApi.getBasicSettings();
    Object.assign(basicSettings, data);
  } catch (error) {
    console.error('加载基本设置失败:', error);
  } finally {
    loading.value.basic = false;
  }
};

// 加载安全设置
const loadSecuritySettings = async () => {
  loading.value.security = true;
  try {
    const data = await settingsApi.getSecuritySettings();
    Object.assign(securitySettings, data);
  } catch (error) {
    console.error('加载安全设置失败:', error);
  } finally {
    loading.value.security = false;
  }
};

// 加载通知设置
const loadNotificationSettings = async () => {
  loading.value.notification = true;
  try {
    const data = await settingsApi.getNotificationSettings();
    Object.assign(notificationSettings, data);
  } catch (error) {
    console.error('加载通知设置失败:', error);
  } finally {
    loading.value.notification = false;
  }
};

// 加载备份设置
const loadBackupSettings = async () => {
  loading.value.backup = true;
  try {
    const data = await settingsApi.getBackupSettings();
    Object.assign(backupSettings, data);
    
    // 加载备份历史
    const history = await settingsApi.getBackupHistory();
    backupHistory.value = history;
  } catch (error) {
    console.error('加载备份设置失败:', error);
  } finally {
    loading.value.backup = false;
  }
};

// 加载系统日志
const loadSystemLogs = async () => {
  loading.value.logs = true;
  try {
    const filters = {
      level: logType.value === 'all' ? '' : logType.value,
      dateRange: logDateRange.value
    };
    
    const response = await settingsApi.getSystemLogs(logCurrentPage.value, logPageSize.value, filters);
    systemLogs.value = response.data;
    totalLogs.value = response.total;
  } catch (error) {
    console.error('加载系统日志失败:', error);
  } finally {
    loading.value.logs = false;
  }
};

// 监听标签页变化
const handleTabChange = (tab) => {
  // 根据当前标签页加载相应数据
  if (tab === 'basic' && !loading.value.basic) {
    loadBasicSettings();
  } else if (tab === 'security' && !loading.value.security) {
    loadSecuritySettings();
  } else if (tab === 'notifications' && !loading.value.notification) {
    loadNotificationSettings();
  } else if (tab === 'backup' && !loading.value.backup) {
    loadBackupSettings();
  } else if (tab === 'logs' && !loading.value.logs) {
    loadSystemLogs();
  }
};

// 保存设置
const saveSettings = async () => {
  try {
    if (activeTab.value === 'basic') {
      await settingsApi.updateBasicSettings(basicSettings);
    } else if (activeTab.value === 'security') {
      await settingsApi.updateSecuritySettings(securitySettings);
    } else if (activeTab.value === 'notifications') {
      await settingsApi.updateNotificationSettings(notificationSettings);
    } else if (activeTab.value === 'backup') {
      await settingsApi.updateBackupSettings(backupSettings);
    }
    
    ElMessage.success('设置已保存');
  } catch (error) {
    console.error('保存设置失败:', error);
    ElMessage.error('保存设置失败');
  }
};

// 测试邮件连接
const testEmailConnection = async () => {
  try {
    const result = await settingsApi.testEmailConnection(notificationSettings);
    ElMessage.success(result.message);
  } catch (error) {
    console.error('邮件连接测试失败:', error);
    ElMessage.error('邮件连接测试失败');
  }
};

// 创建备份
const createBackupNow = async () => {
  try {
    const newBackup = await settingsApi.createBackup();
    backupHistory.value.unshift(newBackup);
    ElMessage.success('备份任务已启动，请稍后查看备份历史');
  } catch (error) {
    console.error('创建备份失败:', error);
    ElMessage.error('创建备份失败');
  }
};

// 下载备份
const downloadBackup = (backup) => {
  ElMessage.success(`正在下载备份: ${backup.date}`);
};

// 恢复备份
const restoreBackup = (backup) => {
  ElMessageBox.confirm(`确定要从备份 ${backup.date} 恢复系统吗？这将覆盖当前数据。`, '恢复确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('系统恢复已启动，完成后系统将自动重启');
  }).catch(() => {
    ElMessage.info('已取消恢复操作');
  });
};

// 删除备份
const deleteBackup = (backup) => {
  ElMessageBox.confirm(`确定要删除备份 ${backup.date} 吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = backupHistory.value.findIndex(b => b.date === backup.date);
    if (index !== -1) {
      backupHistory.value.splice(index, 1);
    }
    ElMessage.success('备份已删除');
  }).catch(() => {
    ElMessage.info('已取消删除操作');
  });
};

// 搜索日志
const searchLogs = () => {
  logCurrentPage.value = 1;
  loadSystemLogs();
  ElMessage.success('日志筛选已应用');
};

// 导出日志
const exportLogs = () => {
  ElMessage.success('日志导出成功');
};

// 处理日志分页变化
const handleLogSizeChange = (val) => {
  logPageSize.value = val;
  loadSystemLogs();
};

const handleLogCurrentChange = (val) => {
  logCurrentPage.value = val;
  loadSystemLogs();
};

// Helper functions
const getLogLevelType = (level) => {
  const typeMap = {
    'error': 'danger',
    'warning': 'warning',
    'info': 'info'
  };
  return typeMap[level] || 'info';
};

// 组件挂载时加载数据
onMounted(() => {
  // 加载当前标签页的数据
  handleTabChange(activeTab.value);
});
</script>

<style scoped>
.settings-page {
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

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #f0f0f0;
}

:deep(.el-tabs__item) {
  font-size: 14px;
}

:deep(.el-tabs__item.is-active) {
  color: var(--color-primary);
}

:deep(.el-tabs__active-bar) {
  background-color: var(--color-primary);
}
</style>
