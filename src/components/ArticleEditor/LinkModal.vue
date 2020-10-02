<template>

    <q-dialog v-model="prompt" persistent>
      <q-card style="width: 80%">
        <q-card-section>
          <div class="text-h6">Añade un enlace</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="href" label="url" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" @click="$emit('cancel')" />
          <q-btn flat label="OK" @click="selectLink" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>

export default {

  props: {
    prompt: Boolean
  },
  data () {
    return {
      href: null,
      command: null
    }
  },
  methods: {
    setCommand (command) {
      // Add the sent command
      this.command = command
    },
    selectLink () {
      const obj = {
        href: this.href,
        command: this.command
      }
      this.$emit('command', obj)
    }
  }
}
</script>

<style>
</style>
