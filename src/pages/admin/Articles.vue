<template>
  <q-page padding class="bg-blue-grey-1">
    <q-table
      title="Blog"
      :data="articles"
      :columns="columns"
      @row-click="onRowClick"
      row-key="name"
    >
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" to="/admin/article/edit" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import getArticles from 'src/queries/getArticles.gql'

export default {
  data () {
    return {
      articles: [],
      columns: [
        {
          name: 'id',
          required: true,
          label: 'ID',
          align: 'left',
          field: 'id',
          sortable: true
        },
        {
          name: 'created_at',
          required: true,
          label: 'Date',
          align: 'left',
          field: 'created_at',
          format: val => `${this.formatDate(val)}`,
          sortable: true
        },
        {
          name: 'title',
          required: true,
          label: 'Título',
          align: 'left',
          field: row => row.translations.find(t => t.language === 'es').title || row.translations.find(t => t.language === 'ca').title,
          sortable: true
        }
      ]
    }
  },
  apollo: {
    // Simple query that will update the 'hello' vue property
    articles: getArticles
  },
  methods: {
    onRowClick (evt, row) {
      // console.log(row)
      const id = row.id
      return this.$router.push(`/admin/article/edit/${id}`)
    },
    formatDate (date) {
      const d = new Date(date)
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      const year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [day, month, year].join('/')
    }
  }
}
</script>

<style>

</style>
