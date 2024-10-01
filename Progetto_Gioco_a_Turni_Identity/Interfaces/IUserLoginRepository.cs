using Progetto_Gioco_a_Turni_Identity.Models;

namespace Progetto_Gioco_a_Turni_Identity.Interfaces
{
    public interface IUserLoginRepository
    {
        Task<bool> LoginUtente(LoginModel loginData);

    }
}
