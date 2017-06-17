using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
//---------------------------------------
using System.Collections;
using System.Web.Configuration;
using System.Collections.Specialized;


public partial class _Default : System.Web.UI.Page
{
    // BEGIN DATA
    //-----------------------------------------------------------------------------    
    // Web.config-supplied URLs, URL prefixes and settings:
    public string VIDEO_PLAY_URL_PREFIX_EMBED;
    public string VIDEO_PLAY_URL_PREFIX_EXTERNAL_PLAYER;
    public string RUN_URL_PREFIX_DEV, RUN_URL_PREFIX_PROD;
    public string RUN_URL_PREFIX;
    public string LAUNCH_EXTERNAL_VIDEO_PLAYER;
    public string HTML_IFRAME_VIDEO_PLAYER;


    // Arguments stored and used as "global" variables:
    public string strGenre, strRating, strPlayed;
    public string[] strYouTubeIds;
    public string[] strYouTubeTitles;

    // NOTE: These constants will free me from the drudgery of comma placement,
    // trailing spaces, etc. and generally improve the code:
    const string SINGLE_QUOTE = "'";
    const string SELECT = "select ";
    const string UNION = " union ";
    const string QUOTED_PERCENT_BEFORE = "'%' + ";
    const string QUOTED_PERCENT_AFTER = " + '%'";
  //const string DIVIDING_LINE = "-----------------"; // for debugging only
    const string DIVIDING_LINE = "";
        
    // END DATA
    //-----------------------------------------------------------------------------
    // BEGIN METHODS    

    protected void Get_Request_Query_String_And_Arguments()
    {
        //-----------------------------------------------------------------------------------------------
        // Step 1: Get the query arguments, if any:

        // NOTE: This value is not currently needed, but is available for
        // future use.  Get the current request's URL query:
        string strRequestUrlQueryReturn = Request.Url.Query.ToString();

        // Get the current request's NameValueCollection class QueryString object...
        NameValueCollection nvcRequestQueryString = Request.QueryString;

        //-----------------------------------------------------------------------------------------------
        // ...which gives us access to its members, the application's query arguments:
        strGenre = nvcRequestQueryString["genre"]; // eg: "ROCK"
        strRating = nvcRequestQueryString["rating"]; // eg: 1
        strPlayed = nvcRequestQueryString["played"]; // eg: "N"

        strYouTubeIds = Request.QueryString.GetValues("id");
        strYouTubeTitles = Request.QueryString.GetValues("title");

        //-----------------------------------------------------------------------------------------------
    }

