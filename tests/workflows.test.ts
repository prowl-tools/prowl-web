import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

const REVIEW_ACTION_SHA = 'e7f0431b7daf2cc818a003c5ac216f29e7da3c53';
const REPOSITORY = 'prowl-tools/prowl-web';
const BASE_SHA = 'd478fb5dc46c96361dc1f9c8fde76aa745dbc884';
const HEAD_SHA = '6d51eaa779368e4f4dd40b5ea9cd2b7882f12397';
const MOVED_HEAD_SHA = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

type FakeGhResponses = Record<string, Record<string, string>>;

type WorkflowResult = {
  outputs: Record<string, string>;
  status: number | null;
  stderr: string;
  stdout: string;
};

const workflowPath = (file: string) =>
  path.join(process.cwd(), '.github', 'workflows', file);

const readWorkflow = (file: string) =>
  fs.readFileSync(workflowPath(file), 'utf8');

const leadingSpaceCount = (line: string) => line.match(/^ */)?.[0].length ?? 0;

const extractRunBlockFromWorkflow = (workflow: string, stepName: string) => {
  const lines = workflow.split('\n');
  const stepIndex = lines.findIndex((line) =>
    line.trimStart().startsWith(`- name: ${stepName}`),
  );

  assert.notEqual(stepIndex, -1, `Missing workflow step: ${stepName}`);

  const stepIndent = leadingSpaceCount(lines[stepIndex]);
  let runIndex = -1;
  for (let index = stepIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];

    if (
      index > stepIndex + 1 &&
      line.trimStart().startsWith('- name:') &&
      leadingSpaceCount(line) <= stepIndent
    ) {
      break;
    }

    if (line.trim() === 'run: |') {
      runIndex = index;
      break;
    }
  }

  assert.notEqual(runIndex, -1, `Missing run block for step: ${stepName}`);

  const scriptIndent = leadingSpaceCount(lines[runIndex]) + 2;
  const scriptPrefix = ' '.repeat(scriptIndent);
  const scriptLines: string[] = [];
  for (const line of lines.slice(runIndex + 1)) {
    if (line === '') {
      scriptLines.push('');
      continue;
    }
    if (!line.startsWith(scriptPrefix)) {
      break;
    }
    scriptLines.push(line.slice(scriptIndent));
  }

  assert.ok(scriptLines.length > 0, `Empty run block for step: ${stepName}`);

  return `${scriptLines.join('\n')}\n`;
};

const extractRunBlock = (file: string, stepName: string) =>
  extractRunBlockFromWorkflow(readWorkflow(file), stepName);

const extractStepBlockFromWorkflow = (workflow: string, stepName: string) => {
  const lines = workflow.split('\n');
  const stepIndex = lines.findIndex((line) =>
    line.trimStart().startsWith(`- name: ${stepName}`),
  );

  assert.notEqual(stepIndex, -1, `Missing workflow step: ${stepName}`);

  const stepIndent = leadingSpaceCount(lines[stepIndex]);
  const stepLines = [lines[stepIndex]];
  for (const line of lines.slice(stepIndex + 1)) {
    if (
      line.trimStart().startsWith('- name:') &&
      leadingSpaceCount(line) <= stepIndent
    ) {
      break;
    }

    if (line.trim() !== '' && leadingSpaceCount(line) <= stepIndent) {
      break;
    }

    stepLines.push(line);
  }

  return stepLines.join('\n');
};

const extractStepBlock = (file: string, stepName: string) =>
  extractStepBlockFromWorkflow(readWorkflow(file), stepName);

const extractJobBlockFromWorkflow = (workflow: string, jobName: string) => {
  const lines = workflow.split('\n');
  const jobIndex = lines.findIndex((line) => line.trim() === `${jobName}:`);

  assert.notEqual(jobIndex, -1, `Missing workflow job: ${jobName}`);

  const jobIndent = leadingSpaceCount(lines[jobIndex]);
  const jobLines = [lines[jobIndex]];
  for (const line of lines.slice(jobIndex + 1)) {
    if (line.trim() !== '' && leadingSpaceCount(line) <= jobIndent) {
      break;
    }

    jobLines.push(line);
  }

  return jobLines.join('\n');
};

