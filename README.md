# GamesTestAutomationExample
Examples and libraries for (Unity3d) mobile game automation testing.

## Purpose
Mobile game automation testing is tricky, the purpose of this project is to provide game developers and QA personel with ideas, examples and libraries which can aid in setting up test automation for a game project.

### Starting point of this project
- [appium](http://appium.io/) can handle device communication for both Android and iOS
  - This includes installing apps, screenshotting, sending touch-events and reading logs

### Problem with image recognition
For game test automation on mobile, the go-to solution is often to use image recognition (e.g. [OpenCV](http://opencv.org/)) to identify captured screenshots or assets are visible on screen. This works in some cases but comes with a lot of problems:
- Games should be tested during development, the assets of the game keep changing and it is a hassle to keep them up to date.
- Managing different versions of assets for different versions (Android, iOS, free, paid, HD) will lead to confusion about which version should be used in which test.
- Mobile devices have different resolutions and screen aspects, so the image comparison needs to deal with scaling
- Image comparison algorithms are slow for the currently large resolutions of devices
- Animated assets cause problems
- Taking screenshots is slow
- Using a VNC-solution will cause latency and artifacts
- etc...

### Problem #1 Verifying that something occured in game
The easiest way to communicate information from the game to the tests scripts is to read them from log. Logcat for Android or syslog for iOS. In Unity3d you can do this simply by using the [Debug class](http://docs.unity3d.com/ScriptReference/Debug.Log.html). If you have a lot of information you need to read from the game to the test-scripts you can use a standard format such as [JSON](https://en.wikipedia.org/wiki/JSON). The [itest-niacin](github.com/Applifier/itest-niacin) libraries used in this repository can handle the JSON parsing in your tests scripts.

### Problem #2 Verifying that something is rendered correctly
Image recognition can be made much more robust for this. For a faster implementation consider using [QR-codes](https://en.wikipedia.org/wiki/QR_code), there are good, fast QR-code reading libraries which allows you to quickly find if your scene/sprite/object was rendered correctly and visible for the player. Please keep in mind that QR-codes are designed with error correction which enables it to be read even with only a part of the QR-code visible.
TODO: Examples and libs with QR-codes

### Problem #3 Finding UI-elements and Gameobjects on screen.
For native UI-elemnents of both Android and iOS this is solved by the platform and you can use Appium to find elements on screen. For games this gets more difficult as the platform cannot help you find the elements. 
A solution which will work for many cases (especially menus and 2D games) is to instument the game to write positions of the elements/objects into the device log. Once again using a standard format such as JSON is recommended. 

See description below in `Use in your own project` on how to integrate the Unity-asset and test libraries into your game project to implement this.

## Usage
### To run example tests using the example-app
- Install [Android Debug Bridge](http://developer.android.com/tools/help/adb.html)
- Install [appium](http://appium.io/) 1.4.16
- Connect an Android device or use emulator
- Start appium server

```
git clone https://github.com/UnityTech/GamesTestAutomationExample
cd GamesTestAutomationExample/tests
./run-tests-android.sh
```

### Use in your own project
![](http://i.imgur.com/Cbos0J9.gif)
- Download the file `example-unity-project/AutomationHelpers.unitypackage` from this repository and drag to your unity project
- Drag the `ObjectLogger`-prefab from the folder `Assets/AutomationHelpers/Prefabs` into root of your project
- Open the `ObjectLogger`-Gameobject in inspector and drag the Gameobject you wish to use in your test in appropriate fields
  - `Logged Objects`-fields should be populated with typical Gameobjects
  - `Ui menu Object`-field can be populated with a UI-object (unity 5+)

## TODO: 
- Write better docs with screenshots
- More examples
- Other methods of testing
- Explain what one can do with this project
- Cloud based testing (testdroid) example
