import type { Localized } from '../domain/site'

type Paragraph = readonly string[]

export interface AboutStory {
  serious: readonly Paragraph[]
  divider: string
  trivia: readonly Paragraph[]
  date: string
}

export const aboutStory: Localized<AboutStory> = {
  'zh-TW': {
    serious: [
      ['Lynn，一個喜歡追根究底的生物。'],
      [
        '相信：',
        '每個人都有值得欣賞的地方；',
        '各種事物都有學習的價值；',
        '所有例外狀況都只是需要一點 error handling。',
      ],
    ],
    divider: '上面是認真的，下面是瑣碎的',
    trivia: [
      [
        '做個人網站，除了展示作品、文章和一些有的沒的，也是為了找地方寫下這個小插曲。',
      ],
      [
        '命名不管從商務、工程或是認知的角度來說都極為重要，所以八年前在學習寫英文書信的時候，用心爬了各種英文名字的網站，經過好幾天的篩選，考慮發音、語義、跟本名的關聯，最後選到 Avalyn 這個名字。',
      ],
      [
        'Ava≈Eva≈Eve≈生命/鳥/活力/水，Lynn 是湖泊。',
        '發音上，Lynn 跟本名相近，Ava 跟我的日文名字有點相似。',
        '但偏偏幾個網站都提到 Avalyn 這個名字的年紀大概是 1950 年代，最後忍痛放棄，選了 Lynn。',
        '沒想到就在最近一次偶然問起 GPT，卻發現 Avalyn 是 2000 後流行又新潮的名字！！',
        '這，就是 AI 存在的意義嗎？',
        '為了讓我發現原來當初爬的網站不可靠嗎😭',
        '為了讓我發現，改個名我就能假裝自己是 00 後嗎（蛤？',
      ],
      [
        '然而現實是很殘酷的，兩年前我就已經把這個網站的 Logo 跟 Favicon 畫好了。',
        '要是改名，我的頭像該怎麼辦？？？我的 domain 怎麼辦？？？我的 Lynx 諧音梗怎麼辦！！！',
      ],
      [
        '可是，我真的很喜歡 Avalyn 這個名字……',
        '00 後……',
        'A 會排在前面……',
        '日文名字尬中文名字……',
        'A a Apple……',
      ],
      [
        '左思右想之後，',
        '我決定在這邊偷偷宣布：',
        '哈囉，我是 Lynn，Lynn for Avalyn。',
      ],
      ['用 alias 解決一切的難題😏'],
    ],
    date: '2026/11/22',
  },
  en: {
    serious: [
      ['Lynn: a creature who loves getting to the bottom of things.'],
      [
        'Believes that:',
        'everyone has something worth appreciating;',
        'everything is worth learning from;',
        'every exception just needs a little error handling.',
      ],
    ],
    divider: 'Serious above, trivial below',
    trivia: [
      [
        'Besides showing projects, articles, and odds and ends, this personal website is also a place to write down a little side story.',
      ],
      [
        'Naming matters enormously, whether you look at it from a business, engineering, or cognitive angle. So eight years ago, while learning to write letters in English, I carefully combed through all kinds of English-name websites. After days of narrowing it down, weighing pronunciation, meaning, and the link to my real name, I settled on the name Avalyn.',
      ],
      [
        'Ava ≈ Eva ≈ Eve ≈ life / bird / vitality / water, and Lynn means lake.',
        'In sound, Lynn is close to my real name, and Ava is a little like my Japanese name.',
        'But several of those websites said Avalyn was a name from around the 1950s, so I reluctantly gave it up and chose Lynn.',
        'Then, when I happened to ask GPT about it recently, I found out that Avalyn is a fresh, trendy name that caught on after 2000!!',
        'Is this what AI exists for?',
        'To show me that the websites I trusted back then were unreliable? 😭',
        'To show me that, with a new name, I could pretend I was born after 2000? (Huh?',
      ],
      [
        'But reality is cruel: I had already drawn the logo and favicon for this website two years ago.',
        'If I change my name, what happens to my avatar??? My domain??? My Lynx pun!!!',
      ],
      [
        'And yet, I really do love the name Avalyn…',
        'Born after 2000…',
        'A gets sorted first…',
        'A Japanese name paired with a Chinese name…',
        'A is for Apple…',
      ],
      [
        'After going back and forth,',
        'I have decided to quietly announce it here:',
        'Hello, I am Lynn, Lynn for Avalyn.',
      ],
      ['Solving every problem with an alias 😏'],
    ],
    date: '2026/11/22',
  },
  ja: {
    serious: [
      ['Lynn、とことん突き詰めるのが好きな生き物。'],
      [
        '信じていること：',
        '誰にでも認めたくなるところがある。',
        'どんなものにも学ぶ価値がある。',
        'どんな例外も、ちょっとした error handling があれば大丈夫。',
      ],
    ],
    divider: 'ここまでは真面目、ここからは小ネタ',
    trivia: [
      [
        '個人サイトを作ったのは、作品や記事、その他いろいろを載せるためだけでなく、このちょっとしたエピソードを書き残す場所がほしかったからでもあります。',
      ],
      [
        '名前は、ビジネスでもエンジニアリングでも認知の面でも、とても大切です。だから 8 年前、英語の手紙の書き方を学んでいたとき、英語の名前を紹介するサイトをいろいろ丁寧に調べました。何日もかけて、発音や意味、本名とのつながりを考えて絞り込み、最後に Avalyn という名前を選びました。',
      ],
      [
        'Ava ≈ Eva ≈ Eve ≈ 生命／鳥／活力／水、Lynn は湖。',
        '発音では、Lynn は本名に近く、Ava は私の日本語の名前に少し似ています。',
        'ところが、いくつものサイトに Avalyn は 1950 年代ごろの名前だと書かれていて、泣く泣くあきらめて Lynn を選びました。',
        'それが最近、たまたま GPT に聞いてみたら、Avalyn は 2000 年以降に流行った、新しくておしゃれな名前だとわかったんです！！',
        'これが AI の存在意義なのでしょうか？',
        'あのとき調べたサイトが当てにならなかったと気づかせるため？😭',
        '名前を変えれば 2000 年代生まれのふりができると気づかせるため？（え？',
      ],
      [
        'でも現実は残酷で、このサイトのロゴとファビコンは 2 年前にもう描き上げていました。',
        '名前を変えたら、私のアイコンはどうするの？？？ドメインは？？？Lynx のダジャレはどうなるの！！！',
      ],
      [
        'それでも、Avalyn という名前が本当に好きなんです……',
        '2000 年代生まれ……',
        'A なら一番前に並ぶ……',
        '日本語の名前と中国語の名前の組み合わせ……',
        'A is for Apple……',
      ],
      [
        'さんざん悩んだ末、',
        'ここでこっそり発表することにしました：',
        'こんにちは、Lynn です。Lynn for Avalyn。',
      ],
      ['alias ですべての難題を解決😏'],
    ],
    date: '2026/11/22',
  },
}
