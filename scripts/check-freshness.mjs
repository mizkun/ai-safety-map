import fs from 'node:fs';
import path from 'node:path';
import {
  currentReviewDay,
  isCalendarDate,
  reviewStatus,
} from '../lib/freshness.mjs';

const args = process.argv.slice(2);
const unsupported = args.find(
  (a) => a !== '--sync-issue' && !a.startsWith('--date='),
);
if (unsupported) throw new Error('Unknown argument: ' + unsupported);
const today =
  args.find((a) => a.startsWith('--date='))?.slice(7) || currentReviewDay();
if (!isCalendarDate(today))
  throw new Error('Expected a real calendar date (YYYY-MM-DD)');
const read = (p) =>
  JSON.parse(fs.readFileSync(path.join('content', p), 'utf8'));
const map = read('map.json');
const nodes = fs
  .readdirSync('content/nodes')
  .filter((f) => f.endsWith('.json'))
  .map((f) => read('nodes/' + f));
const entries = [
  ...nodes.map((n) => ({
    id: n.id,
    title: n.title,
    review: n.review,
    kind: 'node',
  })),
  ...Object.values(map.edges).map((e) => ({
    id: e.id,
    title: e.label,
    review: e.review,
    kind: 'edge',
  })),
].map((e) => ({ ...e, ...reviewStatus(e.review, today) }));
const due = entries
  .filter((e) => e.state === 'due')
  .sort((a, b) => a.dueAt.localeCompare(b.dueAt) || a.id.localeCompare(b.id));
const soon = entries.filter((e) => e.state === 'soon');
const site = 'https://ai-safety-map.org/';
const marker = '<!-- ai-safety-map:freshness -->';
const safeCell = (text) => text.replaceAll('|', ' / ').replaceAll('\n', ' ');
const report = [
  marker,
  '# 内容の再確認',
  '',
  '期限計算日（日本時間）：' + today,
  '',
  `再確認の目安に達した項目・矢印：${due.length}件。2日以内に目安を迎えるもの：${soon.length}件。`,
  '',
  'この検査は日付を比較するものです。新しい研究の調査や、内容の誤り・危険度の判定は行いません。確認日は自動で更新しません。',
  '',
  ...(due.length
    ? [
        '| 項目・矢印 | 最終点検 | 再確認の目安 |',
        '| --- | --- | --- |',
        ...due.map(
          (e) =>
            `| [${e.id} · ${safeCell(e.title)}](${site}#map=overview&${e.kind}=${encodeURIComponent(e.id)}) | ${e.review.checkedAt} | ${e.dueAt} |`,
        ),
        '',
        '[更新手順](https://github.com/mizkun/ai-safety-map/blob/main/docs/keeping-current.md)に沿って、最新の一次資料と反論を確認してください。内容の変更や点検記録はPRでレビューします。',
      ]
    : [
        '現在、再確認の目安に達した項目はありません。新しい情報が出れば、期限前でも確認します。',
      ]),
  '',
].join('\n');
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY)
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);

if (args.includes('--sync-issue')) {
  if (args.some((a) => a.startsWith('--date=')))
    throw new Error('Issue sync cannot use a simulated date');
  if (
    process.env.GITHUB_ACTIONS !== 'true' ||
    !process.env.GITHUB_TOKEN ||
    !process.env.GITHUB_REPOSITORY
  ) {
    throw new Error(
      'Issue sync requires the GitHub Actions token and repository context',
    );
  }
  const repository = process.env.GITHUB_REPOSITORY;
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository))
    throw new Error('Invalid repository context');
  async function api(endpoint, method = 'GET', data) {
    const response = await fetch(
      'https://api.github.com/repos/' + repository + endpoint,
      {
        method,
        headers: {
          Authorization: 'Bearer ' + process.env.GITHUB_TOKEN,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        ...(data ? { body: JSON.stringify(data) } : {}),
        signal: AbortSignal.timeout(30_000),
      },
    );
    if (!response.ok)
      throw new Error('GitHub issue request failed: HTTP ' + response.status);
    return response.json();
  }
  let issue;
  for (let page = 1; !issue; page++) {
    const items = await api('/issues?state=open&per_page=100&page=' + page);
    issue = items.find(
      (i) =>
        !i.pull_request &&
        i.user?.login === 'github-actions[bot]' &&
        i.body?.includes(marker),
    );
    if (items.length < 100) break;
  }
  if (due.length && !issue) {
    await api('/issues', 'POST', {
      title: '内容の再確認が必要な項目',
      body: report,
    });
  } else if (issue && !due.length) {
    await api('/issues/' + issue.number, 'PATCH', {
      state: 'closed',
      body: report,
    });
  } else if (issue && issue.body !== report) {
    await api('/issues/' + issue.number, 'PATCH', { body: report });
  }
}