const extractJobBlock = (file: string, jobName: string) =>
  extractJobBlockFromWorkflow(readWorkflow(file), jobName);

const commandPrNumberExpression =
  /pr_number="\$\{\{\s*github\.event\.issue\.number\s*\|\|\s*github\.event\.pull_request\.number\s*\}\}"/;

const replaceCommandPrNumberExpression = (script: string) => {
  assert.match(
    script,
    commandPrNumberExpression,
    'Missing command workflow PR number expression',
  );

  return script.replace(
    commandPrNumberExpression,
    'pr_number="${EVENT_PR_NUMBER}"',
  );
};

const getCommandResolveScript = () =>
  replaceCommandPrNumberExpression(
    extractRunBlock('prowl-review-command.yml', 'Resolve PR metadata'),
  );

const getWorkflowRunResolveScript = () =>
  extractRunBlock('prowl-review.yml', 'Resolve PR from the CI run');

const createFakeGh = (directory: string) => {
  const ghPath = path.join(directory, 'gh');
  fs.writeFileSync(
    ghPath,
    `#!/usr/bin/env node
const scenario = JSON.parse(process.env.GH_FAKE_SCENARIO ?? '{}');
const [command, endpoint, ...rest] = process.argv.slice(2);
const allowedEndpointPatterns = [
  /^repos\\/prowl-tools\\/prowl-web\\/actions\\/runs\\/[A-Za-z0-9._-]+$/,
  /^repos\\/prowl-tools\\/prowl-web\\/pulls\\/[1-9][0-9]*$/,
];

if (command !== 'api' || !endpoint) {
  console.error('Only gh api is supported by this test fixture.');
  process.exit(1);
}

if (!allowedEndpointPatterns.some((pattern) => pattern.test(endpoint))) {
  console.error('Unsupported gh api endpoint for this test fixture: ' + endpoint);
  process.exit(1);
}

if (rest.length !== 2 || rest[0] !== '--jq' || rest[1] === undefined || rest[1] === '') {
  console.error('Only gh api <endpoint> --jq <expression> is supported by this test fixture.');
  process.exit(1);
}

if ((scenario.failEndpoints ?? []).includes(endpoint)) {
  console.error('Synthetic gh api failure for ' + endpoint);
  process.exit(1);
}

const jq = rest[1];
const endpointResponses = scenario.responses?.[endpoint] ?? {};
const response = endpointResponses[jq];

if (response === undefined) {
  console.error('No fake gh response for ' + endpoint + ' with jq ' + jq);
  process.exit(1);
}

process.stdout.write(response);
if (response !== '' && !response.endsWith('\\n')) {
  process.stdout.write('\\n');
}
`,
  );
  fs.chmodSync(ghPath, 0o755);
};

const parseOutputs = (outputPath: string) => {
  if (!fs.existsSync(outputPath)) {
    return {};
  }

  const entries = fs
    .readFileSync(outputPath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf('=');
      assert.notEqual(separatorIndex, -1, `Invalid GITHUB_OUTPUT line: ${line}`);
      assert.ok(separatorIndex > 0, `Invalid GITHUB_OUTPUT line: ${line}`);
      return [line.slice(0, separatorIndex), line.slice(separatorIndex + 1)];
    });

  return Object.fromEntries(entries);
};

