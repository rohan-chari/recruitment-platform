<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header" elevated>
      <q-toolbar>
        <!--
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        -->

        <q-toolbar-title @click="router.push('/')"> VouchForMe </q-toolbar-title>
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import EssentialLink from 'components/EssentialLink.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const linksList = [
  {
    title: 'Profile',
    icon: 'person',
    link: '/profile',
  },
]
</script>
