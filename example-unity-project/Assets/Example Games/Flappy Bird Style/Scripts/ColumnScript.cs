using UnityEngine;
using System.Collections;

public class ColumnScript : MonoBehaviour 
{
	void OnTriggerEnter2D(Collider2D other)
	{
		//if the bird hits the trigger collider in between the columns then
		//tell the game control that the bird scored
		GameControlScript.current.BirdScored ();
	}
}