    protected string Get_SQL_query()
    {
        // NOTE: These contain the controlling "wrapper" SQL statement:
        const string OUTER_SHELL_BEFORE =
          // Production:
            "select top(1000) youtube_id, youtube_title = min(IsNull(youtube_title, 'unknown video')) from (";
          // Test:
          //"select top(0050) youtube_id, youtube_title = min(IsNull(youtube_title, 'unknown video')) from (";

        const string OUTER_SHELL_AFTER =
            ") as youtube_video group by youtube_id order by NewId()";

        //---------------------------------------------------
        // no arguments                         Result Set 1
        // single criteria argument(s)          "
        // title argument(s)                    "
        //---------------------------------------------------
        // ID argument(s), JimRadio lookup      Result Set 2
        // ID argument(s), hardcoded values     Result Set 3
        //---------------------------------------------------

        //================================================================================
        // Example 1, searching for individual videos by Title and/or ID:
        //
        // Query string:
        // /?title=Honky+Cat&title=Mona+Lisas&title=Oops!...I+Did+It+Again&title=Baby+One+More+Time&id=MW7H6iohAb8&id=9tRgYfQ48A0&id=CduA0TULnow&id=C-u5WLJ9Yk4
        //
        // Generated SQL:
        // select youtube_id,
        //        youtube_title = min(IsNull(youtube_title, 'unknown video')) 
        //   from
        // (
        // -----------------
        // ( select youtube_id, youtube_title 
        //     from video 
        //    where (1 = 1) 
        //      and
        //      (   youtube_title like '%' + 'Honky Cat' + '%' 
        //       or youtube_title like '%' + 'Mona Lisas' + '%' 
        //       or youtube_title like '%' + 'Oops!...I Did It Again' + '%' 
        //       or youtube_title like '%' + 'Baby One More Time' + '%'
        //      )
        // ) 
        // -----------------
        // union
        // ( select youtube_id, youtube_title 
        //     from video 
        //    where (1 = 1) 
        //      and youtube_id in ( 'MW7H6iohAb8', 
        //                          '9tRgYfQ48A0', 
        //                          'CduA0TULnow', 
        //                          'C-u5WLJ9Yk4'
        //                         )
        // ) 
        // -----------------
        // union
        // (         select youtube_id = 'MW7H6iohAb8', youtube_title = 'unknown video' 
        //     union select youtube_id = '9tRgYfQ48A0', youtube_title = 'unknown video' 
        //     union select youtube_id = 'CduA0TULnow', youtube_title = 'unknown video' 
        //     union select youtube_id = 'C-u5WLJ9Yk4', youtube_title = 'unknown video'
        // ) 
        // -----------------
        // )
        //       as youtube_video 
        // group by youtube_id 
        // order by NewId()
        //
        //
        //================================================================================
        // Example 2, searching for multiple videos by way of video classification data:
        //
        // Query string:
        // /?genre=rock&rating=3&played=N
        //
        // Generated SQL:
        // select youtube_id,
        //        youtube_title = min(IsNull(youtube_title, 'unknown video')) 
        //   from 
        // (
        // -----------------
        // ( select youtube_id, youtube_title 
        //     from video 
        //    where (1 = 1) 
        //      and genre = 'rock' 
        //      and rating = 3 
        //      and played = 'N'
        // ) 
        // -----------------
        // )
        //       as youtube_video 
        // group by youtube_id 
        // order by NewId()

        //================================================================================

        string[] strResultSet = new string[3];

        // Init:
        int intResultSetIndex = -1;
        string strSqlQueryReturnValue = "";

        const string JIMRADIO_QUERY = "select youtube_id, youtube_title from video where (1 = 1)";

        //-----------------------------------------------------------------------------------------------------------
        // STEP ONE: LOAD THE SQL RESULT SET ARRAY FROM THE ARGUMENTS/DEFAULTS

        // If argument(s) were supplied:
        if (strGenre != null || strRating != null || strPlayed != null || strYouTubeTitles != null ||
            strYouTubeIds != null)
        {
            if (strGenre != null || strRating != null || strPlayed != null || strYouTubeTitles != null)
            {
                // Section 1, the query, init:
                strResultSet[++intResultSetIndex] = JIMRADIO_QUERY;
            }

            // Append single criteria as needed:

            if (strGenre != null)
            {
                // Section 1, the query, append:
                strResultSet[intResultSetIndex] += 
                    " and genre = " + SINGLE_QUOTE + strGenre + SINGLE_QUOTE;
            }

            if (strRating != null)
            {
                // Section 1, the query, append:
                strResultSet[intResultSetIndex] +=
                    " and rating = " + strRating;

                // Section 2, the GUI:
                if (strRating == "3") { cream.Checked = true; }
            }

            if (strPlayed != null)
            {
                // NOTE: Be careful of terms here.  The only
                // acceptable parameter value is "N".

                // NoRepeats.Checked = true, means Played = "N"

                // The converse is not true as the parameter is simply
                // omitted in such cases.

                // Section 1, the query, append:
                strResultSet[intResultSetIndex] +=
                    " and played = 'N'"; // hardcode of only logical value

                // Section 2, the GUI:
                norepeats.Checked = true;
            }

            // If title argument(s) were supplied:
            if (strYouTubeTitles != null)
            {
                // Declare/init:
                ArrayList arrayListYouTubeTitlesIncl = new ArrayList();
                ArrayList arrayListYouTubeTitlesExcl = new ArrayList();

                // If the user supplied titles, break them out into...
                for (int i = 0; i < strYouTubeTitles.Length; i++)
                {
                    //... exclusions (denoted by the minus sign) and...
                    if (strYouTubeTitles[i].Substring(0, 1) == "-")
                    {
                        arrayListYouTubeTitlesExcl.Add(
                            strYouTubeTitles[i].Substring(1, strYouTubeTitles[i].Length - 1));
                    }
                    //...inclusions:
                    else { arrayListYouTubeTitlesIncl.Add(strYouTubeTitles[i]); }
                }

                // Process exclusions:
                if (arrayListYouTubeTitlesExcl.Count > 0)
                {
                    // Convert:
                    string[] strYouTubeTitlesExclusion =
                        arrayListYouTubeTitlesExcl.ToArray(typeof(string)) as string[];

                    // Section 1A, the query, append exclusions:
                    strResultSet[intResultSetIndex] +=
                        " and (" +
                        Inner_String_Assembly
                        (
                            strYouTubeTitlesExclusion,                                        // inner value
                            "youtube_title not like " + QUOTED_PERCENT_BEFORE + SINGLE_QUOTE, // text before
                            SINGLE_QUOTE + QUOTED_PERCENT_AFTER,                              // text after
                            " and "                                                           // connector
                        )
                        + ")";
                }

                // Process inclusions:
                if (arrayListYouTubeTitlesIncl.Count > 0)
                {
                    // Convert:
                    string[] strYouTubeTitlesInclusion =
                        arrayListYouTubeTitlesIncl.ToArray(typeof(string)) as string[];

                    // Section 1B, the query, append inclusions:
                    strResultSet[intResultSetIndex] +=
                        " and (" +
                        Inner_String_Assembly
                        (
                            strYouTubeTitlesInclusion,                                    // inner value
                            "youtube_title like " + QUOTED_PERCENT_BEFORE + SINGLE_QUOTE, // text before
                            SINGLE_QUOTE + QUOTED_PERCENT_AFTER,                          // text after
                            " or "                                                        // connector
                        )
                        + ")";
                }

                // Section 2, the GUI:
                for (int i = 0; i < strYouTubeTitles.Length; i++)
                {
                    if (i != 0) { search_criteria.Text += ", "; }
                    search_criteria.Text += strYouTubeTitles[i];
                }
            }

            // If ID argument(s) were supplied:
            if (strYouTubeIds != null)
            {
                // Section 1, the query, init:
                strResultSet[++intResultSetIndex] =
                    JIMRADIO_QUERY +
                    " and youtube_id in (" +

                     Inner_String_Assembly
                    (
                        strYouTubeIds,  // inner value
                        SINGLE_QUOTE,   // text before
                        SINGLE_QUOTE,   // text after
                        ", "            // connector
                    )

                    +
                    ")";
                
                    // Init:
                    strResultSet[++intResultSetIndex] =
                        Inner_String_Assembly
                        (
                            strYouTubeIds,                                     // inner values
                            "select youtube_id = " + SINGLE_QUOTE,             // text before
                            SINGLE_QUOTE + ", youtube_title = " +              // text after
                                SINGLE_QUOTE + "unknown video" + SINGLE_QUOTE,
                            " union "                                          // connector
                        );
            }
        }
        // If no argument(s) were supplied:
        else
        {
            // Section 1, the query, init:
            strResultSet[++intResultSetIndex] = JIMRADIO_QUERY;
        }

        //-----------------------------------------------------------------------------------------------------------
        // STEP TWO: UNLOAD THE SQL RESULT SET ARRAY INTO THE SQL QUERY STATEMENT

        // With the Result Set array now fully loaded, unload it into the final
        // SQL statement string, with each array element being represented as a
        // UNION domain within the controlling wrapper SQL statement:
        
        // Prepare the SQL Select statement:
        strSqlQueryReturnValue += DIVIDING_LINE;

        // Init:
        strSqlQueryReturnValue = OUTER_SHELL_BEFORE;

        // Main process:
        strSqlQueryReturnValue += DIVIDING_LINE;
        strSqlQueryReturnValue += Inner_String_Assembly
        (
            strResultSet,           // inner value
            " (",                   // text before
            ") ",                   // text after
            DIVIDING_LINE + UNION   // connector
        );

        // Termination:
        strSqlQueryReturnValue += DIVIDING_LINE;
        strSqlQueryReturnValue += OUTER_SHELL_AFTER;

        //-----------------------------------------------------------------------------------------------------------
        // Return the fully assembled SQL query:
        return strSqlQueryReturnValue;
    }
    
