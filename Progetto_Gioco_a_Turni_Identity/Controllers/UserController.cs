using Microsoft.AspNetCore.Mvc;

namespace Progetto_Gioco_a_Turni_Identity.Controllers
{
    public class UserController : Controller
    {
        public IActionResult ProfiloPersonale()
        {
            return View();
        }

        [HttpPost]
        public IActionResult DataPartiteUser()
        {
            // i dati della partita vinta su memory arrivano qui e li salvo nel db , dati che poi utnte può recuperare.
        }
    }
}
