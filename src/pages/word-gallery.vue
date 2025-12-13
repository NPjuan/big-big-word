<template>
  <div class="word-gallery">
    <!-- 添加单词表单 -->
    <v-card class="mb-4">
      <v-card-title class="bg-primary">
        <span class="text-white">添加新单词</span>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="addWord">
          <v-row align="center">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newWord.word"
                label="输入英文单词"
                required
                :rules="[(v) => !!v || '单词不能为空']"
                @blur="handleFetchWordDetails"
                :loading="isFetchingDetails"
                :append-inner-icon="
                  isFetchingDetails ? 'mdi-loading mdi-spin' : 'mdi-cloud-download'
                "
                placeholder="例如：example"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn
                type="submit"
                color="primary"
                :disabled="!newWord.word.trim() || isFetchingDetails"
                :loading="isFetchingDetails"
              >
                {{ isFetchingDetails ? '获取中...' : '自动获取单词信息' }}
              </v-btn>
            </v-col>
          </v-row>

          <!-- 自动填充的信息展示 -->
          <v-expand-transition>
            <div v-if="showAutoFilledInfo">
              <v-divider class="my-4"></v-divider>
              <v-row>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="newWord.phonetic"
                    label="音标"
                    readonly
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-text-field
                    v-model="newWord.partOfSpeech"
                    label="词性"
                    readonly
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-text-field
                    v-model="newWord.participle"
                    label="分词形式"
                    readonly
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="5">
                  <v-text-field
                    v-model="newWord.meaning"
                    label="英文意思"
                    readonly
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-expand-transition>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- 单词表格 -->
    <v-card>
      <v-card-title class="bg-success">
        <span class="text-white">单词列表</span>
        <v-chip class="ml-2" color="white" text-color="success"> {{ words.length }} 个单词 </v-chip>
      </v-card-title>
      <v-data-table :headers="headers" :items="words" :items-per-page="10" class="elevation-1">
        <template v-slot:item.phonetic="{ item }">
          <div class="d-flex align-center">
            <v-btn
              size="small"
              variant="text"
              :disabled="playingWords.has(item.word)"
              :loading="playingWords.has(item.word)"
              @click="playWord(item.word, playingWords)"
              class="phonetic-btn"
              tabindex="0"
              role="button"
              :aria-label="`播放 ${item.word} 的发音`"
              @keydown.enter="playWord(item.word, playingWords)"
              @keydown.space="playWord(item.word, playingWords)"
            >
              <span
                class="phonetic-text"
                :class="{
                  'phonetic-fallback': isPhoneticFallback(
                    item.phonetic || generateSimplePhonetic(item.word),
                  ),
                }"
                >{{ formatPhonetic(item.phonetic || generateSimplePhonetic(item.word)) }}</span
              >
            </v-btn>
          </div>
        </template>

        <template v-slot:item.partOfSpeech="{ item }">
          <v-chip v-if="item.partOfSpeech" size="small" color="primary" variant="flat">
            {{ item.partOfSpeech }}
          </v-chip>
          <span v-else class="text-grey">-</span>
        </template>

        <template v-slot:item.participle="{ item }">
          <span class="text-body-2">{{ item.participle || '-' }}</span>
        </template>

        <template v-slot:item.meaning="{ item }">
          <span class="text-body-2">{{ item.meaning }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            size="small"
            variant="text"
            color="error"
            @click="deleteWord(item)"
            aria-label="删除单词"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>

        <template v-slot:no-data>
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
import { ref, reactive } from 'vue'
import {
  type Word,
  generateParticipleForms,
  generateSimplePhonetic,
  playWord,
  fetchWordDetails,
} from '../utils/wordUtils'

// Vuetify组件自动导入，无需额外导入

const headers = [
  { title: '单词', key: 'word', align: 'start' },
  { title: '音标', key: 'phonetic', align: 'start' },
  { title: '词性', key: 'partOfSpeech', align: 'center' },
  { title: '分词形式', key: 'participle', align: 'start' },
  { title: '英文意思', key: 'meaning', align: 'start' },
  { title: '操作', key: 'actions', align: 'center', sortable: false },
]

const words = ref<Word[]>([
  {
    word: 'example',
    phonetic: '/ɪɡˈzæmpəl/',
    partOfSpeech: 'noun',
    participle: '',
    meaning: 'a thing characteristic of its kind or illustrating a general rule',
  },
  {
    word: 'learn',
    phonetic: '/lɜ:rn/',
    partOfSpeech: 'verb',
    participle: 'learned/learnt',
    meaning:
      'gain or acquire knowledge of or skill in (something) by study, experience, or being taught',
  },
])

const newWord = reactive<Word>({
  word: '',
  phonetic: '',
  partOfSpeech: '',
  participle: '',
  meaning: '',
})

const playingWords = ref<Set<string>>(new Set())
const isFetchingDetails = ref(false)
const showAutoFilledInfo = ref(false)

function addWord() {
  if (!newWord.word.trim()) return

  words.value.push({ ...newWord })

  // 显示成功添加的反馈
  console.log(`单词 "${newWord.word}" 已成功添加到表格中`)

  // 重置表单
  Object.assign(newWord, {
    word: '',
    phonetic: '',
    partOfSpeech: '',
    participle: '',
    meaning: '',
  })

  // 隐藏自动填充的信息展示
  showAutoFilledInfo.value = false
}

function deleteWord(word: Word) {
  const index = words.value.findIndex((w) => w.word === word.word)
  if (index !== -1) {
    words.value.splice(index, 1)
  }
}

async function handleFetchWordDetails() {
  if (!newWord.word.trim()) return

  isFetchingDetails.value = true
  showAutoFilledInfo.value = false

  try {
    const wordDetails = await fetchWordDetails(newWord.word)

    // 将获取到的信息应用到表单中
    Object.assign(newWord, wordDetails)

    // 显示自动填充的信息
    showAutoFilledInfo.value = true
  } catch (error) {
    console.error('获取单词信息失败:', error)

    // 备选方案：生成基础信息
    newWord.phonetic = generateSimplePhonetic(newWord.word)
    newWord.partOfSpeech = ''
    newWord.participle = generateParticipleForms(newWord.word, '')
    newWord.meaning = newWord.word

    // 显示自动填充的信息
    showAutoFilledInfo.value = true
  } finally {
    isFetchingDetails.value = false
  }
}

function formatPhonetic(phonetic: string): string {
  if (!phonetic) return ''

  // 常见IPA音标字符替换表
  const phoneticMap: Record<string, string> = {
    ɪ: 'ɪ',
    æ: 'æ',
    ʊ: 'ʊ',
    ʌ: 'ʌ',
    ɔ: 'ɔ',
    ə: 'ə',
    ɜ: 'ɜ',
    θ: 'θ',
    ð: 'ð',
    ʃ: 'ʃ',
    ʒ: 'ʒ',
    ŋ: 'ŋ',
    ʧ: 'ʧ',
    ʤ: 'ʤ',
    ː: 'ː',
    ˈ: 'ˈ',
    ˌ: 'ˌ',
  }

  // 替换音标字符为HTML实体或保留原字符
  return phonetic
    .split('')
    .map((char) => {
      return phoneticMap[char] || char
    })
    .join('')
}

function isPhoneticFallback(phonetic: string): boolean {
  if (!phonetic) return false

  // 检测是否包含特殊音标字符
  const specialPhoneticChars = /[ɪæʊʌɔəɜθðʃʒŋʧʤːˈˌ]/g
  return specialPhoneticChars.test(phonetic)
}
</script>

<style scoped>
.word-gallery {
  padding: 20px;
}

.phonetic-text {
  .phonetic-text {
    font-family:
      'Charis SIL', 'Doulos SIL', 'Gentium', 'Arial Unicode MS', 'Lucida Sans Unicode',
      'DejaVu Sans', 'Segoe UI Symbol', 'Arial', sans-serif;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.4;
    letter-spacing: 0.5px;
    font-feature-settings:
      'liga' 1,
      'dlig' 1;
    text-rendering: optimizeLegibility;
  }

  /* 备用音标显示方案 */
  .phonetic-fallback {
    font-family: 'Courier New', monospace;
    background: #f5f5f5;
    padding: 2px 6px;
    border-radius: 3px;
    border: 1px solid #e0e0e0;
    font-size: 12px;
  }
}
.phonetic-btn {
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 4px 8px;
  border-radius: 4px;
  user-select: none;
}

.phonetic-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
  color: #1976d2;
}

.phonetic-btn:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

.phonetic-btn:active {
  background-color: rgba(25, 118, 210, 0.12);
  transform: scale(0.98);
}

.phonetic-playing {
  color: #1976d2;
  background-color: rgba(25, 118, 210, 0.08);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

/* Vuetify 兼容样式 */
.v-card {
  margin-bottom: 16px;
}

.v-data-table {
  margin-top: 0;
}
</style>
