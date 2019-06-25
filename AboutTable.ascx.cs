using System;

    // This User Control is used in all applicaitions, some Web Forms and some MVC Razor
    // pages.  In order to share this code in all of them, I use the concept of Conditional
    // Compilation.  Conditional compilation symbols are defined here:

    // Project menu / <application name> Properties / Build / General / Conditional compilation symbols
    // and their possible values are WEB_FORM or MVC.  The following controls have different definitions
    // in either: HtmlImage and HtmlTableCell

namespace About
{
    #if WEB_FORM
        public partial class AboutTable : System.Web.UI.UserControl
    #endif
    #if MVC
        public partial class AboutTable : System.Web.Mvc.ViewUserControl
    #endif
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // NOTE: The base class does all the work and the derived class is just a
            // container for the hardcoded values.

            // Each application will define its own version of the derived class and, in
            // this way, I will accomplish a unique About window for each application.

            AboutTableInit AboutTableInit1 = new AboutTableInit(this);
        }

    }
}
