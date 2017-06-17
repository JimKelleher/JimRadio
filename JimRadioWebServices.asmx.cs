using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
//--------------------------
using System.Data.SqlClient;


namespace JimRadio
{
    /// <summary>
    /// A collection of web services which centralize all JimRadio database access.
    /// </summary>

    [WebService(Namespace = "http://www.workingweb.info/JimRadio/", Description =
        "<link rel='shortcut icon' href='jimradio.ico'/>" +
        "<style type='text/css'>@import url(JimRadioWebServices.css);</style>" +
        "<img class='JimRadioImage' src='jimradio_animated.gif' alt='' height='25px'>" +
        "<span class='JimRadio'> JimRadio</span>" +
        "<span class='title'> Web Services</span><br />" +
        "<br /><br />" +
        "____________________________________________________________________________<br />" +
        "string <span class='BaseColorBold'>VideoLookupDemo</span>(YouTubeTitle)<br /><br />" +
        "This will return a message indicating whether or not the video was found in the database.<br />" +
        "EXAMPLES: 'let it be' is in the database, 'britney spears' is not.<br />" +
        "____________________________________________________________________________<br /><br />" +
        "Update the JimRadio database with the status of a video play attempt.  The status can be:<br /><br />" +
        "1) Error: void <span class='BaseColorBold'>VideoPlayError</span>(YouTubeId, ErrorCode)<br /><br />" +
        "2) Success: void <span class='BaseColorBold'>VideoPlayed</span>(YouTubeId)<br /><br />" +
        "____________________________________________________________________________<br />"
        )
    ]
    
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]

    public class JimRadioWebServices : System.Web.Services.WebService
    {
        // NOTE: These objects will be initialized and created in a central location:
        JimRadioHostServices jimRadioHostServices;

        SqlConnection sqlConnection;
        SqlCommand sqlCommand;

        [WebMethod(Description = "<br /><span class='intro'>" +
            "Update the JimRadio database with the status of a video play attempt of </span>" +
            "<span class='AccentColor'>Success</span><br /><br />")]
        public void VideoPlayed(string YouTubeId)
        {
            //----------------------------------------------------------------------------------------------
            // Utilize Host Services for database processing:

            // Init the JimRadio host services class to get access to the JimRadio database
            // in server-side processing:
            jimRadioHostServices = new JimRadioHostServices();
            jimRadioHostServices.GetDatabaseSql(out sqlConnection, out sqlCommand);

            //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

            // Init the SQL:
            string strSqlQuery = "update video set played = 'Y' where youtube_id = '" + YouTubeId + "'";

            // Assign and execute the SQL:
            sqlCommand.CommandText = strSqlQuery;
            SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();

            // Clean up:
            sqlConnection.Dispose();
            sqlCommand.Dispose();
            sqlDataReader.Dispose();
        }

        [WebMethod(Description = "<br /><span class='intro'>" +
            "Update the JimRadio database with the status of a video play attempt of </span>" +
            "<span class='AccentColor'>Error</span><br /><br />")]
        public void VideoPlayError(string YouTubeId, int ErrorCode)
        {
            //----------------------------------------------------------------------------------------------
            // Utilize Host Services for database processing:

            // Init the JimRadio host services class to get access to the JimRadio database
            // in server-side processing:
            jimRadioHostServices = new JimRadioHostServices();
            jimRadioHostServices.GetDatabaseSql(out sqlConnection, out sqlCommand);

            //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

            // Init the SQL:
            string strSqlQuery = "update video set play_error = " + ErrorCode.ToString() +
                " where youtube_id = '" + YouTubeId + "'";

            // Assign and execute the SQL:
            sqlCommand.CommandText = strSqlQuery;
            SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();

            // Clean up:
            sqlConnection.Dispose();
            sqlCommand.Dispose();
            sqlDataReader.Dispose();
        }

        [WebMethod(Description = "<br /><span class='intro'>" +
            "Query the JimRadio database as a </span>" +
            "<span class='AccentColor'>demo</span><br /><br />")]
        public string VideoLookupDemo(string YouTubeTitle)
        {
            //----------------------------------------------------------------------------------------------
            // Utilize Host Services for database processing:

            // Init the JimRadio host services class to get access to the JimRadio database
            // in server-side processing:
            jimRadioHostServices = new JimRadioHostServices();
            jimRadioHostServices.GetDatabaseSql(out sqlConnection, out sqlCommand);

            //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

            // Init the SQL:
            string strSqlQuery = "select count(*) from video where youtube_title like '%" + YouTubeTitle + "%'";
            int intTitleCount;

            // Assign and execute the SQL:
            sqlCommand.CommandText = strSqlQuery;
            SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();

            // Read the result:
            sqlDataReader.Read();
            intTitleCount = sqlDataReader.GetInt32(0);

            // Clean up:
            sqlConnection.Dispose();
            sqlCommand.Dispose();
            sqlDataReader.Dispose();

            // Return the appropriate message:
            if (intTitleCount > 0){
                return "Video '" + YouTubeTitle + "' was found.";
            }
            else{
                return "Video '" + YouTubeTitle + "' was not found.";
            }            
        }
    }
}
