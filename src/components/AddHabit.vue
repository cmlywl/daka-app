<script setup>
import { ref } from 'vue'
import { useHabits } from '../composables/useHabits'
import { useToast } from '../composables/useToast'

const { addHabit } = useHabits()
const { showToast } = useToast()
const input = ref('')

function onAdd() {
  if (addHabit(input.value, showToast)) input.value = ''
}
</script>

<template>
  <section class="card">
    <header class="card-head"><h2>添加新习惯</h2></header>
    <div class="add-row">
      <input v-model="input" class="add-input" type="text" maxlength="20" placeholder="输入习惯名称，如：喝水、运动…" autocomplete="off" @keydown.enter="onAdd">
      <button class="btn-primary" @click="onAdd">添加</button>
    </div>
  </section>
</template>