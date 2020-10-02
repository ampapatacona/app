<template>
  <q-page padding>
      <article-editor v-if="article" @guardar="guardar" :article="article" :id="id"></article-editor>
  </q-page>
</template>

<script>
import { date } from 'quasar'

import ArticleEditor from 'src/components/ArticleEditor/index'
import addArticle from 'src/queries/addArticle.gql'
import editArticle from 'src/queries/editArticle.gql'
import articleById from 'src/queries/articleById.gql'

export default {
  components: {
    ArticleEditor
  },
  created () {
    const id = this.$route.params.id
    if (id) {
      return this.$apollo.query({
        query: articleById,
        variables: {
          id: id
        }
      })
        .then(({ data }) => {
          const article = data.articles_by_pk
          const dateFormated = date.formatDate(new Date(article.created_at), 'YYYY-MM-DD HH:mm')
          article.created_at = dateFormated
          this.article = article
          this.id = Number(id)
        })
    } else {
      this.article = this.default
    }
  },
  data () {
    return {
      id: undefined,
      article: null,
      default: {
        created_at: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
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
    getArticle () {
      this.$apollo.query({
        query: articleById,
        variables: {
          id: this.id
        }
      })
    },
    guardar (val) {
      let variables = {
        author_id: this.article.author_id,
        image: this.article.image,
        created_at: new Date(this.article.created_at),
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
          // console.log(insert_articles_one)
          this.id = insert_articles_one.id
          this.$q.notify('Article desat correctament')
          if (this.$route.fullPath === '/admin/article/edit') {
            return this.$router.replace('/admin/article/edit/' + this.id)
          }
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
