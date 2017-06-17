using System.Web.UI;

namespace About
{
    public class AboutTableInit : AboutTableInitBase
    {
        // NOTE: The constructor will pass a reference to the AboutTable object
        // (basically an HTML table) and all the work done in the base class will
        // act upon it.

        // Each application will define its own version of this class and, in this
        // way, I will accomplish a unique About window for each application.

        public AboutTableInit(UserControl AboutTable) : base(AboutTable)
        {
            this.set_cell_group("row1_column1", "<br/><br/>Framework", "dot_net_4_2.jpg", "Microsoft .NET", "4.0");
            this.set_cell_group("row1_column2", "<br/><br/>JimRadio", "asp.jpg", "ASP", "2015");
            this.set_cell_group("row1_column3", "<br/><br/>Implementation", "c_sharp_2010.jpg", "Visual C# &<br/>JavaScript", "2015");

            this.set_cell_group("row2_column1", "<br/><br/>Storage", "sql_server.JPG", "SQL Server", "2005 / 9");
            this.set_cell_group("row2_column2", "<br/><br/>Hosting", "godaddy.jpg", "GoDaddy.com", "");
            this.set_cell_group("row2_column3", "<br/>Video Content<br/>& APIs", "google_youtube_data_api_1_4.jpg", "Google/YouTube", "");

            this.set_cell_group("row3_column1", "<br/><br/>Video Player", "flashplayer.JPG", "Adobe Flash", "");
            this.set_cell_group("row3_column2", "<br/><br/>Video Player", "HTML_5_video.png", "HTML", "5");
            this.set_cell_group("row3_column3", "<br/><br/>Release", "5.png", "", "");

            this.set_cell_group("row4_column1", "<br/><br/>Programming", "programmer.jpg", "Jim Kelleher", "");
            this.set_cell_group("row4_column2", "", "", "", "");
            this.set_cell_group("row4_column3", "", "", "", "");

        }

    }

}
