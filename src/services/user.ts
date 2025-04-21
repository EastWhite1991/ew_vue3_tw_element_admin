import service from '@/utils/request'

export const joinInBlackList = () => {
  return service({
    url: '/user/joinInBlackList',
    method: 'POST',
  })
}
