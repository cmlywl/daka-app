import { reactive, computed } from 'vue'

const STORAGE_KEY = 'daka_habits_v1'
const WEEK_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const WEEKDAY_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { habits: [], records: {} }
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return { habits: [], records: {} }
    if (!Array.isArray(data.habits)) data.habits = []
    if (!data.records || typeof data.records !== 'object' || Array.isArray(data.records)) data.records = {}
    data.habits = data.habits.filter(h => h && typeof h.id === 'string' && typeof h.name === 'string')
    return data
  } catch (e) {
    return { habits: [], records: {} }
  }
}

function newId() {
  if (window.crypto && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}

function pad2(n) { return String(n).padStart(2, '0') }

function dateStr(d) {
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
}

// 模块级单例，多个组件共享同一份响应式数据
const state = reactive(loadState())

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useHabits() {
  const today = computed(() => dateStr(new Date()))

  const todayLabel = computed(() => {
    const n = new Date()
    return (n.getMonth() + 1) + '月' + n.getDate() + '日 ' + WEEKDAY_CN[n.getDay()]
  })

  const todayDone = computed(() =>
    (state.records[today.value] || []).filter(id => state.habits.some(h => h.id === id))
  )

  const todaySummary = computed(() => {
    const total = state.habits.length
    if (total === 0) return '今日完成 0/0'
    const names = state.habits.filter(h => todayDone.value.includes(h.id)).map(h => h.name)
    if (names.length === 0) return '今日完成 0/' + total + ' · 还没开始，加油！'
    return '今日完成 ' + names.length + '/' + total + ' · ' + names.join('、')
  })

  function addHabit(nameRaw, toast) {
    const name = nameRaw.trim()
    if (!name) { toast('请输入习惯名称'); return false }
    if (state.habits.some(h => h.name === name)) { toast('已有同名习惯'); return false }
    state.habits.push({ id: newId(), name })
    saveState()
    return true
  }

  function toggleHabit(id, checked) {
    const t = today.value
    const arr = (state.records[t] || []).slice()
    const i = arr.indexOf(id)
    if (checked && i < 0) arr.push(id)
    if (!checked && i >= 0) arr.splice(i, 1)
    if (arr.length) state.records[t] = arr
    else delete state.records[t]
    saveState()
  }

  function renameHabit(id, nameRaw, toast) {
    const habit = state.habits.find(h => h.id === id)
    if (!habit) return false
    const name = nameRaw.trim()
    if (!name) { toast('名称不能为空'); return false }
    if (state.habits.some(h => h.id !== id && h.name === name)) { toast('已有同名习惯'); return false }
    habit.name = name
    saveState()
    return true
  }

  function deleteHabit(id) {
    state.habits = state.habits.filter(h => h.id !== id)
    Object.keys(state.records).forEach(day => {
      state.records[day] = state.records[day].filter(x => x !== id)
      if (state.records[day].length === 0) delete state.records[day]
    })
    saveState()
  }

  const week = computed(() => {
    const now = new Date()
    const dow = (now.getDay() + 6) % 7
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow)
    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6)
    const t = today.value
    const total = state.habits.length
    const habitIds = new Set(state.habits.map(h => h.id))
    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)
      const ds = dateStr(d)
      const isToday = ds === t
      const isFuture = ds > t
      let countText, done, pct
      if (isFuture) {
        countText = '—'
        done = 0
        pct = 0
      } else {
        done = (state.records[ds] || []).filter(id => habitIds.has(id)).length
        countText = total > 0 ? done + '/' + total : '0/0'
        pct = total > 0 ? Math.round(done / total * 100) : 0
      }
      days.push({
        label: WEEK_LABELS[i],
        date: (d.getMonth() + 1) + '/' + d.getDate(),
        countText, done, pct, isToday, isFuture
      })
    }
    const range = (monday.getMonth() + 1) + '月' + monday.getDate() + '日 - ' +
      (sunday.getMonth() + 1) + '月' + sunday.getDate() + '日'
    return { days, range }
  })

  return {
    state, today, todayLabel, todayDone, todaySummary, week,
    addHabit, toggleHabit, renameHabit, deleteHabit
  }
}