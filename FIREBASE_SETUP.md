# Firebase Setup Guide

## Firebase Database Rules

Firebase Console में जाकर ये rules paste करें:

### Steps:
1. Firebase Console खोलें: https://console.firebase.google.com/
2. अपना project select करें: **rebelvids-academy**
3. Left sidebar में **Realtime Database** पर click करें
4. **Rules** tab पर click करें
5. नीचे दिए गए rules paste करें:

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": true
    },
    "users": {
      ".read": true,
      ".write": true
    }
  }
}
```

6. **Publish** button पर click करें

## Important Notes:

✅ **हाँ, अगर आप website को Firebase पर host करेंगे और admin panel से product add करेंगे, तो वो सभी devices पर show होगा!**

### क्यों?
- Products अब Firebase Realtime Database में store होते हैं
- सभी pages Firebase से directly products fetch करती हैं
- Real-time updates: जब भी admin panel से product add/delete होगा, website automatically update हो जाएगी
- कोई server की जरूरत नहीं - सिर्फ Firebase Hosting चाहिए

### Firebase Hosting के लिए:
1. Firebase CLI install करें: `npm install -g firebase-tools`
2. Login करें: `firebase login`
3. Initialize करें: `firebase init hosting`
4. Deploy करें: `firebase deploy --only hosting`

### Testing:
- Admin panel से product add करें
- किसी भी device/browser से website खोलें
- Product automatically show होगा (real-time update)

