<template>
  <div class="word-gallery">
    <!-- Toast提示 -->
    <v-snackbar v-model="showToast" :timeout="3000" :color="toastColor" location="top right">
      {{ toastMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showToast = false"> 关闭 </v-btn>
      </template>
    </v-snackbar>

    <!-- 添加单词表单 -->
    <v-form class="mb-4 input-card" @submit.prevent="handleFetchWordDetails">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="newWord.word"
            label="add new word (press enter to confirm)"
            required
            @keydown.enter="handleFetchWordDetails"
            :loading="isFetchingDetails"
            :disabled="isFetchingDetails"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>

    <!-- 单词表格 -->
    <v-card>
      <v-card-title class="bg-success">
        <span class="text-white">朝花夕拾</span>
      </v-card-title>
      <v-data-table :headers="headers" :items="words" :items-per-page="10" class="elevation-1">
        <template #item.phonetic="{ item }">
          <v-btn variant="text">
            <span @click="playWord(item.word)" style="text-transform: none">
              {{ item.phonetic }}
            </span>
          </v-btn>
        </template>

        <template #item.partOfSpeech="{ item }">
          <div
            v-if="item.partOfSpeech && item.partOfSpeech.length > 0"
            class="d-flex flex-wrap gap-1"
          >
            <v-chip
              v-for="(pos, index) in item.partOfSpeech"
              :key="index"
              size="small"
              variant="flat"
              class="mr-1 mb-1"
            >
              {{ pos }}
            </v-chip>
          </div>
          <span v-else class="text-grey">-</span>
        </template>

        <template #item.participle="{ item }">
          <span class="text-body-2">{{ item.participle || '-' }}</span>
        </template>

        <template #item.meaning="{ item }">
          <span class="text-body-2">{{ item.meaning }}</span>
        </template>

        <template #item.createdAt="{ item }">
          <span class="text-body-2">{{ formatDate(item.createdAt) }}</span>
        </template>

        <template #item.actions="{ item }">
          <v-btn size="small" variant="text" color="error" @click="deleteWord(item)">
            <v-icon icon="mdi-delete"></v-icon>
          </v-btn>
        </template>

        <template #no-data>
          <div class="text-center py-12">
            <v-icon size="48" color="grey">mdi-book-open-outline</v-icon>
            <h3 class="mt-2 text-body-1 font-weight-medium text-grey">暂无单词</h3>
            <p class="mt-1 text-body-2 text-grey">开始添加第一个单词吧！</p>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  type Word,
  playWord,
  fetchWordDetails,
  saveWordsToStorage,
  loadWordsFromStorage,
  deleteWordFromStorage,
} from '../utils/wordUtils'

// Vuetify组件自动导入，无需额外导入

const headers = [
  { title: '单词', key: 'word', align: 'start' },
  { title: '音标', key: 'phonetic', align: 'start' },
  { title: '词性', key: 'partOfSpeech', align: 'start' },
  { title: '分词形式', key: 'participle', align: 'start' },
  { title: '英文意思', key: 'meaning', align: 'start' },
  { title: '添加时间', key: 'createdAt', align: 'center', sortable: true },
  { title: '操作', key: 'actions', align: 'center', sortable: false },
]

const words = ref<Word[]>([])

const newWord = reactive<Word>({
  word: '',
  phonetic: '',
  partOfSpeech: [],
  participle: '',
  meaning: '',
  createdAt: '',
})

const isFetchingDetails = ref(false)

// Toast提示相关状态
const showToast = ref(false)
const toastMessage = ref('')
const toastColor = ref('error')

// 显示toast提示
function showToastMessage(message: string, color: string = 'error') {
  toastMessage.value = message
  toastColor.value = color
  showToast.value = true
}

// 页面加载时从localStorage加载数据
onMounted(() => {
  const storedWords = loadWordsFromStorage()
  if (storedWords.length > 0) {
    words.value = storedWords
  }
})

// 格式化日期显示
function formatDate(dateString: string): string {
  if (!dateString) return '-'

  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function addWord() {
  if (!newWord.word.trim()) return

  // 添加当前时间戳
  const wordWithTimestamp = {
    ...newWord,
    createdAt: new Date().toISOString(),
  }

  words.value.push(wordWithTimestamp)

  // 保存到localStorage
  saveWordsToStorage(words.value)

  // 显示成功添加的反馈
  console.log(`单词 "${newWord.word}" 已成功添加到表格中`)

  // 重置表单
  Object.assign(newWord, {
    word: '',
    phonetic: '',
    partOfSpeech: [],
    participle: '',
    meaning: '',
    createdAt: '',
  })
}

function deleteWord(word: Word) {
  words.value = deleteWordFromStorage(words.value, word)
}

async function handleFetchWordDetails() {
  if (!newWord.word.trim()) return

  isFetchingDetails.value = true

  try {
    const wordDetails = await fetchWordDetails(newWord.word)
    if (!wordDetails) {
      showToastMessage(`获取单词 "${newWord.word}" 信息失败，请检查单词拼写或重试`)
      return
    }
    console.log('获取到的单词信息:', wordDetails)
    // 将获取到的信息应用到表单中
    Object.assign(newWord, wordDetails)
    // 显示成功提示
    showToastMessage(`单词 "${newWord.word}" 添加成功`, 'success')
    // 直接添加到表格中，不需要二次确认
    addWord()
  } catch (error) {
    console.error('获取单词信息失败:', error)

    // 接口失败时不添加单词，显示错误提示
    showToastMessage(`获取单词 "${newWord.word}" 信息失败，请检查单词拼写或重试`)
  } finally {
    isFetchingDetails.value = false
  }
}
</script>

<style scoped>
.word-gallery {
  position: relative;
  box-sizing: border-box;
  overflow: hidden; /* 防止内容溢出 */
}

.input-card {
  position: fixed;
  bottom: 20px;
  left: calc(var(--v-navigation-drawer-width, 256px) + 20px); /* 侧边栏宽度 + 间距 */
  right: 20px;
  height: 60px;
}
</style>
