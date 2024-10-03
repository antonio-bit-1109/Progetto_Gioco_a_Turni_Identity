using Microsoft.AspNetCore.Identity;
using Progetto_Gioco_a_Turni_Identity.Interfaces;
using Progetto_Gioco_a_Turni_Identity.Models;

namespace Progetto_Gioco_a_Turni_Identity.Repository
{
    //SignInManager<IdentityUser> è una classe concreta, perciò inserisco SignInManager<IdentityUser> nel container delle dipendenze del program (servizio)
    //e lo inietto in questa classe in modo da avere i metodi della classe concreta SignInManager<IdentityUser> disponibili qui dentro

    public class UserLoginRepository : IUserLoginRepository
    {
        private SignInManager<IdentityUser> _SignInManager;
        private string _connectionString;


        public UserLoginRepository(IConfiguration configuration, SignInManager<IdentityUser> signInManager)
        {
            var connectionString = configuration.GetConnectionString("OracleDbContext") ?? throw new InvalidOperationException("Connection string not found.");
            _connectionString = connectionString;
            _SignInManager = signInManager;
        }


        public async Task<bool> LoginUtente(LoginModel loginData)
        {
            // ricavo i dati dell utente che sta tentando di fare login confrontanto email e password inseriti, se combaciano torno i dati dell utente dal db 
            // costruisco un oggetto UserIdentity e lo passo al metodo SIgnInAsync di Identity
            await FindUserByEmail(loginData);


            // "user" tipo "identityUser" , bool "isPersistent" , [string autenticationmethod = null]
            //IdentityUser user = new IdentityUser();

            await _SignInManager.SignInAsync();

            //return true;
        }

        //private async Task<IdentityUser> FindUserByEmail(LoginModel loginData)
        private async Task<string> FindUserByEmail(LoginModel loginData)
        {
            //TROVA LO USER DALLA MAIL 
            //return "ciao";
        }
    }
}
