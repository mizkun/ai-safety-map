# データ構造

固定IDを持つノードと矢印を複数の経路で共有します。JSONとMarkdownを同じPRで変更し、ビルド時に組み合わせます。自由なHTMLは実行しません。

## ノード

content/nodes/C1.json のように、一つのIDを一つのファイルで管理します。

| フィールド  | 意味                                                                                   |
| ----------- | -------------------------------------------------------------------------------------- |
| id          | 項目と共有URLに使う固定ID                                                              |
| title       | 普通の日本語による短い名称                                                             |
| explanation | 同じIDのMarkdownファイル名                                                             |
| evidence    | kind（証拠の種類）、src（出典ID）、text（主張と限界）の配列                            |
| sources     | 参照する出典ID                                                                         |
| questions   | q、a、任意のsrcとchildren。深さは固定しない                                            |
| related     | text、scene（地図ID）、node（項目ID）の関連リンク                                      |
| subgraph    | 任意。詳しい条件を開く地図ID                                                           |
| terms       | 任意。この項目から意味を開ける用語IDの配列                                             |
| topics      | 任意。カードに分野・概念の名称を表示する用語IDの配列。タップで定義を開く               |
| review      | checkedAt（説明の最終点検日）、intervalDays（1〜90日の点検間隔）、reason（間隔の理由） |

解説Markdownは最初に名称の見出しを置き、以下の第2レベル見出しを使います。

- ひとことで
- たとえば（任意）
- 次へ進むには
- 残る壁と不確実性
- 進行を止めるには

現在の表示は見出しごとの平文です。Markdownのリスト・表・埋め込みHTMLは本文で使わず、段落で説明してください。

## 矢印

content/map.json のedgesに記録します。fromとtoはノードIDです。relationは conditional（条件付き接続）、joint（他の条件も併せて検討）、alternative（別の結果）、feedback（循環）、influence（促進し得る影響）、mitigation（抑え得る影響）です。促進・抑制は、その結果の必須条件を意味しません。

jointに任意のrequiresを置くと、複数のノードをANDで併せて検討します。requiresはfromを含む2つ以上の異なるノードIDです。図と詳細パネルは同じ配列を使い、例えばC3-LはC1・C2・C3の3条件を束ねます。標準的な必要十分条件や独立性が証明されたという意味ではなく、成立条件と限界は本文で説明します。

labelは図上の短い説明、explanationは接続の意味、conditionsは追加条件、limitationはまだ言えないこと、safeguardsは対策、sourcesは根拠の出典IDです。

矢印にもノードと同じreviewを持たせます。日付の計算はlib/freshness.mjsをサイトと期限検査で共有します。日本時間で、checkedAtにintervalDaysを加えた日から「要再確認」です。内容の真偽や危険度を示す値ではありません。

## 経路と分解

graphsは表示する地図の集合です。nodesとedgesのIDを参照します。modeは sequence（矢印を順にたどる）、all（一緒に検討する条件）、any（代替となる分岐）、network（並列条件や複数の接続を持つ網）です。networkではnodes配列の順序を因果関係や時間順序に変換せず、edgesとrequiresから関係を読みます。

sequenceの場合、隣り合うノードを結ぶ矢印を同じ順番で指定します。下位の地図はparentで元の項目を示し、その項目のsubgraphから参照します。説明上の分解に循環は作りません。因果関係のフィードバックはedgesで表します。

全要素の図は各ノードを一度だけ配置し、共有する結果や条件を同じカードにつなぎます。all/anyの分解は枠で表し、兄弟ノード間には因果の矢印を引きません。図の固定配置はlib/expanded-tree-layout.ts、接続線はlib/tree-layout.tsです。データを追加した際は、全項目の網羅・重複・孤立・カードの重なりをnpm run test:mapで確認します。経路見出しから項目への薄い点線は分類上の案内で、因果関係ではありません。

表示はlib/horizontal-tree-layout.tsで左から右へ進む配置に変換します。カード、線、接続点、条件の枠を同じ座標変換で扱います。共有する分類線はforksで一本にまとめ、異なる因果線はポートと通過位置を分けます。生存・回復の結果E0は、HからH-E0を通る分岐であり、NOWの隣の現在状態ではありません。

## そのほか

sources.jsonは資料名、日付・対象期間の表示、URLを管理します。news.jsonは研究の読み方の例、history.jsonは意味のある変更の理由と差分です。

watchlist.jsonは調査先のid、name、cadence（daily / weekly）、urls、focus、nodes（関係する項目ID）を管理します。日付だけの一括更新を避けるため、内容を点検した記録はdocs/reviews/へ残します。map.jsonのasOfは取り込まれた内容点検日の最新値です。

glossary.jsonはname、aliases（本文内でタップ可能にする表記）、definition、任意のexample、limit（混同しやすいこと）、sourcesを持ちます。専門用語を本文に加えるときは、説明も一緒に登録してください。

scripts/validate-content.mjsがIDの整合、参照先、必須の説明・出典、時系列の並び、分解の循環を検査します。科学的な妥当性はレビューで確認してください。

出典はpublished（公表日。年月までしか確認できなければその精度を保つ）、period（研究や観測の対象時期・範囲）、checked（確認日）を分けます。公表日が未確認の場合はnullにします。ノードの任意のwatchには、評価を見直す材料になる観測を記載します。矢印のbasisは、編集上の整理か未解決の接続かなど、その根拠の性質を説明します。
