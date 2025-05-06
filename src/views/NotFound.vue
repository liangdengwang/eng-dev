<template>
  <div class="not-found flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary">404</h1>
      <h2 class="text-3xl font-medium mt-4 mb-6">页面未找到</h2>
      <p class="text-gray-600 mb-8">您访问的页面不存在或已被移除</p>
      <el-button type="primary" size="large" @click="goHome">
        <el-icon class="mr-2"><Back /></el-icon>
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.not-found {
  background-image: radial-gradient(circle at 50% 50%, var(--color-primary-light) 0%, transparent 25%);
}

.text-primary {
  color: var(--color-primary);
}
</style>
