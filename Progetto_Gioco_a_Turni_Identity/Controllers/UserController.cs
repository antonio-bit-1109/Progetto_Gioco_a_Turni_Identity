using Microsoft.AspNetCore.Mvc;

namespace Progetto_Gioco_a_Turni_Identity.Controllers
{
    public class UserController : Controller
    {
        public IActionResult ProfiloPersonale()
        {
            return View();
        }
    }
}
