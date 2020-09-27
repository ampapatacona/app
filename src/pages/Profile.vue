<template>
  <q-page padding>
    <h2 class="text-center">Profile</h2>
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
