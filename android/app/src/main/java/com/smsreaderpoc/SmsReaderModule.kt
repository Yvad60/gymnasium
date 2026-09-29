package com.smsreaderpoc

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.provider.Telephony
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.smsreaderpoc.specs.NativeSmsReaderSpec
import java.lang.ref.WeakReference
import org.json.JSONArray
import org.json.JSONObject

@ReactModule(name = SmsReaderModule.NAME)
class SmsReaderModule(reactContext: ReactApplicationContext) :
  NativeSmsReaderSpec(reactContext) {

  init {
    contextRef = WeakReference(reactContext)
  }

  override fun getName() = NAME

  override fun readInbox(
    limit: Double,
    startMillis: Double,
    endMillis: Double,
    promise: Promise,
  ) {
    val context = reactApplicationContext

    if (context.checkSelfPermission(Manifest.permission.READ_SMS) !=
      PackageManager.PERMISSION_GRANTED
    ) {
      promise.reject("PERMISSION_DENIED", "READ_SMS has not been granted")
      return
    }

    val start = startMillis.toLong()
    val end = endMillis.toLong()

    if (end <= start) {
      promise.reject(
        "INVALID_RANGE",
        "endMillis ($end) must be greater than startMillis ($start)",
      )
      return
    }

    val projection = arrayOf(
      Telephony.Sms._ID,
      Telephony.Sms.ADDRESS,
      Telephony.Sms.BODY,
      Telephony.Sms.DATE,
      Telephony.Sms.READ,
    )

    try {
      val messages = JSONArray()
      val max = limit.toInt()

      // start inclusive, end exclusive. Bounds go through selectionArgs rather
      // than string interpolation.
      val selection = "${Telephony.Sms.DATE} >= ? AND ${Telephony.Sms.DATE} < ?"
      val selectionArgs = arrayOf(start.toString(), end.toString())

      context.contentResolver.query(
        Telephony.Sms.Inbox.CONTENT_URI,
        projection,
        selection,
        selectionArgs,
        "${Telephony.Sms.DATE} DESC",
      )?.use { cursor ->
        while (cursor.moveToNext() && messages.length() < max) {
          messages.put(
            JSONObject().apply {
              put("id", cursor.getLong(0))
              put("address", cursor.getString(1) ?: "")
              put("body", cursor.getString(2) ?: "")
              put("date", cursor.getLong(3))
              put("read", cursor.getInt(4) == 1)
            },
          )
        }
      } ?: run {
        promise.reject("NO_PROVIDER", "SMS content provider returned no cursor")
        return
      }

      promise.resolve(messages.toString())
    } catch (e: Exception) {
      promise.reject("READ_FAILED", e)
    }
  }

  override fun drainCaptured(promise: Promise) {
    val prefs = reactApplicationContext.getSharedPreferences(
      SmsReceiver.PREFS_NAME,
      Context.MODE_PRIVATE,
    )
    val queued = prefs.getString(SmsReceiver.KEY_QUEUE, "[]") ?: "[]"
    prefs.edit().remove(SmsReceiver.KEY_QUEUE).apply()
    promise.resolve(queued)
  }

  companion object {
    const val NAME = "NativeSmsReader"

    private var contextRef: WeakReference<ReactApplicationContext>? = null

    fun currentReactContext(): ReactApplicationContext? = contextRef?.get()
  }
}
