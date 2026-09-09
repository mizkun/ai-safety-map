# データ構造

固定IDを持つノードと矢印を複数の経路で共有します。JSONとMarkdownを同じPRで変更し、ビルド時に組み合わせます。自由なHTMLは実行しません。

## ノード

content/nodes/C1.json のように、一つのIDを一つのファイルで管理します。

| フィールド  | 意味                                                        |
| ----------- | ----------------------------------------------------------- |
| id          | 項目と共有URLに使う固定ID                                   |
| title       | 普通の日本語による短い名称                                  |
| explanation | 同じIDのMarkdownファイル名                                  |
| evidence    | kind（証拠の種類）、src（出典ID）、text（主張と限界）の配列 |
| sources     | 参照する出典ID                                              |
| questions   | q、a、任意のsrcとchildren。深さは固定しない                 |
| related     | text、scene（地図ID）、node（項目ID）の関連リンク           |
| subgraph    | 任意。詳しい条件を開く地図ID                                |
| terms       | 任意。この項目から意味を開ける用語IDの配列                  |

解説Markdownは最初に名称の見出しを置き、以下の第2レベル見出しを使います。

- ひとことで
- たとえば（任意）
- 次へ進むには
- 残る壁と不確実性
- 進行を止めるには

現在の表示は見出しごとの平文です。Markdownのリスト・表・埋め込みHTMLは本文で使わず、段落で説明してください。

## 矢印

content/map.json のedgesに記録します。fromとtoはノードIDです。relationは conditional（条件付き接続）、joint（他の条件も併せて検討）、alternative（別の結果）、feedback（循環）です。

labelは図上の短い説明、explanationは接続の意味、conditionsは追加条件、limitationはまだ言えないこと、safeguardsは対策、sourcesは根拠の出典IDです。

## 経路と分解

graphsは表示する地図の集合です。nodesとedgesのIDを参照します。modeは sequence（矢印を順にたどる）、all（一緒に検討する条件）、any（代替となる分岐）です。

sequenceの場合、隣り合うノードを結ぶ矢印を同じ順番で指定します。下位の地図はparentで元の項目を示し、その項目のsubgraphから参照します。説明上の分解に循環は作りません。因果関係のフィードバックはedgesで表します。

## そのほか

sources.jsonは資料名、日付・対象期間の表示、URLを管理します。news.jsonは研究の読み方の例、history.jsonは意味のある変更の理由と差分です。

glossary.jsonはname、aliases（本文内でタップ可能にする表記）、definition、任意のexample、limit（混同しやすいこと）、sourcesを持ちます。専門用語を本文に加えるときは、説明も一緒に登録してください。

scripts/validate-content.mjsがIDの整合、参照先、必須の説明・出典、時系列の並び、分解の循環を検査します。科学的な妥当性はレビューで確認してください。
