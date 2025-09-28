# Google Maps Setup Guide for UniNoah

## 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API (optional)
4. Create credentials (API Key)
5. Restrict the API key to your app package/bundle ID

## 2. Android Configuration

### Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<application>
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_API_KEY_HERE"/>
</application>
```

## 3. iOS Configuration

### Add to `ios/UniNoah/AppDelegate.mm`:
```objc
#import <GoogleMaps/GoogleMaps.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"YOUR_GOOGLE_MAPS_API_KEY_HERE"];
  // ... rest of your code
}
```

## 4. Environment Variables (Recommended)

Create `.env` file in project root:
```
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

Then use in your code:
```javascript
import { GOOGLE_MAPS_API_KEY } from '@env';
```

## 5. Current Implementation

The map is configured with:
- University of Hargeisa coordinates (9.5632, 44.0672)
- Real-time user location
- Interactive ride markers
- Clean, minimal UI
- Tap-to-book functionality

## 6. Features Included

- ✅ Real Google Maps integration
- ✅ Custom university marker
- ✅ Interactive ride markers
- ✅ User location display
- ✅ Smooth animations
- ✅ Tap to select and book rides
- ✅ Locate user button
- ✅ Refresh rides functionality

## 7. Next Steps

1. Add your Google Maps API key
2. Test on both Android and iOS
3. Customize university coordinates if needed
4. Add real GPS location fetching
5. Connect to real ride data API
