using System.ComponentModel.DataAnnotations;

namespace Progetto_Gioco_a_Turni_Identity.Models
{
	public class LoginModel
	{

		[Required(ErrorMessage = "Inserisci la tua email.")]
		[EmailAddress(ErrorMessage = "Formato email non valido.")]
		public string Email { get; set; }

		[Required(ErrorMessage = "inserisci la password.")]
		public string Password { get; set; }

		public LoginModel()
		{
			Email = string.Empty;
			Password = string.Empty;
		}
	}
}
