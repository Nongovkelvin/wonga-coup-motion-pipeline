# Wonga Coup: scripted documentary motion pipeline

The code behind the motion graphics and sound sync for *The London Millionaires Who Tried To Buy Equatorial Guinea*, a 40-minute YouTube documentary on the 2004 Wonga Coup that I'm editing for Jude Bela Studios. The film is still in edit, so **this repo is code only, with no frames, footage or audio from the film.**

About **7762 lines** of ExtendScript, Python and Swift. The ten chapter builders alone are 5732 lines.

## What it does

The director delivers a 39:36 talking-head first cut. The pipeline turns it into a fully illustrated film in a paper-and-document house style:

1. **Analysing the first cut.** A Whisper word-level transcript (5,858 timed words) gives every on-screen moment a time in first-cut seconds. Audio silence below −45 dB and black luma frames are scanned and cross-checked to find the 25 holes left for chapter cards and beat breaks.
2. **Building each chapter in After Effects (`chapters/NN_*/build_NN_*.jsx`).** Each script builds one chapter master, timed to the transcript, inside one undo group:
   - documents multiplied onto paper with timed yellow-marker highlights, typewriter reveals and rubber stamps;
   - maps with pins and routes, driven through a map-template controller (326 map calls across the film);
   - evidence boards of index cards with red arrows drawn on in 3D depth;
   - split-screen panels, parallax photos, detective-style montages, speed ramps and freeze holds;
   - ink and brush transitions;
   - archival grading of every stock clip.
3. **Generating chapters from chapters (`make_NN.py`).** Each chapter's builder is written by a Python generator. It takes the previous chapter's setup, helper functions and master pass, and splices in that chapter's media list and body. The style stays identical across all ten chapters while each one adds new devices to the shared helpers.
4. **Rendering.** `sound/rq_add.jsx` and `rq_render.jsx` queue and render the ten masters headless.
5. **Sound and sync (`sound/`).** `plan_wonga.py` reads the rendered masters and writes a Premiere Pro XML with the first cut on V1, the ten masters butted end to end on V2, and around 14 stereo lanes: voiceover, two music beds, transitions, card risers and hits, subs, reveals, foley, ambience and room tone. It also writes a cue sheet. The Swift tools do the signal work natively on macOS with AVFoundation:

| Tool | What it does |
|---|---|
| `grids` | 64×36 luma fingerprint of every frame |
| `vcuts` | cut detection from frame-to-frame luma difference |
| `thcheck` / `offscan` / `remap` | find where the talking head shows through each master and measure frame offsets, so edits made after the build re-sync automatically |
| `xoff` | audio offset by 10 ms envelope cross-correlation, overall and per 20 s window |
| `loud` | BS.1770 integrated, momentary and short-term LUFS, peaks and band energy |
| `eqbake` | bakes music copies with a 60 Hz high-pass and a −4 dB 2.5 kHz dip that ducks in only while the voice speaks (driven by `vomask.py`) |
| `mixr` | offline mix of the clip plan to check loudness before Premiere |
| `dec` / `grab` | audio decode and exact-time frame grabs for review |

## Layout

- **`lib/kit.jsx`**: the house-style look kit: paper base, document close-ups, marker, grain, depth of field and timing helpers. Every time argument is in first-cut seconds and converted per comp.
- **`lib/helpers_03.jsx`, `lib/helpers_04.jsx`**: shared devices that grew chapter by chapter: `arrow2D`, `chainCard`, `panel`, `detMontage`, `speedHold`, `addTransition` and more.
- **`chapters/`**: the ten chapter builders, their generators and `run_ae.sh`. That script takes a file lock so only one job drives After Effects at a time, then runs the script through `osascript … DoScriptFile`.
- **`broll/`**: a B-roll pass that probes each master and saves check frames at given first-cut times for review.
- **`sound/`**: the sync and sound planner plus the Swift and Python tools.

Paths are relative to a film folder (`FILM_ROOT`, default `~/Films/Jude Bela/Wonga coup`). The licensed templates, Envato packs, footage and music the scripts import aren't included, so the code is here to read rather than to run as is.

## Engineering notes

- **Build safety.** Every builder refuses to run unless the right project is open, and replaces only its own chapter folder on re-run. It never saves the project: the editor does.
- **Logging.** Long After Effects jobs outlive the AppleEvent timeout, so every script logs to a file next to itself.
- **Review.** Client review rules are dated in the code comments (for example, removing on-screen credits on 6 Nov), so each change can be traced to a note.

Built by Nongov Kelvin, with Claude Code as pair programmer.
