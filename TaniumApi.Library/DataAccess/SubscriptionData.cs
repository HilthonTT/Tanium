using Dapper;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess;
public class SubscriptionData(ISqlDataAccess sql) : ISubscriptionData
{
    private readonly ISqlDataAccess _sql = sql;

    public async Task<SubscriptionModel> GetUserSubscriptionAsync(int userId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId);

        var output = await _sql.GetDataAsync<SubscriptionModel>("dbo.spSubscription_GetByUserId", parameters);

        return output;
    }

    public async Task<SubscriptionModel> CreateSubscriptionAsync(SubscriptionModel subscription)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", subscription.UserId);
        parameters.Add("StripeCustomerId", subscription.StripeCustomerId);
        parameters.Add("StripeSubscriptionId", subscription.StripeSubscriptionId);
        parameters.Add("StripePriceId", subscription.StripePriceId);
        parameters.Add("StripeCurrentPeriodEnd", subscription.StripeCurrentPeriodEnd);

        var output = await _sql.SaveDataAsync<SubscriptionModel>("dbo.spSubscription_Insert", parameters);

        return output;
    }

    public async Task<SubscriptionModel> UpdateSubscriptionAsync(SubscriptionModel subscription)
    {
        var parameters = new DynamicParameters();
        parameters.Add("StripeSubscriptionId", subscription.StripeSubscriptionId);
        parameters.Add("StripePriceId", subscription.StripePriceId);
        parameters.Add("StripeCurrentPeriodEnd", subscription.StripeCurrentPeriodEnd);

        var output = await _sql.SaveDataAsync<SubscriptionModel>("dbo.spSubscription_Update", parameters);

        return output;
    }
}
