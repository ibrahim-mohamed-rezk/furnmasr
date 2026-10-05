#!/bin/bash
# Reap orphaned next-server workers (PPID=1). They've detached from the
# Passenger supervisor, so cPanel Restart/Stop can't touch them. Live workers
# always have a real parent PID, so this never kills a serving instance.
# Safe for the whole account (madinty + furnmasr) — targets orphans only.
set -u
for pid in $(pgrep -u "$(id -un)" -f next-server 2>/dev/null); do
  ppid=$(ps -o ppid= -p "$pid" 2>/dev/null | tr -d ' ')
  if [ "$ppid" = "1" ]; then
    kill "$pid" 2>/dev/null && echo "$(date '+%F %T') reaped orphan $pid"
  fi
done