const runWorkflowScript = (
  script: string,
  options: {
    env: Record<string, string>;
    failEndpoints?: string[];
    responses: FakeGhResponses;
  },
): WorkflowResult => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'prowl-workflow-'));
  const scriptPath = path.join(directory, 'script.sh');
  const outputPath = path.join(directory, 'github-output');

  try {
    createFakeGh(directory);
    fs.writeFileSync(scriptPath, script);
    fs.chmodSync(scriptPath, 0o755);

    const result = spawnSync('bash', [scriptPath], {
      encoding: 'utf8',
      env: {
        ...process.env,
        ...options.env,
        GH_FAKE_SCENARIO: JSON.stringify({
          failEndpoints: options.failEndpoints ?? [],
          responses: options.responses,
        }),
        GITHUB_OUTPUT: outputPath,
        GITHUB_REPOSITORY: REPOSITORY,
        PATH: [directory, process.env.PATH ?? ''].filter(Boolean).join(path.delimiter),
      },
    });

    return {
      outputs: parseOutputs(outputPath),
      status: result.status,
      stderr: result.stderr,
      stdout: result.stdout,
    };
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
};

const pullEndpoint = (prNumber: number) =>
  `repos/${REPOSITORY}/pulls/${prNumber}`;

const runEndpoint = (runId: string) =>
  `repos/${REPOSITORY}/actions/runs/${runId}`;

const runConfigResolveScript = (
  script: string,
  options: { baseConfig?: string; prConfig?: string } = {},
): WorkflowResult => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'prowl-config-'));
  const workspace = path.join(directory, 'workspace');
  const scriptPath = path.join(directory, 'script.sh');
  const outputPath = path.join(directory, 'github-output');

  try {
    fs.mkdirSync(path.join(workspace, 'prowl-base'), { recursive: true });
    fs.mkdirSync(path.join(workspace, 'pr-head'), { recursive: true });
    if (options.baseConfig !== undefined) {
      fs.writeFileSync(
        path.join(workspace, 'prowl-base', '.prowl-review.yml'),
        options.baseConfig,
      );
    }
    if (options.prConfig !== undefined) {
      fs.writeFileSync(
        path.join(workspace, 'pr-head', '.prowl-review.yml'),
        options.prConfig,
      );
    }
    fs.writeFileSync(scriptPath, script);
    fs.chmodSync(scriptPath, 0o755);

    const result = spawnSync('bash', [scriptPath], {
      encoding: 'utf8',
      env: {
        ...process.env,
        GITHUB_OUTPUT: outputPath,
        GITHUB_WORKSPACE: workspace,
      },
    });

    return {
      outputs: parseOutputs(outputPath),
      status: result.status,
      stderr: result.stderr,
      stdout: result.stdout,
    };
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
};

test('pins both prowl-review action references to the reviewed Codex-capable commit', () => {
  for (const file of ['prowl-review.yml', 'prowl-review-command.yml']) {
    const workflow = readWorkflow(file);

    assert.match(
      workflow,
      new RegExp(
        `uses: prowl-tools/prowl-code-review@${REVIEW_ACTION_SHA}`,
      ),
    );
    assert.doesNotMatch(workflow, /prowl-tools\/prowl-code-review@main/);
  }
});

test('PR head checkouts have inline same-repo guards and disable persisted credentials', () => {
  const workflows = [
    {
      file: 'prowl-review.yml',
      guard:
        /if: >\n\s+needs\.resolve\.outputs\.resolved == 'true' &&\n\s+needs\.resolve\.outputs\.head_repo != '' &&\n\s+needs\.resolve\.outputs\.head_repo == github\.repository/,
    },
    {
      file: 'prowl-review-command.yml',
      guard:
        /if: >\n\s+needs\.resolve\.outputs\.trusted_head == 'true' &&\n\s+needs\.resolve\.outputs\.head_repo != '' &&\n\s+needs\.resolve\.outputs\.head_repo == github\.repository/,
    },
  ];

  for (const { file, guard } of workflows) {
    const step = extractStepBlock(file, 'Checkout PR head for context');

    assert.match(step, guard);
    assert.match(step, /uses: actions\/checkout@v4/);
    assert.match(step, /persist-credentials: false/);
  }
});

