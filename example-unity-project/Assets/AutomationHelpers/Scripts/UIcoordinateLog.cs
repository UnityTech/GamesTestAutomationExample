using UnityEngine;
using System.Collections;

public class UICoordinateLog : MonoBehaviour
{
	private Rect screenRect;
	private Vector3 position;

	// Use this for initialization
	void Start ()
	{
		screenRect = new Rect (0,0, Screen.width, Screen.height);
		position = transform.position;

		if (screenRect.Contains (position))
			CoordinateToLog ();
	}

	// http://forum.unity3d.com/threads/find-anchoredposition-of-a-recttransform-relative-to-another-recttransform.330560/
	private Vector2 rectTransform2ScreenPoint(RectTransform rectT)
	{
		Vector2 fromPivotDerivedOffset = new Vector2(
			rectT.rect.width * rectT.pivot.x + rectT.rect.xMin,
			rectT.rect.height * rectT.pivot.y + rectT.rect.yMin);
		Vector2 screenPoint = RectTransformUtility.WorldToScreenPoint(null, rectT.position);
		screenPoint += fromPivotDerivedOffset;
		return screenPoint;
	}

	string CoordinateToJson()
	{
		Vector2 screenPos = rectTransform2ScreenPoint(GetComponent<RectTransform>());
		CoordinateSerializable coord = new CoordinateSerializable {
			x = (int)Mathf.Round (screenPos.x),
			y = (int)Mathf.Round (screenPos.y),
			deviceY = (int)Mathf.Round (Screen.height - screenPos.y),
			name = name,
			time = Time.time,
			type = GetType ().ToString (),
		};
		return JsonUtility.ToJson (coord);
	}
		
	void CoordinateToLog()
	{
		string coordinate = CoordinateToJson ();
		Debug.Log ("Automation-coordinate: " + coordinate);
	}
}
