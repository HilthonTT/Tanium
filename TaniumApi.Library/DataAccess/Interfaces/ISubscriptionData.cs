using TaniumApi.Library.Models;

namespace TaniumApi.Library.DataAccess.Interfaces;
public interface ISubscriptionData
{
    Task<SubscriptionModel> CreateSubscriptionAsync(SubscriptionModel subscription);
    Task<SubscriptionModel> GetUserSubscriptionAsync(int userId);
    Task<SubscriptionModel> UpdateSubscriptionAsync(SubscriptionModel subscription);
}