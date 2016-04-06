using UnityEngine;
using System.Collections;

public class BirdScript : MonoBehaviour 
{
	public float upForce;			//upward force of the "flap"
	public float forwardSpeed;		//forward movement speed
	public bool isDead = false;		//has the player collided with a wall?

	Animator anim;					//reference to the animator component
	bool flap = false;				//has the player triggered a "flap"?


	void Start()
	{
		//get reference to the animator component
		anim = GetComponent<Animator> ();
		//set the bird moving forward
		GetComponent<Rigidbody2D>().velocity = new Vector2 (forwardSpeed, 0);
		GetComponent<Rigidbody2D>().constraints = RigidbodyConstraints2D.FreezePositionX | RigidbodyConstraints2D.FreezePositionY;
	}

	void Update()
	{
		if (GameControlScript.current.isInMenu) {
			return;
		}
		//don't allow control if the bird has died
		if (isDead)
			return;
		//look for input to trigger a "flap"
		if (Input.anyKeyDown) {
			Debug.Log ("Now move!");
			GetComponent<Rigidbody2D> ().constraints = RigidbodyConstraints2D.None;
			GetComponent<Rigidbody2D> ().velocity = new Vector2 (forwardSpeed, 0);
			flap = true;
		}
	}

	void FixedUpdate()
	{
		//if a "flap" is triggered...
		if (flap) 
		{
			flap = false;

			//...tell the animator about it and then...
			anim.SetTrigger("Flap");
			//...zero out the birds current y velocity before...
			GetComponent<Rigidbody2D>().velocity = new Vector2(GetComponent<Rigidbody2D>().velocity.x, 0);
			//..giving the bird some upward force
			GetComponent<Rigidbody2D>().AddForce(new Vector2(0, upForce));
		}
	}

	void OnCollisionEnter2D(Collision2D other)
	{
		//if the bird collides with something set it to dead...
		isDead = true;
		//...tell the animator about it...
		anim.SetTrigger ("Die");
		//...and tell the game control about it
		GameControlScript.current.BirdDied ();
	}
}
