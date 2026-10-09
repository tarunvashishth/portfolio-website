import React from 'react';
import { motion } from 'framer-motion';
import { AiFillGithub } from 'react-icons/ai';
import { BiGitPullRequest, BiGitMerge } from 'react-icons/bi';

const REPO = 'https://github.com/ComposioHQ/composio';

// Pull requests to ComposioHQ/composio. Only mark one `merged` once it has landed.
const PULLS = [
  {
    number: 4751,
    area: 'Google provider',
    title: 'Send tool schemas that Gemini and Vertex AI accept',
    desc: 'Rewrites tool JSON schemas so Gemini/Vertex stop rejecting them — keeps integer enums, type lists and anyOf choices intact.',
  },
  {
    number: 4748,
    area: 'json-schema-to-zod',
    title: 'Stop validating format: binary as base64',
    desc: 'Binary fields no longer fail base64 validation, and base64 contentEncoding is matched case-insensitively.',
  },
  {
    number: 4743,
    area: 'Docs · Ask AI',
    title: 'Show an error and retry when the Ask AI call fails',
    desc: 'Failed questions surface an error with a retry button instead of vanishing, and stay in the thread if not retried.',
  },
  {
    number: 4704,
    area: 'Docs',
    title: 'Stop the quickstart intro rendering nested <p>',
    desc: 'Fixes invalid nested paragraphs in the rendered MDX and adds a test that checks every page for them.',
    merged: true,
  },
  {
    number: 4665,
    area: 'Core SDK',
    title: 'Accept experimental in the session authorize type',
    desc: 'Lets TypeScript callers pass experimental options to session.authorize without a type error.',
  },
  {
    number: 4661,
    area: 'OpenAI provider',
    title: 'Accept a Tool Router session in handleResponse',
    desc: 'OpenAIResponsesProvider.handleResponse can now execute tool calls through a Tool Router session.',
  },
];

const Contributions = () => (
  <div className="app__work-oss">
    <div className="app__work-oss-head">
      <h3 className="bold-text">
        Open-source contributions to <a href={REPO} target="_blank" rel="noreferrer">Composio</a>
      </h3>
      <p className="p-text">Fixes and features for the Composio SDK, its AI provider integrations and docs.</p>
    </div>

    <div className="app__work-oss-list">
      {PULLS.map((pr, index) => (
        <motion.a
          key={pr.number}
          href={`${REPO}/pull/${pr.number}`}
          target="_blank"
          rel="noreferrer"
          className="app__work-oss-item"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
        >
          <div className="app__work-oss-meta">
            <span className={`app__work-oss-status ${pr.merged ? 'is-merged' : ''}`}>
              {pr.merged ? <BiGitMerge aria-hidden="true" /> : <BiGitPullRequest aria-hidden="true" />}
              #{pr.number}{pr.merged && ' · Merged'}
            </span>
            <span className="app__work-oss-area">{pr.area}</span>
          </div>
          <h4 className="bold-text">{pr.title}</h4>
          <p className="p-text">{pr.desc}</p>
        </motion.a>
      ))}
    </div>

    <a className="app__work-oss-all p-text" href="/composio-prs.html" target="_blank" rel="noreferrer">
      <AiFillGithub aria-hidden="true" /> See all my Composio pull requests
    </a>
  </div>
);

export default Contributions;
