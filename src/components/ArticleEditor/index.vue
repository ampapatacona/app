<template>
  <form class="article-editor">
    <main class="row q-col-gutter-sm">
      <div class="col-md-8">
        <div class="row">
          <div class="col-12">
            <q-input borderless ref="title" class="title-input" v-model="article.translations.find(t => t.language === lang).title" :placeholder="$t('title')" :rules="[val => !!val || $t('required')]" />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <content-editor v-model="article.translations.find(t => t.language === lang).content" @input="content" />
          </div>
        </div>

      </div> <!-- Fin columna principal -->

      <div class="col-md-4">
        <div class="row">
          <div class="col-12">
            <q-select outlined v-model="lang" :options="langOptions" label="Selecciona idioma a editar" emit-value map-options />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-select outlined v-model="article.status" :options="statusOptions" label="Status" emit-value map-options />
          </div>
        </div>

        <div class="row">
          <div class="col-12">
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
          <div class="image-wrapper-2">
            <q-img
              class="article-image cursor-pointer"
              :src="article.image"
              @click="getImagesPrompt = true"
            >
            </q-img>
            <q-btn class="remove-button" round flat size="xm" color="primary" @click="removeImage"  label="X" />
          </div>
        </div>

        <div>
          <get-images @cancel="getImagesPrompt = false" @selected="imageSelected" :prompt="getImagesPrompt" />
        </div>

        <div class="row" v-if="!article.image">
          <div class="col">
            <q-btn @click="getImagesPrompt = true" color="accent" label="Añadir imagen de portada" />
          </div>
        </div>

      </div> <!-- Fin columna lateral -->
    </main>

    <q-dialog v-model="dialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="save" color="primary" text-color="white" />
          <span class="q-ml-sm">El artículo se encuentra en estado de borrador. ¿Quieres solo guardar o guardar y publicar?</span>
        </q-card-section>

        <q-card-actions align="right">
                    <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Solo guardar" @click="guardar(false)" color="primary" v-close-popup />
          <q-btn label="Guardar y publicar" @click="guardar(true)" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="save" color="primary" @click="preSave" />
    </q-page-sticky>
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
import ContentEditor from './ContentEditor'
import GetImages from './GetImages'
import firebase from 'firebase/app'
import 'firebase/storage'

export default {
  name: 'ArticleEditor',
  components: {
    ContentEditor,
    GetImages
  },

  data () {
    return {
      dialog: false,
      image: null,
      getImagesPrompt: false,
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
    imageSelected (image) {
      // console.log(image)
      this.article.image = image
      this.getImagesPrompt = false
    },
    preSave () {
      if (!this.validation) return
      if (this.article.status === 'PUBLISHED') {
        return this.guardar()
      } else {
        this.dialog = true
      }
    },
    content (val) {
      // console.log(val)
      const lang = this.lang
      if (this.article) {
        this.article.translations.find(t => t.language === lang).content = val
      }
    },
    guardar (publicar) {
      if (!this.validation) return
      if (publicar) {
        this.article.status = 'PUBLISHED'
      }
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
    removeImage () {
      this.article.image = null
    },
    deleteImage () {
      // const ref = this.getPathStorageFromUrl(this.article.image)
      const refFromUrl = firebase.storage().refFromURL(this.article.image)
      refFromUrl.delete().then(() => {
        this.article.image = null
        return this.guardar()
      })
        .catch(err => this.$notify(err))
    },
    uploadImage (obj) {
      // console.log(obj)
      const article = this.article
      article.image = obj.url
      this.$emit('guardar', article)
    }
  }
}
</script>

<style lang="scss">
.image-wrapper-2 {
  position: relative;
  width: 100%;
}
.q-uploader {
  margin-bottom: 1rem;
  width: 100%;
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
