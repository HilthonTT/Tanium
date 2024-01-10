using Dapper;

namespace TaniumApi.Library.DataAccess;
public interface ISqlDataAccess
{
    void CommitTransaction();
    Task<List<T>> GetAllDataAsync<T>(string storedProcedure, DynamicParameters parameters, string connectionStringName = "Default");
    Task<T> GetDataAsync<T>(string storedProcedure, DynamicParameters parameters = null, string connectionStringName = "Default");
    Task<List<T>> LoadAllDataInTransactionAsync<T>(string storedProcedure, DynamicParameters parameters = null);
    Task<T> LoadDataInTransactionAsync<T>(string storedProcedure, DynamicParameters parameters = null);
    void RollbackTransaction();
    Task<int> SaveDataAsync(string storedProcedure, DynamicParameters parameters = null, string connectionStringName = "Default");
    void StartTransaction(string connectionStringName = "Default");
}