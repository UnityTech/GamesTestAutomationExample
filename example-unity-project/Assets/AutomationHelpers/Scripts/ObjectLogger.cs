using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class ObjectLogger : MonoBehaviour
{
	public GameObject[] loggedObjects = { };
	public GameObject uiMenuObject;

	// Use this for initialization
	void Start ()
	{
		Debug.Log ("Adding scripts to log position of " + loggedObjects.Length + " Gameobject components");
		GameObject loggableObject;
		for (int i = 0 ; i < loggedObjects.Length ; i++)
		{
			loggableObject = loggedObjects [i];
			if (loggableObject == null)
				return;
			loggableObject.AddComponent(System.Type.GetType("CoordinateLog"));
		}

		Transform[] uiObjectChildren = { };
		uiObjectChildren = uiMenuObject.GetComponentsInChildren<Transform>();

		Debug.Log ("Adding scripts to log position of " + uiObjectChildren.Length + " UI component");
		for (int i = 0 ; i < uiObjectChildren.Length ; i++)
		{
			loggableObject = uiObjectChildren[i].gameObject;
			if (loggableObject == null)
				return;
			loggableObject.AddComponent(System.Type.GetType("UIcoordinateLog"));
		}
	}
}