    protected void Get_Web_Config_Constants()
    {
        // Fill variables with values from Web.Config making them, effectively, constants:

        // Initialize these URL and URL prefix variables, and others.  These code-behind
        // values will drive Default.aspx's HTML representation of the links or resources
        // that they point to.

        // Handle: ...

        // ...the HTML directly, or...
        VIDEO_PLAY_URL_PREFIX_EMBED =
            WebConfigurationManager.AppSettings["VIDEO_PLAY_URL_PREFIX_EMBED"];
        VIDEO_PLAY_URL_PREFIX_EXTERNAL_PLAYER =
            WebConfigurationManager.AppSettings["VIDEO_PLAY_URL_PREFIX_EXTERNAL_PLAYER"];

        RUN_URL_PREFIX_DEV =
            WebConfigurationManager.AppSettings["RUN_URL_PREFIX_DEV"];
        RUN_URL_PREFIX_PROD =
            WebConfigurationManager.AppSettings["RUN_URL_PREFIX_PROD"];

        LAUNCH_EXTERNAL_VIDEO_PLAYER =
            WebConfigurationManager.AppSettings["LAUNCH_EXTERNAL_VIDEO_PLAYER"];

        HTML_IFRAME_VIDEO_PLAYER =
            WebConfigurationManager.AppSettings["HTML_IFRAME_VIDEO_PLAYER"];

        //----------------------------------------------------------------------
        // NOTE: I like to have the option to point to either the Production or
        // Development run environments:
           RUN_URL_PREFIX = RUN_URL_PREFIX_PROD;
        // RUN_URL_PREFIX = RUN_URL_PREFIX_DEV;
        //----------------------------------------------------------------------
    }

