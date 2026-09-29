package com.smsreaderpoc

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.json.JSONArray
import org.json.JSONObject

/**
 * Fires for every incoming SMS, manifest-registered so it still runs when the
 * app process isn't alive. Reads the PDUs straight off the intent (not the
 * content provider — on some OEMs/API levels the message isn't persisted to
 * the inbox yet when this fires), persists to SharedPreferences so a later
 * app launch can pick it up via `drainCaptured`, and emits a live event when
 * a React instance happens to already be running.
 */
class SmsReceiver : BroadcastReceiver() {

  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action != Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
      return
    }

    val parts = Telephony.Sms.Intents.getMessagesFromIntent(intent)
    if (parts.isNullOrEmpty()) {
      return
    }

    val address = parts[0].originatingAddress ?: ""
    val date = parts[0].timestampMillis
    val body = parts.joinToString(separator = "") { it.messageBody ?: "" }

    val message = JSONObject().apply {
      put("id", date)
      put("address", address)
      put("body", body)
      put("date", date)
      put("read", false)
    }

    persist(context, message)
    emitToJs(message)
  }

  private fun persist(context: Context, message: JSONObject) {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    val existing = JSONArray(prefs.getString(KEY_QUEUE, "[]"))

    val updated = JSONArray()
    updated.put(message)
    var i = 0
    while (i < existing.length() && updated.length() < MAX_QUEUE_SIZE) {
      updated.put(existing.get(i))
      i++
    }

    prefs.edit().putString(KEY_QUEUE, updated.toString()).apply()
  }

  private fun emitToJs(message: JSONObject) {
    val reactContext = SmsReaderModule.currentReactContext() ?: return
    if (!reactContext.hasActiveReactInstance()) {
      return
    }

    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(EVENT_NAME, message.toString())
  }

  companion object {
    const val PREFS_NAME = "sms_reader_poc"
    const val KEY_QUEUE = "captured_queue"
    const val MAX_QUEUE_SIZE = 200
    const val EVENT_NAME = "onSmsReceived"
  }
}
