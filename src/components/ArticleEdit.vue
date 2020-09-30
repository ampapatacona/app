<template>
  <form>
    <q-input outlined v-model="article.title" label="Outlined" />
  </form>
</template>

<script>
export default {
  name: 'ArticleEdit',
  props: {
    article: {
      type: Object,
      default: null
    }
  }

}
</script>

<style>

</style>
