using Microsoft.AspNetCore.Identity;
using Progetto_Gioco_a_Turni_Identity.Models;
using System.Security.Claims;

namespace Progetto_Gioco_a_Turni_Identity.Interfaces
{
    public interface IUserServices
    {
        Task<IdentityResult> CreazioneUtente(RegisterModel datiUtenteRegistration);
        Task<bool> ConfermaEMailDb();
        Task<bool> LoginUtente(LoginModel loginData);

        Task<bool> LogoutUser();

        Task<bool> SaveDataGame(dataVictoryMemoryDTO data, ClaimsPrincipal user);
        //string ExtractUserName(string email);
        //string HashingPassword(string password, string username);
    }
}
