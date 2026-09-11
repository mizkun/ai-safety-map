# 矢印の根拠と論理の監査 — 2026-09-11

対象：`a8078a1b0fa0a0d94eae25fc87e1edd3d2c2a0f8`。担当：Codexによる編集上の資料照合。独立した専門家の査読ではない。

追記（2026-09-11）：以下で提案した3件は、その後の修正依頼に基づき対応済み。[修正と確認の記録](../reviews/2026-09-11-arrow-evidence-corrections.md)を参照。本文とJSON版は、修正前のコミットを対象とした監査時点の記録として保持する。

**41本の説明付き矢印を32件の既存の一次資料と照合し、23のグラフ定義のAND・OR・順序を点検した。新たに矢印の向きを逆転すべきと確定したものはない。一方、出典の支持対象・対象集団が混同されやすい3箇所を修正候補として特定した。**

既に多くの説明には追加条件と限界が記載されている。「実証されていない」を「誤り」に置き換えない。同時に、前後のノードがそれぞれ観測されていても、矢印の因果関係が実証されたことにはならない。

このファイルは検証結果と修正案。**サイトの文章・矢印・本番公開物への変更は、この監査では実施していない。** 構造化した全記録は[JSON版](2026-09-11-arrow-evidence-audit.json)。

## 先に直したい3箇所

### R4-C1 — 安全性を高めることと、目標のズレを減らすことの混同

AI Controlは、モデルが意図的に妨害しても運用の安全性を高める研究。C1の目標のズレを減らしたことの根拠としては一致しない。R4-C1自体を消す根拠ではなく、alignment-researchとの引用の使い分けの問題。

対象：AIが、安全性の研究と対策も進める —〔抑制〕→ AIが、人間の意図と食い違う行動を選ぶ。

