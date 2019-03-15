const FPS = 30;
const SecodsBetweenFrames = 1 / FPS;
var Can;
var Cancon;

//Canvas Setup
Can = document.getElementById( "mycanvas" );
Cancon = Can.getContext( "2d" );
Can.style.cursor = "none";

const CanvasX = Can.width;
const CanvasY = Can.height;

var Player;
var Target;
var Bullet;
var TargetArray;
var TargetGraphic;

//var MinXBounds;
//var MinYBounds;
//var MaxXBounds;
//var MaxYBounds;



window.onload = function(){ ini(); }


function ini()
{
	

	//Player
	Player = new Object();


    //Player Graphics
	Player.Body = new Image();
	Player.Body.src = "body.png";

	Player.Turret = new Image();
	Player.Turret.src = "turret.png";

	Player.Track = new Image();
	Player.Track.src = "track.png";


    //Player Vars
	Player.X = ( CanvasX / 2 );
	Player.Y = ( CanvasY / 2 );
	Player.Speed = 0.0;
	Player.Acc = 0.1;
	Player.Rotation = 0;
	Player.RotationSpeed = 1;
	Player.TurretRotation = 0;
	Player.TurretRotationSpeed = 1.0;
	Player.ReloadTime = 0;


    //Player Events
	Player.RotateRight = false;
	Player.RotateLeft = false;
	Player.Foward = false;
	Player.Backwards = false;
	Player.RotateTurretLeft = false;
	Player.RotateTurretRight = false;
	Player.Fire = false;


    //Bullet
    Bullet = new Object();

    //Bullet Graphic
    Bullet.Body = new Image();
    Bullet.Body.src = "bullet.png";

    //Bullet Vars
    Bullet.Alive = false;
    Bullet.X = 0;
    Bullet.Y = 0;
    Bullet.Rotation = 0;
    Bullet.Life = 0;
    Bullet.Speed = 7.5;

    //Targets
    
    TargetArray = new Array;

    for( var i = 0; i < 3; i++ )
    {
        var Tmp = new Object;
        Tmp.X = ( 200 * ( i + 1 ) );
        Tmp.Y = 100;
        Tmp.Vis = true;
        TargetArray.push( Tmp );
    } 

    //Target Graphic
    TargetGraphic = new Image();
    TargetGraphic.src = "jeep.png";




	//SetGameLoop
	setInterval( Gameloop, SecodsBetweenFrames * 1000 );
}

