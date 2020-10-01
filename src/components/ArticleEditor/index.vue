<template>
  <form class="article-editor">
    <div class="row">
      <div class="col-12">
        <q-input borderless ref="title" class="title-input" v-model="article.translations.find(t => t.language === lang).title" :placeholder="$t('title')" :rules="[val => !!val || $t('required')]" />
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-6">
        <q-input filled v-model="article.created_at">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date v-model="article.created_at" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="article.created_at" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div><!--  datetime row -->

    <div class="row" v-if="article.image">
      <q-img
      :src="article.image"
      style="height: 140px; max-width: 150px"
      >
      </q-img>
    </div>

    <div class="row" v-if="!article.image">
      <div class="col">
        <firebase-uploader @added="imageAdded" @removed="imageRemoved" @upload="uploadImage" :label="$t('image')" ref="uploader" hide-upload-btn></firebase-uploader>
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-6">
        <q-select outlined v-model="lang" :options="langOptions" label="Idioma" emit-value map-options />
      </div>
      <div class="col-xs-12 col-sm-6">
        <q-select outlined v-model="article.status" :options="statusOptions" label="Status" emit-value map-options />
      </div>
    </div>
    <div class="row">
      <!-- <div class="col-12 col-md-8">
        <q-editor ref="content" :definitions="definitions" :toolbar="toolbar" v-model="article.translations.find(t => t.language === lang).content" min-height="10rem" />
      </div> -->
      <div class="col-12">
        <content-editor v-model="article.translations.find(t => t.language === lang).content" @input="content" />
      </div>

    </div>

    <q-btn @click="guardar">{{$t('save')}}</q-btn>
  </form>
</template>
<i18n>
{
  "ca": {
    "title": "Títol",
    "save": "Desa",
    "image": "Imatge de portada",
    "required": "Aquest camp és obligatori",
    "draft": "Esborrany",
    "published": "Publicat"
  },
  "es": {
    "title": "Título",
    "save": "Guardar",
    "image": "Imagen de portada",
    "required": "Este campo es obligatorio",
    "draft": "Borrador",
    "published": "Publicado"
  }
}
</i18n>

<script>
import FirebaseUploader from './FirebaseUploader.js'
import ContentEditor from './ContentEditor'

export default {
  name: 'ArticleEditor',
  components: {
    FirebaseUploader,
    ContentEditor
  },

  data () {
    return {
      image: null,
      pendingImages: false,
      triggerUpload: false,
      lang: 'es',
      langOptions: [
        { label: 'Valencià', value: 'ca' },
        { label: 'Castellano', value: 'es' }
      ],
      statusOptions: [
        { label: this.$t('draft'), value: 'DRAFT' },
        { label: this.$t('published'), value: 'PUBLISHED' }
      ]
    }
  },
  props: {
    article: Object,
    id: Number
  },
  computed: {
    validation () {
      return this.$refs.title.validate()
    }
  },
  methods: {
    content (val) {
      // console.log(val)
      const lang = this.lang
      if (this.article) {
        this.article.translations.find(t => t.language === lang).content = val
      }
    },
    guardar () {
      if (!this.validation) return
      const article = this.article
      if (this.id) {
        article.id = this.id
      }
      if (this.article.image || !this.pendingImages) return this.$emit('guardar', article)
      this.$refs.uploader.upload()
    },
    imageAdded () {
      this.pendingImages = true
    },
    imageRemoved () {
      this.pendingImages = false
    },
    uploadImage (obj) {
      console.log(obj)
      const article = this.article
      article.image = obj.url
      this.$emit('guardar', article)
    }
  }
}
</script>

<style lang="scss">
.q-uploader {
  margin-bottom: 1rem;
}

.title-input {
    font-size: 2.5rem;
    line-height: 2.5rem;
    color: lightgray;
  }
.article-editor {

  label {
    margin-bottom: 2rem;
  }
  .title-input{
    margin-bottom:0;
  }

}
</style>
