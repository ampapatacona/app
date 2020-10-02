<template>

    <q-dialog v-model="prompt" persistent>
      <q-card style="width: 80%">
        <q-card-section>
          <div class="text-h6">Elige una imagen</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <div class="image-wrapper" v-for="(image, index) in images" :key="index">
            <q-img class="cursor-pointer" style="width: 200px;" :src="image" @click="selectImage(image)" />
            <q-btn class="remove-button" round flat size="xm" color="primary" @click="deleteImage(image)" icon="delete" />
          </div>
        </q-card-section>

        <q-card-section>
            <firebase-uploader @added="imageAdded" @removed="imageRemoved" @upload="uploadImage" label="Subir imagen" ref="uploader"></firebase-uploader>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" @click="$emit('cancel')" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/storage'
import FirebaseUploader from './FirebaseUploader.js'

export default {
  created () {
    this.getImages()
  },
  props: {
    prompt: Boolean
  },
  components: {
    FirebaseUploader
  },
  data () {
    return {
      images: [],
      pendingImages: false
    }
  },
  methods: {
    selectImage (image) {
      this.$emit('selected', image)
    },
    getImages () {
      const vm = this
      const storageRef = firebase.storage().ref()
      var listRef = storageRef.child('media')
      listRef.listAll()
        .then(function (res) {
          const imagesRefs = res.items
          const images = []
          for (const image of imagesRefs) {
            const ref = storageRef.child(image.location.path_)
            ref.getDownloadURL().then(function (url) {
              images.push(url)
            })
          }
          vm.images = images
        }
        )
    },
    imageAdded () {
      this.pendingImages = true
    },
    imageRemoved () {
      this.pendingImages = false
    },
    uploadImage () {
      return this.getImages()
    },
    deleteImage (image) {
      // console.log(image)
      const refFromUrl = firebase.storage().refFromURL(image)
      refFromUrl.delete().then(() => {
        return this.getImages()
      })
        .catch(err => this.$notify(err))
    }
  }
}
</script>

<style>
.image-wrapper {
  display: inline-block;
  position: relative;
}
.remove-button {
  position: absolute;
  top: 2px;
  left: 5px;
}
.q-uploader {
  margin-bottom: 1rem;
  width: 100%;
}
</style>
