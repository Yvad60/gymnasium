#!/bin/sh
# Metro + build/install on the connected device, in one terminal. Ctrl-C stops both.
set -e

# A fresh shell has none of the toolchain on PATH (the README's export lines are
# easy to skip), so resolve it here instead of depending on ~/.zshrc. Anything
# already exported wins.
: "${JAVA_HOME:=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home}"
: "${ANDROID_HOME:=/opt/homebrew/share/android-commandlinetools}"
export JAVA_HOME ANDROID_HOME
PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
export PATH

for tool in java adb; do
  command -v "$tool" >/dev/null 2>&1 || {
    echo "dev: '$tool' not found. See README → Toolchain setup." >&2
    exit 1
  }
done

# Without this check run-android reports "Failed to launch emulator", which is a
# confusing way to say "nothing is plugged in".
if ! adb devices | awk 'NR > 1 && $2 == "device" { found = 1 } END { exit !found }'; then
  echo "dev: no Android device attached. Enable USB debugging, then check 'adb devices'." >&2
  exit 1
fi

# run-android would spawn Metro in a terminal window of its own, and the two
# bundlers would fight over port 8081 — hence --no-packager.
#
# Metro's stdin comes from /dev/null so that, as a background job, it never tries
# to put the terminal in raw mode for its keyboard shortcuts. A background
# process that reads the TTY gets SIGTTIN and silently suspends, which looks
# exactly like the app failing to start. Trade-off: no r/d/j shortcuts here. Use
# the two-terminal flow (`npm start` + `npm run android`) if you want them.
npx react-native start < /dev/null &
METRO_PID=$!
trap 'kill $METRO_PID 2>/dev/null' EXIT INT TERM

npx react-native run-android --no-packager

# Build is installed; hold Metro in the foreground so the app has a bundle server.
wait $METRO_PID
