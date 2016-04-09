using UnityEngine;
using System.Collections;

public class CoordinateLog : MonoBehaviour {
	private float lastTimeLogged = -1.0f; 
	private float logInterval = 2.0f;

	string CoordinateToJson(Camera camera){
		Vector3 screenPos = camera.WorldToScreenPoint(transform.position);
		CoordinateSerializable coord = new CoordinateSerializable();
		coord.x = (int)Mathf.Round(screenPos.x);
		coord.y = (int)Mathf.Round(screenPos.y);
		coord.deviceY = (int)Mathf.Round (Screen.height - screenPos.y);
		coord.name = name;
		coord.time = Time.time;
		coord.type = GetType ().ToString ();
		return JsonUtility.ToJson (coord);
	}

	void CoordinateToLog(Camera camera){
		string coordinate = CoordinateToJson (camera);
		Debug.Log ("Automation-coordinate: " + coordinate);
		lastTimeLogged = Time.time;
	}

	void OnBecameVisible(){
		CoordinateToLog (Camera.current);
	}

	void Update(){
		if (lastTimeLogged < 0) {
			return;
		}
		if (lastTimeLogged + logInterval < Time.time) {
			CoordinateToLog (Camera.current);
		}
	}
}
