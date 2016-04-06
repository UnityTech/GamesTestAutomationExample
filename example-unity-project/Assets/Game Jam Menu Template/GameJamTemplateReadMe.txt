Game Jam Template 


The intent of this package is to eliminate some of the less exciting work of creating a small working game including title screen menu, pause menu and basic audio options.

If you would prefer to watch a video which includes a quick setup walk through and a longer explanation of how the package works, look here: http://unity3d.com/learn/tutorials/modules/beginner/live-training-archive/game-jam-template

Setup guide:


1. Import the Game Jam Template Package.


1. Open the folder in Assets > Game Jam Template > Prefabs


1. Drag the two prefabs in that folder called UI and EventManager into the scene you want your main menu to appear in.
2. Configure the options below as needed.


Start Options:


The UI game object has a component called Start Options attached to it, choose from the following options:


* Change Scenes: if your game happens in a single scene, the scene in which this menu has been added, leave this at it’s default value of false. 
* If you want to change scenes when the Start button is pressed add the scene you want to load to the Build Settings (via File > Build Settings)
* To the right of each scene in the Build Settings is a number, this is the scene index. Add the number of the scene you want to load to the Scene To Start variable of Start Options.  If you only have two scenes, the default index value of Scene To Start (1) should work.
* Set Change Scenes to true.


Audio Configuration:


The UI game object has a component called PlayMusic attached to it.
* Assign the Audio Clip containing your title music loop to the Title Music variable
* If you have separate music for your main game play, assign that to the Audio Clip variable Main Music
* If you have separate music for your main game play and your game runs in a single scene, set Change Music On Start to True.
* The clip assigned to Main music will play if scene index 1 is loaded. If you want the same music to play after changing scenes leave Change Music On Start false.
* Assign the ‘Output’ property of each Audio Source playing sound effects to the ‘SoundFx’ group of ‘MasterMixer’ by clicking the circle select button to the right of Output.


To change the Game Title, edit the Text field of the Text component attached to TitleText found under in the hierarchy under UI > MenuPanel > Title > TitleText.










Functionality:


Main Menu
-Placeholder title image and title text
-Start Button
- Options Button
- Quit Button
- Fade to black (or any color assigned to FadeImage) when transitioning out of main menu to main scene


Options Panel
-Music Volume
-Sound Effects Volume
-Back Button


Pause Panel
-Music Volume
-Sound Effects Volume
- Resume Button
- Quit Button


Music 
-Play music based on scene number
-Music pre-routed to Audio Mixer, connected to UI


Other functionality:


-Can be used either with single scene or multi-scene games.