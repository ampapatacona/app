export default ({ urlPath, redirect, store }) => {
  const isAuthorized = store.state.user.token
  if (!isAuthorized && !urlPath.startsWith('/login')) {
    return redirect({ path: '/login' })
  }
}
