<template>
  <q-page padding>
    <h2 class="text-center">Login</h2>
    <firebase-ui :message="$t('login.enter')" />
  </q-page>
</template>

<script>
import FirebaseUi from 'src/components/FirebaseUi.vue'

export default {
  name: 'PageIndex',
  components: {
    FirebaseUi
  }
}
</script>
