//---------------------------------------------------
// SendSMTPEmail
using System.Net.Mail;

//---------------------------------------------------
// GetRequesterIPAddress and GetRequesterIPInfo
using System.Net;
using System.IO;
using System.Xml;

//----------------------------------------------------
// Get AppSettings from Web.config:
using System.Web.Configuration;

/// <summary>
/// A collection of host-only services available to all WorkingWeb applications.
/// </summary>
public class WorkingWebHostServices
{
    //--------------------------------------------------------------------------------------------------------
    // Package 1, Combined Services:

    public bool PageLoadInit(string strWebsite, string strVisitorIsDeveloper)
    {
        // Web.config-supplied:
        string DEVELOPER_SERVER_IP = WebConfigurationManager.AppSettings["DEVELOPER_SERVER_IP"];

        bool boolIsDeveloper;

        // Get/set information about the user who requested this page...
        string strRequesterIP = GetRequesterIPAddress();

        // DISABLING VISITOR EMAIL NOTE 2 of 2: This setting is stored in Web.config and covers all browsers on my
        // PC since the IP address remains constant (though it does change over the years, every now and then):
        if ( strRequesterIP == WebConfigurationManager.AppSettings["DEVELOPER_CLIENT_PC_IP"] ||
             strVisitorIsDeveloper == "Y" ||
             strRequesterIP == DEVELOPER_SERVER_IP)
                { boolIsDeveloper = true; }
        else
                { boolIsDeveloper = false; }

        // NOTE: Email only works when the application is installed on the server:
        if (strRequesterIP != DEVELOPER_SERVER_IP)
        {
            // ... and, if it's not the developer, ...
            if (!boolIsDeveloper)
            {
                // ... send it by email to the webmaster:
                EmailToWebmaster(strWebsite + " Visitor", strWebsite + " was visited by: " + strRequesterIP);
            };
        };

        // Return a boolean indicating whether or not the user is also the developer:
        return boolIsDeveloper;
    }
    
    //--------------------------------------------------------------------------------------------------------
    // Package 2, Send SMTP Email:

    private void EmailToWebmaster(string strSubject, string strMessage)
    {
        string WEBMASTER_HOST_EMAIL = WebConfigurationManager.AppSettings["WEBMASTER_HOST_EMAIL"];
        
        // From me, to me, with love:
        SendSMTPEmail(WEBMASTER_HOST_EMAIL, WEBMASTER_HOST_EMAIL, strSubject, strMessage);
    }
    
    private void SendSMTPEmail(string strSender, string strRecipients, string strSubject, string strMessage)
    {
        // NOTE: Since email parameters come from the website's web.config file and since this is not
        // available in development, I need a try/catch here in order to run in development:
        try
        {
            // Init:
            MailMessage mailObj = new MailMessage(strSender, strRecipients, strSubject, strMessage);
            SmtpClient SMTPServer = new SmtpClient();

            // Send the email:
            SMTPServer.Send(mailObj);
       }
        catch (System.Exception) {}

    }

    //--------------------------------------------------------------------------------------------------------
    // Package 3, Get Requester IP Address:

    private string GetRequesterIPAddress()
    {
        // Get the requester's IP address:
        System.Web.HttpContext httpContext = System.Web.HttpContext.Current;

        string strIpAddress = httpContext.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

        // If the the visitor is NOT behind a proxy server or router:
        if (string.IsNullOrEmpty(strIpAddress)) { return httpContext.Request.ServerVariables["REMOTE_ADDR"]; }

        // If the the visitor IS behind a proxy server or router:
        else
        {
            string[] strIpArray = strIpAddress.Split(new char[] { ',' });   // "HTTP_X_FORWARDED_FOR"
            return strIpArray[0];
        }
    }

}