test('self-hosted review jobs keep mandatory same-repo gates', () => {
  const commandJob = extractJobBlock('prowl-review-command.yml', 'command');
  const reviewJob = extractJobBlock('prowl-review.yml', 'review');

  assert.match(
    commandJob,
    /if: >\n\s+needs\.resolve\.outputs\.trusted_head == 'true' &&\n\s+needs\.resolve\.outputs\.head_repo != '' &&\n\s+needs\.resolve\.outputs\.head_repo == github\.repository/,
  );
  assert.match(commandJob, /runs-on: \[self-hosted, macOS, prowl-review\]/);
  assert.match(commandJob, /timeout-minutes: 30/);
  assert.match(
    commandJob,
    /group: prowl-review-codex-\$\{\{ github\.repository \}\}-\$\{\{ needs\.resolve\.outputs\.pr_number \}\}-\$\{\{ needs\.resolve\.outputs\.head_repo \}\}/,
  );

  assert.match(
    reviewJob,
    /if: >\n\s+needs\.resolve\.outputs\.resolved == 'true' &&\n\s+needs\.resolve\.outputs\.head_repo != '' &&\n\s+needs\.resolve\.outputs\.head_repo == github\.repository/,
  );
  assert.match(reviewJob, /runs-on: \[self-hosted, macOS, prowl-review\]/);
  assert.match(reviewJob, /timeout-minutes: 30/);
  assert.match(
    reviewJob,
    /group: prowl-review-codex-\$\{\{ github\.repository \}\}-\$\{\{ needs\.resolve\.outputs\.pr_number \}\}-\$\{\{ needs\.resolve\.outputs\.head_repo \}\}/,
  );
});

test('command workflow queues command requests on server-derived PR metadata', () => {
  const resolveJob = extractJobBlock('prowl-review-command.yml', 'resolve');
  const commandJob = extractJobBlock('prowl-review-command.yml', 'command');

  assert.doesNotMatch(resolveJob, /\n    concurrency:\n/);
  assert.match(
    commandJob,
    /concurrency:\n\s+group: prowl-review-codex-\$\{\{ github\.repository \}\}-\$\{\{ needs\.resolve\.outputs\.pr_number \}\}-\$\{\{ needs\.resolve\.outputs\.head_repo \}\}\n\s+queue: max\n\s+cancel-in-progress: false/,
  );
});

test('run block extractor strips indentation relative to the run key', () => {
  const workflow = [
    'steps:',
    '- name: Fixture step',
    '  run: |',
    '    echo first',
    '      echo nested',
    '- name: Next step',
    '  run: |',
    '    echo skipped',
  ].join('\n');

  assert.equal(
    extractRunBlockFromWorkflow(workflow, 'Fixture step'),
    'echo first\n  echo nested\n',
  );
});

test('command resolve script substitutes the workflow PR-number expression', () => {
  const script = getCommandResolveScript();

  assert.match(script, /pr_number="\$\{EVENT_PR_NUMBER\}"/);
  assert.doesNotMatch(script, commandPrNumberExpression);
});

test('command resolve script substitution handles expression formatting changes', () => {
  const script = replaceCommandPrNumberExpression(
    'pr_number="${{github.event.issue.number||github.event.pull_request.number}}"\n',
  );

  assert.equal(script, 'pr_number="${EVENT_PR_NUMBER}"\n');
});

test('command resolve script substitution rejects missing workflow expression', () => {
  assert.throws(
    () => replaceCommandPrNumberExpression('pr_number="${{ github.event.issue.number }}"\n'),
    /Missing command workflow PR number expression/,
  );
});

