# データ構造

マップは固定IDを持つJSONとMarkdownで管理し、Gitの差分でレビューします。公開サイトは静的ファイルです。閲覧のためのDBやFirebaseプロジェクトは必要ありません。

## ノード

`content/nodes/C1.json` と `content/explanations/C1.md` が一つの項目です。

| フィールド | 意味 |
| --- | --- |
| id / title | 固定IDと、図に表示する短い名称 |
| explanation | 同じIDのMarkdownファイル名 |
| status | observed（観測例あり）、limited（限定した条件の証拠）、hypothesis（条件付き仮説）、definition（到達点の定義） |
| research | research.jsonの研究カードID。複数の項目で共有できる |
| sources | 出典ID。参照する研究カードの出典も含める |
| subgraph | 下位の条件を表示する図のID |
| topics / terms | カードに併記する分野名／関連する用語のID |
| review | checkedAt、intervalDays（1〜90日）、reason |
| watch | どんな新しい証拠で判断を見直すか |
| related / questions | 任意の補足リンクと、追加の問答 |

`status` は危険度や成立の割合ではありません。`observed` でも特定の条件での観測であり、世界全体で成立したという意味ではありません。

Markdownは名称の第1見出しと、次の6節を必須とします。

1. 概要
2. 他の条件との関係
3. 現在の状況
4. 成立条件
5. 根拠の限界
6. 考えられる対策

本文は節ごとの平文として表示します。任意の「具体例」も使えます。HTMLを実行したり、Markdown内の見出し以外の構文を展開したりはしません。

## 研究カードと出典

`content/research.json` は、title、type、kind、source、locator、evaluator、setting、method、result、limitationを持ちます。誰が、何を、どの条件で、どう測り、何が分かり、何が分からないかを一件ずつ管理します。typeはevaluation（評価実験）、observation（観測・記録）、model（モデルによる推計）、definition（定義）、argument（原論考）です。表示用のkindとは別に、CIで参照する分類を保持します。観測例ありには、評価実験か観測の資料が少なくとも一件必要ですが、それだけで主張を実証したとは判定しません。

`sources.json` はtitle、url、primary、date、published、period、checkedを持ちます。`primary` には、その資料が誰の何の一次情報かを書きます。文字列があるだけでは一次情報の保証にならないため、内容レビューが必要です。

公表日の精度が月までなら年月を保持し、未確認ならnullにします。対象期間、出典本文を確認した日、ノードの説明を再点検した日を混同しません。`map.json` の `asOf` は取り込んだ点検日の最新値です。

## 矢印

`content/map.json` の `edges` に保存します。

| フィールド | 意味 |
| --- | --- |
| from / to | 接続先のノードID |
| relation | conditional / joint / alternative / feedback / influence / mitigation |
| requires | jointで必須。fromを含む、異なる2項目以上のAND入力 |
| label / explanation | 図上の短い表現と接続の概要 |
| conditions | この接続が成立するための条件 |
| current | 接続のどの部分まで、現在の証拠があるか |
| limitation / basis | 根拠の限界と、編集上の仮説・定義などの区別 |
| safeguards | 候補または検証された対策 |
| research / sources / review | 研究、出典、点検日への参照 |

促進・抑制は必須の前提を意味しません。フィードバックは明示します。ANDはここで扱う経路の条件であり、必要十分条件や統計的独立性を証明したものではありません。

## 図と固定配置

`graphs` のmodeはsequence（追加条件をたどる経路）、all（AND）、any（OR）、network（複数の接続）です。下位図のparentと、親ノードのsubgraphは相互参照します。説明の分解に循環は作りません。

全要素は各ノードを一度だけ描きます。ORは枝分かれと合流、ANDは余白を持つ枠として表示します。枠の手前の親カードは説明する現象、枠内のカードはその条件です。兄弟を因果の前後関係にはしません。共同条件を次の状態へ接続するANDは、矢印のrequiresと一致させます。

`lib/expanded-tree-layout.ts` で固定配置し、`lib/horizontal-tree-layout.ts` で左から右へ変換します。横位置は年月ではありません。研究の加速の影響線、分類上の案内、現象の因果線は異なる意味です。

## ストーリーと補助資料

`stories.json` は経路IDごとのtitle、intro、chapters、outlookを持ちます。各chapterはtitle、textと、関連するnodesの配列を持ちます。物語は仮説の筋道を説明し、未確認の出来事や確定した時期を作りません。

`glossary.json` のaliasesが本文中の用語ボタンになります。`news.json` は一次資料の読み方、`history.json` は意味のある変更の記録、`watchlist.json` は定期調査の入口です。

## 点検と配信

[点検手順](logic-review.md)に従い、`docs/reviews/*.json` に点検の指紋と判断を残します。`lib/review-fingerprints.mjs` は参照する研究・出典も指紋に含め、根拠が変わった説明の古い点検を無効にします。指紋は内容の正しさを証明しません。

初期HTMLには地図の構造・名称・用語の別名などだけを含めます。本文や研究カードは、内容の指紋を名前に含む `content/details-….json` から、最初に詳細を開いた時に取得します。一度取得すると、同じページ内の次の詳細で再利用します。完全版はSSRの初期データへ重複埋め込みしません。

地図は表示範囲外のカードを省いて描画します。ピンチによる拡大・縮小は地図だけに適用し、詳細の文章のスクロールと分けます。自動テストは構造と座標を検査しますが、実機での体感速度や見た目を保証するものではありません。
