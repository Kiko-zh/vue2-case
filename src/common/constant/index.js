/**
 * 批量加载帧图片
 * @param {Function} context - require.context 创建的函数
 * @returns {Array<string>} 返回的所有图片
 */
function loadFrames (context) {
  const frames = []
  const keyNames = []
  context.keys().forEach(k => {
    keyNames.push(k)
    frames.push(context(k))
  })
  const keys = keyNames.map(v => v = v.replace(/[`./|.png`]/g, ''))
  return {frames, keys}
}

const requireEmoji = require.context('@/assets/emoji', false, /\.png$/)
console.log('loadFr==', loadFrames(requireEmoji).keys)
export const emojiSrcList = loadFrames(requireEmoji).frames

export const emojiList = loadFrames(requireEmoji).keys

export const groupMembers = [
  {
    member_name: 'Andy',
    member_id: '001',
    im_user_id: 'a01'
  },
  {
    member_name: 'Angela',
    member_id: '002',
    im_user_id: 'a02'
  },
  {
    member_name: 'Apple',
    member_id: '003',
    im_user_id: 'a03'
  },
  {
    member_name: 'Banana',
    member_id: '004',
    im_user_id: 'a04'
  },
  {
    member_name: 'Bella',
    member_id: '005',
    im_user_id: 'a05'
  },
]