function Gameloop()
{
	Cancon.fillStyle="#669900";
	Cancon.fillRect( 0, 0, CanvasX, CanvasY );
	Cancon.save();
	
	if ( Player.Speed < 0.001 && Player.Speed > -0.001 ){ Player.Speed = 0; }
	else if ( Player.Speed > 0 ){ Player.Speed -= ( Player.Acc / 10 ); } 
	else if ( Player.Speed < 0 ){ Player.Speed += ( Player.Acc / 10 ); } 
	
	if( Player.Foward )
	{ 
		if( Player.Speed < 1.0 )
		{
			Player.Speed += Player.Acc;
		} 
	}
	if( Player.Backward )
	{ 
		if( Player.Speed > -0.5 )
		{
			Player.Speed -= Player.Acc; 
		}
	}
	if( Player.RotateRight )
    { 
        Player.Rotation += Player.RotationSpeed;
        Player.TurretRotation += Player.RotationSpeed;
    }
	if( Player.RotateLeft )
    { 
        Player.Rotation -= Player.RotationSpeed;
        Player.TurretRotation -= Player.RotationSpeed;  
    }


	if( Player.Rotation < 0 ){ Player.Rotation = 359; }
	if( Player.Rotation > 359 ){ Player.Rotation = 0; }
	
	var Radians = ( ( Math.PI / 180 ) * Player.Rotation );
	
	Player.X += ( Player.Speed * Math.cos( Radians ) );
	Player.Y += ( Player.Speed * Math.sin( Radians ) );

	if( Player.RotateTurretRight ){ Player.TurretRotation += Player.TurretRotationSpeed; }
	if( Player.RotateTurretLeft ){ Player.TurretRotation -= Player.TurretRotationSpeed; }

    if( Player.Fire )
    {
         if( !Bullet.Alive )
         {
            Bullet.Alive = true;
            Bullet.Rotation = Player.TurretRotation;
            Bullet.Life = 1.0;
            Bullet.X = ( ( Player.X + 16 ) - ( Player.Body.width / 2 ) );
            Bullet.Y = ( ( Player.Y + 12 ) - ( Player.Body.height / 2 ) );
         }
    }

    if ( Bullet.Alive )
    {
        Radians = ( ( Math.PI / 180 ) * Bullet.Rotation );

        Bullet.X += ( Bullet.Speed * Math.cos( Radians ) );
        Bullet.Y += ( Bullet.Speed * Math.sin( Radians ) ); 


        //Collisons - walls
        if( Bullet.X < 1 || Bullet.X > ( CanvasX - 1 ) )
        {
            Bullet.Alive = false;
        }

        if( Bullet.Y < 1 || Bullet.Y > ( CanvasY - 1 ) )
        {
            Bullet.Alive = false;
        }

        for( var i = 0; i < 3; i++ )
        {
            if( Bullet.X > TargetArray[i].X && Bullet.X < ( TargetArray[i].X + TargetGraphic.width ) )
            {
               if( Bullet.Y > TargetArray[i].Y && Bullet.Y < ( TargetArray[i].Y + TargetGraphic.height ) )
                {
                    TargetArray[i].Vis = false;
                } 
            }
        }
    }

    //Render Targets

    for( var i = 0; i < 3; i++ )
    {
        if( TargetArray[i].Vis )
        {
            Cancon.drawImage( TargetGraphic, TargetArray[i].X , TargetArray[i].Y );
        }
    }

    Cancon.restore();
    Cancon.save();


	//render tank
	
	//Tank Render Setup
	Cancon.translate(  Player.X,  Player.Y );	
	Cancon.rotate( Math.PI / 180 * Player.Rotation );
	Cancon.translate( -Player.X,  -Player.Y  );

	//LeftTrack
	Cancon.drawImage( Player.Track, ( ( Player.X - 3 ) - ( Player.Body.width / 2 ) ) , ( ( Player.Y - 5 ) - ( Player.Body.height / 2 ) )  );

	//RightTrack
	Cancon.drawImage( Player.Track, ( ( Player.X - 3 ) - ( Player.Body.width / 2 ) ) , ( ( Player.Y + 25  ) - ( Player.Body.height / 2 ) )  );

	//Body
	Cancon.drawImage( Player.Body, ( Player.X - ( Player.Body.width / 2 ) ), ( Player.Y - ( Player.Body.height / 2 ) ) );
	
	Cancon.restore();
	Cancon.save();


    //Bullet
    if( Bullet.Alive )
    {
        Cancon.translate(  Bullet.X,  Bullet.Y );	
	    Cancon.rotate( Math.PI / 180 * Bullet.Rotation );
	    Cancon.translate( -Bullet.X,  -Bullet.Y  );

        Cancon.drawImage( Bullet.Body, Bullet.X, Bullet.Y );

        Bullet.Life -= 0.01;
        if( Bullet.Life < 0.0 ){ Bullet.Alive = false; }

        Cancon.restore();    
    }


	//Turret
	
	if( Player.TurretRotation < 0 ){ Player.TurretRotation = 359; }
	if( Player.TurretRotation > 359 ){ Player.TurretRotation = 0; }
	
	Cancon.translate(  Player.X,  Player.Y );	
	Cancon.rotate( Math.PI / 180 * Player.TurretRotation );
	Cancon.translate( -Player.X,  -Player.Y  );

	Cancon.drawImage( Player.Turret, ( ( Player.X + 10 ) - ( Player.Body.width / 2 ) ), ( ( Player.Y + 3 ) - ( Player.Body.height / 2 ) ) );
	
	Cancon.restore();
    Cancon.save();
}


document.onkeydown = function( e ) 
{
	if ( !e ) { e = window.event; }
    		
	//Up
    if( e.keyCode == 38 ){ }

	//Down
	if( e.keyCode == 40 ){ }

	//Left
	if( e.keyCode == 37 ){ Player.RotateTurretLeft = true; }
        		
	//Right
	if( e.keyCode == 39 ){ Player.RotateTurretRight = true; }
        		
	//W
	if( e.keyCode == 87 ){ Player.Foward = true; }	

	//A
	if( e.keyCode == 65 ){ Player.RotateLeft = true; }
		
	//S
	if( e.keyCode == 83 ){ Player.Backward = true; }	

	//D
	if( e.keyCode == 68 ){ Player.RotateRight = true; }	

    //Space
    if( e.keyCode == 32 ){ Player.Fire = true; }

}


document.onkeyup = function( e ) 
{
	if ( !e ) { e = window.event; }
    		
	//Up
    if( e.keyCode == 38 ){ }

	//Down
	if( e.keyCode == 40 ){ }

	//Left
	if( e.keyCode == 37 ){ Player.RotateTurretLeft = false; }
        		
	//Right
	if( e.keyCode == 39 ){ Player.RotateTurretRight = false; }
        		
	//W
	if( e.keyCode == 87 ){ Player.Foward = false; }	

	//A
	if( e.keyCode == 65 ){ Player.RotateLeft = false; }
		
	//S
	if( e.keyCode == 83 ){ Player.Backward = false; }	

	//D
	if( e.keyCode == 68 ){ Player.RotateRight = false;  }
    
    //Space
    if( e.keyCode == 32 ){ Player.Fire = false; }		
}


