# Deployment — cPanel (Node.js Selector / Passenger) + GitHub Actions

> **⚠ Inherited from the previous project.** This guide was written for the
> storefront Furnmasr was forked from. The *procedure* is accurate, but every
> concrete identifier below — the cPanel username (`furnmasrstore26`), the home
> and app paths, and the log filenames — was mechanically renamed and does **not**
> correspond to a real Furnmasr account. Replace them with the actual values from
> your hosting panel before following any of it.

The storefront is a **server-rendered** Next.js 16 app. It uses `src/proxy.ts`,
`await headers()` in the root layout, and a NextAuth route handler, so it **cannot** be
statically exported into `public_html`. It needs a live Node process.

This VPS is a **CloudLinux CageFS jail** — the cPanel user (`furnmasrstore26`) has a
restricted shell with **no root**, so we run the app through cPanel's built-in
**Node.js Selector (Phusion Passenger)** rather than PM2. Passenger starts and
supervises the Node process and connects the domain to it; there is no manual
reverse proxy to configure.

Architecture:

```
GitHub push (main)
  └─ Actions: npm ci → lint → tsc → next build (output: standalone)
       └─ tar-over-ssh bundle → VPS:$APP_DIR/releases/<sha>  (jail has no rsync)
            └─ symlink swap (current) → touch current/tmp/restart.txt
                 └─ reap workers left in *previous* releases → prune old releases

Browser → Apache + Passenger (cPanel vhost) → Next standalone server.js
```

Builds happen on GitHub runners, so the jailed VPS never runs `npm install` or
`next build` — it only serves the prebuilt bundle. That sidesteps the CageJail's
limited toolchain entirely.

