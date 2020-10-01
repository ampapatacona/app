
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'profile', component: () => import('pages/Profile.vue') }
    ]
  },

  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ]
  },

  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresScope: 'admin', requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/admin/Index.vue') },
      { path: 'article/edit', component: () => import('pages/admin/ArticleEdit.vue') },
      { path: 'article/edit/:id', component: () => import('pages/admin/ArticleEdit.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
