using System;
using System.Web.UI;

using About;

namespace JimRadio
{
    public partial class About : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // NOTE: The base class does all the work and the derived class is just a
            // container for the hardcoded values.

            // Each application will define its own version of the derived class and, in
            // this way, I will accomplish a unique About window for each application.

            AboutTableInit AboutTableInit1 = new AboutTableInit(AboutTable);

        }
    }
}