Directory layout on the VPS (all under the cPanel user's home):

```
~/apps/furnmasr/
  current -> releases/<sha>     # Passenger "Application root" points HERE
  releases/<sha>/               # standalone bundle: server.js, .next/, public/, node_modules/
    tmp/restart.txt             # touch to reload Passenger (created by deploy)
  releases/<older-sha>/         # kept for rollback (last 5)
```

---

## One-time VPS setup

### 1. Create the directory skeleton (SSH as the cPanel user)

```bash
mkdir -p ~/apps/furnmasr/releases
```

Do **one** initial deploy from GitHub (push to `main`, or run the workflow
manually) so that `~/apps/furnmasr/current` and a first release exist. The
cPanel app-creation step below needs the app root to exist first.

### 2. Create the Node.js app in cPanel

**cPanel → Software → Setup Node.js App → Create Application**

| Field                        | Value                                              |
| ---------------------------- | -------------------------------------------------- |
| Node.js version              | 20.x (latest 20 offered)                           |
| Application mode             | Production                                          |
| Application root             | `apps/furnmasr/current`  (relative to home)         |
| Application URL              | `furnmasr.com`  (the domain, no subpath)       |
| Application startup file     | `server.js`                                        |

> **Application root is the `current` symlink.** cPanel writes its absolute path
> into the domain's Passenger config once; Passenger then follows the symlink
> live, so each deploy's symlink swap is picked up on the next restart. Do **not**
> click "Run NPM Install" — the bundle already ships its own `node_modules`.

Click **Create**, then **Start App**.

### 3. Runtime environment variables

`NEXT_PUBLIC_*` vars are inlined **at build time** on the GitHub runner — they do
**not** go here. Only **runtime** secrets do. In the Node.js App screen, use
**"Add Variable"** for each:

| Variable                | Value                                             |
| ----------------------- | ------------------------------------------------- |
| `NODE_ENV`              | `production`                                       |
| `NEXTAUTH_URL`          | `https://furnmasr.com` (non-www — see below)  |
| `NEXTAUTH_SECRET`       | «secret»                                           |
| `AUTH_SECRET`           | «secret»                                           |
| `GOOGLE_CLIENT_ID`      | «value»                                            |
| `GOOGLE_CLIENT_SECRET`  | «value»                                            |
| `FACEBOOK_CLIENT_ID`    | «value»                                            |
| `FACEBOOK_CLIENT_SECRET`| «value»                                            |

Click **Save**, then **Restart** the app for the vars to take effect.

> `NEXTAUTH_URL` **must** be the **non-www** origin — `next.config.js` 308-redirects
> www → non-www, and an OAuth callback landing on a redirect breaks the flow. Make
> sure the Google and Facebook consoles list
> `https://furnmasr.com/api/auth/callback/{google,facebook}`.

> **Why the Selector UI and not a `.env` file?** Next's standalone `server.js`
> does not load `.env` files at runtime. Passenger injects the Selector's
> variables into the process env directly, which is the reliable path.

### 4. Deploy SSH key (as the cPanel user)

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/gh_deploy -N ""
cat ~/.ssh/gh_deploy.pub >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys
cat ~/.ssh/gh_deploy          # → paste into the SSH_PRIVATE_KEY secret
```

Capture the host fingerprint from your machine:

```bash
ssh-keyscan -p 22 <VPS_IP>    # → paste into the SSH_KNOWN_HOSTS secret
```

---

## GitHub configuration

**Settings → Secrets and variables → Actions**

| Type     | Name                       | Example / notes                                  |
| -------- | -------------------------- | ------------------------------------------------ |
| Secret   | `SSH_HOST`                 | `142.132.213.14`                                 |
| Secret   | `SSH_USER`                 | `furnmasrstore26`                                 |
| Secret   | `SSH_PORT`                 | optional, defaults to 22                         |
| Secret   | `SSH_PRIVATE_KEY`          | contents of `~/.ssh/gh_deploy`                   |
| Secret   | `SSH_KNOWN_HOSTS`          | output of `ssh-keyscan`                          |
| Variable | `APP_DIR`                  | `/home/furnmasrstore26/apps/furnmasr`              |
| Variable | `NEXT_PUBLIC_SITE_URL`     | `https://furnmasr.com`                       |
| Variable | `NEXT_PUBLIC_API_BASE_URL` | production API base, **including** `/api`        |
| Variable | `NEXT_PUBLIC_API_URL`      | used by the NextAuth `social_login` call         |

Create a **production** environment (Settings → Environments) if you want a
manual approval gate before the deploy job runs.

> **Chicken-and-egg:** step 1 needs a first deploy to create `current`, but the
> deploy's "activate" step swaps a symlink that Passenger reads. Order it as:
> push once (creates `releases/<sha>` + `current`) → create the cPanel app
> (steps 2–3) → every later push just swaps + restarts. The first push's restart
> touch is harmless even before the app exists.

---

## Operations

**Reload** after changing env vars: use **Restart** in the cPanel Node.js App
screen (or `touch ~/apps/furnmasr/current/tmp/restart.txt`).

**Logs:** Passenger/stderr goes to the domain's error log —
`~/logs/furnmasr.com.error.log` or via cPanel → Metrics → Errors. Add
`console`-level logging sparingly; Passenger captures stdout/stderr.

**Rollback** to any of the last 5 releases (SSH as the cPanel user):

```bash
cd ~/apps/furnmasr
ls -1dt releases/*/                  # newest first
ln -sfn releases/<older-sha> current.tmp && mv -Tf current.tmp current
mkdir -p current/tmp && touch current/tmp/restart.txt
```

---

## Gotchas

- **`output: "standalone"` does not copy `public/` or `.next/static/`.** The
  workflow copies them into the bundle explicitly. If you ever build by hand, do
  the same or the site loads with no CSS and no images.
- **Changing a `NEXT_PUBLIC_*` value requires a rebuild**, not a restart — the
  value is inlined into the client JS. Update the repo variable, then re-run the
  workflow.
- **Passenger + Next standalone port binding:** Passenger hands the app a socket
  and intercepts `server.listen()`, so Next's `PORT`/`HOSTNAME` are ignored under
  Passenger — that's expected. If the app 503s right after the first start,
  Restart it once from the cPanel screen so Passenger re-reads the startup file.
- **Add new image CDN hosts** to `images.remotePatterns` in `next.config.js`, or
  `next/image` will 400 in production.
- **Surplus `next-server` workers / `NPROC` exhaustion.** Old
  `next-server`/`lsnode.js` processes pile up across restarts/deploys until the
  CageFS process cap is hit and you see `live_swrapper: Unable to fork` (the app
  then can't start at all).

  **Reaper ordering.** The reaper originally ran *before* `touch restart.txt` and
  killed every matching worker under `$APP_DIR`, including the live one, on the
  assumption that LiteSpeed detaches workers to PID 1. It does not: on this
  account app workers stay **children of the LiteSpeed spawner** (their PPID is
  the spawner, which lives outside the CageFS view, so `/proc/<ppid>` reads as
  "No such file"). Killing a supervised child just makes the supervisor respawn
  it — so each deploy produced *two* instances: one respawned in reaction to the
  kill, one from the `restart.txt` reload seconds later. Nothing removed the
  surplus, so the count climbed with every deploy.

  The order is now: **swap symlink → `restart.txt` → wait → reap only workers
  whose cwd is a _previous_ release → prune**. Workers serving the release just
  activated are deliberately spared; the supervisor owns their lifecycle.
  Pruning runs last so a directory a worker is still executing from is never
  deleted out from under it. Each deploy logs
  `Live workers under $APP_DIR after deploy:` — if that list grows deploy over
  deploy, the reaper has stopped matching.

  **The reaper is scoped to `$APP_DIR` on purpose.** This cPanel account also
  hosts other Node apps under `~/apps/` (e.g. `~/apps/madinty`), and the NPROC cap
  is per *user*, not per app. An unscoped `ps -u <user> | grep next-server` matches
  the sibling apps' workers too and would take their sites down on every deploy
  here. The step therefore resolves `/proc/<pid>/cwd` — which for a standalone
  server is its own release dir, since `server.js` does
  `process.chdir(__dirname)` — and keeps only PIDs under `$APP_DIR/`. Do not
  "simplify" it back to a bare `pgrep`.

  `ps` alone cannot tell workers apart: every standalone worker sets its title to
  `next-server (vX)` regardless of app or release. The version does identify the
  *app* here — Furnmasr is on Next 14, Madinty on Next 15 — but never tells you
  whether a worker is surplus. Only the cwd does.

  To clear surplus workers by hand, scoped to this app and sparing the live
  release:
  ```bash
  APP_DIR=~/apps/furnmasr
  LIVE=$(readlink -f "$APP_DIR/current")
  stale=""
  for pid in $(ps -u "$(id -un)" -o pid=); do
    cmd=$(tr '\0' ' ' 2>/dev/null < "/proc/$pid/cmdline") || continue
    case "$cmd" in *next-server*|*lsnode.js*|*server.js*) ;; *) continue ;; esac
    case "$(readlink "/proc/$pid/cwd" 2>/dev/null)" in
      "$LIVE"|"$LIVE"/*) ;;                       # live — keep
      "$APP_DIR"/*) stale="$stale $pid" ;;
    esac
  done
  echo "reaping:$stale"
  kill $stale 2>/dev/null; sleep 3; kill -9 $stale 2>/dev/null
  ```
  If you kill the live worker too, LiteSpeed respawns it — the site stays up, but
  you gain nothing. To audit first, without killing:
  ```bash
  for pid in $(pgrep -u "$USER" -f 'next-server|lsnode\.js|server\.js'); do
    printf '%s  %s\n' "$pid" "$(readlink /proc/$pid/cwd)"
  done | sort -k2
  ```
