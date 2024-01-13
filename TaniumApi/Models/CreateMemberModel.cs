using System.ComponentModel.DataAnnotations;

namespace TaniumApi.Models;

public class CreateMemberModel
{
    [Range(0, int.MaxValue)]
    public int CommunityId { get; set; }
}
