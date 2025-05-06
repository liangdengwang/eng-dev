import api from './api';
import dashboardData from '../mocks/dashboard.json';
import analyticsData from '../mocks/analytics.json';
import usersData from '../mocks/users.json';
import settingsData from '../mocks/settings.json';

// 模拟API请求延迟
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// 仪表盘相关API
export const dashboardApi = {
  // 获取仪表盘统计数据
  getStats: async () => {
    await delay();
    return dashboardData.stats;
  },
  
  // 获取收入趋势图表数据
  getRevenueChart: async (timeRange = 'month') => {
    await delay();
    return dashboardData.revenueChart;
  },
  
  // 获取用户增长图表数据
  getUserGrowthChart: async (timeRange = 'month') => {
    await delay();
    return dashboardData.userGrowthChart;
  },
  
  // 获取产品类别分布数据
  getCategoryDistribution: async () => {
    await delay();
    return dashboardData.categoryDistribution;
  },
  
  // 获取最近订单数据
  getRecentOrders: async () => {
    await delay();
    return dashboardData.recentOrders;
  },
  
  // 获取最近活动数据
  getRecentActivities: async () => {
    await delay();
    return dashboardData.recentActivities;
  }
};

// 数据分析相关API
export const analyticsApi = {
  // 获取数据分析摘要
  getSummary: async () => {
    await delay();
    return analyticsData.summary;
  },
  
  // 获取销售趋势数据
  getSalesTrend: async (type = 'daily') => {
    await delay();
    return analyticsData.salesTrend;
  },
  
  // 获取产品类别销售数据
  getCategorySales: async () => {
    await delay();
    return analyticsData.categorySales;
  },
  
  // 获取地区销售数据
  getRegionSales: async () => {
    await delay();
    return analyticsData.regionSales;
  },
  
  // 获取销售漏斗数据
  getSalesFunnel: async () => {
    await delay();
    return analyticsData.salesFunnel;
  },
  
  // 获取销售详细数据
  getSalesData: async (page = 1, pageSize = 10, filters = {}) => {
    await delay();
    const { salesData } = analyticsData;
    
    // 简单的筛选逻辑
    let filteredData = [...salesData];
    
    if (filters.product) {
      filteredData = filteredData.filter(item => item.product.includes(filters.product));
    }
    
    if (filters.category) {
      filteredData = filteredData.filter(item => item.category === filters.category);
    }
    
    if (filters.region) {
      filteredData = filteredData.filter(item => item.region === filters.region);
    }
    
    if (filters.dateRange && filters.dateRange.length === 2) {
      const startDate = new Date(filters.dateRange[0]);
      const endDate = new Date(filters.dateRange[1]);
      
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    
    // 分页
    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filteredData.slice(start, end);
    
    return {
      data: paginatedData,
      total,
      page,
      pageSize
    };
  }
};

// 用户管理相关API
export const usersApi = {
  // 获取用户列表
  getUsers: async (page = 1, pageSize = 10, filters = {}) => {
    await delay();
    
    // 简单的筛选逻辑
    let filteredUsers = [...usersData];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) || 
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }
    
    if (filters.status) {
      filteredUsers = filteredUsers.filter(user => user.status === filters.status);
    }
    
    if (filters.dateRange && filters.dateRange.length === 2) {
      const startDate = new Date(filters.dateRange[0]);
      const endDate = new Date(filters.dateRange[1]);
      
      filteredUsers = filteredUsers.filter(user => {
        const registerDate = new Date(user.registerDate);
        return registerDate >= startDate && registerDate <= endDate;
      });
    }
    
    // 分页
    const total = filteredUsers.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedUsers = filteredUsers.slice(start, end);
    
    return {
      data: paginatedUsers,
      total,
      page,
      pageSize
    };
  },
  
  // 获取用户详情
  getUserById: async (id) => {
    await delay();
    const user = usersData.find(user => user.id === id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  },
  
  // 创建用户
  createUser: async (userData) => {
    await delay();
    
    // 模拟创建用户
    const newUser = {
      id: usersData.length + 1,
      ...userData,
      registerDate: new Date().toISOString().split('T')[0],
      lastLogin: '从未登录'
    };
    
    return newUser;
  },
  
  // 更新用户
  updateUser: async (id, userData) => {
    await delay();
    
    const userIndex = usersData.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // 模拟更新用户
    const updatedUser = {
      ...usersData[userIndex],
      ...userData
    };
    
    return updatedUser;
  },
  
  // 删除用户
  deleteUser: async (id) => {
    await delay();
    
    const userIndex = usersData.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // 模拟删除用户
    return { success: true };
  },
  
  // 获取用户角色分布
  getUserRoleDistribution: async () => {
    await delay();
    
    // 统计各角色用户数量
    const roleCount = {
      admin: 0,
      editor: 0,
      user: 0,
      visitor: 0
    };
    
    usersData.forEach(user => {
      if (user.role in roleCount) {
        roleCount[user.role]++;
      }
    });
    
    return [
      { value: roleCount.admin, name: '管理员' },
      { value: roleCount.editor, name: '编辑' },
      { value: roleCount.user, name: '用户' },
      { value: roleCount.visitor, name: '访客' }
    ];
  },
  
  // 获取用户注册趋势
  getUserRegisterTrend: async () => {
    await delay();
    
    // 按月统计注册用户
    const monthlyRegistrations = {
      '2025-01': 0,
      '2025-02': 0,
      '2025-03': 0,
      '2025-04': 0,
      '2025-05': 0
    };
    
    usersData.forEach(user => {
      const month = user.registerDate.substring(0, 7);
      if (month in monthlyRegistrations) {
        monthlyRegistrations[month]++;
      }
    });
    
    return {
      xAxis: ['1月', '2月', '3月', '4月', '5月'],
      series: [
        {
          name: '新注册用户',
          data: [
            monthlyRegistrations['2025-01'],
            monthlyRegistrations['2025-02'],
            monthlyRegistrations['2025-03'],
            monthlyRegistrations['2025-04'],
            monthlyRegistrations['2025-05']
          ]
        }
      ]
    };
  }
};

