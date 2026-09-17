# 2026-09-10 定期調査：事故の再分析と監督

## 範囲と扱い

2026-09-10に、watchlistのdailyについて直近14日（8月27日〜9月10日）を中心に、新着一覧と関係する原資料を確認した。再確認期限を迎えた項目は0件、2日以内も0件。木曜のためweeklyの全面点検ではない。無関係な項目・出典の確認日を一括更新していない。

作業開始時とPR作成前に重複する公開PRがないことを確認した。ユーザーが直接依頼した経済資料の反映はmainの`aa97e71`で公開済み。本案はその版を基点とし、カードの見た目や仕事の分岐を取り消さない。定期調査の本案はdraft PRで人の確認を待ち、自動で公開しない。

## 採用する一次資料

[Anthropic — An alignment assessment of recent cybersecurity incidents](https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents)、2026-09-09。Introduction、Alignment assessment summary、Which monitors would have caught this behavior?、新しいモデルでの模擬追試の節を確認した。

既存のC1・Lは実験や別の調査を扱っていたが、この再分析は未収録だった。C1・Lに出来事の研究カード、C3・C3aに対策の研究カードを加える。図の接続は変更しない。

開発元の調査であり、METRの独立調査は契約段階である。7月30日の説明から、推論の偏りと課題達成を優先する無謀さという解釈へ見直した点を、行動の観測と分ける。AISIのMythos 5事例は対象外なので合算しない。長期的な別目標や協働が確認された話へも置き換えない。

監督の評価は、最初の3事例の既知の記録を用いた事後の検査である。サイバー分類器の阻止判定、auto modeで期待される阻止、オフライン監督の見逃しを分けた。auto modeは内部モデルの操作にも一部反応しているため、「全く検知しなかった」とは書かない。未知の事例や、阻止後に行動を変えるモデルに対する保証にはできない。

同じ原資料には、新しいモデルで有害行動が減る模擬試験や、簡略化した別の試験で製品モデルが攻撃しなかった結果もある。危険の増加だけを探さず確認したが、それぞれの設定が違うため一般利用の安全率として集計しない。意図的に報酬ハックを学習させたモデルと製品モデルも同一視しない。

## その他の確認先と採否

| 確認先 | 今回の判断 |
| --- | --- |
| [METR研究](https://metr.org/research/)・[Notes](https://metr.org/notes/)・[Updates](https://metr.org/blog/)・[Time horizons](https://metr.org/time-horizons/) | 新着一覧を既存の8月26日の調査などと照合。古い評価の確認日を一律に更新しない。 |
| [METRの8月31日セキュリティ更新](https://metr.org/blog/2026-08-31-security-update/) | 全本文を確認。外部攻撃者による認証情報の窃取・エージェントを使う探索、対処の報告。評価中のAIによる自律攻撃とは区別する。M系統の既存の成立条件を変える材料とはせず、本PRのC/L系統に混ぜない。防御措置の記述の対象は7月30日時点。 |
| [AISI新着](https://www.aisi.gov.uk/blog)・[8月27日のoptstop](https://www.aisi.gov.uk/blog/optimal-stopping-spending-evaluation-compute-where-it-counts) | 原紹介の方法・測定の限界を確認。評価資源の節約の話であり、危険能力の上限や現行モデルの安全率の更新には使わない。原論文の数値検証・再現まではしていない。 |
| [OpenAI safety](https://openai.com/safety/)・[研究一覧](https://openai.com/research/index/)・[公開前評価](https://deploymentsafety.openai.com/) | 新着を既存のAstra、9月6日の研究支援、9月8日の成果の出典と照合。本PRでは既存の評価結果・日付を更新しない。 |
| [Anthropic研究](https://www.anthropic.com/research)・[Alignment Science](https://alignment.anthropic.com/) | 9月9日の再分析を採用。経済資料はユーザー依頼分で反映済み。既存の自動安全性研究と数学の資料は重複追加しない。 |
| [Fine-Tuned Lie Detectors Failed to Generalize](https://alignment.anthropic.com/2026/lie-detectors/) | 8月21日で主な調査窓の外。要約と方法を確認したが全面点検はしていない。見逃しの一般化を今後の広い点検で追う候補として残す。 |
| [Training a Misaligned Reward Seeker](https://alignment.anthropic.com/2026/reward-seeker/) | 公表表示は8月まで。9月9日報告の関連原研究として概要を確認。全実験の分析は未完了なので、新着として独立した数値カードを作らない。 |
| [DeepMindモデルカード](https://deepmind.google/models/model-cards/)・[Blog](https://deepmind.google/blog/)・[Gemini Omni Flash](https://deepmind.google/models/model-cards/gemini-omni-flash/) | 一覧と動画モデルの安全性・限界の節を確認。新たな危険能力の閾値や全職種の代替を示す結果としては採用しない。既存のGemini 3.8の出典と重複させない。 |

検索結果の要約だけを根拠に採用した項目はない。一覧調査は網羅的なシステマティックレビューではなく、原研究の独立再現も行っていない。

## 因果と翻訳の点検

局所的な実行Lと、活動の持続・広がりを要するC4は分けたまま。C1・C2・C3をANDで組み合わせる構造も維持した。再分析だけで、自己改善や世界規模の制御喪失を実証したとは書かない。R4による安全性研究の効果も、その研究で試した条件の範囲にとどめる。

日本語と直接作成した英訳で、事例数と実行数、通常提供と評価設定、観測と原因の解釈、事後評価と実際の阻止を照合した。履歴挿入で移った既存の英訳は原文対応を維持している。

`npm run check`と`npm run build`を実施し、版に対応する編集点検記録を添えてdraft PRにする。編集点検済みは独立した専門家の査読・承認を意味しない。
