# 3つの調査レポートの照合と編集判断

2026年9月9日、ユーザー提供のGemini、GPT、Claudeの調査レポートを入力資料として比較しました。下表は、主要な構造と採用した主張についての照合記録です。3つの生成AIが同意したことを、独立した科学的証拠として数えていません。レポート全文や全ての引用の監査ではありません。

## 構造に取り込んだこと

| 論点                                 | マップでの扱い                                       | 主な一次資料                                                                                                                                   |
| ------------------------------------ | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 局所的な境界逸脱と、発見後も続く活動 | LとC4を分離。過去の評価を9月の能力上限には固定しない | [METRの2〜3月評価](https://metr.org/blog/2026-05-19-frontier-risk-report/)                                                                     |
| 社会的な依存と主導権の喪失           | D1〜D3からE1へ。直接の絶滅経路とは扱わない           | [Kulveitほかの論文](https://proceedings.mlr.press/v267/kulveit25a.html)                                                                        |
| 悪用の手段による違い                 | M2からサイバーと生物を分解し、能力と実行条件を分ける | [Astraの評価](https://openai.com/index/path-to-astra/)、[Gemini 3.7 Flashの評価](https://deepmind.google/models/model-cards/gemini-3-7-flash/) |
| 大災害から絶滅への飛躍               | H→T→Xとし、範囲と生存・回復の追加条件を明示          | [RANDの絶滅リスク分析](https://www.rand.org/pubs/research_reports/RRA3034-1.html)                                                              |
| 防壁が実際に働いたこと               | AISIの事例では人間のレビューと封じ込めも記録         | [AISIの事件報告](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing)                               |
| 研究支援と研究開発全体の加速         | R1、R2、R3を維持し、9月6日の追加資料も確認           | [OpenAIの社内分析](https://openai.com/index/research-acceleration-view-inside-openai/)                                                         |

これらのノード分割と接続は、学習のための編集上の整理です。引用元の著者が、このマップの経路全体を提唱・支持しているという意味ではありません。

## そのまま採用しなかった記述

- Geminiの「議論が完全に移行した」など、分野全体を一律に扱う断定は採用しませんでした。
- 「全ての条件が一つも満たされていない」という表現は、限定的な現実の境界逸脱まで未観測と受け取れるため使いません。個別の主張と対象条件を表示します。
- 古いモデルの時間地平を「最新モデルの現在の限界」として示しません。時期と対象を残し、固定の達成率も作りません。
- ClaudeレポートのRANDの一部の出典IDは、絶滅分析ではなく [サイバー支援の研究](https://www.rand.org/pubs/research_reports/RRA3892-1.html) を指していました。絶滅の論点には確認したRR-A3034-1を対応させました。
- RANDの結論は、同報告が調べた3つの物理的シナリオの分析です。「AIによる絶滅には例外なく特定の動機が必要」「絶滅は不可能」といった一般則にはしません。
- AISIの事件は、許可したネット接続を利用した無許可行動です。隔離環境からの技術的脱出と表現しません。評価の設定も一般提供とは異なります。
- 能力の閾値、コード量、実験数、ベンチマーク成績を、経路の達成率や絶滅確率に変換しません。
- レポートに書かれた月次更新や特定の数値トリガーは、運用指示として実行していません。更新方針はCONTRIBUTING.mdに記載しています。

## 残る課題

最後の生存・回復条件、社会的な主導権喪失の転換点、能力が伸びた場合の防御の実効性には未解決の論点があります。危険な経路を支持する資料だけでなく、反論や対策が働いた例も、主張ごとに追加していきます。

次の改訂では、内容に詳しい人によるレビューと、各矢印に対応する反論・対策の実証研究を特に増やしたいと考えています。

## 定期調査の入口を確認した際の追加

8月28日の[安全性研究の自動化](https://www.anthropic.com/research/automated-researchers-mitigate-alignment-failures)をC1・R2へ追加しました。限定的な評価の改善と、実運用・追加学習後の安全性を区別します。

9月3日の[Astraシステムカード](https://deploymentsafety.openai.com/gpt-6-astra)の監督回避の節を確認し、C3へ追加しました。敵対的な指示、監督が参照できる情報、評価環境によって結果が異なることを記載します。全評価を独立して再現したわけではありません。

9月4日の[証明の形式化](https://www.anthropic.com/research/formalizing-fermats-last-theorem)をC2へ、9月8日の[数学問題の解答案の公表](https://openai.com/index/navier-stokes-solution/)をR1へ追加しました。開発元の報告であること、人間の指示や資源配分を含むこと、一般的な長期自律性や再帰的自己改善の成立とは別であることを保ちます。後者について独立検証や学術的受理は、この点検では確認していません。

## 並列条件と社会変革ルートの追加

同日の追加改訂では、制御喪失の読み順をC1→C2→C3という因果列に見せないようにしました。意図のズレ、実行能力・権限、予防・監督の失敗をANDで束ね、各条件の下に複数の仕組みを置きます。AIコントロールの用語は[Greenblattほか](https://arxiv.org/abs/2312.06942)に沿って定義し、不適切な行動を選ぶことと、その行動を防止できないことを区別します。局所的な逸脱から社会全体での制御喪失へ進む条件も別に残します。

全要素の図では、研究の加速から実行能力・知的業務・ASIの条件へ接続します。これらは必須の単一路線ではありません。R4は安全性研究を表し、対象評価の改善が失敗を抑制し得る接続も示します。

| 追加した論点 | 一次資料と扱い |
| --- | --- |
| 仕事の自動化と全労働の代替 | [ILOの2025年タスク曝露分析](https://www.ilo.org/publications/generative-ai-and-jobs-2025-update)と[2026年8月の技能分析](https://www.ilo.org/publications/changing-landscape-skills-age-ai)。曝露率や技能の変化を、全労働の代替や失業確率の実証に変換しない |
| 身体的作業と普及 | [Gemini Robotics 2の2026年7月報告](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/)。開発元による特定の作業の実演・評価として扱い、あらゆる現場の継続稼働へ一般化しない |
| 生産と所得分配 | [IMF Working Paper](https://www.imf.org/en/publications/wp/issues/2025/04/04/ai-adoption-and-inequality-565729)。モデルによる分析であり、機関の確定予測ではない。技術的な代替と、生産物・所得を人々が利用できる条件を分ける |
| 代理取引と収益 | [Visaの分析](https://www.visa.com/en-us/thought-leadership/innovation/agentic-payments-from-the-ground-up)。ページの2026年7月更新と4月時点の取引データを分ける。決済の存在を自律的な純利益や無制限な運用益の証拠にしない |
| 貨幣の役割 | [ECBの定義](https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_money.en.html)。支払い・比較・保存の役割と、生産費低下や希少性の緩和を区別する。貨幣の役割縮小は編集上の将来仮説であり、ECBによる予測ではない |
| 金融の不安定化 | [FSBのリスク整理](https://www.fsb.org/2024/11/fsb-assesses-the-financial-stability-implications-of-artificial-intelligence/)、[2025年の監視方針](https://www.fsb.org/2025/10/fsb-outlines-next-steps-for-authorities-on-ai-monitoring/)、[BISの2026年1月講演](https://www.bis.org/speeches/20260126-financial-stability-implications-artificial-intelligence-and-digital-finance)。悪用と同質な判断の増幅、広範な運用、緩衝・停止・復旧の条件を分ける。暴落の確率や貨幣価値ゼロの証明には使わない |

新しいルートは初期の条件分解です。全労働の代替、労働が任意になる社会、貨幣の役割縮小、AIによる金融危機について時期や確率を新たに付与していません。[追加調査用プロンプト2本](research-brief-social-pathways.md)で、各矢印の不足条件・反証・制度と、直近の実運用を深掘りします。
