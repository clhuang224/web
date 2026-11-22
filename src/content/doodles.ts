import type { Doodle } from '../domain/site'

// FIXME: 塗鴉列表希望不要有文字，改用 waterfall 畫廊排版，點進詳情才有文字說明

const illustrations = [
  [
    'potato-parade',
    '馬鈴薯造型角色與彩色線條',
    'Potato-shaped characters and colorful stripes',
    'ジャガイモのようなキャラクターとカラフルな線',
  ],
  [
    'wide-eyes',
    '睜大眼睛的臉部特寫',
    'A close-up of a wide-eyed face',
    '目を大きく開いた顔のアップ',
  ],
  [
    'outline-sketch',
    '黑色線條描繪的場景',
    'A black-line outline scene',
    '黒い線で描いた風景',
  ],
  [
    'red-and-green-lines',
    '紅色曲線與綠色直線',
    'Red curves and green vertical lines',
    '赤い曲線と緑の縦線',
  ],
  [
    'rainbow-squiggles',
    '帶有小表情的彩色彎曲角色',
    'Colorful winding shapes with small faces',
    '小さな表情のあるカラフルな曲線',
  ],
  [
    'steam-train',
    '蒸汽火車與人物線稿',
    'A line-drawn steam train and figures',
    '蒸気機関車と人物の線画',
  ],
  [
    'yellow-streaks',
    '人物與黃色光帶',
    'A figure with yellow streaks',
    '人物と黄色い帯',
  ],
  [
    'sleepy-and-wide-eyed',
    '一張睏倦與一張睜大眼睛的臉',
    'A sleepy face and a wide-eyed face',
    '眠そうな顔と目を大きく開いた顔',
  ],
  [
    'rainbow-arc',
    '彩虹與人物線條',
    'A large rainbow arc and an outlined figure',
    '大きな虹と人物の線画',
  ],
  [
    'magnifying-glass-sketch',
    '人物與放大鏡',
    'Figures and a magnifying glass',
    '人物と虫眼鏡',
  ],
  [
    'riverside-city',
    '城市河岸旁的人物',
    'A figure by a river and city buildings',
    '街並みと川辺にいる人物',
  ],
  [
    'gray-and-black-blocks',
    '淺色背景上的灰黑色塊',
    'Gray and black blocks on a pale ground',
    '淡い背景に灰色と黒のかたまり',
  ],
  [
    'desk-and-music-note',
    '桌子、音符與藍色色塊',
    'A desk, a music note, and blue shapes',
    '机、音符、青いかたまり',
  ],
  [
    'reclining-figure',
    '紅色背景上的躺臥人物',
    'A reclining figure on a red background',
    '赤い背景に横たわる人物',
  ],
] as const

export const doodles: Doodle[] = illustrations.map(
  ([slug, zh, en, ja], index) => {
    const id = String(index + 1).padStart(2, '0')
    return {
      id,
      number: index + 1,
      src: `/images/doodles/doodle-${id}-${slug}.png`,
      alt: { 'zh-TW': zh, en, ja },
    }
  },
)
