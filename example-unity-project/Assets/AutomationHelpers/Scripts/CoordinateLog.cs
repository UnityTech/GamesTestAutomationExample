using UnityEngine;
using System.Collections;

public class CoordinateLog : MonoBehaviour {
	public GameObject target;

	void Start() {
		target = gameObject;
	}

	string CoordinateToJson(Camera camera){
		Vector3 screenPos = camera.WorldToScreenPoint(target.transform.position);
		CoordinateSerializable coord = new CoordinateSerializable();
		coord.x = (int)Mathf.Round(screenPos.x);
		coord.y = (int)Mathf.Round(screenPos.y);
		coord.name = target.name;
		coord.time = Time.time;
		return JsonUtility.ToJson (coord);
	}

	void CoordinateToLog(Camera camera){
		string coordinate = CoordinateToJson (camera);
		Debug.Log ("Automation-coordinate: " + coordinate);
	}

	void OnBecameVisible(){
		Debug.Log ("Camera is " + Camera.current);
		CoordinateToLog (Camera.current);
	}

	void update(){
		CoordinateToLog (Camera.current);
	}

}
