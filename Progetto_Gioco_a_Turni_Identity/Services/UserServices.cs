using Microsoft.AspNetCore.Identity;
using Progetto_Gioco_a_Turni_Identity.Interfaces;
using Progetto_Gioco_a_Turni_Identity.Models;
using Progetto_Gioco_a_Turni_Identity.Repository;

namespace Progetto_Gioco_a_Turni_Identity.Services
{
    public class UserServices : IUserServices
    {
        private readonly UserRegisterRepository _userRegisterRepository;
        private readonly IUserLoginRepository _userLoginRepository;
        private readonly IPasswordHasher<IdentityUser> _passwordHasher;
        private readonly IEmail _emailSender;
        private readonly SignInManager<IdentityUser> _signInManager;
        private string NomeUltimoUtenteCreato { get; set; }


        public UserServices(UserRegisterRepository userRepository, IUserLoginRepository IuserLoginRepository, IPasswordHasher<IdentityUser> passwordHasher, IEmail emailSender, SignInManager<IdentityUser> signInManager)
        {
            _userRegisterRepository = userRepository;
            _userLoginRepository = IuserLoginRepository;
            _passwordHasher = passwordHasher;
            _emailSender = emailSender;
            _signInManager = signInManager;
            NomeUltimoUtenteCreato = string.Empty;
        }

        public async Task<IdentityResult> CreazioneUtente(RegisterModel datiUtenteRegistration)
        {
            if (datiUtenteRegistration == null)
            {
                throw new Exception("i dati dal form non sono arrivati");
            }

            try
            {
                using (var cancellationTokenSource = new CancellationTokenSource())
                {
                    string username = ExtractUserName(datiUtenteRegistration.Email);
                    // creazione di un IdentityUser temporaneo (contenente il nome)
                    // da passare al metodo di hash della password, insieme alla pass in chiaro da hashare.
                    IdentityUser userTemp = new IdentityUser()
                    {
                        UserName = username
                    };
                    string hashPsw = HashingPassword(datiUtenteRegistration.Password, userTemp);

                    if (username == "null" || hashPsw == "null")
                    {
                        throw new Exception("impossibile ricavare username");
                    }

                    IdentityUser user = new IdentityUser()
                    {
                        Id = Guid.NewGuid().ToString(),
                        Email = datiUtenteRegistration.Email,
                        NormalizedEmail = datiUtenteRegistration.Email.Trim().ToLower(),
                        PhoneNumber = datiUtenteRegistration.Cellulare,
                        UserName = username,
                        NormalizedUserName = username.Trim().ToLower(),
                        EmailConfirmed = false,
                        PhoneNumberConfirmed = false,
                        TwoFactorEnabled = false,
                        LockoutEnabled = false,
                        AccessFailedCount = 0,
                        PasswordHash = hashPsw,
                        ConcurrencyStamp = Guid.NewGuid().ToString(),
                        SecurityStamp = Guid.NewGuid().ToString(),
                        LockoutEnd = null
                    };

                    CancellationToken cancellationToken = cancellationTokenSource.Token;
                    // Implementazione del metodo dal repository 
                    IdentityResult esito = await _userRegisterRepository.CreateAsync(user, cancellationToken);

                    if (esito.Succeeded)
                    {
                        NomeUltimoUtenteCreato = user.UserName;
                        await SendEmailConfirmation(user.Email, NomeUltimoUtenteCreato);
                    }

                    return esito;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"errore durante la creazione utente :{ex.ToString()}");
                return IdentityResult.Failed(new IdentityError { Description = "Errore durante la creazione utente." });
            }
        }

        // serve per confermare la mail conc cui un utente si è registrato.
        public async Task<bool> ConfermaEMailDb()
        {
            try
            {
                bool esito = await _userRegisterRepository.confermaEMail();
                return esito;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"errore durante il richiamo del db per impostare EMAILCONFIRMED su true :{ex.ToString()}");
                return false;
            }
        }

        private string ExtractUserName(string email)
        {
            if (email == null)
            {
                throw new Exception("nessuna email fornita");
            }

            try
            {
                string username = email.Substring(0, email.IndexOf("@"));
                return username;

            }
            catch (Exception ex)
            {
                Console.WriteLine($" errore durante l'estrazione dello username :{ex.Message}");
                return "null";
            }
        }

        private string HashingPassword(string password, IdentityUser username)
        {
            if (password == null)
            {
                throw new Exception("nessuna password fornita");
            }

            try
            {
                string hashPass = _passwordHasher.HashPassword(username, password);
                return hashPass;
            }
            catch (Exception ex)
            {
                Console.WriteLine($" errore durante la criptazione della password:{ex.Message}");
                return "null";
            }
        }

        private async Task<bool> SendEmailConfirmation(string emailDestinatario, string nomeUtenteCreato)
        {
            try
            {
                bool esito = await _emailSender.SendEmail_Confirmation(emailDestinatario, nomeUtenteCreato);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"errore durante l'invio dell'email di conferma dell utente appena creato. :{ex.ToString()}");
                return false;
            }
        }

        public async Task<bool> LoginUtente(LoginModel loginData)
        {
            await _userLoginRepository.LoginUtente(loginData);
            return true;
        }
    }
}
