using Microsoft.AspNetCore.Identity;
using Progetto_Gioco_a_Turni_Identity.Models;

namespace Progetto_Gioco_a_Turni_Identity.Interfaces
{
    public interface IUserServices
    {
        Task<IdentityResult> CreazioneUtente(RegisterModel datiUtenteRegistration);
        //string ExtractUserName(string email);
        //string HashingPassword(string password, string username);
    }
}
