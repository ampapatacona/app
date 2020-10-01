<template>
  <q-page padding>
      <article-editor @guardar="guardar" :article="article" :id="id"></article-editor>
  </q-page>
</template>

<script>
import { date } from 'quasar'

import ArticleEditor from 'src/components/ArticleEditor/index'
import addArticle from 'src/queries/addArticle.gql'
import editArticle from 'src/queries/editArticle.gql'

export default {
  components: {
    ArticleEditor
  },
  data () {
    return {
      id: null,
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
      let variables = {
        author_id: this.article.author_id,
        image: this.article.image,
        created_at: new Date(this.article.date),
        status: this.article.status,
        titleca: this.translatedArticle('ca').title,
        contentca: this.translatedArticle('ca').content,
        titlees: this.translatedArticle('es').title,
        contentes: this.translatedArticle('es').content
      }
      if (this.id) {
        variables = { ...variables, id: this.id }
      }

      this.$apollo.mutate({
        mutation: this.id ? editArticle : addArticle,
        variables,

        // eslint-disable-next-line camelcase
        update: (cache, { data: { insert_articles_one } }) => {
          // Read the data from our cache for this query.
          // eslint-disable-next-line
         console.log(insert_articles_one);
          this.id = insert_articles_one.id
        }
      })
    },
    translatedArticle (lang) {
      return this.article.translations.find(t => t.language === lang)
    }
  }

}
</script>

<style>

</style>
