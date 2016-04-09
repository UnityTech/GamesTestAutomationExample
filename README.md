# GamesTestAutomationExample
The collecting ideas on how to do Test Automation in Games

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
