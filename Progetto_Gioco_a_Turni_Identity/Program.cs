using Microsoft.AspNetCore.Identity;
using Progetto_Gioco_a_Turni_Identity.Interfaces;
using Progetto_Gioco_a_Turni_Identity.Models;
using Progetto_Gioco_a_Turni_Identity.Repository;
using Progetto_Gioco_a_Turni_Identity.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// servizi di UserRegisterREpository
builder.Services.AddScoped<IUserStore<IdentityUser>, UserRegisterRepository>();
builder.Services.AddScoped<IUserPasswordStore<IdentityUser>, UserRegisterRepository>();
builder.Services.AddScoped<IUserEmailStore<IdentityUser>, UserRegisterRepository>();
builder.Services.AddScoped<ICustomUserRepository, UserRegisterRepository>();
builder.Services.AddScoped<UserRegisterRepository>();
// servizi di UserLoginRepository
builder.Services.AddScoped<IUserLoginRepository, UserLoginRepository>();

// altri servizi 
builder.Services.AddScoped<SignInManager<IdentityUser>>();
builder.Services.AddScoped<IUserServices, UserServices>();
builder.Services.AddScoped<IPasswordHasher<IdentityUser>, PasswordHasher<IdentityUser>>();
builder.Services.AddScoped<IEmail, InvioEMailModel>();
// suggerimento copilot ---------------
builder.Services.AddScoped<UserManager<IdentityUser>>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, UserClaimsPrincipalFactory<IdentityUser>>();
builder.Services.AddScoped<ILookupNormalizer, UpperInvariantLookupNormalizer>();
builder.Services.AddScoped<IdentityErrorDescriber>();
builder.Services.AddScoped<IUserConfirmation<IdentityUser>, DefaultUserConfirmation<IdentityUser>>();
//builder.Services.AddScoped<IUserLoginRepository, UserLoginRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Auth}/{action=Index}/{id?}");

app.Run();
