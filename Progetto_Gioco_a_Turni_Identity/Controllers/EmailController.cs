using Microsoft.AspNetCore.Mvc;
using Progetto_Gioco_a_Turni_Identity.Interfaces;

namespace Progetto_Gioco_a_Turni_Identity.Controllers
{
    public class EmailController : Controller
    {
        private readonly IUserServices _userServices;

        public EmailController(IUserServices userServices)
        {
            _userServices = userServices;
        }


        [HttpGet]
        public async Task<IActionResult> ConfermaEmailRegistrazione_Successo()
        {

            bool esito = await _userServices.ConfermaEMailDb();

            if (esito)
            {
                return View();
            }
            else
            {
                return RedirectToAction("ConfermaEmailRegistrazione_Fallito", "Email");
            }
        }

        public IActionResult ConfermaEmailRegistrazione_Fallito()
        {
            return View();
        }
    }
}
