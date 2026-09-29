import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  PermissionsAndroid,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import NativeSmsReader from './specs/NativeSmsReader';

type SmsMessage = {
  id: number;
  address: string;
  body: string;
  date: number;
  read: boolean;
};

const PRESETS = [
  { key: '24h', label: '24h', days: 1 },
  { key: '7d', label: '7d', days: 7 },
  { key: '30d', label: '30d', days: 30 },
  { key: 'all', label: 'All', days: null },
] as const;

type PresetKey = (typeof PRESETS)[number]['key'];

/** Local midnight of `date`, n days later. */
function startOfDay(date: Date, plusDays = 0) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + plusDays,
  );
}

function toDayText(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

/**
 * Strict YYYY-MM-DD → local midnight. Returns null for anything else,
 * including rollovers like 2026-02-31 that `new Date` would silently accept.
 */
function parseDay(text: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text.trim());
  if (!match) {
    return null;
  }

  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);

  if (date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

function rangeForPreset(days: number | null) {
  const today = startOfDay(new Date());
  return {
    start: days === null ? new Date(1970, 0, 1) : startOfDay(today, -days),
    end: today,
  };
}

const INITIAL = rangeForPreset(7);

export default function App() {
  const [messages, setMessages] = useState<SmsMessage[]>([]);
  const [status, setStatus] = useState('Pick a range, then read the SMS inbox.');
  const [busy, setBusy] = useState(false);
  const [startText, setStartText] = useState(toDayText(INITIAL.start));
  const [endText, setEndText] = useState(toDayText(INITIAL.end));
  const [preset, setPreset] = useState<PresetKey | null>('7d');
  const [captured, setCaptured] = useState<SmsMessage[]>([]);

  useEffect(() => {
    async function init() {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      ]);
      console.log('[sms] startup permissions:', granted);

      try {
        const raw = await NativeSmsReader.drainCaptured();
        const parsed: SmsMessage[] = JSON.parse(raw);
        if (parsed.length) {
          console.log(`[sms] drained ${parsed.length} captured message(s)`);
          setCaptured(prev => [...parsed, ...prev]);
        }
      } catch (e) {
        console.error('[sms] drainCaptured failed:', e);
      }
    }

    init();

    const subscription = DeviceEventEmitter.addListener(
      'onSmsReceived',
      (raw: string) => {
        try {
          const message: SmsMessage = JSON.parse(raw);
          console.log('[sms] live message received:', message);
          setCaptured(prev => [message, ...prev]);
        } catch (e) {
          console.error('[sms] failed to parse live message:', e);
        }
      },
    );

    return () => subscription.remove();
  }, []);

  function applyPreset(key: PresetKey, days: number | null) {
    const { start, end } = rangeForPreset(days);
    setStartText(toDayText(start));
    setEndText(toDayText(end));
    setPreset(key);
  }

  async function readSms() {
    const start = parseDay(startText);
    const end = parseDay(endText);

    if (!start || !end) {
      setStatus('Dates must be YYYY-MM-DD.');
      return;
    }

    if (end < start) {
      setStatus('"To" cannot be earlier than "From".');
      return;
    }

    setBusy(true);
    setMessages([]);
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      );
      console.log('[sms] permission result:', granted);

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        setStatus(`Permission not granted (${granted}).`);
        return;
      }

      // "To" is inclusive on screen; the native side takes a half-open
      // interval, so the end bound is midnight of the following day.
      const startMillis = start.getTime();
      const endMillis = startOfDay(end, 1).getTime();

      console.log(
        `[sms] range ${start.toISOString()} .. ${new Date(
          endMillis,
        ).toISOString()} (exclusive)`,
      );

      const raw = await NativeSmsReader.readInbox(1000, startMillis, endMillis);
      const parsed: SmsMessage[] = JSON.parse(raw);

      console.log(`[sms] read ${parsed.length} message(s)`);
      parsed.forEach(m => {
        console.log(
          `[sms] ${new Date(m.date).toISOString()} from=${m.address} read=${
            m.read
          } body=${JSON.stringify(m.body)}`,
        );
      });

      setMessages(parsed);
      setStatus(
        `Read ${parsed.length} message(s) from ${toDayText(start)} to ${toDayText(
          end,
        )}. See Metro logs for detail.`,
      );
    } catch (e: any) {
      console.error('[sms] failed:', e);
      setStatus(`Failed: ${e?.message ?? String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>SMS Reader PoC</Text>

        <View style={styles.presets}>
          {PRESETS.map(p => (
            <Pressable
              key={p.key}
              style={[
                styles.preset,
                preset === p.key && styles.presetActive,
              ]}
              disabled={busy}
              onPress={() => applyPreset(p.key, p.days)}
            >
              <Text
                style={[
                  styles.presetLabel,
                  preset === p.key && styles.presetLabelActive,
                ]}
              >
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>From</Text>
          <TextInput
            style={styles.input}
            value={startText}
            onChangeText={text => {
              setStartText(text);
              setPreset(null);
            }}
            placeholder="YYYY-MM-DD"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numbers-and-punctuation"
            editable={!busy}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>To</Text>
          <TextInput
            style={styles.input}
            value={endText}
            onChangeText={text => {
              setEndText(text);
              setPreset(null);
            }}
            placeholder="YYYY-MM-DD"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numbers-and-punctuation"
            editable={!busy}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          disabled={busy}
          onPress={readSms}
        >
          <Text style={styles.buttonLabel}>
            {busy ? 'Reading…' : 'Read SMS'}
          </Text>
        </Pressable>
        <Text style={styles.status}>{status}</Text>
        {busy && <ActivityIndicator style={styles.spinner} />}
      </View>

      {captured.length > 0 && (
        <View style={styles.captured}>
          <Text style={styles.capturedTitle}>
            Live captures ({captured.length})
          </Text>
          <ScrollView
            style={styles.capturedList}
            contentContainerStyle={styles.listInner}
          >
            {captured.map(m => (
              <View key={`${m.id}-${m.date}`} style={styles.row}>
                <Text style={styles.rowFrom}>{m.address || '(unknown)'}</Text>
                <Text style={styles.rowDate}>
                  {new Date(m.date).toLocaleString()}
                </Text>
                <Text style={styles.rowBody}>{m.body}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView style={styles.list} contentContainerStyle={styles.listInner}>
        {messages.map(m => (
          <View key={m.id} style={styles.row}>
            <Text style={styles.rowFrom}>{m.address || '(unknown)'}</Text>
            <Text style={styles.rowDate}>
              {new Date(m.date).toLocaleString()}
            </Text>
            <Text style={styles.rowBody}>{m.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: '600', color: '#111' },
  presets: { flexDirection: 'row', gap: 8 },
  preset: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d4d4d8',
  },
  presetActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  presetLabel: { color: '#3f3f46', fontSize: 13, fontWeight: '600' },
  presetLabelActive: { color: '#fff' },
  field: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fieldLabel: { width: 44, color: '#555', fontSize: 13 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d4d4d8',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#111',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: { opacity: 0.7 },
  buttonLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },
  status: { color: '#555', fontSize: 13 },
  spinner: { alignSelf: 'flex-start' },
  captured: {
    maxHeight: 160,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fefce8',
  },
  capturedTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#854d0e',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  capturedList: { flex: 1 },
  list: { flex: 1, borderTopWidth: 1, borderTopColor: '#eee' },
  listInner: { padding: 20, gap: 16 },
  row: { gap: 2 },
  rowFrom: { fontWeight: '600', color: '#111' },
  rowDate: { fontSize: 11, color: '#888' },
  rowBody: { color: '#333' },
});