test('workflow output parser rejects malformed lines without separators', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'prowl-output-'));
  const outputPath = path.join(directory, 'github-output');

  try {
    fs.writeFileSync(outputPath, 'not-a-key-value-line\n');

    assert.throws(
      () => parseOutputs(outputPath),
      /Invalid GITHUB_OUTPUT line: not-a-key-value-line/,
    );
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('workflow output parser rejects malformed lines without keys', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'prowl-output-'));
  const outputPath = path.join(directory, 'github-output');

  try {
    fs.writeFileSync(outputPath, '=value\n');

    assert.throws(() => parseOutputs(outputPath), /Invalid GITHUB_OUTPUT line: =value/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('fake gh fixture rejects unsupported API endpoints', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'prowl-gh-'));

  try {
    createFakeGh(directory);
    const result = spawnSync(
      path.join(directory, 'gh'),
      ['api', `repos/${REPOSITORY}/issues/33`, '--jq', '.number'],
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          GH_FAKE_SCENARIO: JSON.stringify({ responses: {} }),
        },
      },
    );

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Unsupported gh api endpoint/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('config resolve scripts fail closed when base and PR configs are missing', () => {
  for (const file of ['prowl-review.yml', 'prowl-review-command.yml']) {
    const result = runConfigResolveScript(
      extractRunBlock(file, 'Resolve prowl-review config'),
    );

    assert.equal(result.status, 1, `${file}\n${result.stdout}\n${result.stderr}`);
    assert.deepEqual(result.outputs, {});
    assert.match(result.stdout, /Missing prowl-review config/);
  }
});

test('config resolve scripts prefer trusted base config when PR config is absent', () => {
  for (const file of ['prowl-review.yml', 'prowl-review-command.yml']) {
    const result = runConfigResolveScript(
      extractRunBlock(file, 'Resolve prowl-review config'),
      { baseConfig: 'provider: codex\n' },
    );

    assert.equal(result.status, 0, `${file}\n${result.stdout}\n${result.stderr}`);
    assert.match(result.outputs.path, /\/prowl-base\/\.prowl-review\.yml$/);
    assert.doesNotMatch(result.stdout, /Using bootstrap config/);
  }
});

test('config resolve scripts fall back to PR config when base config is absent', () => {
  for (const file of ['prowl-review.yml', 'prowl-review-command.yml']) {
    const result = runConfigResolveScript(
      extractRunBlock(file, 'Resolve prowl-review config'),
      { prConfig: 'provider: codex\n' },
    );

    assert.equal(result.status, 0, `${file}\n${result.stdout}\n${result.stderr}`);
    assert.match(result.outputs.path, /\/pr-head\/\.prowl-review\.yml$/);
    assert.match(result.stdout, /Using bootstrap config/);
  }
});

test('command workflow ignores untrusted command comments before resolving metadata', () => {
  const workflow = readWorkflow('prowl-review-command.yml');

  assert.match(workflow, /github\.event\.comment\.user\.type != 'Bot'/);
  assert.match(workflow, /github\.event\.comment\.author_association == 'OWNER'/);
  assert.match(workflow, /github\.event\.comment\.author_association == 'MEMBER'/);
  assert.match(
    workflow,
    /github\.event\.comment\.author_association == 'COLLABORATOR'/,
  );
  assert.match(workflow, /contains\(github\.event\.comment\.body, '@prowl-review'\)/);
  assert.match(
    workflow,
    /!contains\(github\.event\.comment\.body, '<!-- prowl-review:summary -->'\)/,
  );
  assert.match(
    workflow,
    /!contains\(github\.event\.comment\.body, '<!-- prowl-review:finding '\)/,
  );
});

