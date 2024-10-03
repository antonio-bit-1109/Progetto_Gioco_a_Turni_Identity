using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Progetto_Gioco_a_Turni_Identity.Interfaces;
using Progetto_Gioco_a_Turni_Identity.Models;

namespace Progetto_Gioco_a_Turni_Identity.Controllers
{
    public class AuthController : Controller
    {
        private readonly IUserServices _userServices;

        public AuthController(IUserServices userServices)
        {
            _userServices = userServices;
        }

        // GET: è il metodo (action) di base che viene chiamato se non ne viene specificato uno.
        public IActionResult Index()
        {
            return View();
        }
        // 
        // GET: /AuthController/Welcome/ 
        public string Welcome()
        {
            return "This is the Welcome action method...";
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Registrazione()
        {
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> LoginUser(LoginModel loginData)
        {
            if (!ModelState.IsValid)
            {
                TempData["error"] = "errore in fase di login. Dati inseriti non validi o mancanti.";
                return View("Login", loginData);
            }
            else
            {

                await _userServices.LoginUtente(loginData);
                // logica per fare login e in teoria creare un token, salvarlo a db , inviarlo al frontend bla bla bla 
                return RedirectToAction("Index", "Home");
            }

        }

        [HttpPost]
        public async Task<IActionResult> RegisterUser(RegisterModel createUser)
        {
            if (!ModelState.IsValid)
            {
                TempData["error"] = "si sono verificati errori";
                return View("Registrazione", createUser);
            }

            // se il modello è valido chiama il service e
            // successivamente il repository per creare un nuovo utente
            IdentityResult esito = await _userServices.CreazioneUtente(createUser);

            if (esito.Succeeded)
            {
                TempData["success"] = "utente creato con successo. Riceverai una mail con un link per confermare il tuo account.";
                return RedirectToAction("Login", "Auth");
            }

            else
            {
                TempData["error"] = string.Join(", ", esito.Errors.Select(e => e.Description));
                return View("Registrazione", createUser);
            }

            //return View("Registrazione", createUser);
        }
    }
}
