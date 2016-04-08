using UnityEngine;
using System.Collections;

public class ObjectLogger : MonoBehaviour {
	public GameObject[] loggedObjects = {};

	// Use this for initialization
	void Start () {
		Debug.Log ("Adding scripts to log position of " + loggedObjects.Length + " components");
		GameObject loggableObject;
		for (int i = 0 ; i < loggedObjects.Length ; i++){ 
			loggableObject = loggedObjects [i];
			if (loggableObject == null)
				return;
			loggableObject.AddComponent(System.Type.GetType("CoordinateLog"));
		}
	}

	void Update(){

	}
}