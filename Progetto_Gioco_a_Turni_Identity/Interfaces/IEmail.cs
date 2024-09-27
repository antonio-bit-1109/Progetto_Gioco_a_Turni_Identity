namespace Progetto_Gioco_a_Turni_Identity.Interfaces
{
    public interface IEmail
    {
        Task<bool> SendEmail_Confirmation(string destinatarioMail, string nomeUltimoUtenteCreato);
    }
}
