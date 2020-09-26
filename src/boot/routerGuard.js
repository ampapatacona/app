export default ({ urlPath, redirect, router, store }) => {
  const isAuthorized = store.state.user.token
  // console.log('isAuthorized', isAuthorized)
  if (!isAuthorized && !urlPath.startsWith('/login')) {
    return redirect({ path: '/login' })
  } else if (isAuthorized && urlPath.startsWith('/login')) {
    return redirect({ path: '/' })
  }
}
