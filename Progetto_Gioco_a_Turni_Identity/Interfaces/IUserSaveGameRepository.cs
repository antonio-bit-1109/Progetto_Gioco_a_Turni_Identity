using Progetto_Gioco_a_Turni_Identity.Models;

namespace Progetto_Gioco_a_Turni_Identity.Interfaces
{
    public interface IUserSaveGameRepository
    {
        Task<bool> SaveGameIntoDb(dataVictoryMemoryDTO data, string idUtente);
    }
}
