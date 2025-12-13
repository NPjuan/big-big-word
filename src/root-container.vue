<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar title="Big Big Word">
        <v-spacer></v-spacer>
        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          text="Toggle Theme"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <v-navigation-drawer permanent>
        <v-list nav>
          <v-list-item
            prepend-icon="mdi-home"
            title="单词库"
            value="home"
            :to="{ name: 'Home' }"
            active-class="text-primary"
          ></v-list-item>

          <v-list-item
            prepend-icon="mdi-book-open-variant"
            title="学习模式"
            value="study"
            :to="{ name: 'Study' }"
            active-class="text-primary"
          ></v-list-item>

          <v-list-item
            prepend-icon="mdi-chart-bar"
            title="统计信息"
            value="stats"
            :to="{ name: 'Stats' }"
            active-class="text-primary"
          ></v-list-item>

          <v-list-item
            prepend-icon="mdi-cog"
            title="设置"
            value="settings"
            :to="{ name: 'Settings' }"
            active-class="text-primary"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-container>
          <router-view />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<style scoped></style>
