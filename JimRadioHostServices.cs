using System.Data.SqlClient;
using System.Configuration;

public class JimRadioHostServices
{
    public void GetDatabaseSql(out SqlConnection sqlConnection, out SqlCommand sqlCommand)
    {        
        // My GoDaddy, SQL Server, video (song), "JimRadio" database:

        // Connect:
        sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings[
            "DATABASE_CONNECTION_STRING"].ToString());
        sqlConnection.Open();

        // Init the query object, which will be used to execute SQL:
        sqlCommand = sqlConnection.CreateCommand();

        // Return sqlConnection and sqlCommand as output parameters

    }
}