// 系统设置相关API
export const settingsApi = {
  // 获取基本设置
  getBasicSettings: async () => {
    await delay();
    return settingsData.basicSettings;
  },
  
  // 更新基本设置
  updateBasicSettings: async (settings) => {
    await delay();
    return { ...settingsData.basicSettings, ...settings };
  },
  
  // 获取安全设置
  getSecuritySettings: async () => {
    await delay();
    return settingsData.securitySettings;
  },
  
  // 更新安全设置
  updateSecuritySettings: async (settings) => {
    await delay();
    return { ...settingsData.securitySettings, ...settings };
  },
  
  // 获取通知设置
  getNotificationSettings: async () => {
    await delay();
    return settingsData.notificationSettings;
  },
  
  // 更新通知设置
  updateNotificationSettings: async (settings) => {
    await delay();
    return { ...settingsData.notificationSettings, ...settings };
  },
  
  // 测试邮件连接
  testEmailConnection: async (config) => {
    await delay();
    return { success: true, message: '邮件服务器连接测试成功' };
  },
  
  // 获取备份设置
  getBackupSettings: async () => {
    await delay();
    return settingsData.backupSettings;
  },
  
  // 更新备份设置
  updateBackupSettings: async (settings) => {
    await delay();
    return { ...settingsData.backupSettings, ...settings };
  },
  
  // 获取备份历史
  getBackupHistory: async () => {
    await delay();
    return settingsData.backupHistory;
  },
  
  // 创建备份
  createBackup: async () => {
    await delay();
    
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const newBackup = {
      date: formattedDate,
      size: '130MB',
      type: '手动',
      status: 'success'
    };
    
    return newBackup;
  },
  
  // 获取系统日志
  getSystemLogs: async (page = 1, pageSize = 10, filters = {}) => {
    await delay();
    
    // 简单的筛选逻辑
    let filteredLogs = [...settingsData.systemLogs];
    
    if (filters.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filters.level);
    }
    
    if (filters.dateRange && filters.dateRange.length === 2) {
      const startDate = new Date(filters.dateRange[0]);
      const endDate = new Date(filters.dateRange[1]);
      
      filteredLogs = filteredLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= startDate && logDate <= endDate;
      });
    }
    
    // 分页
    const total = filteredLogs.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedLogs = filteredLogs.slice(start, end);
    
    return {
      data: paginatedLogs,
      total,
      page,
      pageSize
    };
  }
};

// 导出所有API
export default {
  dashboard: dashboardApi,
  analytics: analyticsApi,
  users: usersApi,
  settings: settingsApi
};
