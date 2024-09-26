using Microsoft.AspNetCore.Identity;
using Progetto_Gioco_a_Turni_Identity.Interfaces;
using Progetto_Gioco_a_Turni_Identity.Models;
using Progetto_Gioco_a_Turni_Identity.Repository;

namespace Progetto_Gioco_a_Turni_Identity.Services
{
    public class UserServices : IUserServices
    {
        private readonly UserRepository _userRepository;
        private readonly IPasswordHasher<IdentityUser> _passwordHasher;

        public UserServices(UserRepository userRepository, IPasswordHasher<IdentityUser> passwordHasher)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
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
                    IdentityResult esito = await _userRepository.CreateAsync(user, cancellationToken);
                    return esito;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"errore durante la creazione utente :{ex.ToString()}");
                return IdentityResult.Failed(new IdentityError { Description = "Errore durante la creazione utente." });
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
    }
}
