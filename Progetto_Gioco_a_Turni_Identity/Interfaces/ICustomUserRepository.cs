namespace Progetto_Gioco_a_Turni_Identity.Interfaces
{
    public interface ICustomUserRepository
    {
        Task<bool> confermaEMail();
    }
}