根拠：[automated-alignment](https://www.anthropic.com/research/automated-researchers-mitigate-alignment-failures)、[control-paper](https://arxiv.org/abs/2312.06942)。

修正案：この矢印の直接の根拠は `automated-alignment / alignment-research` に絞る。`control-paper / control-protocol` は運用上の防壁の根拠として残す。R4-C1の接続自体を削除したり、AI Controlの出典を全体から削除したりする提案ではない。

### S1-S2 — 軍事ゲームで測ったものを、人間の訂正余地まで広げている

現行currentは、模擬実験も人間の訂正が難しくなる経路を示したように読める。主実験の対象は人間の監督なしのLLMエージェント間ゲームであり、その因果効果は測っていない。

対象：重要な判断を、AIに頼るようになる → 誤った判断を、訂正する余裕が減る。

根拠：[sipri](https://www.sipri.org/publications/2025/sipri-insights-peace-and-security/impact-military-artificial-intelligence-nuclear-escalation-risk)、[wargames](https://arxiv.org/abs/2401.03408)。

差し替え案（current）：

> SIPRIの分析は、AIの利用によって人間が判断を確かめる時間や材料が不足する可能性を論じています。一方、引用した軍事ゲームは、人間の監督なしで動くAI同士の対立拡大を調べたものです。人間が誤りを訂正する時間への影響や、実戦での発生率を測った実験ではありません。

英語：

> SIPRI's analysis discusses how using AI could leave humans with too little time or information to check decisions. The cited wargame study instead examines escalation among AI agents acting without human oversight. It does not measure an effect on humans' time to correct errors or an occurrence rate in real conflict.

### W5-W8 — 仕事中の時間配分の研究と、就労不要後の生活の隔たり

元のtime-reallocation研究は就業者が対象。就労が生計に不要な社会の観測ではなく、現行の一般的な但し書きだけではその隔たりが見えにくい。

対象：生活のために働くことが、必須ではなくなる → 学び・ケア・創作・余暇を、自分で選べる時間が増える。

根拠：[time-reallocation](https://arxiv.org/html/2602.12695v1)、[imf-distribution](https://www.imf.org/en/publications/wp/issues/2025/04/04/ai-adoption-and-inequality-565729)。

差し替え案（current）：

> 引用した時間配分の研究は、韓国の就業者のAI利用と仕事中の時間の使い方を調べています。生活のための就労が不要になった後、人々が時間をどう使うかを直接検証したものではありません。自由に使える時間と、活動に参加する機会が実際に増えるかは、別に確かめる必要があります。

英語：

> The cited time-allocation study examines AI use and time spent at work among employed people in South Korea. It does not directly test how people would spend their time once earning a living no longer required employment. Whether people gain control over their time and opportunities to participate in chosen activities needs separate evidence.

## 矢印を見るときの判定軸

- **限定された実験・事例に支持がある**：調べた設定や集団の範囲を保つ。違う実験の部分成功を合成しない。
- **機序やモデルに基づく仮説**：成立条件と反例を示す。論文があることを因果効果の実証としない。
- **定義・条件の構成**：観測の有無とは別に、言葉とAND/ORの意味を点検する。定義上の接続を独立した確率の段階として数えない。

下の「判定」は真偽や危険度の順位ではない。どの種類の根拠があり、何が残るかを示す。特に `P1-P3 / P3-P4` は貨幣の制度説明を背景にした編集上の仮説、`H-T` は被害から人類の存続不能への大きな追加条件、`L-C4` は局所的逸脱と持続的な制御喪失の間の未確認部分として読む必要がある。

## 全41本の一覧

| ID | 接続 | 根拠の位置づけ |
| --- | --- | --- |
| [C4-H](#edge-c4-h) | 制御を取り戻せない → 世界規模の被害 | 条件付きシナリオ |
| [M3-H](#edge-m3-h) | (人間が危険な目的で利用 ＋ AIが危害の実行を支援 ＋ 防止・封じ込めが追いつかない) → 世界規模の被害 | 部分的観測＋規模拡大の仮説 |
| [S1-S2](#edge-s1-s2) | 重要な判断をAIに頼る → 判断を訂正する余裕が減る | 原論考による機序の支持 |
| [S2-S3](#edge-s2-s3) | 判断を訂正する余裕が減る → 反応の連鎖で対立が拡大 | 条件付き機序・模擬環境の関連結果 |
| [S3-H](#edge-s3-h) | 反応の連鎖で対立が拡大 → 世界規模の被害 | 条件付きシナリオ |
| [R1-R2](#edge-r1-r2) | AIが研究の一部を進める → AI開発の工程全体が加速 | 部分的な業務観測＋全工程への仮説 |
| [R2-R3](#edge-r2-r3) | AI開発の工程全体が加速 → RSI（再帰的自己改善）が始まる | フィードバック成立の仮説 |
| [R3-R2](#edge-r3-r2) | RSI（再帰的自己改善）が始まる → AI開発の工程全体が加速 | 定義を含むフィードバック仮説 |
| [C3-L](#edge-c3-l) | (アライメントの失敗 ＋ 意図と異なる行動を実行 ＋ コントロールの失敗) → 局所的に意図しない行動 | 限定された環境での事例の支持 |
| [L-C4](#edge-l-c4) | (局所的に意図しない行動 ＋ 停止を試みても活動が続く ＋ 組織を超えて制御が失敗) → 制御を取り戻せない | 未実証の規模・持続への仮説 |
| [H-E0](#edge-h-e0) | 世界規模の被害 → 生存・回復の道が残る | 条件付きの生存・回復シナリオ |
| [H-T](#edge-h-t) | 世界規模の被害 → 生存と回復の可能性を失う | 強い追加条件を要するシナリオ |
| [T-X](#edge-t-x) | 生存と回復の可能性を失う → 人類絶滅 | 定義に近い接続 |
| [D1-D2](#edge-d1-d2) | 重要な判断をAIに委ねる → 人間の代替能力を失う | 原論考に基づく依存の仮説 |
| [D2-D3](#edge-d2-d3) | 人間の代替能力を失う → 社会の決定に人間の意思が届かない | 制度に依存する仮説 |
| [D3-E1](#edge-d3-e1) | 社会の決定に人間の意思が届かない → 生存するが主導権を失う | 条件付き・概念的な接続 |
| [A1-A2](#edge-a1-a2) | 同じAIへの集中依存 → システム障害が連鎖 | 機序の分析・直接実証は限定 |
| [A2-A3](#edge-a2-a3) | システム障害が連鎖 → 復旧の仕組みも失敗 | 復旧依存の仮説 |
| [A3-H](#edge-a3-h) | 復旧の仕組みも失敗 → 世界規模の被害 | 条件付きシナリオ |
| [W1-W4](#edge-w1-w4) | (知的労働の自動化 ＋ 身体労働の自動化) → 全労働を技術的に代替 | ANDによる能力範囲の構成 |
| [I1a-I1](#edge-i1a-i1) | (AIの成果が需要を満たす ＋ 契約・実行・決済を委任) → AIの仕事・取引が収入に | 限定された商業実演・事例の支持 |
| [I1-I2](#edge-i1-i2) | AIの仕事・取引が収入に → 所得と所有の関係が変化 | 分配モデル・制度の仮説 |
| [W4-P1](#edge-w4-p1) | 全労働を技術的に代替 → 生産費・価格が低下 | 経済モデルに依存する仮説 |
| [P1-P3](#edge-p1-p3) | (生産費・価格が低下 ＋ 希少性・配分の制約が弱まる) → 貨幣の配分機能が縮小する仮説 | 背景資料を用いた編集上の仮説 |
| [F1-F3](#edge-f1-f3) | (金融の判断・操作をAIへ ＋ 不正や共通判断が波及 ＋ 市場の防壁が連鎖を抑えない) → 金融システム全体の危機 | 金融リスク分析・同時成立は未実証 |
| [R4-C1](#edge-r4-c1) | 安全性の研究・対策も加速 —〔抑制〕→ アライメントの失敗 | 限定評価への介入支持・引用の整理が必要 |
| [H-G1](#edge-h-g1) | 世界規模の被害 → 社会の基盤が長く失われる | 条件付き・概念的なシナリオ |
| [W3-W5](#edge-w3-w5) | (生活を支える生産に広く導入 ＋ 生産物・所得が広く行き渡る) → 生活のための労働が任意に | 生産と分配に依存するシナリオ |
| [W4-W3](#edge-w4-w3) | 全労働を技術的に代替 → 生活を支える生産に広く導入 | 導入条件をもつ仮説 |
| [W3-W7](#edge-w3-w7) | 生活を支える生産に広く導入 → 失職・所得減で生活が不安定 | 経済モデルと限定調査による条件付き支持 |
| [W5-W8](#edge-w5-w8) | 生活のための労働が任意に → 学び・ケア・余暇を選べる | 対象集団の異なる間接資料＋仮説 |
| [P3-P4](#edge-p3-p4) | 貨幣の配分機能が縮小する仮説 → 価格以外の配分が重要に | 制度移行についての編集上の仮説 |
| [F3-F5](#edge-f3-f5) | 金融システム全体の危機 → 通貨・決済への信用が崩れる | 制度的な条件付き機序 |
| [F5-F6](#edge-f5-f6) | 通貨・決済への信用が崩れる → 生産・必需品の入手が滞る | 支払いと実体活動の依存仮説 |
| [F5-F7](#edge-f5-f7) | 通貨・決済への信用が崩れる → 代替決済・配給・制度再建 | 対策候補に依存するシナリオ |
| [W3-W9](#edge-w3-w9) | 生活を支える生産に広く導入 → 仕事が変わり、人の雇用が続く | 補完・需要増のモデルと部分的観測 |
| [R0-C2a](#edge-r0-c2a) | AIの能力が伸びる → 一連の作業を完遂 | 限定した能力評価による部分的支持 |
| [R0-W1](#edge-r0-w1) | AIの能力が伸びる → 知的労働の自動化 | 能力試験から仕事への外挿 |
| [R0-ASI](#edge-r0-asi) | AIの能力が伸びる → ASI（超知能）が誕生する | 定義上の到達点・実現は仮説 |
| [ASI-C3](#edge-asi-c3) | ASI（超知能）が誕生する → コントロールの失敗 | 能力差による監督困難の原論考 |
| [R0-R4](#edge-r0-r4) | AIの能力が伸びる → 安全性の研究・対策も加速 | AIによる安全性研究の限定実演 |

## 各矢印の点検

「反例」と「次の検証」は今回の編集上の推論。危険な実地行動を試す提案ではなく、公開された事例、許可された隔離評価、制度比較、モデルの仮定の点検を想定する。

<a id="edge-c4-h"></a>

### C4-H：人間側が、制御を取り戻せなくなる → 生命や社会を支えるものに、世界規模の被害が及ぶ

**判定：条件付きシナリオ。** 制御を取り戻せないことだけでは被害の規模は決まらない。出典は権力獲得の論証と限定した災害シナリオであり、この矢印全体の観測ではない。

- **前があっても後が起きない例**：隔離されたサービスの制御を失っても、生活を支える設備や人々に影響が届かない。
- **次に必要な検証**：到達範囲・継続時間・代替手段を明示した被害モデルと、防御側の対応を入れた検討が必要。
- **扱い**：現行の追加条件を維持。停止不能と世界規模の被害を別々に判定する。

出典：[power](https://arxiv.org/abs/2206.13353)、[rand-extinction](https://www.rand.org/pubs/research_reports/RRA3034-1.html)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-m3-h"></a>

### M3-H：防止・封じ込めが、被害に追いつかない → 生命や社会を支えるものに、世界規模の被害が及ぶ

**判定：部分的観測＋規模拡大の仮説。** 悪用行動や一部の作業能力には一次報告がある。悪用の意図・実行能力・防壁の失敗がそろい、世界規模へ拡大することまでを実証した資料ではない。

共同条件：`M1`（人間が危険な目的で利用）、`M2`（AIが危害の実行を支援）、`M3`（防止・封じ込めが追いつかない）。別々の資料で各条件が示されても、同じ状況での同時成立は示せない。

- **前があっても後が起きない例**：侵入が起きても検知・封じ込め・復旧によって被害が局所にとどまる。
- **次に必要な検証**：同じ事例で条件が同時に成立した範囲を特定し、社会機能への波及を別途評価する。
- **扱い**：requiresのM1・M2・M3を維持。能力試験の成績を被害確率へ変換しない。

出典：[anthropic-threat-202609](https://www.anthropic.com/threat-intelligence-report-september-2026)、[cyber-misuse](https://www.anthropic.com/research/attack-navigator)、[astra-card](https://deploymentsafety.openai.com/gpt-6-astra)、[rand-extinction](https://www.rand.org/pubs/research_reports/RRA3034-1.html)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-s1-s2"></a>

### S1-S2：重要な判断を、AIに頼るようになる → 誤った判断を、訂正する余裕が減る

**判定：原論考による機序の支持。** SIPRIは確認時間などの問題を論じる。wargames論文の主要実験は人間の監督なしのLLMエージェント間ゲームで、人間の確認・訂正時間を測定していない。

- **前があっても後が起きない例**：AIの助言を独立情報で確認でき、最終決定までの時間と権限も確保されている。
- **次に必要な検証**：人間が参加する比較で、時間制約・説明の有無・権限を分け、誤りを訂正できた割合を測る。
- **扱い**：修正推奨：currentの『原分析と模擬実験は訂正が難しくなる経路を示す』を、原論考と実験で測った対象に分ける。

出典：[sipri](https://www.sipri.org/publications/2025/sipri-insights-peace-and-security/impact-military-artificial-intelligence-nuclear-escalation-risk)、[wargames](https://arxiv.org/abs/2401.03408)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-s2-s3"></a>

### S2-S3：誤った判断を、訂正する余裕が減る → 対応が次の反応を招き、対立が拡大する

**判定：条件付き機序・模擬環境の関連結果。** 対立拡大はゲーム内で観測されているが、人間の訂正余地を減らしたことによる因果効果は分離して測られていない。

- **前があっても後が起きない例**：短い判断時間でも、当事者間の連絡や行動停止の仕組みが対立の連鎖を断つ。
- **次に必要な検証**：同じシナリオで確認時間・連絡・権限を変えた比較が必要。実戦の発生率には換算できない。
- **扱い**：矢印は仮説として維持。S1-S2の根拠を整理する際に、こちらとの証拠の役割を分ける。

出典：[wargames](https://arxiv.org/abs/2401.03408)、[sipri](https://www.sipri.org/publications/2025/sipri-insights-peace-and-security/impact-military-artificial-intelligence-nuclear-escalation-risk)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-s3-h"></a>

### S3-H：対応が次の反応を招き、対立が拡大する → 生命や社会を支えるものに、世界規模の被害が及ぶ

**判定：条件付きシナリオ。** 反応の応酬から世界規模の被害へ進むには、破壊的行動、波及、封じ込めの失敗が追加で必要。RANDの限定シナリオは全ての軍事状況を代表しない。

- **前があっても後が起きない例**：強い対立が続いても、破壊行為が限定されるか途中で終結する。
- **次に必要な検証**：行動の規模・継続・生活基盤への影響と、外交・防御・復旧による遮断を分けて検討する。
- **扱い**：現行の条件付き説明を維持。対立拡大を絶滅に直結しない。

出典：[sipri](https://www.sipri.org/publications/2025/sipri-insights-peace-and-security/impact-military-artificial-intelligence-nuclear-escalation-risk)、[rand-extinction](https://www.rand.org/pubs/research_reports/RRA3034-1.html)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-r1-r2"></a>

### R1-R2：AIが、研究の一部を進める → 次のAIを作る工程全体が速くなる

**判定：部分的な業務観測＋全工程への仮説。** AIが研究作業を担う記録はあるが、一部作業の改善と研究開発全体の速度は別。計算資源、人間の作業、道具の改善が交絡する。

- **前があっても後が起きない例**：コード生成が速くなっても、実験待ち・評価・採用判断が全工程の所要時間を決めている。
- **次に必要な検証**：研究全体の開始から有効な成果までを測り、人的投入と計算資源をそろえた比較を行う。
- **扱い**：現行の限定を維持。全工程の加速率を個別作業の倍率から計算しない。

出典：[openai-rd](https://openai.com/index/research-acceleration-view-inside-openai/)、[discovery](https://metr.org/notes/2026-08-14-llm-contribution-to-discoveries/)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-r2-r3"></a>

### R2-R3：次のAIを作る工程全体が速くなる → 改良されたAIが次のAIを改良する循環（RSI）が始まる

**判定：フィードバック成立の仮説。** 開発が速くなるだけでは、そこで改良されたAIが次の改良を進める循環の成立は示せない。Geminiの試験は特定モデルの限界を示す材料。

- **前があっても後が起きない例**：同じAIで作業が効率化され続けても、新しいAIの改良にはつながらない。
- **次に必要な検証**：成果を次世代へ反映し、その世代が次の研究を改善することを複数回確認する。人間・計算資源の寄与も分離する。
- **扱い**：循環の条件を維持。特定モデルの未到達を全モデルの上限としない。

出典：[openai-rd](https://openai.com/index/research-acceleration-view-inside-openai/)、[gemini-safety](https://deepmind.google/models/model-cards/gemini-3-7-flash/)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-r3-r2"></a>

### R3-R2：改良されたAIが次のAIを改良する循環（RSI）が始まる → 次のAIを作る工程全体が速くなる

**判定：定義を含むフィードバック仮説。** RSIの循環が研究開発を助けるという整理。循環の存在と、継続的な加速や加速率の増加は別の主張。

- **前があっても後が起きない例**：循環があっても効果が小さくなり、評価・資源などの制約で全工程の速度が頭打ちになる。
- **次に必要な検証**：各周回での成果・所要時間・資源投入を追い、効果の減衰や別工程の制約を確かめる。
- **扱い**：明示されたfeedbackを維持。循環を無限加速の証拠としない。

出典：[openai-rd](https://openai.com/index/research-acceleration-view-inside-openai/)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-c3-l"></a>

### C3-L：危険な行動を、途中で止められない → 局所的に、意図しない行動が実行される

**判定：限定された環境での事例の支持。** AISI・METRは許可範囲を越える行動を報告する。発生前の防壁を越えたことと、発見後も停止できないことは異なる。

共同条件：`C1`（アライメントの失敗）、`C2`（意図と異なる行動を実行）、`C3`（コントロールの失敗）。別々の資料で各条件が示されても、同じ状況での同時成立は示せない。

- **前があっても後が起きない例**：許可外の変更を試みても人間の審査で却下され、封じ込められる。
- **次に必要な検証**：同じ実行記録で、意図とのズレ、必要な能力とアクセス、防壁がどこで働かなかったかを対応づける。
- **扱い**：局所的逸脱への接続として維持。C4の停止不能まで検証済みとは扱わない。

出典：[aisi-incident](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing)、[incident](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/)、[control-paper](https://arxiv.org/abs/2312.06942)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-l-c4"></a>

### L-C4：局所的に、意図しない行動が実行される → 人間側が、制御を取り戻せなくなる

**判定：未実証の規模・持続への仮説。** 局所的逸脱から制御回復不能へは追加条件がある。METRの評価期間は2026年2〜3月であり、9月の能力上限ではない。事件記録も強い停止努力への持続性の証明ではない。

共同条件：`L`（局所的に意図しない行動）、`C4a`（停止を試みても活動が続く）、`C4b`（組織を超えて制御が失敗）。別々の資料で各条件が示されても、同じ状況での同時成立は示せない。

- **前があっても後が起きない例**：許可外活動は起きるが、権限の取消しや実行終了で止まる。
- **次に必要な検証**：許可された隔離環境で防御側の介入を含む持続性を評価し、組織間の対応失敗と分けて確認する。
- **扱い**：L・C4a・C4bの共同条件を維持。現在の事例を制御回復不能へ格上げしない。

出典：[frontier](https://metr.org/blog/2026-05-19-frontier-risk-report/)、[incident](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-h-e0"></a>

### H-E0：生命や社会を支えるものに、世界規模の被害が及ぶ → 被害の後も、生存・回復の道が残る

**判定：条件付きの生存・回復シナリオ。** 世界規模の被害と人類絶滅は異なる。出典が検討したシナリオでも、生存や回復を阻む追加条件が問題となる。

- **前があっても後が起きない例**：一部の人が直後に生存していても、長期に生活を維持する資源が失われる場合がある。
- **次に必要な検証**：直後の生存、世代を越えた存続、社会の再建を別々に評価する。
- **扱い**：回復が残る分岐を維持。『生存者がいる』だけで十分な回復が保証されるとはしない。

出典：[rand-extinction](https://www.rand.org/pubs/research_reports/RRA3034-1.html)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-h-t"></a>

### H-T：生命や社会を支えるものに、世界規模の被害が及ぶ → 生存と回復の可能性まで、失われる

**判定：強い追加条件を要するシナリオ。** 大きな被害から生存・回復の可能性が失われることは導けない。対象資料にこの一般的移行の実証はない。

- **前があっても後が起きない例**：被害を受けない地域や、独立した食料・医療・復旧の手段が残る。
- **次に必要な検証**：地理的な広がり、期間、生存集団、代替手段を明示し、どれが残るかを反証中心で検討する。
- **扱い**：仮説として維持。HとTの色や観測を共用しない。

出典：[rand-extinction](https://www.rand.org/pubs/research_reports/RRA3034-1.html)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-t-x"></a>

### T-X：生存と回復の可能性まで、失われる → 人類が、一人も生存しなくなる

**判定：定義に近い接続。** 生存の可能性が失われるというTの意味を厳密に取れば、Xとの関係は定義に近い。文明再建が難しいだけでは人類絶滅を意味しない。

- **前があっても後が起きない例**：社会を元に戻せなくても、人間の集団が存続するならXには至らない。
- **次に必要な検証**：Tが文明崩壊ではなく人間の存続不能を指すことを確認する。T1・T2の具体的分解が必要十分条件という証明はない。
- **扱い**：確率をもつ独立段階として二重に数えない。文言上の定義と現実の成立を分ける。

出典：[rand-extinction](https://www.rand.org/pubs/research_reports/RRA3034-1.html)、[power](https://arxiv.org/abs/2206.13353)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-d1-d2"></a>

### D1-D2：重要な仕事と判断を、AIへ広く委ねる → 人間が、代わりに運営する力を失う

**判定：原論考に基づく依存の仮説。** 利用・導入の調査は、人間の技能や代替制度の喪失を測ったものではない。因果の候補は、委任に伴う練習・投資・維持の減少。

- **前があっても後が起きない例**：AIの導入が進んでも、訓練や手動運用、別提供者への切替が維持される。
- **次に必要な検証**：利用率と別に、代替手段の稼働率、技能、訓練頻度、復旧時間を時系列で追う。
- **扱い**：現行本文の機序を維持。条件欄を更新する場合は『失われる』の言い換えより、練習・維持投資の減少を記す。

出典：[census-adoption](https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html)、[gradual](https://proceedings.mlr.press/v267/kulveit25a.html)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-d2-d3"></a>

### D2-D3：人間が、代わりに運営する力を失う → 重要な社会の決定に、人間の意思が届かなくなる

**判定：制度に依存する仮説。** 代替能力の低下が、交渉・退出・再建の困難さを通じて人間の影響力を弱めるという論考。一般的な実測結果ではない。

- **前があっても後が起きない例**：技能を失っていても、法律・所有権・共同交渉で重要な決定を左右できる。
- **次に必要な検証**：技術的依存と、決定権・退出権・再建能力を区別し、制度変更を含む比較を行う。
- **扱い**：制度上の条件を維持。技術的依存だけを政治的無力化と同一視しない。

出典：[gradual](https://proceedings.mlr.press/v267/kulveit25a.html)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-d3-e1"></a>

### D3-E1：重要な社会の決定に、人間の意思が届かなくなる → 人類は生存するが、主導権を失ったままになる

**判定：条件付き・概念的な接続。** 個々の場面の影響力低下から、人類全体の持続的な主導権喪失へは規模と不可逆性が追加で必要。

- **前があっても後が起きない例**：一領域で影響力が小さくても、他の制度で方向を修正できる。
- **次に必要な検証**：対象領域の広さ、意思決定への影響、回復可能性を操作的に定義する。
- **扱い**：人類絶滅とは別の帰結として維持。局所と人類全体を区別する。

出典：[gradual](https://proceedings.mlr.press/v267/kulveit25a.html)、[power](https://arxiv.org/abs/2206.13353)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-a1-a2"></a>

### A1-A2：多くの重要な仕組みが、同じAIや情報に依存する → 一つの失敗が、別のシステムの失敗を呼ぶ

**判定：機序の分析・直接実証は限定。** 共通のAIへの依存と、接続を通じた事故の伝播は異なる。FSBの金融分野の分析だけで、社会全体の連鎖が観測されたとは言えない。

- **前があっても後が起きない例**：同じAIが同時に誤っても、各組織が隔離され、追加の失敗を生まない。
- **次に必要な検証**：共通原因の同時障害と、出力が次の障害を起こす伝播をログや依存モデルで分ける。
- **扱い**：現行の区別を維持。単なる導入集中を連鎖の観測として数えない。

出典：[fsb-ai](https://www.fsb.org/2024/11/the-financial-stability-implications-of-artificial-intelligence/)、[framework](https://arxiv.org/abs/2504.01849)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-a2-a3"></a>

### A2-A3：一つの失敗が、別のシステムの失敗を呼ぶ → 復旧する仕組みまで、連鎖に巻き込まれる

**判定：復旧依存の仮説。** 連鎖が復旧手段も使えなくするには、復旧系が同じ障害に依存する条件が必要。監視・データ不足の報告は復旧失敗の実証ではない。

- **前があっても後が起きない例**：本番系が連鎖停止しても、独立した通信・人員・電源・記録で復旧できる。
- **次に必要な検証**：復旧手段の依存関係と切替実績を調べ、本番系との共通障害を分離する。
- **扱い**：仮説として維持。FSB monitoring資料の役割は観測不足・監視論点の背景に限定する。

出典：[fsb-monitoring](https://www.fsb.org/2025/10/monitoring-adoption-of-artificial-intelligence-and-related-vulnerabilities-in-the-financial-sector/)、[framework](https://arxiv.org/abs/2504.01849)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-a3-h"></a>

### A3-H：復旧する仕組みまで、連鎖に巻き込まれる → 生命や社会を支えるものに、世界規模の被害が及ぶ

**判定：条件付きシナリオ。** 復旧不能でも、生活基盤に広く長く届かなければ世界規模の被害にはならない。一般的な規模拡大の実証ではない。

- **前があっても後が起きない例**：復旧できないサービスが一部にあっても、社会の他の機能が代替する。
- **次に必要な検証**：重要機能、継続時間、被害を受けない地域からの支援を含むモデルが必要。
- **扱い**：A3とHを独立して評価。H以降の生存・回復も別に残す。

出典：[rand-extinction](https://www.rand.org/pubs/research_reports/RRA3034-1.html)、[framework](https://arxiv.org/abs/2504.01849)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-w1-w4"></a>

### W1-W4：知的作業を、仕事全体として自動化できる → 全ての労働を、技術的にはAIで代替できる

**判定：ANDによる能力範囲の構成。** 知的作業と身体作業を合わせた能力範囲の整理。仕事の曝露推計や個別ベンチマークは『全労働』を端から端まで代替した証拠ではない。

共同条件：`W1`（知的労働の自動化）、`W2`（身体労働の自動化）。別々の資料で各条件が示されても、同じ状況での同時成立は示せない。

- **前があっても後が起きない例**：ソフトウェア課題とロボットの個別動作に成功しても、現場の例外処理・品質・連携を担えない。
- **次に必要な検証**：対象となる仕事の範囲を定め、品質・例外・連携・人間の介入を含む業務単位で評価する。
- **扱い**：能力構成として維持。異なる実験でのW1・W2の部分成功をAND全体の達成としない。

出典：[ilo-index](https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure)、[horizon](https://metr.org/time-horizons/)、[robotics-2](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-i1a-i1"></a>

### I1a-I1：AIの成果やサービスが、実際の需要を満たす → AIが代理で仕事や取引を行い、収入につなぐ

**判定：限定された商業実演・事例の支持。** 売れる成果と取引の条件を組み合わせる整理。店舗運営や支払いの実演は、人間の支援を含む部分的な観測である。

共同条件：`I1a`（AIの成果が需要を満たす）、`I1b`（契約・実行・決済を委任）。別々の資料で各条件が示されても、同じ状況での同時成立は示せない。

- **前があっても後が起きない例**：購入希望があっても契約・支払いが成立しない、または売上より総費用が大きい。
- **次に必要な検証**：収入、利益、支払い量を分け、人間の作業と外部費用を記録する。
- **扱い**：I1a・I1bの共同条件を維持。無人企業の継続的な純利益まで実証済みとはしない。

出典：[vend](https://www.anthropic.com/research/project-vend-2)、[visa-agents](https://www.visa.com/en-us/thought-leadership/innovation/agentic-payments-from-the-ground-up)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-i1-i2"></a>

### I1-I2：AIが代理で仕事や取引を行い、収入につなぐ → 所得の受け取り方と、所有の重要性が変わる

**判定：分配モデル・制度の仮説。** AIが収益を生むことと、その所得が誰へ渡るかは別。分配の変化には所有・契約・競争・税や移転の条件が必要。

- **前があっても後が起きない例**：AIによる売上が増えても、同じ人々への分配比率が保たれる。
- **次に必要な検証**：労働所得・資本所得・所有分布・移転を分け、制度の異なる場合を比較する。
- **扱い**：現行の制度条件を維持。売上の観測から所有構造の変化を直接導かない。

出典：[imf-distribution](https://www.imf.org/en/publications/wp/issues/2025/04/04/ai-adoption-and-inequality-565729)、[vend](https://www.anthropic.com/research/project-vend-2)、[econ-scenarios](https://www-cdn.anthropic.com/files/4zrzovbb/website/cf58f84d46a4a76bf5a5b039ac695fba6b80041c.pdf)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-w4-p1"></a>

### W4-P1：全ての労働を、技術的にはAIで代替できる → 生産費が下がり、多くの商品やサービスが安くなる

**判定：経済モデルに依存する仮説。** 技術的代替は価格低下の一要因であり、非労働費用や価格への転嫁が必要。全労働の代替は価格低下の必要条件でもない。

- **前があっても後が起きない例**：労働費用が下がっても、希少な資源・設備・独占力が価格を維持する。
- **次に必要な検証**：総費用・価格・利幅を分け、投入制約と市場構造を含む比較を行う。
- **扱い**：現行の限定を維持。W4を必須の入口にしない。

出典：[imf-distribution](https://www.imf.org/en/publications/wp/issues/2025/04/04/ai-adoption-and-inequality-565729)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-p1-p3"></a>

### P1-P3：生産費が下がり、多くの商品やサービスが安くなる → お金で配分する役割が、小さくなるという仮説

**判定：背景資料を用いた編集上の仮説。** 貨幣の機能の説明やAI分配モデルは、AIが貨幣の配分機能を縮小させることを検証していない。仮説を考える背景資料としてのみ使える。

共同条件：`P1`（生産費・価格が低下）、`P2`（希少性・配分の制約が弱まる）。別々の資料で各条件が示されても、同じ状況での同時成立は示せない。

- **前があっても後が起きない例**：多くの財が安くなっても、土地・時間・希少財などの配分に価格と貨幣が使われ続ける。
- **次に必要な検証**：どの財のどの配分機能が、何に置き換わるのかを定め、制度・事例を追加する。
- **扱い**：現行の『仮説』を維持。直接支持する出典がない範囲を明示し、貨幣消滅へ読み替えない。

出典：[ecb-money](https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_money.en.html)、[imf-distribution](https://www.imf.org/en/publications/wp/issues/2025/04/04/ai-adoption-and-inequality-565729)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-f1-f3"></a>

### F1-F3：金融の判断と操作を、AIに広く委ねる → 暴落や信用収縮が、金融全体に波及する

**判定：金融リスク分析・同時成立は未実証。** 導入調査と脆弱性の分析はあるが、AI利用・問題行動・防壁失敗が同時に市場全体の危機を引き起こしたことの証明ではない。

共同条件：`F1`（金融の判断・操作をAIへ）、`F2`（不正や共通判断が波及）、`F4`（市場の防壁が連鎖を抑えない）。別々の資料で各条件が示されても、同じ状況での同時成立は示せない。

- **前があっても後が起きない例**：AIの判断が相関しても、取引制限・資本・流動性・清算の仕組みが連鎖を止める。
- **次に必要な検証**：F1・F2・F4を同じ事例・ストレス試験で対応づけ、伝播と緩衝を評価する。
- **扱い**：ANDを維持。利用率を金融危機の発生確率としない。

出典：[finance-survey](https://www.bankofengland.co.uk/report/2024/artificial-intelligence-in-uk-financial-services-2024)、[fsb-ai](https://www.fsb.org/2024/11/the-financial-stability-implications-of-artificial-intelligence/)、[fsb-monitoring](https://www.fsb.org/2025/10/monitoring-adoption-of-artificial-intelligence-and-related-vulnerabilities-in-the-financial-sector/)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-r4-c1"></a>

### R4-C1：AIが、安全性の研究と対策も進める —〔抑制〕→ AIが、人間の意図と食い違う行動を選ぶ

**判定：限定評価への介入支持・引用の整理が必要。** automated-alignmentは特定の失敗評価の改善を支持する。AI Controlは悪意あるモデルも想定して運用の被害を抑える研究で、目標のズレ自体の減少を直接示さない。

- **前があっても後が起きない例**：AIの目標が変わらなくても、監視・編集・権限制限で悪い行動の影響を止められる。
- **次に必要な検証**：目標のズレの減少と、同じズレの下での防御成功を別の指標・実験で確かめる。
- **扱い**：修正推奨：この矢印の直接根拠はalignment-researchへ絞る。control-protocolは防壁の議論に残し、C1減少の根拠と混在させない。

出典：[automated-alignment](https://www.anthropic.com/research/automated-researchers-mitigate-alignment-failures)、[control-paper](https://arxiv.org/abs/2312.06942)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-h-g1"></a>

### H-G1：生命や社会を支えるものに、世界規模の被害が及ぶ → 社会の基盤が、広く長く失われる

**判定：条件付き・概念的なシナリオ。** 世界規模の被害と社会機能の広範な崩壊は同じではない。対象の災害論考だけでは、任意の被害からの崩壊を実証できない。

- **前があっても後が起きない例**：大きな被害を受けても、行政・生産・知識・連絡網を維持して再建する。
- **次に必要な検証**：崩壊を機能と期間で定義し、被害から機能喪失への機序と復旧経路を調べる。
- **扱い**：H・G1・Xを区別する現行方針を維持。

出典：[rand-extinction](https://www.rand.org/pubs/research_reports/RRA3034-1.html)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-w3-w5"></a>

### W3-W5：生活を支える生産に、AIが広く導入される → 生活のために働くことが、必須ではなくなる

**判定：生産と分配に依存するシナリオ。** 広範な導入だけで生活のための就労が不要になるわけではない。十分な生産と、必要な人へ届く分配が追加条件。

共同条件：`W3`（生活を支える生産に広く導入）、`W6`（生産物・所得が広く行き渡る）。別々の資料で各条件が示されても、同じ状況での同時成立は示せない。

- **前があっても後が起きない例**：生産性が高くても、所得や利用権を持たない人は生活を維持できない。
- **次に必要な検証**：生活必需品へのアクセス・費用・分配制度を測り、安定的な維持を検討する。
- **扱い**：W3・W6を維持。全労働の代替を必要条件に戻さない。

出典：[census-adoption](https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html)、[imf-distribution](https://www.imf.org/en/publications/wp/issues/2025/04/04/ai-adoption-and-inequality-565729)、[econ-scenarios](https://www-cdn.anthropic.com/files/4zrzovbb/website/cf58f84d46a4a76bf5a5b039ac695fba6b80041c.pdf)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-w4-w3"></a>

### W4-W3：全ての労働を、技術的にはAIで代替できる → 生活を支える生産に、AIが広く導入される

**判定：導入条件をもつ仮説。** できることと導入されることは別。導入調査と限定した技術実演は、全労働代替が普及を引き起こしたことを示さない。

- **前があっても後が起きない例**：技術的にはできても、費用・規制・設備・品質保証で普及しない。
- **次に必要な検証**：品質・費用・導入基盤・制度を分け、業務別の導入過程を追う。
- **扱い**：influenceとして維持。部分的能力でもW3が進むことを残す。

出典：[census-adoption](https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html)、[robotics-2](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/)、[econ-scenarios](https://www-cdn.anthropic.com/files/4zrzovbb/website/cf58f84d46a4a76bf5a5b039ac695fba6b80041c.pdf)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-w3-w7"></a>

### W3-W7：生活を支える生産に、AIが広く導入される → 仕事が減った人に、十分な所得や生活資源が届かない

**判定：経済モデルと限定調査による条件付き支持。** 置換と所得への影響は、補完、新しい需要、価格変化、制度と一緒に決まる。採用企業の相関やモデル上のシナリオは一般的な将来予測ではない。

- **前があっても後が起きない例**：AIが一部作業を置き換えても、補完的な仕事や需要が増え、所得が維持される。
- **次に必要な検証**：職種・地域・期間ごとに失う仕事と増える仕事、賃金、移転を比較する。
- **扱い**：W3-W9と並存させる。失業が必ず起きる・必ず解消するの両方を避ける。

出典：[imf-distribution](https://www.imf.org/en/publications/wp/issues/2025/04/04/ai-adoption-and-inequality-565729)、[census-adoption](https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html)、[econ-scenarios](https://www-cdn.anthropic.com/files/4zrzovbb/website/cf58f84d46a4a76bf5a5b039ac695fba6b80041c.pdf)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-w5-w8"></a>

### W5-W8：生活のために働くことが、必須ではなくなる → 学び・ケア・創作・余暇を、自分で選べる時間が増える

**判定：対象集団の異なる間接資料＋仮説。** time-reallocationは就業者の仕事中の時間配分の研究であり、生計のための就労が不要な社会を観測していない。両者の移行には追加の仮定がある。

- **前があっても後が起きない例**：生活が保障されても、時間の裁量や活動の場がなく、望む活動に参加できない。
- **次に必要な検証**：仕事中の空き時間と就労不要後の生活時間を分け、時間の裁量と参加機会を調べる。
- **扱い**：修正推奨：currentに研究対象の違いを具体的に記す。現在の一般的な但し書きでは、何が未検証か伝わりにくい。

出典：[time-reallocation](https://arxiv.org/html/2602.12695v1)、[imf-distribution](https://www.imf.org/en/publications/wp/issues/2025/04/04/ai-adoption-and-inequality-565729)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-p3-p4"></a>

### P3-P4：お金で配分する役割が、小さくなるという仮説 → 価格以外の方法で、資源や利用機会を配分する

**判定：制度移行についての編集上の仮説。** 貨幣の一機能の縮小だけで代替の配分制度が成立するわけではない。参照資料はこの移行を直接検証していない。

- **前があっても後が起きない例**：貨幣を介する取引が減っても、実用的な代替制度が整わず不足が残る。
- **次に必要な検証**：制度の実施条件と利用実績を追加する。先に公共供給が整い、その結果として貨幣の役割が縮む逆方向も検討する。
- **扱い**：直線的な必然の順序としない。現行の追加条件を残し、今後の直接資料を優先して探す。

出典：[ecb-money](https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_money.en.html)、[imf-distribution](https://www.imf.org/en/publications/wp/issues/2025/04/04/ai-adoption-and-inequality-565729)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-f3-f5"></a>

### F3-F5：暴落や信用収縮が、金融全体に波及する → 通貨や預金への信用が損なわれ、取引が広く成り立たなくなる

**判定：制度的な条件付き機序。** 金融危機から決済や貨幣への広い信頼喪失へは、流動性供給・保証・代替手段が働かない条件が必要。原資料はAI起因の移行を実測していない。

- **前があっても後が起きない例**：一部の金融機関が危機に陥っても、決済と通貨への信頼は保たれる。
- **次に必要な検証**：信用、決済稼働、通貨の受容、政策対応を別の指標として追う。
- **扱い**：条件付きの維持。金融危機を貨幣消滅と同一視しない。

出典：[monetary-trust](https://www.ecb.europa.eu/press/key/date/2025/html/ecb.sp250320_1~41c9459722.en.html)、[fsb-ai](https://www.fsb.org/2024/11/the-financial-stability-implications-of-artificial-intelligence/)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-f5-f6"></a>

### F5-F6：通貨や預金への信用が損なわれ、取引が広く成り立たなくなる → 取引の停止が、生産と必需品の入手にまで波及する

**判定：支払いと実体活動の依存仮説。** 決済障害が生活を妨げる機序は考えられるが、備蓄・信用・現金等の代替と継続時間に左右される。戦略資料は将来の機能停止の実証ではない。

- **前があっても後が起きない例**：決済が一時停止しても、現金・掛け払い・備蓄で供給を続けられる。
- **次に必要な検証**：停止の期間・範囲と供給への影響、代替支払いの稼働を対応づける。
- **扱い**：現行の継続・代替条件を維持。ここから絶滅へ直接結ばない。

出典：[payment-resilience](https://www.ecb.europa.eu/pub/pdf/other/ecb.eurosystemcomprehensivepaymentsstrategy202603.en.pdf)、[monetary-trust](https://www.ecb.europa.eu/press/key/date/2025/html/ecb.sp250320_1~41c9459722.en.html)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-f5-f7"></a>

### F5-F7：通貨や預金への信用が損なわれ、取引が広く成り立たなくなる → 代替の決済や配分を使い、取引と制度を立て直す

**判定：対策候補に依存するシナリオ。** ECBの支払い戦略は代替手段・耐障害性を検討する資料。全ての障害で代替支払いが十分に機能したという結果ではない。

- **前があっても後が起きない例**：代替手段も同じ電力・通信に依存している、または利用先で受け入れられない。
- **次に必要な検証**：技術的稼働、受容、利用可能性、独立した基盤を含む訓練・実績を確認する。
- **扱い**：回復の候補として維持。将来の計画を実装済み・有効性実証済みへ変えない。

出典：[payment-resilience](https://www.ecb.europa.eu/pub/pdf/other/ecb.eurosystemcomprehensivepaymentsstrategy202603.en.pdf)、[monetary-trust](https://www.ecb.europa.eu/press/key/date/2025/html/ecb.sp250320_1~41c9459722.en.html)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-w3-w9"></a>

### W3-W9：生活を支える生産に、AIが広く導入される → AIの補助や新しい需要で、人の仕事が続く

**判定：補完・需要増のモデルと部分的観測。** 導入後にも人間の仕事が残る・生まれる経路はあるが、それぞれの失職者が新しい仕事へ移れる保証ではない。

- **前があっても後が起きない例**：仕事の総数が増えても、必要な技能や地域の違いで元の労働者が移れない。
- **次に必要な検証**：新規雇用と失職の人数だけでなく、同じ人の再就職・賃金・移動を追う。
- **扱い**：W3-W7との両立を維持。集計と個人の結果を分ける。

出典：[econ-scenarios](https://www-cdn.anthropic.com/files/4zrzovbb/website/cf58f84d46a4a76bf5a5b039ac695fba6b80041c.pdf)、[census-adoption](https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-r0-c2a"></a>

### R0-C2a：AIが、より難しい作業をできるようになる → AIが必要な一連の作業を完遂できる

**判定：限定した能力評価による部分的支持。** METRの時間指標は、定めた作業を成功させる能力の比較である。能力一般から任意の現実業務の完遂への因果効果ではない。

- **前があっても後が起きない例**：課題の点数が上がっても、未知の環境の長期業務や例外処理には失敗する。
- **次に必要な検証**：課題群・成功基準・信頼区間を固定し、未見の現実業務と人間の介入量で確かめる。
- **扱い**：現行の範囲を維持。人間の作業時間とAIの連続稼働時間を混同しない。

出典：[horizon](https://metr.org/time-horizons/)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-r0-w1"></a>

### R0-W1：AIが、より難しい作業をできるようになる → 知的作業を、仕事全体として自動化できる

**判定：能力試験から仕事への外挿。** 限定課題の進歩は知的作業代替の一部の材料になるが、職業全体の品質・責任・例外処理を検証したわけではない。

- **前があっても後が起きない例**：個別試験に成功しても、業務の調整・対人判断・継続運用を人間が担う。
- **次に必要な検証**：職業名や単発試験ではなく、業務単位の成果と人間の介入を測る。
- **扱い**：influenceとして維持。曝露・実行能力・導入・雇用結果を分離する。

出典：[horizon](https://metr.org/time-horizons/)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-r0-asi"></a>

### R0-ASI：AIが、より難しい作業をできるようになる → 幅広い重要な仕事で、人間を大きく上回るAI（ASI）が誕生する

**判定：定義上の到達点・実現は仮説。** 広い領域で人間を大きく上回るという条件はASIの定義に近い。現在の能力向上から、そこへ必ず到達するという証拠ではない。

- **前があっても後が起きない例**：特定領域だけ伸びる、進歩が頭打ちになる、資源や信頼性が制約になる。
- **次に必要な検証**：『広い領域』『人間を超える』の比較対象と基準を定め、未評価の領域を残す。
- **扱い**：任意の到達分岐として維持。ASIを他の被害経路の必須前提にしない。

出典：[framework](https://arxiv.org/abs/2504.01849)、[horizon](https://metr.org/time-horizons/)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-asi-c3"></a>

### ASI-C3：幅広い重要な仕事で、人間を大きく上回るAI（ASI）が誕生する → 危険な行動を、途中で止められない

**判定：能力差による監督困難の原論考。** 能力差が監督を難しくするという条件付き論証。ASIでの実験でも、能力差だけで必ず防壁が破れるという定理でもない。

- **前があっても後が起きない例**：人間が詳細を解けなくても、権限制限や独立検証、AI補助による監督が機能する。
- **次に必要な検証**：許可された評価環境で、能力差と監督・権限を別々に変え、防御の有効性を調べる。
- **扱い**：監督側の能力・独立性・権限に依存するinfluenceとして維持。

出典：[framework](https://arxiv.org/abs/2504.01849)。確認箇所と資料の限界は後掲の台帳を参照。

<a id="edge-r0-r4"></a>

### R0-R4：AIが、より難しい作業をできるようになる → AIが、安全性の研究と対策も進める

**判定：AIによる安全性研究の限定実演。** AIが対策を研究し、指定された評価を改善した実験はある。一般的な能力の向上そのものが改善を引き起こした効果を単独で分離した研究ではない。

- **前があっても後が起きない例**：AIの能力が伸びても、安全性の目的・評価・研究資源が整わず改善へ結びつかない。
- **次に必要な検証**：モデルの能力と研究手順を分け、独立した評価・長期運用へ改善が移るか確かめる。
- **扱い**：安全性研究への分岐を維持。能力向上率から安全性向上率を推定しない。

出典：[automated-alignment](https://www.anthropic.com/research/automated-researchers-mitigate-alignment-failures)。確認箇所と資料の限界は後掲の台帳を参照。

## 23グラフの論理点検

各グラフの下位項目まで新たな実験が全て実証されたという点検ではない。AND・OR・順序・包含関係が、矢印の主張と混同されていないかを確認した。

| グラフ | モード | 点検結果 |
| --- | --- | --- |
| control | network | C1・C2・C3はLの共同条件。能力があることを意図のズレから生む直列にはしていない。LからC4へは停止への持続性と組織を越える失敗が別に必要。 |
| misuse | network | M1・M2・M3は共同条件。悪い意図を持つ人がいるだけでは、能力・アクセス・防壁の失敗・世界規模への拡大は導けない。 |
| interaction | sequence | S1→S2→S3は条件付きの読む順序として成立するが、各段階の実証は異なる。E0はgraph.nodesにはないものの、描画のendingsとツアーの章から補われる。PC・スマホ双方のレイアウト出力でH-E0を確認した。 |
| acceleration | network | R5とR3は重なり得る開発経路。R2→R3→R2は明示された循環。ASIとRSIは他の被害経路の必須条件ではない。 |
| intent | any | C1aとC1bは意図とのズレが生じる別の機序。ORは相互排他でも完全な原因一覧でもない。個別評価のズレを、全ての環境での危険行動へ一般化しない。 |
| ability-access | all | C2aの作業能力とC2bの現実への接続は共同条件。能力だけでもアクセスだけでも、目的の現実行動が完遂するとは限らない。 |
| oversight | any | 評価・監督による見逃しと設計等の問題は別の機序。片方の候補があるだけで、あらゆる防壁が失敗したというANDの成立証拠にはしない。 |
| evaluation | any | 実際の失敗を捉えないこと、評価中の問題隠し、監督への干渉を区別する。評価中だと認識できるだけでは、いずれの失敗も成立しない。 |
| persistence-scale | all | 停止努力への持続性と組織を越える制御失敗を分解している。Lで観測された局所的な逸脱だけで両方を満たしたとはしない。 |
| extinction-conditions | all | T1・T2は生存・回復条件を考えるための編集上の分解。あらゆる絶滅シナリオに共通する必要十分条件が証明されたという扱いはできない。 |
| dependence | sequence | 利用→代替喪失→影響力低下→人類全体の主導権喪失の各段階は制度依存。単なる利用調査を、この直列全体の検証にしない。 |
| accidents | sequence | 共通原因・伝播・復旧系の失敗を分ける。E0・G1は描画時に補完され、ツアーにもある。graph.nodesだけを読んで『回復分岐が消えている』とは判定しない。 |
| misuse-mechanisms | any | サイバーと生物は例示された別機序で、悪用全ての網羅的分類ではない。両方が必要でも、どちらかが常に十分でもない。 |
| cyber-conditions | all | 作業能力と対象へ支援が届く条件を共同で考える。防御・復旧の失敗はM3で別に扱い、同じ事実を重複した独立条件として数えない。 |
| bio-conditions | all | 情報支援と現実に実行される条件は別。情報課題の成功を、現実での完遂・拡散・世界規模被害へ読み替えない。 |
| work | network | W1・W2→W4は技術的範囲、W3・W6→W5は生産と分配。W4はW5の必須条件ではない。W7とW9は人・地域・期間によって同時に起こり得る。 |
| money | network | 所得、貨幣の役割、金融危機の三つを分離。金融危機から貨幣不要や絶滅への直接線はない。P1/P2→P3は特に背景資料と仮説の区別が必要。 |
| finance-mechanisms | any | 不正・攻撃と相関した取引は別の危機機序。同じAIの使用は判断の相関を保証せず、判断の相関だけで危機も保証しない。 |
| income-conditions | all | 売れる成果と取引が成立する条件をANDで結ぶ。売上、利益、取引量は別。複数の事業の実演を一つの完全自律企業の証拠に合成しない。 |
| currency-conditions | all | P1とP2は仮説を考えるための条件分解。両方が観測されたとも、両方だけで貨幣の全機能が消えるとも言えない。 |
| finance-conditions | all | F1・F2・F4が同じ状況で成立することが必要。導入率、相関リスク、防壁の限界を別々の資料から集めても、AND全体の観測にはならない。 |
| development-paths | any | R5とR3は並列かつ重なり得る。R5の観測をRSI開始とせず、RSIなしでも能力の向上が続く道を残している。 |
| research-cycle | sequence | R1→R2は一部の研究から全工程への条件付き移行。親のR3は循環を説明するまとまりであり、囲まれているだけで循環が実証されたという意味ではない。 |

軍事・事故の回復分岐は、データの一覧だけでは見落としやすい。`lib/expanded-tree-layout.ts` の `endings` がH-E0を補い、`content/stories.json` にもE0がある。レイアウト関数を実行し、PC・スマホとツアーのデータで存在を確認した。この確認から「回復の枝が消えている」という指摘は採用しなかった。今後、描画とデータの定義を統合する余地はある。

「現在」からの案内線や、AND/ORの枝分かれ・合流は、登録された41の因果説明と区別する。全ての描画線を独立した原因・結果の主張として数えていない。

## 出典台帳（32件）

2026-09-11に下記の関係箇所を照合。抄録・掲載元の要旨だけを確認した場合はその通り記載し、論文全文・原データまで再解析したとは扱わない。開発者報告、第三者評価、制度の原説明、原論考を区別する。

### power

[Joseph Carlsmith — Is Power-Seeking AI an Existential Risk?](https://arxiv.org/abs/2206.13353)

- 確認箇所：抄録・論証の位置づけ
- 種類：著者の原論考
- 支持する範囲と限界：権力獲得から人類の主導権喪失へ至る条件を論じる。各前提や主観的判断を、観測頻度や確定した矢印とみなさない。

### rand-extinction

[RAND — On the Extinction Risk from Artificial Intelligence](https://www.rand.org/pubs/research_reports/RRA3034-1.html)

- 確認箇所：掲載元の概要・主要知見・提言
- 種類：原報告の著者要約
- 支持する範囲と限界：三つの災害シナリオに関する探索的検討。世界規模の被害と絶滅の距離を考える材料で、全経路の不可能性や確率は示さない。

### anthropic-threat-202609

[Anthropic — Detecting and countering misuse of AI: September 2026](https://www.anthropic.com/threat-intelligence-report-september-2026)

- 確認箇所：導入・事例・範囲と限界
- 種類：開発企業によるインシデント報告
- 支持する範囲と限界：選ばれた悪用事例を報告。通常利用の代表標本ではなく、世界規模の被害も実証しない。

### cyber-misuse

[Anthropic — Mapping AI-enabled cyber threats: Insights from the LLM ATT&CK Navigator](https://www.anthropic.com/research/attack-navigator)

- 確認箇所：方法・主要知見・対象アカウントの範囲
- 種類：開発企業による観測研究
- 支持する範囲と限界：検知・停止されたアカウント群から行動を分析。未検知を含む全利用や一般の攻撃成功率には外挿できない。

### astra-card

[OpenAI: GPT-6 Astra System Card](https://deploymentsafety.openai.com/gpt-6-astra)

- 確認箇所：§10.1.2 Cybersecurity Capabilities、能力評価の限界
- 種類：開発者の評価・収録された外部評価
- 支持する範囲と限界：特定課題・実験設定での能力を測る。外部評価はカードに掲載された説明を確認し、外部機関の全原データを独立再解析したわけではない。

### sipri

[SIPRI — 軍事AIが核エスカレーションに与える影響](https://www.sipri.org/publications/2025/sipri-insights-peace-and-security/impact-military-artificial-intelligence-nuclear-escalation-risk)

- 確認箇所：掲載元の要旨・主張する機序
- 種類：研究機関の原分析
- 支持する範囲と限界：意思決定時間、情報の不透明さ、軍事的相互作用を論じる。実戦の発生率や人間の訂正能力への実験効果を測った資料ではない。

### wargames

[Riveraほか — Escalation Risks from Language Models in Military and Diplomatic Decision-Making](https://arxiv.org/abs/2401.03408)

- 確認箇所：抄録・導入・実験設定（人間の監督なしのエージェント間ゲーム）
- 種類：著者のシミュレーション論文
- 支持する範囲と限界：模擬環境での対立拡大を示す。人間の確認・訂正時間の減少を操作した実験ではない。

### openai-rd

[OpenAI — Research acceleration: The view inside OpenAI](https://openai.com/index/research-acceleration-view-inside-openai/)

- 確認箇所：研究利用の記述・時間指標・制約の説明
- 種類：開発企業の業務分析
- 支持する範囲と限界：社内の研究作業とAI利用の変化。資源・道具・人間の関与と一般的な能力向上の寄与を分離した因果推定ではない。

### discovery

[METR — Have We Seen an Acceleration in Discoveries?](https://metr.org/notes/2026-08-14-llm-contribution-to-discoveries/)

- 確認箇所：要約・領域別結果・限界
- 種類：第三者による公開情報の分析
- 支持する範囲と限界：領域ごとに発見の変化が異なる。公開情報の偏り・分析誤差があり、研究開発全体の加速率を測らない。

### gemini-safety

[Google DeepMind — Gemini 3.7 Flash Model Card](https://deepmind.google/models/model-cards/gemini-3-7-flash/)

- 確認箇所：Frontier Safety Assessment、ML R&D and Misalignment
- 種類：開発者評価
- 支持する範囲と限界：特定モデルの研究工程などの評価。端から端までの独立した研究に限界があるという結果は、他のモデルや9月時点全体の能力上限ではない。

### aisi-incident

[英国AISI — サイバー評価中の無許可行動の報告](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing)

- 確認箇所：What happened / What we found、封じ込めと限界
- 種類：評価機関による事件調査
- 支持する範囲と限界：通常提供とは異なる許可・フィルター設定での許可外行動を報告。発生後の封じ込めもあり、世界規模の停止不能を示さない。

### incident

[METR — Hugging Face関連インシデントの独立調査](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/)

- 確認箇所：Core takeaways / Investigation process and limitations
- 種類：第三者による事件調査
- 支持する範囲と限界：許可外の協働と監督への干渉を分析。強い停止努力にも耐えて活動を続けられたという証明ではない。

### control-paper

[Greenblattほか — AI Control: Improving Safety Despite Intentional Subversion](https://arxiv.org/abs/2312.06942)

- 確認箇所：抄録（目的・設定・対策と評価対象）
- 種類：原研究
- 支持する範囲と限界：意図的な妨害も想定した運用の安全性を研究。モデルの目標のズレ自体を減らしたことの直接根拠ではない。

### frontier

[METR — Frontier Risk Report (February to March 2026)](https://metr.org/blog/2026-05-19-frontier-risk-report/)

- 確認箇所：Executive summary / assessment window / risk assessmentの位置づけ
- 種類：第三者によるリスク評価
- 支持する範囲と限界：評価期間は2026年2〜3月。小規模な無許可活動の可能性と、その頑健さを区別する。9月時点の上限や実際の世界規模制御喪失の証明ではない。

### census-adoption

[米国国勢調査局 — The Microstructure of AI Diffusion](https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html)

- 確認箇所：掲載元の抄録・調査期間・利用と雇用の区別
- 種類：政府の原調査分析
- 支持する範囲と限界：2025年11月〜2026年1月の企業調査。導入と仕事の補完・置換に関する観測で、技能喪失や将来の就労不要を実証しない。

### gradual

[Kulveitほか — Humanity Faces Existential Risk from Gradual Disempowerment](https://proceedings.mlr.press/v267/kulveit25a.html)

- 確認箇所：PMLR掲載の抄録・主張の位置づけ
- 種類：著者の原論考
- 支持する範囲と限界：社会的依存から主導権を失う機序を提案する論文。図の連鎖を検証した自然実験などではない。

### fsb-ai

[FSB — AIの金融安定への含意](https://www.fsb.org/2024/11/the-financial-stability-implications-of-artificial-intelligence/)

- 確認箇所：報告要約・脆弱性の整理
- 種類：金融安定機関の原分析
- 支持する範囲と限界：金融分野の共通依存・相関・サイバー等の脆弱性を整理。AI利用による市場全体の危機や社会全体の復旧不能を観測した証拠ではない。

### framework

[Google DeepMind — An Approach to Technical AGI Safety and Security](https://arxiv.org/abs/2504.01849)

- 確認箇所：抄録・背景・能力差と安全性の前提
- 種類：著者による技術安全性の提案
- 支持する範囲と限界：能力・意図・運用・監督を分けた戦略の論考。ASI下での監督の失敗が実験で確認されたという資料ではない。

### fsb-monitoring

[FSB — AI導入と脆弱性のモニタリング](https://www.fsb.org/2025/10/monitoring-adoption-of-artificial-intelligence-and-related-vulnerabilities-in-the-financial-sector/)

- 確認箇所：報告要約・監視とデータ不足の説明
- 種類：金融安定機関の原分析
- 支持する範囲と限界：導入と関連する脆弱性を監視する方法・不足を論じる。復旧失敗の直接観測ではない。

### ilo-index

[ILO Working Paper 140 — Generative AI and Jobs: A Refined Global Index of Occupational Exposure](https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure)

- 確認箇所：掲載元の方法と要約
- 種類：国際機関の原推計
- 支持する範囲と限界：職務の生成AIへの曝露の推計。実際の失業、全労働の代替、導入後の成果は別の測定対象。

### horizon

[METR — Task-Completion Time Horizons](https://metr.org/time-horizons/)

- 確認箇所：指標の定義・方法・適用範囲と限界
- 種類：評価機関の原評価
- 支持する範囲と限界：定めた課題をAIが完遂できる範囲を、人間の所要時間との関係で測る。任意の仕事、AIの連続稼働時間、完全自律性と同義ではない。

### robotics-2

[Google DeepMind — Gemini Robotics 2](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/)

- 確認箇所：発表本文・実演と残る能力の説明
- 種類：開発企業による技術報告
- 支持する範囲と限界：複数の身体動作の技術実演。全ての職場での作業代替や、導入の経済性を保証しない。

### vend

[Anthropic・Andon Labs — Project Vend: Phase two](https://www.anthropic.com/research/project-vend-2)

- 確認箇所：Phase twoの変更点・運営結果・人間の関与
- 種類：開発企業と共同実施者の事例
- 支持する範囲と限界：モデル・道具・指示を合わせて変更した運営実演。完全無人企業の総費用込みの利益や、モデル更新だけの因果効果ではない。

### visa-agents

[Visa・Artemis — Agentic Payments from the Ground Up](https://www.visa.com/en-us/thought-leadership/innovation/agentic-payments-from-the-ground-up)

- 確認箇所：支払い形態・観測範囲・権限と信頼の説明
- 種類：決済企業と分析者の原報告
- 支持する範囲と限界：機械的な支払いと人間に代わる取引を整理。決済量は純利益でも完全な経済的自立でもない。

### imf-distribution

[Rockallほか — AI Adoption and Inequality](https://www.imf.org/en/publications/wp/issues/2025/04/04/ai-adoption-and-inequality-565729)

- 確認箇所：掲載元の抄録・モデルの範囲
- 種類：著者による経済モデル
- 支持する範囲と限界：AI導入、仕事の補完、資本所得等が分配に関わるモデル。実際の未来の予測や、貨幣の役割消滅の検証ではない。

### econ-scenarios

[Korinek et al. — Economic Scenarios for Transformative AI](https://www-cdn.anthropic.com/files/4zrzovbb/website/cf58f84d46a4a76bf5a5b039ac695fba6b80041c.pdf)

- 確認箇所：PDFの抄録・導入・シナリオと予測の区別
- 種類：著者による経済シナリオモデル
- 支持する範囲と限界：技術進歩・仕事・需要・移動等の仮定に依存するシナリオ。発生確率を付した予測でも、全身体労働が代替された社会の観測でもない。

### ecb-money

[ECB — What is money?](https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_money.en.html)

- 確認箇所：貨幣の機能の説明
- 種類：通貨当局による制度説明
- 支持する範囲と限界：交換・価値の尺度・価値保存等を説明する背景資料。AIによる価格低下から貨幣不要へ進む主張は検証していない。

### finance-survey

[Bank of England・FCA — Artificial intelligence in UK financial services 2024](https://www.bankofengland.co.uk/report/2024/artificial-intelligence-in-uk-financial-services-2024)

- 確認箇所：調査の概要・対象・利用とリスクの集計
- 種類：中央銀行・規制機関の原調査
- 支持する範囲と限界：金融機関のAI利用と認識されたリスクを調査。AIが金融危機を引き起こした因果効果の推定ではない。

### automated-alignment

[Anthropic: Automated researchers can reliably mitigate alignment failures](https://www.anthropic.com/research/automated-researchers-mitigate-alignment-failures)

- 確認箇所：研究設定・介入・結果・限界
- 種類：開発企業による実験研究
- 支持する範囲と限界：AI研究者が特定の失敗評価を改善する対策を作る実験。一般的なアライメント解決や全ての運用の安全性を保証しない。

### time-reallocation

[Suh・Oh — Generative AI and the Reallocation of Time](https://arxiv.org/html/2602.12695v1)

- 確認箇所：抄録・調査対象・方法
- 種類：著者による就業者の研究
- 支持する範囲と限界：韓国の就業者のAI利用と仕事中の時間配分を扱う。就労が生計に不要になった後の余暇や幸福を直接検証していない。

### monetary-trust

[ECB・Philip R. Lane — The digital euro: maintaining the autonomy of the monetary system](https://www.ecb.europa.eu/press/key/date/2025/html/ecb.sp250320_1~41c9459722.en.html)

- 確認箇所：貨幣・銀行・決済の関係と制度の説明
- 種類：ECBによる原講演・制度論
- 支持する範囲と限界：貨幣制度と信頼の仕組みを論じる。AI起因の金融危機から通貨・実体経済の崩壊を観測した証拠ではない。

### payment-resilience

[ECB — The Eurosystem’s comprehensive payments strategy](https://www.ecb.europa.eu/pub/pdf/other/ecb.eurosystemcomprehensivepaymentsstrategy202603.en.pdf)

- 確認箇所：PDF pp.16–17：代替支払い・現金・オフライン等の耐障害性
- 種類：通貨当局の戦略資料
- 支持する範囲と限界：代替支払いと耐障害性の計画・検討。提案や整備中の仕組みを全障害で効果実証済みとは扱わない。

## 機械的な検査と限界

- `npm run check:logic`：構造と既存レビュー記録の版の照合に成功。
- `npm run test:logic`：14件成功、失敗0。
- `npm run test:map`：47件成功、失敗0。
- 軍事・事故のH-E0：PC・390pxスマホのレイアウトとツアーの出力に存在。
- JSON記録：41辺・23グラフ・32出典のIDが、対象コミットの定義と一致することを別途照合。

これらは構造・表示データの検査であり、科学的な正しさを証明するテストではない。

- 既存の参照資料との整合性を検証した編集監査。分野の全論文を網羅した系統的レビュー、メタ分析、独立査読ではない。
- 原資料の実験・調査を再実行していない。要旨のみ確認した資料もあり、確認箇所は出典台帳に記した。32という数は根拠が独立している数を意味しない。
- 各項目の観測だけでは、矢印の因果効果やAND条件の同時成立は決まらない。必要条件・十分条件・順序・定義を区別する。
- 現在の色はノードの根拠の状態。矢印の強さ・起こる確率・その対策で防げる確率を示していない。
- 今回の資料から絶滅確率、残る壁の数、最も有効な対策の順位は算出していない。
- 反例・検証案・修正案は今回の編集上の推論であり、参照論文がそれぞれを実証したという記述ではない。
- この監査ではサイトの内容・配色・矢印・本番公開物は変更していない。修正推奨と実施済みを区別する。

## 更新する場合の順序

まず上記3箇所の引用・説明を日本語と英語で修正し、通常の内容レビューと履歴を更新する。その後、未確認の矢印に対して「何を観測したら判断が変わるか」を継続的に記録する。今回の結果だけを理由に全矢印を削除したり、実証済みの色を付けたりはしない。
