<%@ Page Language="C#" AutoEventWireup="true" Inherits="_Default" CodeBehind="Default.aspx.cs" %>

<!DOCTYPE html>

<!-- Responsive design: Portrait: -->
<meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0">

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

    <title>JimRadio</title>

    <link type="image/x-icon" rel="icon" href="favicon.ico" />
    <link type="text/css" rel="stylesheet" href="Site.css" />
    <link type="text/css" rel="stylesheet" href="StandardStreams.css" />

    <script type="text/javascript" src="ExternalVideoPlayer.js">     </script>
    <script type="text/javascript" src="StandardStreams.js"></script>

    <script type="text/javascript" src="WorkingWebBrowserServices.js"></script>

    <script type="text/javascript">

        //-----------------------------------------------------------------------------------------
        // Responsive web design is an approach that makes web pages render well on a variety of
        // devices and window or screen sizes.  Search for "responsive".
        window.addEventListener("orientationchange", function () {

            // The NOTE and processing below is taken from application ArtistMaint.  That app
            // had no problem when switching back to portrait mode.  This app does, though the
            // zooming is out, not in.  What a mess!  Here, the message will be generic and
            // apply to both portrait and landscape:
            alert("Correcting resizing error...");

            if (window.orientation == 0) {

                // Portrait:
                document.getElementById("viewport").setAttribute("content", "initial-scale=1.0");
            }
            else {
                // NOTE: It is a known problem that, on changing to landscape mode, the browser
                // fully zooms the page.  I have seen it documented for both Android and I-Phone.
                // Unfortunately, non of the solutions suggested worked for me.  In the course of
                // my debugging, I saw that a simple messagebox somehow short-circuits the problem.

                // Having wasted enough time on this, I will wait a few years, check back, and see
                // if the problem has been fixed.

                // Landscape:
                //alert("Correcting landscape resizing error...");
                document.getElementById("viewport").setAttribute("content", "initial-scale=0.5");
            }

        }, false);
        //---------------------------------------------------------------------------------------------------

        // <HEAD> GLOBAL VARIABLES:

        // This will be filled in main():
        var standard_streams_services;

        // This will be filled in onYouTubeIframeAPIReady():
        var player;

        // Miscellaneous globals:
        var about_window;
        var current_video;

        // Static GUI object references:
        var gridview_table, video_title;

        // External Video Player Services object:
        var external_video_player_services;

        // <HEAD> AVAILABLE FUNCTIONS:

        // DRIVER FUNCTIONS:

        function main() {

            // NOTE: If we have gotten this far, it means that JavaScript is enabled.  Hide this:
            document.getElementById("javascript_message").style.display = "none";

            // NOTE: Most of the standard output will be handeled by this service:
            standard_streams_services = new standard_streams();

            // Current video processing:
            current_video = new Object();

            // Initialize the loop driving variables:
            current_video.play_index = 0;
            current_video.video_id = "";

            // These will be set dynamically on a video by video basis in conjunction with the
            // External Video Player:
            current_video.video_title = "";
            current_video.video_duration = 0;
            current_video.autoplay = "";

            // Initialize the External Video Player Services object.  Pass the argument values,
            // both of which are references to functions that reside in this, the calling module.
            // This allows the External Video Player utility to integrate smoothly with JimRadio,
            // while remaining separate and external:
            external_video_player_services =
                new external_video_player(
                    log_video_play,
                    play_next,
                    "<%=VIDEO_PLAY_URL_PREFIX_EXTERNAL_PLAYER %>"
                );

            // Do window closing housekeeping:
                    window.onunload = OnWindowClose;

            // Init the static GUI object references:
                    gridview_table = document.getElementById('query_result_grid_view');
                    video_title = document.getElementById('video_title');

            // Usage 1 of 2: This is the "main processs" for looking at
            // videos on an individual basis:
                    play_preprocess();

            // Create the player:

            // 2. This code loads the IFrame Player API code asynchronously.
                    var tag = document.createElement("script");

            // Transfer this value from code-behind C# to JavaScript:
                  var HTML_IFRAME_VIDEO_PLAYER = "<%=this.HTML_IFRAME_VIDEO_PLAYER%>";
            tag.src = HTML_IFRAME_VIDEO_PLAYER;

            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            // NOTE: The form is created with a play_log of a wider size, the source of which I cannot
            // determine, which is then made smaller by way of CSS.  The original size, however, causes
            // the TD (table column) to be too wide, which causes the table to be too wide and, finally,
            // the form to be too wide which causes unnecessary horizontal scrolling.  We will re-size
            // the play_log dynamically to fix this annoying problem:
            document.getElementById("column_3").style.width =
                document.getElementById("play_log").offsetWidth + "px";

        }

        // 3. This function creates an <iframe> (and YouTube player) after the API code downloads.
        function onYouTubeIframeAPIReady() {

            player = new YT.Player(

                "player", {

                    videoId: current_video.video_id,

                    <%--NOTE: These functions are the original functions as taken from the YouTube sample
                    application.  Leave them intact: --%>

                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange,
                        'onError': onPlayerError
                    }
                }
            );

        }

        // 4. The API will call this function when the video player is ready.
        function onPlayerReady(event) {

            event.target.playVideo();

        }

        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.

        function onPlayerStateChange(event) {

            // My testing determined:
            //  -1 (unstarted, no constant equivalent) 	- only fires for the first video
            //   5 (YT.PlayerState.CUED)			    - never fires		
            //   1 (YT.PlayerState.PLAYING)		        - can fire multiple times, if you, for eg., fast forward the video

            // Iterate the loop on a successful video completion:
            if (event.data == YT.PlayerState.ENDED) {

                log_video_play(current_video.video_title);

                // Update the JimRadio database, by the web service, on the server, with success:
                JimRadio.JimRadioWebServices.VideoPlayed(
                    current_video.video_id,
                    onVideoPlayedComplete,
                    onVideoPlayedFailed
                );

                // Continue playing the list:
                play_next();

            }

        }

        // REMAINING FUNCTIONS:
        function ButtonAbout_onclick() {

            // POPUP NOTE: Since secondary windows are not required to run JimRadio,
            // we defer this error checking until such time as the user requests a
            // secondary window:
            about_window = open_popup_window(
                "About.aspx",
	            true, // modal dialog
	            "no", // resizable
	            "no", // scrollbars NOTE: This doesn't work in Safari
	            540,  // width
	            680   // height
            );
        }

        function ButtonPlay_onclick() {

            // URL construction variables:            
            var play_URL_arguments = "";
            var URL_argument_char = "?";

            //-------------------------------------------------------------------------
            // GUI:  Determine what JimRadio music content criteria the user selected:
            //
            //-------------------------------------------------------------------------
            // GET USER SELECTIONS, PART 1 OF 4:  Radio Stations selected:

            // Each "station" has 2 elements that we care about...
            // ... 1) whether or not the checkbox was checked:
            var frame = document.getElementById('stations_frame');
            var checkbox = frame.contentWindow.document.getElementsByName('checkbox');

            // ... 2) what is the link's location, especially its arguments:
            var hyperlink = frame.contentWindow.document.getElementsByTagName('a');

            // Determine what checkboxes were checked:

            // IMPORTANT NOTE:  The first array entry is the JimRadio checkbox.
            // This process is really not applicable for JimRadio, so I will skip
            // it and start at the second array entry (index number one):
            for (i = 1; i < checkbox.length; i++) {

                if (checkbox[i].checked == true) {

                    // We're going to parse the fully qualified link down to it's
                    // argument component:
                    var criteria = String(hyperlink[i]);

                    // We're building the URL as we go, append:
                    play_URL_arguments += URL_argument_char +
                        criteria.substring(criteria.search("\\?") + 1, criteria.length);

                    // Prep for next  usage:
                    if (URL_argument_char == "?") { URL_argument_char = "&" }
                }
            }

            //-----------------------------------------------------------------------------
            // GET USER SELECTIONS, PART 2 OF 4:  Search Criteria (free-form text) entered:

            // Get the GUI object reference to the search criteria:
            var search_criteria = document.getElementById('search_criteria').value

            if (search_criteria.length > 0) {

                // Strip out extraneous spaces:
                while (search_criteria.search("  ") > 0) {
                    search_criteria = search_criteria.replace("  ", " ")
                }

                // Strip out quote characters because 1) they were purged
                // from the JimRadio database at load-time, and 2) they are
                // generally problematic.

                // Single quotes:
                while (search_criteria.search("'") > -1) {
                    search_criteria = search_criteria.replace("'", "")
                }

                // Double quotes:
                while (search_criteria.search('"') > -1) {
                    search_criteria = search_criteria.replace('"', '')
                }

                // Turn the comma into a token:
                while (search_criteria.search(", ") > 0) {
                    search_criteria = search_criteria.replace(", ", ",")
                }

                // Assign the base search criteria:
                search_criteria = URL_argument_char + "title=" + search_criteria;

                // Assign the search criteria for multiple searches:
                while (search_criteria.search(",") > 0) {
                    search_criteria = search_criteria.replace(",", "&title=")
                }

                // Replace spaces with plus signs:
                while (search_criteria.search(" ") > 0) {
                    search_criteria = search_criteria.replace(" ", "+")
                }

                // We're building the URL as we go, append:
                play_URL_arguments += search_criteria;

                // Prep for next  usage:
                if (URL_argument_char == "?") { URL_argument_char = "&" }
            }

            //----------------------------------------------------------------------------
            // GET USER SELECTIONS, PART 3 OF 4:  "Cream" selected:

            // If appropriate, assign the "cream" rating:
            if (document.getElementById("cream").checked) {

                // We're building the URL as we go, append:
                play_URL_arguments += URL_argument_char + "rating=3";

                // Prep for next  usage:
                if (URL_argument_char == "?") { URL_argument_char = "&" }
            }
            //----------------------------------------------------------------------------
            // GET USER SELECTIONS, PART 4 OF 4:  No Repeats selected:

            // If appropriate, assign No Repeats:
            if (document.getElementById("norepeats").checked) {

                // We're building the URL as we go, append:
                play_URL_arguments += URL_argument_char + "played=N";

                // NOTE: This check is unnecessary because this is the last
                // in the sequence CURRENTLY.  However, with future checks,
                // it may be needed:

                // Prep for next  usage:
                if (URL_argument_char == "?") { URL_argument_char = "&" }
            }
            //----------------------------------------------------------------------------

            // Go to the fully constructed link, a YouTube video:
            location.href = "<%=RUN_URL_PREFIX %>" + play_URL_arguments;

        }

        function ButtonSkip_onclick() {

            if (current_video.play_index < gridview_table.rows.length) {

                // Log the video:
                log_video_play(current_video.video_title);
            }
            else {
                // Reset.  This will, in conjunction with code that follows,
                // have the effect of starting the play loop over again:
                current_video.play_index = -1;     // NOTE: This will be incremented to
                current_video.video_duration = 0;  //    zero before it is used again.                
            }

            if ("<%=LAUNCH_EXTERNAL_VIDEO_PLAYER %>" == "true") {

                // Reset any videos running in the External Video Player:
                external_video_player_services.reset();
            }

            // Continue playing the list:
            play_next();

        }

        function ButtonStop_onclick() {

            // If this video is not one of the videos with a No Embedding prohibition:
            if (current_video.video_duration == 0) {

                // "Stop" (ie, pause) the currently playing video in the standard,
                // Flash, embedded video player by way of the on-screen plugin:
                player.pauseVideo();

            }

            if ("<%=LAUNCH_EXTERNAL_VIDEO_PLAYER %>" == "true") {

                // Reset any videos running in the External Video Player:
                external_video_player_services.reset();
            }

        }

        function log_video_play(text_to_log) {

            // Clear out the "now playing" video title in preparation for moving
            // on to the next video.  This will only have a meaningful effect for
            // the final video.  The If test is to halt a crash that only occurred
            // during External Video Player specialized testing:
            if (video_title) {
                video_title.value = "";
            }

            // Get the GUI object reference to the play log:
            var play_log = document.getElementById('play_log');

            // NOTE: This bullet (•) is entered by typing ALT + 7
            // (on the number pad):
            play_log.value = "• " + text_to_log + "\r\n" + play_log.value;

        }

        function onPlayerError(event) {

            // NOTE: The external video player is a way around the error:
            if (external_video_player_services.external_video_playing == false) {

                var youtube_error_code = event.data;
                var youtube_error_desc;

                // Customize the error message:
                switch (youtube_error_code) {

                    case 2:
                        youtube_error_desc = "INVALID PARAMETER";
                        break;

                    case 5:
                        youtube_error_desc = "CAN'T BE PLAYED IN AN HTML5 PLAYER";
                        break;

                    case 101:
                        youtube_error_desc = "EMBEDDED PLAYBACK DENIED";
                        break;

                    case 100, 150:
                        youtube_error_desc = "NOT FOUND";
                        break;

                    default:
                        youtube_error_desc = "UNKNOWN ERROR " + event.data;
                        break;

                }

                // Log the erroneous video:
                log_video_play(youtube_error_desc + ": " + current_video.video_id + " - " + current_video.video_title);

                // Update the JimRadio database, by the web service, on the server, with error:
                JimRadio.JimRadioWebServices.VideoPlayError(
                    current_video.video_id,
                    youtube_error_code,
                    onVideoPlayErrorComplete,
                    onVideoPlayErrorFailed
                );

                // Continue playing the list:
                play_next();
            }

        }

        // If 1) the video didn't play and 2) the web service failed:
        function onVideoPlayErrorFailed(error) {

            // NOTE: I could simulate this situation by deleting the web service from
            // the server.  An error message would be provided:
            var error_message = "JimRadioWebServices.VideoPlayError() error"; // init

            if (error) {
                error_message += ", Status Code: " + error.get_statusCode() +
                                 ", Error: " + error.get_message()
            }

            standard_streams_services.write("error", error_message);

        }

        // If 1) the video played but 2) the web service failed:
        function onVideoPlayedFailed(error) {

            // NOTE: I could simulate this situation by deleting the web service from
            // the server.  An error message would not be provided:
            var error_message = "JimRadioWebServices.VideoPlayed() error"; // init

            if (error) {
                error_message += ", Status Code: " + error.get_statusCode() +
                                 ", Error: " + error.get_message()
            }

            standard_streams_services.write("error", error_message);

        }

        function onVideoPlayedComplete(results) {
            //alert(results); // debug
        }

        function onVideoPlayErrorComplete(results) {
            //alert(results); // debug
        }

        function OnWindowClose() {

            // Do housekeeping:

            if (about_window) {
                about_window.close();
            }

            if (external_video_player_services.video_window) {
                external_video_player_services.video_window.close();
            }

        }

        function play_next() {

            // NOTE: The external video player is playing so we will hold off on Play Next.
            // It will tell us when it is done:

            if (external_video_player_services.external_video_playing == false) {
                current_video.play_index++;

                if (current_video.play_index < gridview_table.rows.length) {

                    current_video.video_id = gridview_table.rows[current_video.play_index].cells[0].firstChild.data;

                    // Usage 2 of 2: This is the "main processs" for looking at videos on an individual basis:
                    play_preprocess();

                    player.loadVideoById(current_video.video_id);
                }
            }

        }

        // This is the "main processs" for looking at videos on an individual basis:
        function play_preprocess() {

            //-------------------------------------------------------------------------
            // GLOBAL PLAY-RELATED VALUES:

            // Part 1 of 4, Init these 3 play variables from "Data Source A",
            // the JimRadio database:
            current_video.video_id =
                gridview_table.rows[current_video.play_index].cells[0].firstChild.data;
            current_video.video_title =
                gridview_table.rows[current_video.play_index].cells[1].firstChild.data;
            current_video.video_duration = 0;

            if (current_video.video_title.match("unknown video")) {

                // Make sure we have a meaningful description for videos with no titles:
                current_video.video_title = "unknown video " + current_video.video_id;
            }

            // Part 2 of 4, Potentially reset these 3 play variables from
            // "Data Source B", the External Video Player array-based "database"
            // in the following function:
            external_video_player_services.fill_globals();

            // Set the "now playing" video title:
            video_title.value = current_video.video_title;

            //-----------------------------------------------------------------------
            // SHOWING THE EXTERNAL VIDEO PLAYER:

            // Part 3 of 4, If "Data Source B", the External Video Player array-based
            // "database" overrode "Data Source A", the JimRadio database:
            if (current_video.video_duration > 0) {

                if ("<%=LAUNCH_EXTERNAL_VIDEO_PLAYER %>" == "true") {

                    // Launch the External Video Player with "Data Source B", the
                    // External Video Player array-based "database", data:
                    external_video_player_services.launch_external_player();

                    // Having launched a player to play the video, we now must
                    // deal with the standard, Flash, embedded video player's
                    // video. We don't want it to skip ahead, which it would do
                    // since it has a zero second duration, so we will pause it
                    // (ie, will not autoplay it).  NOTE: When the External Video
                    // Player is finished, it will close up both players:
                    global_autoplay = false;
                }
            }

                // Part 4 of 4, Using "Data Source A", the JimRadio database:
            else { // ELSE FOR: if (current_video.video_duration > 0)

                // Fall through to standard, Flash, embedded video player
                // processing:

                // Autoplay this video:
                current_video.autoplay = true;

            } // END OF:  if (current_video.video_duration > 0)

            //---------------------------------------------------------------------------------
            // A NOTE on "data source" symmetry:  Each data source has a video play success
            // function as well as an error function.  The following is a handy reference:
            //
            // Data Source A, JimRadio database
            //
            //      onPlayerStateChange()       updates the JimRadio database with success
            //
            //      onPlayerError()             updates the JimRadio database with error
            //
            // Data Source B, External Video Player "database"
            //
            //	    end_of_video()              updates the JimRadio database with success
            //
            //	    ERROR FUNCTION              I don't even try (it would be difficult and/or
            //                                  convoluted) to capture any errors when playing
            //                                  these few videos.  I will inform the user,
            //                                  however, of browser/environment problems.
            //---------------------------------------------------------------------------------

        }

    </script>

