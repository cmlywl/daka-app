<script setup>
import { useHabits } from '../composables/useHabits'

const { week } = useHabits()
</script>

<template>
  <section class="card">
    <header class="card-head">
      <h2>本周打卡</h2>
      <span class="range">{{ week.range }}</span>
    </header>
    <ul class="week-grid">
      <li v-for="d in week.days" :key="d.label" class="day" :class="{ today: d.isToday, future: d.isFuture }">
        <span class="day-label">{{ d.label }}</span>
        <div class="day-track"><span class="day-fill" :style="{ height: d.pct + '%' }"></span></div>
        <span class="day-count">{{ d.countText }}</span>
      </li>
    </ul>
  </section>
</template>