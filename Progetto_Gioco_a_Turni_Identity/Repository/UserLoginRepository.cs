using Microsoft.AspNetCore.Identity;
using Oracle.ManagedDataAccess.Client;
using Progetto_Gioco_a_Turni_Identity.Interfaces;
using Progetto_Gioco_a_Turni_Identity.Models;
using System.Data;

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
			IdentityUser User = await FindUserByEmail(loginData);

			bool isGood = IsUserGeneratedGood(User);
			// "user" tipo "identityUser" , bool "isPersistent" , [string autenticationmethod = null]
			//IdentityUser user = new IdentityUser();
			if (isGood)
			{
				await _SignInManager.SignInAsync(User, true);
				return true;
			}
			else
			{
				return false;
			}

			//return true;
		}

		//private async Task<IdentityUser> FindUserByEmail(LoginModel loginData)
		private async Task<IdentityUser> FindUserByEmail(LoginModel loginData)
		{
			//TROVA LO USER DALLA MAIL 
			try
			{
				using (var conn = new OracleConnection(_connectionString))
				{
					await conn.OpenAsync();

					using (var command = conn.CreateCommand())
					{
						command.CommandType = CommandType.StoredProcedure;
						command.CommandText = "SELECT_USER_BY_EMAIL";


						command.Parameters.Add("emailUser", OracleDbType.NVarchar2).Value = loginData.Email;

						//inserisco parametro di output 
						var cursorParam = new OracleParameter("user_cursor", OracleDbType.RefCursor)
						{
							Direction = ParameterDirection.Output
						};

						command.Parameters.Add(cursorParam);

						using (var reader = await command.ExecuteReaderAsync())
						{
							if (await reader.ReadAsync())
							{
								var user = new IdentityUser
								{
									Id = reader["ID"]?.ToString() ?? "null",
									UserName = reader["USERNAME"]?.ToString() ?? "null",
									NormalizedUserName = reader["NORMALIZEDUSERNAME"]?.ToString() ?? "null",
									Email = reader["EMAIL"]?.ToString() ?? "null",
									NormalizedEmail = reader["NORMALIZEDEMAIL"]?.ToString() ?? "null",
									EmailConfirmed = Convert.ToBoolean(reader["EMAILCONFIRMED"]),
									PasswordHash = reader["PASSWORDHASH"]?.ToString() ?? "null",
									SecurityStamp = reader["SECURITYSTAMP"]?.ToString() ?? "null",
									ConcurrencyStamp = reader["CONCURRENCYSTAMP"]?.ToString() ?? "null",
									PhoneNumber = reader["PHONENUMBER"]?.ToString() ?? "null",
									PhoneNumberConfirmed = Convert.ToBoolean(reader["PHONENUMBERCONFIRMED"]),
									TwoFactorEnabled = Convert.ToBoolean(reader["TWOFACTORENABLED"]),
									LockoutEnd = reader["LOCKOUTEND"] != DBNull.Value ? Convert.ToDateTime(reader["LOCKOUTEND"]) : DateTime.Now.AddYears(-100),
									LockoutEnabled = Convert.ToBoolean(reader["LOCKOUTENABLED"]),
									AccessFailedCount = Convert.ToInt32(reader["ACCESSFAILEDCOUNT"])
								};

								return user;
							}

							IdentityUser userFail = new IdentityUser();
							return userFail;
						}


					}

				}
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Errore durante il login dell'utente: {ex.Message}");
				IdentityUser userFail = new IdentityUser();
				return userFail;
			}
		}


		// metodo che implementa la reflection (riflessione)
		private bool IsUserGeneratedGood(IdentityUser user)
		{
			try
			{
				var type = user.GetType();

				// avendo ottenuo il tipo di user -- prendo tutte le sue proprietà -- questo mi torna un array contenente tutte le proprietà
				var properties = type.GetProperties();

				// avendo in properties un array di proprietà di user lo posso ciclare 
				if (properties.Length > 0)
				{
					foreach (var prop in properties)
					{
						// posso analizzare le singole proprietà dell'oggetto una ad una  e applicare una logica.
						var value = prop.GetValue(user);

						if (value == null || value.ToString() == "null")
						{
							return false;

						}

					}

					return true;
				}

				return false;
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Errore durante il controllo dell utente selezionato dal db: {ex.Message}");
				return false;
			}
			// ottengo a runtime il tipo dell oggetto user - anche se gia lo so al tempo della compilazione, a runtime c'è bisogno di ottenere di nuovo il tipo
			// per far funzionare la reflection 
		}
	}
}

