using Progetto_Gioco_a_Turni_Identity.Interfaces;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace Progetto_Gioco_a_Turni_Identity.Models
{
    public class InvioEMailModel : IEmail
    {
        private string Mittente { get; set; } = "antoniorizzuti767@gmail.com";
        private string Destinatario { get; set; }
        private string pswMIttente { get; set; }
        private string Oggetto { get; set; }
        private string Testo { get; set; }

        public InvioEMailModel()
        {
            string? psw_email_MIttente = Environment.GetEnvironmentVariable("SECRET_KEY_EMAIL_SENDER") ;

            if (psw_email_MIttente == null)
            {
                Console.WriteLine("variabile d'ambiente che dovrebbe contenere password Email mittente è null. Imposto valore DEFAULT");
                Console.WriteLine("impossibile inviare Email in queste condizioni.");
                psw_email_MIttente = "ciaociao";
            }

            if (psw_email_MIttente == null)
            {
                throw new Exception("impossibile reperire password mittente email dalla macchina.");
            }

            pswMIttente = psw_email_MIttente;
            Destinatario = string.Empty;
            Oggetto = string.Empty;
            Testo = string.Empty;

        }

        public async Task<bool> SendEmail_Confirmation(string destinatarioMail, string nomeUltimoUtenteCreato)
        {
            if (string.IsNullOrWhiteSpace(destinatarioMail))
            //string.IsNullOrWhiteSpace(oggettoMail) ||
            //string.IsNullOrWhiteSpace(testoMail))
            {
                throw new Exception("destinatario mail non specificato.");
            }
            try
            {

                this.Destinatario = destinatarioMail;
                this.Oggetto = "Conferma Iscrizione Gioco a Turni MVC";
                this.Testo = CreateTesto_conferma_Email(nomeUltimoUtenteCreato);

                var fromAddress = new MailAddress(this.Mittente);
                var toAddress = new MailAddress(this.Destinatario);
                string fromPassword = this.pswMIttente;
                const string smtpServer = "smtp.gmail.com";
                const int smtpPort = 587;


                var smtp = new SmtpClient
                {
                    Host = smtpServer,
                    Port = smtpPort,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
                };

                using (var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = Oggetto,
                    Body = Testo
                })
                {
                    await smtp.SendMailAsync(message);
                }
                Console.WriteLine("  ---   ----   ----   ---- ");
                Console.WriteLine("Email inviata con successo.");
                Console.WriteLine("---   ---  ----  ----  --- ");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Errore durante l'invio della mail post registrazione con successo: {ex.Message}");
                return false;
            }
        }

        private string CreateTesto_conferma_Email(string nomeUltimoUtenteCreato)
        {
            StringBuilder testo = new StringBuilder();
            testo.AppendLine($"Ciao, {nomeUltimoUtenteCreato}");
            testo.AppendLine();
            testo.AppendLine("Grazie per esserti iscritto al nostro gioco a turni MVC che prevediamo, MOLTO PRESTO, diventare una vera figata!");
            testo.AppendLine("(adesso sto scrivendo il servizio per inviare le mail ed è il 27 Settembre, chissà quando potrò lavorare con queste tecnologie");
            testo.AppendLine("Comunque, ...");
            testo.AppendLine();
            testo.AppendLine("<a href=\"https://localhost:7282/Email/ConfermaEmailRegistrazione_Successo\"> (☞ﾟヮﾟ)☞ CLICCAMI ☜(ﾟヮﾟ☜) </a>");
            testo.AppendLine();
            testo.AppendLine("Clicca il link qui sopra per confermare la tua Registrazione, oppure se non sei stato tu a richiederla, ignora questo messaggio.");
            testo.AppendLine("GRAZIE!");
            return testo.ToString();
        }
    }
}
