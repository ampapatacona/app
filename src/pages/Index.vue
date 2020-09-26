<template>
  <q-page class="flex flex-center">
    <div v-if="$store.state.user && $store.state.user.user">
      {{ $store.state.user.user.email }}
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex'
}
</script>
