import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  /**
   * Reads the newest `limit` messages the SMS inbox holds in
   * `[startMillis, endMillis)` — start inclusive, end exclusive, both epoch
   * milliseconds.
   *
   * Resolves with a JSON string (an array of SmsMessage) so we don't have to
   * describe the row shape to codegen.
   */
  readInbox(
    limit: number,
    startMillis: number,
    endMillis: number,
  ): Promise<string>;

  /**
   * Drains messages captured by `SmsReceiver` while it ran (including while
   * the app process wasn't alive) and clears the queue. Resolves with a JSON
   * string in the same shape as `readInbox`.
   */
  drainCaptured(): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeSmsReader');
