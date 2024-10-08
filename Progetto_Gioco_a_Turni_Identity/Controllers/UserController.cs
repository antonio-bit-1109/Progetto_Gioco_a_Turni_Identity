﻿using Microsoft.AspNetCore.Mvc;
using Progetto_Gioco_a_Turni_Identity.Interfaces;
using Progetto_Gioco_a_Turni_Identity.Models;

namespace Progetto_Gioco_a_Turni_Identity.Controllers
{

    public class UserController : Controller
    {
        private readonly IUserServices _userServices;

        public UserController(IUserServices userServices)
        {
            _userServices = userServices;
        }

        public IActionResult ProfiloPersonale()
        {
            return View();
        }

        [HttpPost]
        public IActionResult DataPartiteUser([FromBody] dataVictoryMemoryDTO data)
        {
            // i dati della partita vinta su memory arrivano qui e li salvo nel db , dati che poi utnte può recuperare.
            if (ModelState.IsValid)
            {
                if (User != null && User.Identity != null && User.Identity.IsAuthenticated)
                {
                    _userServices.SaveDataGame(data, User);
                    return Ok();
                }
                else
                {
                    return Unauthorized(new { success = false, message = "Utente non autenticato." });
                }

            }
            else
            {
                return BadRequest(new { success = false, message = "Dati non validi. Impossibile reperire dati necessari alla registrazione della partita vinta." });
            }
        }
    }
}
