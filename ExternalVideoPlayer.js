//==========================================================================
// External Video Player processing:

// NOTE: I'm not calling this a "YouTube player", though in reality that
// is what it is.  However, this could probably be tried using some other
// URL than YouTube's for playing Flash videos.
function external_video_player(video_play_log_function, video_play_next_function,
    VIDEO_PLAY_URL_PREFIX_EXTERNAL_PLAYER) {

    // Save argument constant:
    this.VIDEO_PLAY_URL_PREFIX_EXTERNAL_PLAYER = VIDEO_PLAY_URL_PREFIX_EXTERNAL_PLAYER;

    // Save the argument values, both of which are references to functions
    // that reside in the calling module.  This allows this utility to
    // integrate smoothly with JimRadio, while remaining separate and
    // external:
    this.video_play_log_function = video_play_log_function;
    this.video_play_next_function = video_play_next_function;

    // These will be filled when the Video Player window is first opened:
    this.video_window = null;               // init
    this.external_video_playing = false;    // init

    // This will be filled when a video is over as indicated by a timer
    // event:
    this.timeout = null; // init

}

//------------------------------------------------------------------------------
external_video_player.prototype.end_of_video =
function () {

    // Init/reset:
    this.reset();

    // "Out-source" successful-play logging to the logging function
    // that resides in the calling module:   
    this.video_play_log_function(current_video.video_title);

    // Update the JimRadio database, by the web service, on the server, with success:
    JimRadio.JimRadioWebServices.VideoPlayed(
        current_video.video_id,
        onVideoPlayedComplete,
        onVideoPlayedFailed
    );

    // Continue playing the list.  "Out-source" Play Next processing to
    // the Play Next function which resides in the calling module:   
    this.video_play_next_function();

}

//------------------------------------------------------------------------------
external_video_player.prototype.fill_globals =
function () {
    
    //----------------------------------------------------------------------------------
    // NOTE:  For this processing, I had high hopes to intercept the YouTube error
    // codes for Embedded Playback Denied dynamically and, for them, to launch an
    // alternative, external video player.  Unfortunately, the literal meaning of
    // the error is false as I have determined that 99.99 percent of all errors are
    // really Video Removed errors.  Only a tiny fraction, at last count 13 out of
    // 4000, were truly Embed errors and they were only findable by manually looking
    // for them!

    // Further, since I have altered the SQL to use multiple queries and unions, I
    // did not want to clutter it all up with references to the Video Duration column,
    // which would have been, in the vast majority of cases, empty and meaningless.

    // NOTE: Use these arguments to test this functionality.
    // NOTE 2: EXTERNAL VIDEO PLAYER CROSS-REFERENCE 1 OF 2 - These examples must be kept up to date with the
    // JimRadio demos in file demo/demo.htm:

    // /?id=VUIcqK8yN7Y&id=wI6ii4Lld_s&id=rn2NIhVI8qQ&id=0iN5dAA4GXA&id=rgpbIPQl7CA&id=upZB5VlbC6o&id=VtcSZTacovI

    // If this video is one of the videos with a No Embedding prohibition:
    switch (current_video.video_id) {

        // NOTE: In comments, I refer to this as the External Video Player
        // array-based "database":   

        case "VUIcqK8yN7Y":

            // This video has no sound!:
            current_video.video_duration = 247;
            current_video.video_title = "Trey Band on Craig Ferguson";
            break;

        case "wI6ii4Lld_s":
            current_video.video_duration = 268;
            current_video.video_title = "Southern Cross Jimmy Buffett 8/3/2006";
            break;

        case "rn2NIhVI8qQ":
            current_video.video_duration = 244;
            current_video.video_title = "Talking Heads - Live in Rome 1980 - 02 Stay Hungry";
            break;

        case "0iN5dAA4GXA":
            current_video.video_duration = 239;
            current_video.video_title = "Todd Rundgren couldnt i just tell you the way i fe (...)";
            break;

        case "rgpbIPQl7CA":
            current_video.video_duration = 606;
            current_video.video_title = "Harry Chapin: BETTER PLACE TO BE 81";
            break;

        case "upZB5VlbC6o":
            current_video.video_duration = 336;
            current_video.video_title = "Harry Chapin: MR TANNER 81";
            break;

        case "VtcSZTacovI":
            current_video.video_duration = 451;
            current_video.video_title = "Harry Chapin:SEQUEL 81";
            break;

        default:
            current_video.video_duration = 0;
    }

    // NOTE: Use the following line of code to speed up testing:
    if (current_video.video_duration > 0) { current_video.video_duration = 10; }

}

//------------------------------------------------------------------------------
external_video_player.prototype.launch_external_player =
function () {

    // This is how long it takes to open the External Video Player:
    var VIDEO_LOAD_SECONDS = 6;

    // Add time to allow the player to load:
    current_video.video_duration += VIDEO_LOAD_SECONDS;

    // NOTE: If the external player video has a commercial in it then all bets
    // are off in terms of trying to time the end of the video.  This is one of
    // the reasons I abandoned this whole effort.

    // Init/reset:
    this.reset();

    // Open a new browser window and link to YouTube's URL, passing
    // it the Video ID of the video that has the prohibition, thus
    // satisfying it:
    this.video_window =

        // Open a regular window.  See POPUP NOTE, elsewhere in the code.
        open_popup_window(
            this.VIDEO_PLAY_URL_PREFIX_EXTERNAL_PLAYER + current_video.video_id,
	        false,  // modal dialog
	        "yes",  // resizable
	        "no",   // scrollbars NOTE: This doesn't work in Safari
	        700,    // width
	        500     // height
        );

    // INTERNET EXPLORER NOTE: window.open returns a NULL reference, even though the
    // window actually opens, if Enable Protected Mode is checked under:
    //      Internet Options->Security->Security Level for this zone
    // It will completely mess up this process.

    // VIVALDI NOTE: The pop-up blocker is set/unset using the Chrome command:
    // chrome://settings/content/

    if (this.video_window == null) {
            
        // "Out-source" failed-play logging to the logging function
        // which resides in the calling module:   
        this.video_play_log_function(
            "WINDOW BLOCKED - " + current_video.video_title
        );

        // "Out-source" Play Next processing to the Play Next function
        // which resides in the calling module:   
        this.video_play_next_function();
    }
    else {

        this.external_video_playing = true;

        // Set a Timer that will go off when the video is over, based
        // on its listed duration:
        this.timeout = setTimeout(

            // NOTE: Pass a reference to a logging function that resides in the
            // calling module to be called by the External Video Player to report
            // on either success or failure.  NOTE 2: In all honesty, "success"
            // simply means that the timer has expired, as I'm making no effort
            // to capture play errors from the External Video Player:
            function () {
                external_video_player_services.end_of_video(log_video_play) 
            },
            current_video.video_duration * 1000);
    }

}

//------------------------------------------------------------------------------
external_video_player.prototype.reset =
function () {

    // If a video is running in the External Video Player...
    if (this.external_video_playing == true) {

        //...stop it and close its window:
        this.external_video_playing = false;
        clearTimeout(this.timeout);
        this.video_window.close();
    }

}

//------------------------------------------------------------------------------
