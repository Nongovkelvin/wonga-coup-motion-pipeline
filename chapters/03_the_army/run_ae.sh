#!/bin/zsh
# run_ae.sh <script.jsx> [timeout s]: takes the AE lock (never touches someone else's), runs one script, releases the lock
A="${FILM_ROOT:-$HOME/Films/Jude Bela/Wonga coup}/Assets"
if ! mkdir "$A/.ae_lock" 2>/dev/null; then echo "LOCKED by: $(cat "$A/.ae_lock/owner" 2>/dev/null)"; exit 3; fi
echo "wonga-03" > "$A/.ae_lock/owner"
osascript -e "with timeout of ${2:-3600} seconds" -e "tell application \"Adobe After Effects 2025\" to DoScriptFile \"$1\"" -e "end timeout"; r=$?
[ "$(cat "$A/.ae_lock/owner" 2>/dev/null)" = "wonga-03" ] && rm -r "$A/.ae_lock"
exit $r
