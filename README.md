# SMS Reader — proof of concept

Answers one question: **can a React Native app on Android 8 read the device's SMS inbox?**
Yes. This app has a single "Read SMS" button that requests `READ_SMS`, queries the
SMS content provider, logs the messages, and lists them on screen.

## How it works

Android exposes SMS via a [content provider](https://developer.android.com/reference/android/provider/Telephony.Sms),
which has no JS API — so there's a small native module.

| File | Role |
| --- | --- |
| `specs/NativeSmsReader.ts` | TurboModule spec. Codegen turns this into the Java interface the Kotlin class implements. |
| `android/app/src/main/java/com/smsreaderpoc/SmsReaderModule.kt` | The actual read: `ContentResolver.query(Telephony.Sms.Inbox.CONTENT_URI, …)`, newest first, capped at `limit`. |
| `android/app/src/main/java/com/smsreaderpoc/SmsReaderPackage.kt` | Registers the module with React Native. |
| `android/app/src/main/java/com/smsreaderpoc/MainApplication.kt` | Adds `SmsReaderPackage()` to the package list. |
| `android/app/src/main/AndroidManifest.xml` | Declares `android.permission.READ_SMS`. |
| `App.tsx` | Button, runtime permission request, `console.log`, on-screen list. |

The module returns a **JSON string** rather than a structured array. Codegen would
otherwise need a declared type for every row field; for a PoC, `JSON.parse` on the JS
side is less machinery for the same result.

Reading does *not* require root, and does *not* require being the default SMS app —
that's only needed to *send* or *write* messages.

### Why not `react-native-get-sms-android`?

The obvious off-the-shelf package. It was last published in 2022 and cannot build
against RN 0.87: it uses `jcenter()` (dead since 2021), Android Gradle Plugin 3.3.1,
has no `namespace` in its `build.gradle` and a `package=` attribute in its library
manifest (both hard errors on AGP 8+), and depends on the `com.facebook.react:react-native`
artifact, which was renamed to `react-android`. Writing the module directly is ~60 lines
and has no such rot.

## Toolchain setup

This was set up from scratch on Apple Silicon macOS with no prior Android tooling.

```sh
brew install openjdk@17
brew install --cask android-commandlinetools

export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
export PATH="$PATH:$ANDROID_HOME/platform-tools"

yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-37.0" "build-tools;37.0.0"
```

Put the three `export` lines in your `~/.zshrc` so they survive new shells.

Note `platforms;android-37.0`, not `android-37` — Google now minor-versions SDK
platforms, and the un-suffixed name no longer resolves.

`android/local.properties` pins `sdk.dir` to the same path. It's gitignored by
default, so it needs recreating on a fresh clone.

## Running it

Connect the Android 8 phone over USB with **USB debugging** enabled
(Settings → Developer options), then:

```sh
adb devices          # confirm the phone shows up as "device", not "unauthorized"
npm start            # Metro, in one terminal
npm run android      # build + install, in another
```

Tap **Read SMS**, accept the permission prompt, and the messages appear on screen.
The detailed log lines go to the Metro terminal, or:

```sh
adb logcat -s ReactNativeJS
```

`minSdkVersion` is 24, so Android 8 (API 26) is in range.

### Building an APK to sideload

A **debug** APK fetches its JS bundle from Metro over USB, so it only runs while your
computer is attached. For an APK that runs on the phone by itself, build **release** —
it embeds the bundle:

```sh
cd android && ./gradlew assembleRelease
# android/app/build/outputs/apk/release/app-release.apk
```

Install it over USB:

```sh
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

Or copy the `.apk` to the phone and tap it — Android 8 will ask you to allow
"install unknown apps" for whichever app you opened it from.

Release builds are signed with the key described in `keystore.properties`
(gitignored, alongside the `.keystore` itself). Both are needed to produce an
*upgradable* build: if you lose them, a rebuilt APK has a different signature and
Android will refuse to install it over the existing one — you'd have to uninstall
first. Without `keystore.properties` the build silently falls back to the debug key,
which is fine for a PoC but not stable across machines.

`keystore.properties.sample` documents the format for a fresh clone.

## If you ship this further

- `READ_SMS` is a **restricted permission** on the Play Store; distributing there needs
  a permissions declaration form. Sideloading onto one phone is unaffected.
- The permission request here handles grant/deny but not the "don't ask again" state,
  which needs deep-linking to app settings.
- Only `Telephony.Sms.Inbox` is read. Sent messages live under `Telephony.Sms.Sent`.
