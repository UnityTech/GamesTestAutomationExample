using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class ObjectLogger : MonoBehaviour
{
	public GameObject[] LoggedObjects = { };
	public GameObject UIMenuObject;

	// Use this for initialization
	void Start ()
	{
		Debug.Log ("Adding scripts to log position of " + LoggedObjects.Length + " Gameobject components");
		GameObject loggableObject;
		for (int i = 0 ; i < LoggedObjects.Length ; i++)
		{
			loggableObject = LoggedObjects [i];
			if (loggableObject == null)
				return;
			loggableObject.AddComponent(System.Type.GetType("CoordinateLog"));
		}

		if (UIMenuObject != null)
		{
			Transform[] uiObjectChildren = { };
			uiObjectChildren = UIMenuObject.GetComponentsInChildren<Transform> ();

			Debug.Log ("Adding scripts to log position of " + uiObjectChildren.Length + " UI component");
			for (int i = 0; i < uiObjectChildren.Length; i++)
			{
				loggableObject = uiObjectChildren [i].gameObject;
				if (loggableObject == null)
					return;
				loggableObject.AddComponent (System.Type.GetType ("UIcoordinateLog"));
			}
		}
	}
}
