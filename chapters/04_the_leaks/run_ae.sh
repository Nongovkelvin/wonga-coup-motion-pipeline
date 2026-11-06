#!/bin/zsh
# run_ae.sh <script.jsx> [timeout s]: takes the AE lock (never touches someone else's), runs one script (display kept awake for the run), releases the lock
A="${FILM_ROOT:-$HOME/Films/Jude Bela/Wonga coup}/Assets"
if ! mkdir "$A/.ae_lock" 2>/dev/null; then echo "LOCKED by: $(cat "$A/.ae_lock/owner" 2>/dev/null)"; exit 3; fi
echo "overnight-runner" > "$A/.ae_lock/owner"
caffeinate -d -i osascript -e "with timeout of ${2:-3600} seconds" -e "tell application \"Adobe After Effects 2025\" to DoScriptFile \"$1\"" -e "end timeout"; r=$?
[ "$(cat "$A/.ae_lock/owner" 2>/dev/null)" = "overnight-runner" ] && rm -r "$A/.ae_lock"
exit $r
