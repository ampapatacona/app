<template>
  <q-page padding>
    <h2>Edit article</h2>
    <article-edit :article="article"></article-edit>
  </q-page>
</template>

<script>
import ArticleEdit from 'src/components/ArticleEdit.vue'
export default {
  data () {
    return {
      article: null
    }
  },
  components: {
    ArticleEdit
  }

}
</script>

<style>

</style>
