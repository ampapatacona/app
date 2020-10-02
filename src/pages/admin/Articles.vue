<template>
  <q-page padding class="bg-blue-grey-1">
    <q-table
      class="content"
      title="Blog"
      :data="articlesData.articles"
      :columns="columns"
      @row-click="onRowClick"
      row-key="id"
      :pagination.sync="pagination"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort
      sortBy="created_at"
    >
    <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" clearable clear-icon="close" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

    </q-table>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" to="/admin/article/edit" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import getArticles from 'src/queries/getArticles.gql'

export default {
  mounted () {
    // get initial data from server (1st page)
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    })
  },
  data () {
    return {
      articlesData: {
        articles_aggregate: null,
        articles: []
      },
      filter: '',
      loading: false,
      pagination: {
        sortBy: 'created_at',
        descending: true,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 10
      },
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
          sortable: false
        }
      ]
    }
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
    },
    onRequest (props) {
      console.log('props', props)
      this.loading = true
      const {
        page,
        rowsPerPage,
        rowsNumber,
        sortBy,
        descending
      } = props.pagination
      const filter = props.filter ? `%${props.filter}%` : null
      const limit = rowsPerPage === 0 ? rowsNumber : rowsPerPage
      const offset = (page - 1) * rowsPerPage
      // console.log('rowsPerPage', rowsPerPage)
      // console.log('rowsNumber', rowsNumber)
      // console.log('limit', limit)
      const order_by = {}
      order_by[sortBy] = descending ? 'desc' : 'asc'
      const variables = {
        limit,
        offset,
        order_by,
        filter
      }
      return this.$apollo.addSmartQuery('articlesData', {
        query: getArticles,
        variables () {
          return variables
          // if (!filter) {
          //   return {
          //     ...variables,
          //     filter: filter
          //   }
          // } else {
          //   return variables
          // }
        },
        update (data) {
          console.log('data', data)
          // console.log('this.projectsData', this.projectsData)
          this.pagination.page = page
          this.pagination.rowsPerPage = rowsPerPage
          this.pagination.sortBy = sortBy
          this.pagination.descending = descending
          this.pagination.rowsNumber = data.articles_aggregate.aggregate.count
          this.loading = false
          return data
        }
      })
    }
  }
}
</script>

<style>

</style>
