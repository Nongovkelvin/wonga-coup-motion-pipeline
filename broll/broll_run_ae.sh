#!/bin/zsh
# broll_run_ae.sh <script.jsx> [timeout s]: b-roll overnight runner (6 Nov). Takes the AE lock (never touches someone else's), runs one script under caffeinate, releases the lock.
A="${FILM_ROOT:-$HOME/Films/Jude Bela/Wonga coup}/Assets"
if ! mkdir "$A/.ae_lock" 2>/dev/null; then echo "LOCKED by: $(cat "$A/.ae_lock/owner" 2>/dev/null)"; exit 3; fi
echo "broll-overnight" > "$A/.ae_lock/owner"
caffeinate -di osascript -e "with timeout of ${2:-3600} seconds" -e "tell application \"Adobe After Effects 2025\" to DoScriptFile \"$1\"" -e "end timeout"; r=$?
[ "$(cat "$A/.ae_lock/owner" 2>/dev/null)" = "broll-overnight" ] && rm -r "$A/.ae_lock"
exit $r
