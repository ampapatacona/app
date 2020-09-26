<template>
  <q-page class="flex flex-center">
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
