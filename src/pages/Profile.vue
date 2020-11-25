<template>
  <q-page padding>
    <h2 class="text-center">Datos personales</h2>
    <h3>En construcción</h3>
    <div v-if="$store.state.user && $store.state.user.user">
      Email: {{ $store.state.user.user.email }}
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex'
}
</script>
