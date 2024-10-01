using System.ComponentModel.DataAnnotations;

namespace Progetto_Gioco_a_Turni_Identity.Models
{
	public class RegisterModel
	{
		//private UserRepository _userRepository;

		public RegisterModel()
		{
			//_userRepository = userRepository;
			Email = string.Empty;
			Password = string.Empty;
			ConfirmPassword = string.Empty;
			Cellulare = string.Empty;
		}

		[Required(ErrorMessage = "L'email è obbligatoria.")]
		[EmailAddress(ErrorMessage = "Formato email non valido.")]
		public string Email { get; set; }

		[Required(ErrorMessage = "La password è obbligatoria.")]
		[DataType(DataType.Password)]
		[StringLength(100, MinimumLength = 8, ErrorMessage = "La password deve essere lunga almeno 8 caratteri.")]
		public string Password { get; set; }

		[Required(ErrorMessage = "La conferma della password è obbligatoria.")]
		[DataType(DataType.Password)]
		[Compare("Password", ErrorMessage = "Le password non corrispondono.")]
		public string ConfirmPassword { get; set; }

		[Required(ErrorMessage = "Il numero di cellulare è obbligatorio.")]

		public string Cellulare { get; set; }
	}
}
