<template>
  <form ref="form">
    <div class="row">
      <div class="col-12 col-md-6">
        <q-input filled v-model="article.date">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date v-model="article.date" mask="YYYY-MM-DD HH:mm">
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
                <q-time v-model="article.date" mask="YYYY-MM-DD HH:mm" format24h>
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
    <div class="row">
      <div class="col-12 col-md-4">
        <q-select outlined v-model="lang" :options="langOptions" label="Idioma" emit-value map-options />
      </div>
    </div>
    <div class="row">

      <div class="col-12 col-md-8">
        <q-input ref="title" outlined v-model="article.translations.find(t => t.language === lang).title" :label="$t('title')" :rules="[val => !!val || 'Field is required']" />
      </div>
      <div class="col-12 col-md-8">
        <q-editor ref="content" :definitions="definitions" :toolbar="toolbar" v-model="article.translations.find(t => t.language === lang).content" min-height="10rem" />
      </div>

    </div>

    <div class="row">
      <q-img
      :src="article.image"
      style="height: 140px; max-width: 150px"
    >
      <template v-slot:loading>
        <div class="absolute-full flex flex-center bg-primary text-white">
          Imatge de portada
        </div>
      </template>
    </q-img>
    </div>

    <div class="row">
      <div class="col">
        <firebase-uploader @added="imageAdded" @removed="imageRemoved" @upload="uploadImage" :label="$t('image')" ref="uploader" hide-upload-btn></firebase-uploader>
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
    "image": "Imatge de portada"
  },
  "es": {
    "title": "Título",
    "save": "Guardar",
    "image": "Imagen de portada"
  }
}
</i18n>

<script>
import FirebaseUploader from 'src/components/FirebaseUploader.js'

export default {
  name: 'ArticleEditor',
  components: {
    FirebaseUploader
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
      definitions: {
        // save: {
        //   tip: 'Save your work',
        //   icon: 'save',
        //   label: 'Save',
        //   handler: saveWork
        // },
        // upload: {
        //   tip: 'Upload to cloud',
        //   icon: 'cloud_upload',
        //   label: 'Upload',
        //   handler: uploadIt
        // }
      },
      toolbar: [
        ['left', 'center', 'right', 'justify'],
        ['bold', 'italic', 'underline', 'strike'],
        ['undo', 'redo'],
        ['unordered', 'ordered'],
        [
          {
            label: this.$q.lang.editor.formatting,
            icon: this.$q.iconSet.editor.formatting,
            list: 'no-icons',
            options: ['h2', 'h3', 'p']
          }
        ],
        ['link']
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

<style scoped>
label {
  margin-bottom: 2rem;
}
</style>
