using UnityEngine;
using System.Collections;

public class CoordinateSerializable
{
	public string name;
	public int x;
	public int y;
	// Mobile devices will mainly have origo at top-left
	public int deviceY;
	public float time;
	public string type;
}
