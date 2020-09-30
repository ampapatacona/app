<template>
  <q-page padding>
    <h2>Edit article</h2>
      <article-editor @guardar="guardar" :article="article" :id="id"></article-editor>
  </q-page>
</template>

<script>
import { date } from 'quasar'

import ArticleEditor from 'src/components/ArticleEditor'
export default {
  components: {
    ArticleEditor
  },
  data () {
    return {
      id: 23,
      article: {
        date: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
        author_id: this.$store.state.user ? this.$store.state.user.user.uid : null,
        image: null,
        status: 'DRAFT',
        translations: [
          {
            language: 'ca',
            title: '',
            content: ''
          },
          {
            language: 'es',
            title: '',
            content: ''
          }
        ]
      }
    }
  },
  methods: {
    guardar (val) {
      console.log(val)
    }
  }

}
</script>

<style>

</style>
