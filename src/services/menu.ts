import service from '@/utils/request'

export const asyncMenu = () => {
  return service({
    url: '/menus',
    method: 'get',
  })
}
