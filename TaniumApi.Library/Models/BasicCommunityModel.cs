﻿namespace TaniumApi.Library.Models;
public class BasicCommunityModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public string BannerUrl { get; set; }
    public int UserId { get; set; }
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    public DateTime DateUpdated { get; set; }
}
