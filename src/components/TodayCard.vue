<script setup>
import { useHabits } from '../composables/useHabits'
import { useToast } from '../composables/useToast'

const { state, todayDone, toggleHabit, renameHabit, deleteHabit } = useHabits()
const { showToast } = useToast()

function isChecked(id) { return todayDone.value.includes(id) }

function onRename(h) {
  const name = window.prompt('请输入新的习惯名称：', h.name)
  if (name === null) return
  renameHabit(h.id, name, showToast)
}

function onDelete(h) {
  if (!window.confirm('确定删除习惯「' + h.name + '」吗？删除后其历史打卡不再计入统计。')) return
  deleteHabit(h.id)
}
</script>

<template>
  <section class="card">
    <header class="card-head"><h2>今日清单</h2></header>
    <ul class="habit-list">
      <li v-if="state.habits.length === 0" class="empty">
        <strong>还没有习惯</strong><br>先在下方添加第一个习惯吧
      </li>
      <li v-for="h in state.habits" :key="h.id" class="habit" :class="{ done: isChecked(h.id) }">
        <label class="habit-main">
          <input type="checkbox" class="habit-check" :checked="isChecked(h.id)" @change="toggleHabit(h.id, $event.target.checked)">
          <span class="box" aria-hidden="true">
            <svg class="tick" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <span class="habit-name">{{ h.name }}</span>
        </label>
        <span class="habit-meta">
          <span v-if="isChecked(h.id)" class="chip">已打卡</span>
          <button class="mini" @click="onRename(h)">重命名</button>
          <button class="mini danger" @click="onDelete(h)">删除</button>
        </span>
      </li>
    </ul>
  </section>
</template>