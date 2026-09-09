# 全体の因果関係・一次情報の点検

点検：2026年9月9日〜10日。担当：Codexによる編集上の点検。独立した専門家の査読ではありません。主に9月9日までに公表された資料を確認し、67項目、33矢印、37研究カード、8経路のストーリーを点検しました。

## 主な訂正

| 論点 | 訂正と理由 |
| --- | --- |
| アライメント・能力・コントロール | 目標のズレが能力を生むような旧直列の矢印を、現行データから除去。C1・C2・C3はLへの共同条件。旧URLは訂正後の接続へ案内する。 |
| 悪用 | 危険な目的がAIの能力を生むように見える直列を除去。M1・M2・M3を並列に扱い、世界規模への拡大はさらに条件を明示。 |
| M2cと下位条件 | M2c1は作業能力、M2c2は支援が対象へ届く条件。防御・復旧の失敗はM3へ分離し、二重に数えない。 |
| 評価認識 | 試験だと分かることと、試験中だけ問題を隠すことを区別。認識だけでは見逃しを起こす十分条件ではない。 |
| 局所的な逸脱 | AISIやMETRの記録を世界規模の停止不能の実証にしない。発見後の停止努力に耐えることを別に点検する。 |
| 全労働の代替 | W4は技術的可能性。導入W3を定義へ混ぜない。W5には十分な生産と分配W6が必要で、文字どおり全労働の代替は必須ではない。 |
| 所得と金融 | 需要と取引の条件はAND。売上、純利益、決済量、所得分配を分ける。金融危機を貨幣の役割縮小や絶滅へ直接つながない。 |
| 絶滅 | 大きな被害、文明の後退、主導権の喪失、生存者がゼロになることを分ける。T1・T2は編集上の分解で、必要十分条件の証明ではない。 |

## 主な一次資料の照合

[Astraのシステムカード](https://deploymentsafety.openai.com/gpt-6-astra)のサイバー評価には、公開・内部の複数のベンチマークと外部評価がある。「一つの試験しかない」とは記述しない。評価指標、試行回数、通常提供と異なる設定、防御の強い対象に残る失敗は研究カードに記録した。

[Gemini 3.8 Flashのカード](https://deepmind.google/models/model-cards/gemini-3-8-flash/)は、重大な能力増加を認めず3.7の評価を基に判断している。新しいモデルで全試験を独立に再実施したとは扱わない。[3.7の評価](https://deepmind.google/models/model-cards/gemini-3-7-flash/)では、試験の認識と制限の回避の違いも確認した。企業ごとのCritical、CCL、TCLの名前を共通の尺度にしない。

[AISIの調査](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing)は、外部通信を許しフィルターを無効にした試験での記録で、隔離からの脱出とは異なる。行動数と試行数を区別し、封じ込めと実害が確認されなかったことを落とさない。[METRの調査](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/)は、調査期間・閲覧できた資料・分析方法の限界を伴う。

[OpenAIの業務分析](https://openai.com/index/research-acceleration-view-inside-openai/)は利用や研究作業の変化を示すが、人間の介入・計算資源の変化を含む。[Anthropicの安全性研究](https://www.anthropic.com/research/automated-researchers-mitigate-alignment-failures)の評価改善率を、実世界の事故確率の低下率には変換しない。

[ILOの原推計](https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure)の曝露は失業率ではない。[米国国勢調査局の原分析](https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html)は調査時期と各割合の母数を保持した。[Project Vend](https://www.anthropic.com/research/project-vend-2)は人間の購入承認・補充を含み、店舗収支を完全無人企業の純利益とは扱わない。

[英国金融の原調査](https://www.bankofengland.co.uk/report/2024/artificial-intelligence-in-uk-financial-services-2024)は、組織の利用率とユースケースの自律性を別に集計している。[FSBの原分析](https://www.fsb.org/2024/11/the-financial-stability-implications-of-artificial-intelligence/)は、相関・共通依存・防壁の条件を考える材料で、AIによる市場全体の危機の実証ではない。

[RANDの原シナリオ分析](https://www.rand.org/pubs/research_reports/RRA3034-1.html)は取り上げた三つの経路に厳しい条件があると論じる。全ての将来技術や経路が不可能という証明に一般化しない。ほかの資料の評価者・方法・結果・支持範囲は `content/research.json` と、対応するJSON点検記録に残した。

## 未解決の範囲

- 非公開モデル・運用、未公表の事故は把握できない。公開資料を全て網羅した調査でもない。
- 制度・軍事・社会依存・絶滅に関する多くの接続は、原論考に基づく条件付きの整理。段階ごとの確率や時期は算出していない。
- 数学の最新成果は、公表・形式的検査・独立した受理を分ける。この点検で解答案を再証明していない。
- 一次情報でも自己報告、標本の偏り、模擬環境、著者の判断は残る。「一次」というラベルを正しさの保証にしない。
- 対策の多くは候補であり、全ての場面で効果が実証されたと記述しない。

日本語は[文化審議会の指針](https://www.bunka.go.jp/seisaku/bunkashingikai/kokugo/hokoku/pdf/93731901_01.pdf)を基に、主語・述語、指示語、接続詞、修飾先を確認した。全体の因果図、詳細、ストーリーの意味を合わせることを優先した。

今後の変更は、[論理と根拠の点検手順](../logic-review.md)とCIで点検記録の版を照合する。機械による検査、編集者による内容の判断、独立した査読は区別する。
