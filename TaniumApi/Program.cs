using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using TaniumApi;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.ConfigureServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapHealthChecks("/_health", new HealthCheckOptions
{
    AllowCachingResponses = true,
});

app.UseCors();
app.UseCors("OpenCors");
app.UseRateLimiter();
app.UseOutputCache();

app.UseAuthentication();
app.UseAuthorization();

var policyCollection = new HeaderPolicyCollection()
    .AddDefaultSecurityHeaders()
    .AddFrameOptionsDeny()
    .AddXssProtectionBlock()
    .AddContentTypeOptionsNoSniff()
    .AddStrictTransportSecurityMaxAgeIncludeSubDomains(maxAgeInSeconds: 60 * 60 * 24 * 365) // maxage = one year in seconds
    .AddReferrerPolicyStrictOriginWhenCrossOrigin()
    .RemoveServerHeader()
    .AddContentSecurityPolicy(builder =>
    {
        builder.AddObjectSrc().None();
        builder.AddFormAction().Self();
        builder.AddFrameAncestors().None();
    })
    .AddCrossOriginOpenerPolicy(builder =>
    {
        builder.SameOrigin();
    })
    .AddCrossOriginEmbedderPolicy(builder =>
    {
        builder.RequireCorp();
    })
    .AddCrossOriginResourcePolicy(builder =>
    {
        builder.SameOrigin();
    });

app.UseSecurityHeaders(policyCollection);

app.MapControllers();

app.Run();