</head>

<body>

    <div class="BannerDiv">
        <br />
        <img src="jimradio_animated.gif" alt="" />
        <span class="BannerSpan">JimRadio
        </span>
        <br />
        <br />
    </div>

    <!-- JavaScript-disabled processing.  Show this by default.  To test this processing, simply toggle the
         Enable JavaScript setting of your browser and refresh the view of the page. -->
    <div id="javascript_message">
        You need JavaScript enabled to view this web page properly.<br />
        <br />
    </div>

    <form runat="server">

        <table>

            <tr id="main_table_row">

                <td>
                    <br />

                    <%-- I-PHONE NOTE 1 OF 2: All of this jive is necessary because the I-phone doesn't contain I-frames
                    inside a sized, scrollable container, as all browsers and other cell phones do.  Here we will force
                    it to do so.

                    Thanks to John Kurlak for this: https://blogs.msdn.microsoft.com/kurlak/2013/11/03/hiding-vertical-scrollbars-with-pure-css-in-chrome-ie-6-firefox-opera-and-safari/                       
                    
                    Related Issues:
                            
                    Problem 1) I-phone doesn't show Stations in a bordered I-frame, as described above.
                    Solution 1) Wrap the I-frame in a Div.

                    Problem 2) Created by solution 1, above: In some, not all, PC browsers, a static, useless scrollbar shows for the wrapping Div.
                    Solution 2) Wrap the first Div inside a second Div, slightly smaller, to hide the scrollbars.

                    Problem 3) In I-phone, Stations are now properly inside a bordered I-frame, but they don't scroll via touch.
                    Solution 3) Add webkit reference "-webkit-overflow-scrolling: touch" to CSS.

                    NOTE: Scrollbars only show and apply to PC-based browsers.  They are not part of the cell phone paradigm.
                        
                    --%>

                    <div class="outer_container">
                        <div class="inner_container">
                            <div class="element">
                                <iframe id="stations_frame" src="stations/stations.htm" title=""></iframe>
                            </div>
                        </div>
                    </div>

                </td>

                <td class="BaseColor">
                    <br />
                    <asp:Image ID="Image1" runat="server" ImageUrl="~/cream.jpg" />
                    &nbsp;
                    <input id="cream" type="checkbox" runat="server" />
                    <span class="AccentColor">"Cream"</span><span> (best of, only)</span>
                    <br />
                    <br />
                    Enter <span class="AccentColor">Search Criteria</span> <span>separated by commas:</span><br />
                    <asp:TextBox ID="search_criteria" runat="server" TextMode="MultiLine" CssClass="BaseColor"></asp:TextBox>
                    <br />
                    <input id="ButtonPlay" type="button" value="Play" onclick="return ButtonPlay_onclick()" />&nbsp;
                    <input id="ButtonSkip" onclick="return ButtonSkip_onclick()" type="button" value="Skip" />&nbsp;
                    <input id="ButtonStop" type="button" value="Stop" onclick="return ButtonStop_onclick()" />&nbsp;
                    <input id="ButtonAbout" type="button" value="About" onclick="return ButtonAbout_onclick()" />
                    <br />
                    <br />
                    <span class="BaseColorBold">Instructions</span><br />
                    1) Select <span class="AccentColor">Stations</span> (optional)<br />
                    2) Select <span class="AccentColor">"Cream"</span> (optional)<br />
                    3) Enter <span class="AccentColor">Search Criteria</span> (optional)<br />
                    4) Push the Play button<br />
                    <br />
                    <span class="BaseColor InstructionsSmallFont">Note: Criteria preceded by minus signs
                        will be excluded from results.</span><br />
                    <br />
                    <input id="norepeats" type="checkbox" runat="server" />
                    <asp:Label ID="Label17" runat="server" Text="No Repeats" class="BaseColorBold">
                    </asp:Label>
                </td>

                <td id="column_3">
                    <br />

                    <%--NOTE: These comments, numbered "1." through "5.", are the original comments as taken
                    from the YouTube sample application.  Leave them intact: --%>

                    <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
                    <div id="player"></div>

                    <input id="video_title" type="text" readonly="readonly" class="BaseColorReverseVideo" />
                    <br />

                    <asp:TextBox ID="play_log" runat="server" TextMode="MultiLine"
                        ReadOnly="True" Wrap="False" class="BaseColor">
                    </asp:TextBox>
                </td>

            </tr>

        </table>

        <asp:ScriptManager ID="ScriptManager1" runat="server">
            <Services>
                <asp:ServiceReference Path="JimRadioWebServices.asmx" />
            </Services>

        </asp:ScriptManager>

        <div>

            <asp:GridView ID="query_result_grid_view" runat="server" AutoGenerateColumns="False">
            </asp:GridView>

        </div>

        <%------------------------------------------------------------------------------------------------------------------%>
        <!-- This shows the "standard footer" for my GUI forms. -->
        <!--#include file="StandardStreams.htm"-->
        <%------------------------------------------------------------------------------------------------------------------%>
    </form>

    <script type="text/javascript">

        // <BODY> STARTUP PROCESSING:
        main();

    </script>

</body>

</html>
