using Dapper;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using TaniumApi.Library.DataAccess.Interfaces;

namespace TaniumApi.Library.DataAccess;
public class SqlDataAccess(IConfiguration config) : ISqlDataAccess
{
    private const string DefaultDatabase = "Default";
    private readonly IConfiguration _config = config;
    private static IDbConnection _connection;
    private static IDbTransaction _transaction;

    private string GetConnectionString(string connectionStringName)
    {
        return _config.GetConnectionString(connectionStringName);
    }

    private static void Dispose()
    {
        _connection?.Dispose();
        _transaction?.Dispose();

        _transaction = null;
        _connection = null;
    }

    public async Task<List<T>> GetAllDataAsync<T>(
        string storedProcedure,
        DynamicParameters parameters = null,
        string connectionStringName = DefaultDatabase)
    {
        string connectionString = GetConnectionString(connectionStringName);

        using var connection = new SqlConnection(connectionString);
        var rows = await connection.QueryAsync<T>(storedProcedure, parameters,
            commandType: CommandType.StoredProcedure);

        return rows.ToList();
    }

    public async Task<T> GetDataAsync<T>(
        string storedProcedure,
        DynamicParameters parameters = null,
        string connectionStringName = DefaultDatabase)
    {
        string connectionString = GetConnectionString(connectionStringName);

        using var connection = new SqlConnection(connectionString);
        var row = await connection.QueryFirstOrDefaultAsync<T>(storedProcedure, parameters,
            commandType: CommandType.StoredProcedure);

        return row;
    }

    public async Task<T> SaveDataAsync<T>(
        string storedProcedure,
        DynamicParameters parameters = null,
        string connectionStringName = DefaultDatabase)
    {
        string connectionString = GetConnectionString(connectionStringName);

        using var connection = new SqlConnection(connectionString);
        var result = await connection.QueryFirstOrDefaultAsync<T>(storedProcedure,
            parameters, commandType: CommandType.StoredProcedure);

        return result;
    }

    public async Task CheckHealthAsync(string connectionStringName = DefaultDatabase)
    {
        string connectionString = GetConnectionString(connectionStringName);

        using var connection = new SqlConnection(connectionString);
        var result = await connection.QueryFirstOrDefaultAsync<int>("SELECT 1", 
            commandType: CommandType.Text);
    }

    public void StartTransaction(string connectionStringName = DefaultDatabase)
    {
        string connectionString = GetConnectionString(connectionStringName);

        _connection = new SqlConnection(connectionString);
        _connection.Open();

        _transaction = _connection.BeginTransaction();
    }

    public void CommitTransaction()
    {
        _transaction?.Commit();
        _connection?.Close();

        Dispose();
    }

    public void RollbackTransaction()
    {
        _transaction?.Rollback();
        _connection?.Close();

        Dispose();
    }

    public async Task<List<T>> LoadAllDataInTransactionAsync<T>(
        string storedProcedure,
        DynamicParameters parameters = null)
    {
        var rows = await _connection?.QueryAsync<T>(storedProcedure, parameters,
            commandType: CommandType.StoredProcedure, 
            transaction: _transaction);

        return rows.ToList();
    }

    public async Task<T> LoadDataInTransactionAsync<T>(
        string storedProcedure,
        DynamicParameters parameters = null)
    {
        var row = await _connection?.QueryFirstOrDefaultAsync(
            storedProcedure,
            parameters,
            commandType: CommandType.StoredProcedure, 
            transaction: _transaction);

        return row;
    }

    public async Task<T> SaveInTransactionAsync<T>(
        string storedProcedure,
        DynamicParameters parameters = null)
    {
        var result = await _connection?.QueryFirstOrDefaultAsync<T>(storedProcedure, parameters,
            commandType: CommandType.StoredProcedure, transaction: _transaction);

        return result;
    }
}