test('command resolve marks same-repo pull request heads trusted', () => {
  const result = runWorkflowScript(getCommandResolveScript(), {
    env: {
      EVENT_PR_NUMBER: '33',
    },
    responses: {
      [pullEndpoint(33)]: {
        '[.base.sha, .head.sha, .head.repo.full_name] | @tsv':
          `${BASE_SHA}\t${HEAD_SHA}\t${REPOSITORY}`,
      },
    },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.outputs, {
    base_sha: BASE_SHA,
    head_repo: REPOSITORY,
    head_sha: HEAD_SHA,
    pr_number: '33',
    trusted_head: 'true',
  });
});

test('command resolve rejects malformed event PR numbers before API lookup', () => {
  const result = runWorkflowScript(getCommandResolveScript(), {
    env: {
      EVENT_PR_NUMBER: '../../33',
    },
    responses: {},
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Invalid command PR number: \.\.\/\.\.\/33/);
  assert.deepEqual(result.outputs, {});
});

test('command resolve marks fork pull request heads untrusted without failing', () => {
  const result = runWorkflowScript(getCommandResolveScript(), {
    env: {
      EVENT_PR_NUMBER: '33',
    },
    responses: {
      [pullEndpoint(33)]: {
        '[.base.sha, .head.sha, .head.repo.full_name] | @tsv':
          `${BASE_SHA}\t${HEAD_SHA}\tcontributor/prowl-web`,
      },
    },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.outputs.trusted_head, 'false');
  assert.equal(result.outputs.head_repo, 'contributor/prowl-web');
  assert.match(result.stdout, /Fork PR command skipped/);
});

test('command resolve fails closed when required pull request metadata is incomplete', () => {
  const result = runWorkflowScript(getCommandResolveScript(), {
    env: {
      EVENT_PR_NUMBER: '33',
    },
    responses: {
      [pullEndpoint(33)]: {
        '[.base.sha, .head.sha, .head.repo.full_name] | @tsv':
          `${BASE_SHA}\t${HEAD_SHA}\t`,
      },
    },
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Failed to resolve complete PR metadata/);
});

test('workflow_run resolve only starts after successful pull_request CI runs', () => {
  const workflow = readWorkflow('prowl-review.yml');

  assert.match(
    workflow,
    /github\.event\.workflow_run\.event == 'pull_request'/,
  );
  assert.match(
    workflow,
    /github\.event\.workflow_run\.conclusion == 'success'/,
  );
});

test('workflow_run resolve deduplicates candidates and resolves exactly one open PR at the CI head', () => {
  const result = runWorkflowScript(getWorkflowRunResolveScript(), {
    env: {
      CHECK_RUN: 'true',
      HEAD_SHA,
      PR_PAYLOAD: '[{"number":33}]',
      RUN_ID: '100',
    },
    responses: {
      [runEndpoint('100')]: {
        '.pull_requests[]?.number': '33',
      },
      [pullEndpoint(33)]: {
        '[.base.sha, .head.sha, .head.repo.full_name, .draft] | @tsv':
          `${BASE_SHA}\t${HEAD_SHA}\t${REPOSITORY}\tfalse`,
        '[.state, .head.sha] | @tsv': `open\t${HEAD_SHA}`,
      },
    },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.outputs, {
    base_sha: BASE_SHA,
    head_repo: REPOSITORY,
    head_sha: HEAD_SHA,
    is_draft: 'false',
    pr_number: '33',
    resolved: 'true',
  });
});

test('workflow_run resolve fails the setup check when the completed run cannot be inspected', () => {
  const result = runWorkflowScript(getWorkflowRunResolveScript(), {
    env: {
      CHECK_RUN: 'true',
      HEAD_SHA,
      PR_PAYLOAD: '[]',
      RUN_ID: 'rate-limited',
    },
    failEndpoints: [runEndpoint('rate-limited')],
    responses: {},
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.outputs.resolved, 'false');
  assert.equal(result.outputs.check_head_sha, HEAD_SHA);
  assert.equal(result.outputs.check_conclusion, 'failure');
  assert.match(result.outputs.check_summary, /API, rate-limit, or permissions errors/);
});

test('workflow_run resolve rejects malformed PR candidates before PR API lookup', () => {
  const result = runWorkflowScript(getWorkflowRunResolveScript(), {
    env: {
      CHECK_RUN: 'true',
      HEAD_SHA,
      PR_PAYLOAD: '[{"number":"../../33"}]',
      RUN_ID: 'malformed-candidate',
    },
    responses: {
      [runEndpoint('malformed-candidate')]: {
        '.pull_requests[]?.number': '',
      },
    },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.outputs.resolved, 'false');
  assert.equal(result.outputs.head_sha, HEAD_SHA);
  assert.equal(result.outputs.check_head_sha, HEAD_SHA);
  assert.equal(result.outputs.check_conclusion, 'failure');
  assert.equal(result.outputs.pr_number, undefined);
  assert.match(result.outputs.check_summary, /invalid pull request number/);
  assert.match(result.stdout, /invalid PR candidate/);
});

test('workflow_run resolve rejects zero PR candidates before PR API lookup', () => {
  const result = runWorkflowScript(getWorkflowRunResolveScript(), {
    env: {
      CHECK_RUN: 'true',
      HEAD_SHA,
      PR_PAYLOAD: '[]',
      RUN_ID: 'zero-candidate',
    },
    responses: {
      [runEndpoint('zero-candidate')]: {
        '.pull_requests[]?.number': '0',
      },
    },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.outputs.resolved, 'false');
  assert.equal(result.outputs.head_sha, HEAD_SHA);
  assert.equal(result.outputs.check_head_sha, HEAD_SHA);
  assert.equal(result.outputs.check_conclusion, 'failure');
  assert.equal(result.outputs.pr_number, undefined);
  assert.match(result.outputs.check_summary, /invalid pull request number/);
  assert.match(result.stdout, /invalid PR candidate/);
});

test('workflow_run resolve fails the setup check when candidate PR metadata cannot be loaded', () => {
  const result = runWorkflowScript(getWorkflowRunResolveScript(), {
    env: {
      CHECK_RUN: 'true',
      HEAD_SHA,
      PR_PAYLOAD: '[{"number":33}]',
      RUN_ID: 'candidate-api-failure',
    },
    failEndpoints: [pullEndpoint(33)],
    responses: {
      [runEndpoint('candidate-api-failure')]: {
        '.pull_requests[]?.number': '',
      },
    },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.outputs.resolved, 'false');
  assert.equal(result.outputs.pr_number, undefined);
  assert.equal(result.outputs.head_sha, HEAD_SHA);
  assert.equal(result.outputs.check_head_sha, HEAD_SHA);
  assert.equal(result.outputs.check_conclusion, 'failure');
  assert.match(result.outputs.check_summary, /could not load pull request #33/);
  assert.match(result.stdout, /failed to load PR #33 metadata/);
});

test('workflow_run resolve fails the setup check when resolved PR metadata is incomplete', () => {
  const invalidMetadata = [
    ['base_sha', `null\t${HEAD_SHA}\t${REPOSITORY}\tfalse`],
    ['head_sha', `${BASE_SHA}\tnull\t${REPOSITORY}\tfalse`],
    ['head_repo', `${BASE_SHA}\t${HEAD_SHA}\tnull\tfalse`],
  ];

  for (const [field, metadata] of invalidMetadata) {
    const result = runWorkflowScript(getWorkflowRunResolveScript(), {
      env: {
        CHECK_RUN: 'true',
        HEAD_SHA,
        PR_PAYLOAD: '[{"number":33}]',
        RUN_ID: `incomplete-${field}`,
      },
      responses: {
        [runEndpoint(`incomplete-${field}`)]: {
          '.pull_requests[]?.number': '',
        },
        [pullEndpoint(33)]: {
          '[.base.sha, .head.sha, .head.repo.full_name, .draft] | @tsv': metadata,
          '[.state, .head.sha] | @tsv': `open\t${HEAD_SHA}`,
        },
      },
    });

    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.outputs.resolved, 'false');
    assert.equal(result.outputs.pr_number, '33');
    assert.equal(result.outputs.head_sha, HEAD_SHA);
    assert.equal(result.outputs.check_head_sha, HEAD_SHA);
    assert.equal(result.outputs.check_conclusion, 'failure');
    assert.match(result.outputs.check_summary, /complete metadata/);
    assert.match(result.stdout, /incomplete PR metadata/);
  }
});

test('workflow_run resolve skips ambiguous matching pull requests', () => {
  const result = runWorkflowScript(getWorkflowRunResolveScript(), {
    env: {
      CHECK_RUN: 'true',
      HEAD_SHA,
      PR_PAYLOAD: '[{"number":33}]',
      RUN_ID: '101',
    },
    responses: {
      [runEndpoint('101')]: {
        '.pull_requests[]?.number': '34',
      },
      [pullEndpoint(33)]: {
        '[.state, .head.sha] | @tsv': `open\t${HEAD_SHA}`,
      },
      [pullEndpoint(34)]: {
        '[.state, .head.sha] | @tsv': `open\t${HEAD_SHA}`,
      },
    },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.outputs, {
    resolved: 'false',
  });
  assert.match(result.stdout, /expected exactly one open PR/);
});

test('workflow_run resolve skips closed pull requests at the CI head', () => {
  const result = runWorkflowScript(getWorkflowRunResolveScript(), {
    env: {
      CHECK_RUN: 'true',
      HEAD_SHA,
      PR_PAYLOAD: '[{"number":33}]',
      RUN_ID: 'closed-pr',
    },
    responses: {
      [runEndpoint('closed-pr')]: {
        '.pull_requests[]?.number': '',
      },
      [pullEndpoint(33)]: {
        '[.state, .head.sha] | @tsv': `closed\t${HEAD_SHA}`,
      },
    },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.outputs, {
    resolved: 'false',
  });
  assert.match(result.stdout, /expected exactly one open PR/);
});

test('workflow_run resolve skips fork pull requests before the self-hosted review job', () => {
  const result = runWorkflowScript(getWorkflowRunResolveScript(), {
    env: {
      CHECK_RUN: 'true',
      HEAD_SHA,
      PR_PAYLOAD: '[{"number":33}]',
      RUN_ID: '102',
    },
    responses: {
      [runEndpoint('102')]: {
        '.pull_requests[]?.number': '',
      },
      [pullEndpoint(33)]: {
        '[.base.sha, .head.sha, .head.repo.full_name, .draft] | @tsv':
          `${BASE_SHA}\t${HEAD_SHA}\tcontributor/prowl-web\tfalse`,
        '[.state, .head.sha] | @tsv': `open\t${HEAD_SHA}`,
      },
    },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.outputs.resolved, 'false');
  assert.equal(result.outputs.pr_number, '33');
  assert.equal(result.outputs.check_head_sha, HEAD_SHA);
  assert.equal(result.outputs.check_conclusion, 'neutral');
  assert.match(result.outputs.check_summary, /fork pull request/);
});

test('workflow_run resolve skips stale CI runs when the pull request head has moved', () => {
  const result = runWorkflowScript(getWorkflowRunResolveScript(), {
    env: {
      CHECK_RUN: 'true',
      HEAD_SHA,
      PR_PAYLOAD: '[{"number":33}]',
      RUN_ID: '103',
    },
    responses: {
      [runEndpoint('103')]: {
        '.pull_requests[]?.number': '',
      },
      [pullEndpoint(33)]: {
        '[.base.sha, .head.sha, .head.repo.full_name, .draft] | @tsv':
          `${BASE_SHA}\t${MOVED_HEAD_SHA}\t${REPOSITORY}\tfalse`,
        '[.state, .head.sha] | @tsv': `open\t${HEAD_SHA}`,
      },
    },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.outputs, {
    resolved: 'false',
  });
  assert.match(result.stdout, /head moved from CI head/);
});
