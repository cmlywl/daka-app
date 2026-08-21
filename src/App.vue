<script setup>
import { computed } from 'vue'
import { useHabits } from './composables/useHabits'
import { useToast } from './composables/useToast'
import TodayCard from './components/TodayCard.vue'
import AddHabit from './components/AddHabit.vue'
import WeekStats from './components/WeekStats.vue'

const { toast } = useToast()
const { state, todayLabel, todayDone } = useHabits()

const doneCount = computed(() => todayDone.value.length)
const total = computed(() => state.habits.length)
const pct = computed(() => (total.value ? Math.round((doneCount.value / total.value) * 100) : 0))
const heroState = computed(() => {
  if (total.value === 0) return '添加几个习惯，开始今天的打卡'
  if (doneCount.value === 0) return '今天还没有完成，先打一个勾吧'
  if (doneCount.value === total.value) return '今日全部完成，太棒了 🎉'
  return '继续加油，把剩下的也完成'
})
</script>

<template>
  <div class="page">
    <header class="masthead">
      <p class="eyebrow">DAILY HABITS</p>
      <h1 class="wordmark">习惯打卡</h1>
    </header>

    <section class="hero">
      <p class="eyebrow">今日打卡</p>
      <div class="hero-date">{{ todayLabel }}</div>
      <p class="hero-state">
        <template v-if="total > 0">
          <span class="hero-total"><span :key="doneCount" class="hero-count">{{ doneCount }}</span> / {{ total }} 已完成</span>
          <span class="hero-hint"> · {{ heroState }}</span>
        </template>
        <span v-else>{{ heroState }}</span>
      </p>
      <div class="hero-track"><span class="hero-fill" :style="{ width: pct + '%' }"></span></div>
    </section>

    <TodayCard />
    <AddHabit />
    <WeekStats />

    <footer class="foot">数据仅保存在此浏览器中</footer>
  </div>

  <Transition name="toast">
    <div v-if="toast.show" class="toast">{{ toast.text }}</div>
  </Transition>
</template>