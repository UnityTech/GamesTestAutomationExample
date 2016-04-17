using UnityEngine;
using System.Collections;

public class CoordinateLog : MonoBehaviour
{
	private float lastTimeLogged = -1.0f; 
	private float logInterval = 2.0f;

	private string CoordinateToJson (Camera camera)
	{
		Vector3 screenPos = camera.WorldToScreenPoint(transform.position);
		CoordinateSerializable coord = new CoordinateSerializable
		{
			x = (int)Mathf.Round(screenPos.x),
			y = (int)Mathf.Round(screenPos.y),
			deviceY = (int)Mathf.Round (Screen.height - screenPos.y),
			name = name,
			time = Time.time,
			type = GetType ().ToString (),
		};
		return JsonUtility.ToJson (coord);
	}

	private void CoordinateToLog (Camera camera)
	{
		if (camera == null)
			return;

		string coordinate = CoordinateToJson (camera);
		Debug.Log ("Automation-coordinate: " + coordinate);
		lastTimeLogged = Time.time;
	}

	void OnBecameVisible ()
	{
		CoordinateToLog (Camera.current);
	}

	void Update ()
	{
		if (lastTimeLogged < 0)
			return;

		if (lastTimeLogged + logInterval < Time.time)
			CoordinateToLog (Camera.current);
	}
}
