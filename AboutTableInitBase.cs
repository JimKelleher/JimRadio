using System.Web.UI;
using System.Web.UI.HtmlControls;

namespace About
{
    public class AboutTableInitBase
    {
        UserControl AboutTable;

        // Constructor:

        //public partial class AboutTable : System.Web.UI.UserControl
        //public partial class AboutTable : System.Web.Mvc.ViewUserControl

        #if WEB_FORM
            public AboutTableInitBase(UserControl AboutTable)
        #endif
        #if MVC
            public AboutTableInitBase(System.Web.Mvc.ViewUserControl AboutTable)
        #endif
        {
            // Save this and the detail methods will act upon it:
            this.AboutTable = AboutTable;
        }

        // Public worker method:
        public void set_cell_group(string group, string title, string icon_url, string detail, string version)
        {
            // These four fields constitute one logical group or "cell":
            this.set_text_cell(group + "_title", title);
            this.set_image_url(group + "_icon", icon_url);
            this.set_text_cell(group + "_detail", detail);
            this.set_text_cell(group + "_version", version);
        }

        // Private detail method:
        private void set_image_url(string image_name, string image_url)
        {
            HtmlImage image = (HtmlImage)AboutTable.FindControl(image_name);

            image.Src = image_url;
        }

        // Private detail method:
        private void set_text_cell(string cell_name, string cell_value)
        {
            HtmlTableCell table_cell = (HtmlTableCell)AboutTable.FindControl(cell_name);

            table_cell.InnerHtml = cell_value;
        }

    }

}
