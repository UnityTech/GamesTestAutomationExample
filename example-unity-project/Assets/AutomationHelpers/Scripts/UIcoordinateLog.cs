using UnityEngine;
using System.Collections;

public class UIcoordinateLog : MonoBehaviour {
	Rect screenRect;
	Vector3 position;
	// Use this for initialization
	void Start () {
		screenRect = new Rect (0,0, Screen.width, Screen.height);
		position = transform.position;
		if(screenRect.Contains(position)){
			CoordinateToJson ();
		}
	}

	string CoordinateToJson(){
		Camera camera = Camera.current;
		Vector3 parentPosition = transform.position;
		Vector3 offset = GetComponent<RectTransform>().localPosition;
		Vector3 anchPos = GetComponent<RectTransform>().anchoredPosition;
		Vector3 uiPosition = parentPosition + anchPos;
		Debug.Log ("uiPos(" + name + ") = " + uiPosition + ". AnchorPos = " + anchPos + ". ParentPos = " + parentPosition + ". Offset = " + offset);
		Vector3 screenPos = camera.WorldToScreenPoint(uiPosition);
		CoordinateSerializable coord = new CoordinateSerializable();
		coord.x = (int)Mathf.Round(screenPos.x);
		coord.y = (int)Mathf.Round(screenPos.y);
		coord.name = name;
		coord.time = Time.time;
		return JsonUtility.ToJson (coord);
	}

	// Update is called once per frame
	void Update () {
	
	}
}