    protected void Host_Services()
    {
        //--------------------------------------------------------------------------------------------
        // DISABLING VISITOR EMAIL NOTE 1 of 2: This setting is stored in a browser cookie and covers
        // only that browser on my cell phone since the IP address varies every time I use it:

        // Look for the presence of this cookie.
        // NOTE: It is created in the SetCookie() event of form CookieVisitorIsDeveloper.aspx
        HttpCookie cookie = Request.Cookies["VisitorIsDeveloper"];

        String strVisitorIsDeveloper = "N"; // init

        // If the cookie exists:
        if (cookie != null)
        {
            // NOTE: This can only equal "Y":
            strVisitorIsDeveloper = cookie.Value.ToString();
        }

        //--------------------------------------------------------------------------------------------
        // Utilize Host Services for processing done by all applications.  Init the WorkingWeb
        // host services class:
        WorkingWebHostServices workingWebHostServices = new WorkingWebHostServices();

        // Perform standard start-up processing, passing the name of the application.  This
        // returns a boolean indicating whether or not the user is also the developer:
        bool boolIsDeveloper = workingWebHostServices.PageLoadInit("JimRadio", strVisitorIsDeveloper);

        // NOTE: JimRadio is a multi-user system, with the exception that No Repeats
        // only makes sense (as currently designed) for a single user, ie, me!:

        // If the user is also the developer:
        if (boolIsDeveloper) { norepeats.Disabled = false; } // "disabled = false" is a hell of a
        else { norepeats.Disabled = true; }                  //  way to say "enabled"!
    }

    protected void Host_Services_Get_Database(out SqlConnection sqlConnection, out SqlCommand sqlCommand)
    {
        // Utilize Host Services for database processing.  Init the JimRadio host services class to
        // get access to the JimRadio database in server-side processing:
        JimRadioHostServices jimRadioHostServices = new JimRadioHostServices();
        jimRadioHostServices.GetDatabaseSql(out sqlConnection, out sqlCommand);
    }

    protected string Inner_String_Assembly(string[] strInnerValueArray, string strTextBefore, string strTextAfter,
        string strConnector)
    {
        // NOTE: This convenience/utility method will traverse an array and take some
        // piece of SQL code and "wrap it" with some other pieces of SQL code, making
        // it a coherent whole:

        string strSqlReturnValue = "";

        // For each entry in the array...
        for (int i = 0; i < strInnerValueArray.Length; i++)
        {
            // ...that is actually filled...
            if (strInnerValueArray[i] != null)
            {
                // ... add the connector, if appropriate...
                if (i != 0) { strSqlReturnValue += strConnector; };

                // ... and, finally, combine them all:
                strSqlReturnValue += strTextBefore + strInnerValueArray[i] + strTextAfter;
            }
        }

        // Return the fully assembled line of SQL:
        return strSqlReturnValue;
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        //----------------------------------------------------------------------------------
        // Perform host-specific, standard start-up processing:
        Host_Services();

        SqlConnection sqlConnection;
        SqlCommand sqlCommand;

        //----------------------------------------------------------------------------------
        // Get a connection to my GoDaddy, SQL Server, video (song),
        // "JimRadio" database:
        Host_Services_Get_Database(out sqlConnection, out sqlCommand);

        //----------------------------------------------------------------------------------
        // Get the application-run, video-play URL prefixes, and settings and set
        // them as "global" variables:
        Get_Web_Config_Constants();

        //----------------------------------------------------------------------------------
        // Get the arguments, if any:
        Get_Request_Query_String_And_Arguments();

        //----------------------------------------------------------------------------------
        // Get the query, a SQL Select statement.  It will fill all of the application's data.
        // It may consist of, up to 4, result sets (JimRadio by single criteria,
        // YouTube by YouTube ID, JimRadio by YouTube ID and JimRadio by YouTube title)
        // which get merged by an outer SQL Group By shell: 
        string strSqlSelect = Get_SQL_query();

        //----------------------------------------------------------------------------------
        // Finally, retrieve and show the results:
        Show_Results_Data(sqlConnection, sqlCommand, strSqlSelect);

        //----------------------------------------------------------------------------------
    }

    protected void Show_Results_Data(SqlConnection sqlConnection, SqlCommand sqlCommand, string strSqlQuery)
    {
        // Execute the SQL we have been creating and bind the results to the
        // output, a GridView:

        // Assign and execute the SQL:
        sqlCommand.CommandText = strSqlQuery;
        SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();

        // Bind the SQL result set to the GridView, dynamically:
        query_result_grid_view.AutoGenerateColumns = true;
        query_result_grid_view.ShowHeader = false;
        query_result_grid_view.DataSource = sqlDataReader;
        query_result_grid_view.DataBind();

        // Clean up:
        sqlConnection.Dispose();
        sqlCommand.Dispose();
        sqlDataReader.Dispose();
    }

    //-----------------------------------------------------------------------------
    // END METHODS
}
