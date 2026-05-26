<div align="center">

<br />

```
  ██████╗ ██╗████████╗████████╗ ██████╗  ██████╗ ██╗     
 ██╔════╝ ██║╚══██╔══╝╚══██╔══╝██╔═══██╗██╔═══██╗██║     
 ██║  ███╗██║   ██║      ██║   ██║   ██║██║   ██║██║     
 ██║   ██║██║   ██║      ██║   ██║   ██║██║   ██║██║     
 ╚██████╔╝██║   ██║      ██║   ╚██████╔╝╚██████╔╝███████╗
  ╚═════╝ ╚═╝   ╚═╝      ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝
```

**Build Git commands visually. Copy with confidence.**

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-0EA5E9?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

[**Live Demo →**](https://gittool.dev)  ·  [Report a Bug](https://github.com/Vibhav-y/GitTool/issues)  ·  [Request a Command](https://github.com/Vibhav-y/GitTool/issues)

<br />

</div>

---

## What is gittool?

gittool is an interactive Git command builder for developers who are tired of googling flag syntax.

Pick a command, toggle the flags you need, and get the exact command — ready to copy. No memorization. No manual page spelunking. No wrong flags in production.

**70+ commands. Every flag documented. Zero configuration.**

---

## Features

- **Visual builder** — toggle flags, fill in values, see your command update live
- **70+ Git commands** across 10 categories from `init` to `filter-branch`
- **One-click copy** — copies to clipboard and logs to history
- **Fuzzy search** — find any command or flag instantly
- **GitHub login** — save favorites, track history, create shareable links
- **Shareable commands** — generate a URL for any command + flag combination
- **Dark-first UI** — built for terminal people

---

## Screenshots

> _Add screenshots or a GIF of the command builder here_

---

## Tech Stack

| | |
|--|--|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 |
| **Database & Auth** | Supabase (PostgreSQL + GitHub OAuth) |
| **Deployment** | Vercel |
| **Package Manager** | pnpm |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18.17
- pnpm (`npm i -g pnpm`)
- A [Supabase](https://supabase.com) project
- A [GitHub OAuth App](https://github.com/settings/developers)

### 1. Clone & install

```bash
git clone https://github.com/Vibhav-y/GitTool.git
cd GitTool
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up the database

Run this SQL in your Supabase SQL Editor:

```sql
-- Favorites
create table public.favorites (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  command_slug text not null,
  created_at   timestamptz default now(),
  unique(user_id, command_slug)
);
alter table public.favorites enable row level security;
create policy "own favorites" on public.favorites
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Command history
create table public.command_history (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  command_slug text not null,
  command_used text not null,
  used_at      timestamptz default now()
);
alter table public.command_history enable row level security;
create policy "own history" on public.command_history
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Shared commands
create table public.shared_commands (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete set null,
  command_slug text not null,
  command_used text not null,
  note         text,
  created_at   timestamptz default now()
);
alter table public.shared_commands enable row level security;
create policy "public read" on public.shared_commands for select using (true);
create policy "auth write"  on public.shared_commands for insert
  with check (auth.uid() is not null);
```

### 4. Configure GitHub OAuth

1. Go to [GitHub → Developer Settings → OAuth Apps](https://github.com/settings/developers) → **New OAuth App**
2. Set the Authorization callback URL to:
   ```
   https://<your-supabase-project-id>.supabase.co/auth/v1/callback
   ```
3. In Supabase → **Authentication → Providers → GitHub**, paste your Client ID and Secret.

### 5. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
GitTool/
├── app/
│   ├── page.tsx                  # Home — command list
│   ├── commands/[slug]/page.tsx  # Command builder
│   ├── favorites/page.tsx        # Saved commands (auth)
│   ├── history/page.tsx          # Usage history (auth)
│   ├── share/[id]/page.tsx       # Shared command view
│   └── auth/callback/route.ts    # OAuth callback
│
├── components/
│   ├── CommandBuilder.tsx        # Interactive flag builder
│   ├── CommandCard.tsx           # Command preview
│   ├── CopyButton.tsx            # Clipboard + toast
│   ├── FavoriteButton.tsx        # Toggle favorite
│   ├── SearchBar.tsx             # Fuzzy search
│   └── AuthButton.tsx            # GitHub login/logout
│
├── data/commands/
│   ├── index.ts                  # Aggregated command list
│   ├── basics.ts                 # init, clone, status, add, commit
│   ├── branching.ts              # branch, checkout, switch, merge
│   ├── remote.ts                 # remote, fetch, pull, push
│   ├── history.ts                # log, diff, show, blame
│   ├── stash.ts                  # stash operations
│   ├── rebase.ts                 # rebase, cherry-pick, bisect
│   ├── tags.ts                   # tag, describe
│   ├── reset.ts                  # reset, revert, restore, clean
│   ├── config.ts                 # config, alias
│   └── advanced.ts               # reflog, worktree, submodule, gc…
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client (cookies)
│   ├── utils.ts                  # cn(), slugify(), copyToClipboard()
│   └── types.ts                  # Shared types
│
└── api/
    ├── favorites/route.ts        # GET, POST, DELETE
    ├── history/route.ts          # GET, POST
    └── share/route.ts            # POST, GET
```

---

## Commands Coverage

| Category | Commands |
|----------|----------|
| Basics | `init` `clone` `status` `add` `commit` `mv` `rm` |
| Branching | `branch` `checkout` `switch` `merge` `merge-base` |
| Remote | `remote` `fetch` `pull` `push` `ls-remote` |
| History | `log` `diff` `show` `blame` `shortlog` |
| Stash | `stash save/pop/list/apply/drop/clear` |
| Rebase | `rebase` `rebase -i` `cherry-pick` `bisect` |
| Tags | `tag` `describe` |
| Reset & Undo | `reset` `revert` `restore` `clean` |
| Config | `config` `alias` |
| Advanced | `reflog` `worktree` `submodule` `archive` `bundle` `gc` `fsck` |

---

## Adding a Command

Each command is a TypeScript object in `data/commands/`. Here's the shape:

```typescript
{
  slug: "git-log",            // URL key
  name: "git log",            // display name
  category: "history",
  description: "Show commit history.",
  baseCommand: "git log",
  options: [
    {
      id: "oneline",
      flag: "--oneline",
      label: "One line per commit",
      description: "Compact output — hash + message only.",
      type: "boolean",
      default: false,
    },
    {
      id: "n",
      flag: "-n",
      label: "Limit",
      description: "Show only the last N commits.",
      type: "number",
      placeholder: "10",
    },
  ],
  examples: [
    {
      description: "Compact graph of all branches",
      command: "git log --oneline --graph --all",
    },
  ],
}
```

To add a new command: define it in the right category file, export it, and add it to `data/commands/index.ts`. Open a PR.

---

## Deployment

### Vercel (recommended)

```bash
vercel --prod
```

Set these environment variables in your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
```

**Before going live:**
- Add your production domain to Supabase → Authentication → URL Configuration → Allowed Redirect URLs
- Update your GitHub OAuth App's callback URL to the production Supabase URL

---

## API

The internal REST API is documented separately in [`API_REFERENCE.md`](./API_REFERENCE.md).

Quick overview:

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/favorites` | ✓ | List saved favorites |
| `POST` | `/api/favorites` | ✓ | Add a favorite |
| `DELETE` | `/api/favorites` | ✓ | Remove a favorite |
| `GET` | `/api/history` | ✓ | Command usage history |
| `POST` | `/api/history` | ✓ | Log a command usage |
| `POST` | `/api/share` | ✓ | Create shareable link |
| `GET` | `/api/share/[id]` | ✗ | View shared command |

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feat/add-git-worktree-flags`
3. Make your changes
4. Open a pull request

Issues and PRs are welcome — especially new command definitions and flag additions.

---

## License

MIT © [Vibhav Y](https://github.com/Vibhav-y)

---

<div align="center">

Made by [Vibhav](https://github.com/Vibhav-y) · [gittool.dev](https://gittool.dev) · [linkedin.com/in/vibhav-y](https://linkedin.com/in/vibhav-y)

</div>
