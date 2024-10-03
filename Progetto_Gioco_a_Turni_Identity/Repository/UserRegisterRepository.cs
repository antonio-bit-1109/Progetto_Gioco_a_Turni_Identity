using Microsoft.AspNetCore.Identity;
using Oracle.ManagedDataAccess.Client;
using Oracle.ManagedDataAccess.Types;
using Progetto_Gioco_a_Turni_Identity.Interfaces;
using System.Data;

namespace Progetto_Gioco_a_Turni_Identity.Repository
{


	public class UserRegisterRepository : IUserStore<IdentityUser>,
		IUserPasswordStore<IdentityUser>,
		IUserEmailStore<IdentityUser>,
		ICustomUserRepository
	{
		private readonly string _connectionString;

		//// SignInmanager non è un interfaccia ma una classe concreta. perciò posso inserirla direttamente come proprietà di userrepository
		//private readonly SignInManager<IdentityUser> _signInManager;

		public UserRegisterRepository(IConfiguration configuration)
		{
			var connectionString = configuration.GetConnectionString("OracleDbContext") ?? throw new InvalidOperationException("Connection string not found.");
			_connectionString = connectionString;
			//_signInManager = signInManager;
		}

		// metodo per aprire connessione con  il db 
		public (bool, OracleConnection) OpenConnectionDb()
		{
			OracleConnection connection = new OracleConnection(_connectionString);
			try
			{

				//await connection.OpenAsync();
				connection.Open();
				if (connection.State == System.Data.ConnectionState.Open)
				{
					Console.WriteLine("------------------------------------");
					Console.WriteLine("connessione con il db correttamente eseguita.");
					Console.WriteLine("------------------------------------");
					return (true, connection);
				}

				throw new Exception("connessione con il db non riuscita");

			}
			catch (Exception ex)
			{
				Console.WriteLine("------------------------------------");
				Console.WriteLine(ex.ToString());
				Console.WriteLine("------------------------------------");
				return (false, connection);
			}
		}

		// chiusura connessione al db 
		public bool ClosingConnection(OracleConnection connection)
		{
			try
			{

				if (connection != null && connection.State == System.Data.ConnectionState.Open)
				{
					connection.Close();
					Console.WriteLine("------------------------------------");
					Console.WriteLine("Connessione con il db chiusa correttamente.");
					Console.WriteLine("------------------------------------");
					return true;
				}

				throw new Exception("impossibile chiudere la connessione al db.");

			}
			catch (Exception ex)
			{
				Console.WriteLine("------------------------------------");
				Console.WriteLine($"Errore durante la chiusura della connessione: {ex.Message}");
				Console.WriteLine("------------------------------------");
				return false;
			}
		}

		// creazione nuovo utente
		public async Task<IdentityResult> CreateAsync(IdentityUser user, CancellationToken cancellationToken)
		{
			var (result, conn) = OpenConnectionDb();

			if (!result) return await Task.FromResult(IdentityResult.Failed(new IdentityError { Description = "Errore di connessione al database." }));

			try
			{
				//trasformo i booleani in interi da salvare nel db
				int emailConfirmed = user.EmailConfirmed ? 1 : 0;
				int phoneNumConfirmed = user.PhoneNumberConfirmed ? 1 : 0;
				int twoFactorEnabled = user.TwoFactorEnabled ? 1 : 0;
				int lockoutEnabled = user.LockoutEnabled ? 1 : 0;

				// se l utente richiede di cancellare l'operazione
				// il cancellation token fare il rollback delle azioni
				if (cancellationToken.IsCancellationRequested)
				{
					Console.WriteLine("Operazione annullata prima dell'inizio.");
					return await Task.FromResult(IdentityResult.Failed(new IdentityError
					{
						Description = "Operazione annullata."
					}));
				}

				using (var command = conn.CreateCommand())
				{
					command.CommandType = CommandType.StoredProcedure;
					command.CommandText = "INSERT_USER";


					//PRIMA DI ESEGUIRE LA QUERY COTROLLA DI NUOVO SE UTENTE 
					//HA ANNULLATO L OPERAZIONE

					if (cancellationToken.IsCancellationRequested)
					{
						Console.WriteLine("Operazione annullata prima dell'inizio.");
						return await Task.FromResult(IdentityResult.Failed(new IdentityError
						{
							Description = "Operazione annullata."
						}));
					}

					//inserisci parametri in e out EMAIL
					command.Parameters.Add("id_user_param", OracleDbType.NVarchar2).Value = user.Id;
					command.Parameters.Add("email_user_param", OracleDbType.NVarchar2).Value = user.Email;
					command.Parameters.Add("norm_email_param", OracleDbType.NVarchar2).Value = user.NormalizedEmail;
					command.Parameters.Add("username_param", OracleDbType.NVarchar2).Value = user.UserName;
					command.Parameters.Add("norm_username_param", OracleDbType.NVarchar2).Value = user.NormalizedUserName;
					command.Parameters.Add("email_confirmed_param", OracleDbType.Int32).Value = emailConfirmed;
					command.Parameters.Add("phone_num_confirmed_param", OracleDbType.Int32).Value = phoneNumConfirmed;
					command.Parameters.Add("phone_num_param", OracleDbType.NVarchar2).Value = user.PhoneNumber;
					command.Parameters.Add("two_factor_enabled_param", OracleDbType.Int32).Value = twoFactorEnabled;
					command.Parameters.Add("lockOut_enabled_param", OracleDbType.Int32).Value = lockoutEnabled;
					command.Parameters.Add("acc_fail_count_param", OracleDbType.Int32).Value = user.AccessFailedCount;
					command.Parameters.Add("pswHash_param", OracleDbType.NVarchar2).Value = user.PasswordHash;
					command.Parameters.Add("conc_stamp_param", OracleDbType.NVarchar2).Value = user.ConcurrencyStamp;
					command.Parameters.Add("security_stamp_param", OracleDbType.NVarchar2).Value = user.SecurityStamp;
					command.Parameters.Add("lockOut_end_param", OracleDbType.TimeStampTZ).Value = user.LockoutEnd;

					//inserisco parametro di output 
					var righe_inserite = new OracleParameter("righe_inserite", OracleDbType.Int32)
					{
						Direction = ParameterDirection.Output
					};

					command.Parameters.Add(righe_inserite);

					command.ExecuteNonQuery();

					if (righe_inserite.Value != DBNull.Value)
					{

						int RigheInserite = ((OracleDecimal)righe_inserite.Value).ToInt32();

						if (RigheInserite == 1)
						{
							Console.WriteLine("fin qui tutto bene");
							await Populate_UserRoles_table(user, conn);
							await Popolate_User_Claims_table(user, conn);
							return await Task.FromResult(IdentityResult.Success);
						}

						if (RigheInserite == -1)
						{
							Console.WriteLine("utente non inserito.");
							return await Task.FromResult(IdentityResult.Failed(new IdentityError
							{
								Description = "Email o cellualre gia presenti nel database."
							}));
						}


					}
				}
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Errore durante la creazione dell'utente {ex.Message}");
				return await Task.FromResult(IdentityResult.Failed(new IdentityError { Description = "Errore durante la creazione dell'utente." }));
			}
			finally
			{
				ClosingConnection(conn);
			}

			return await Task.FromResult(IdentityResult.Success);
		}

		// SCRIVI DEI METODI PER POPOLARE LE RESTANTI TABELLE DELL AUTENTICAZIONE 
		private async Task<bool> Populate_UserRoles_table(IdentityUser user, OracleConnection conn)
		{
			try
			{
				using (var command = conn.CreateCommand())
				{
					command.CommandType = CommandType.StoredProcedure;
					command.CommandText = "POPULATE_ASPNETUSERROLES";

					//parametro input 
					command.Parameters.Add("user_id_param", OracleDbType.NVarchar2).Value = user.Id;

					//parametro output
					var righe_inserite = new OracleParameter("righe_Inserite", OracleDbType.Int32)
					{
						Direction = ParameterDirection.Output
					};

					command.Parameters.Add(righe_inserite);
					await command.ExecuteNonQueryAsync();

					if (righe_inserite.Value != DBNull.Value)
					{


						int RigheInserite = ((OracleDecimal)righe_inserite.Value).ToInt32();

						if (RigheInserite == 1)
						{
							Console.WriteLine("tabella ASPNETUSERROLES correttamente popolata.");
							return true;
						}

						if (RigheInserite == 0)
						{
							throw new Exception("Errore durante il popolamento della tabella ASP NET USER ROLES");

						}


					}
					throw new Exception("contorlla trore procedure. IL parametro righe inserite riisulta null.");

				}
			}
			catch (Exception ex)
			{
				Console.WriteLine($"errore durante il popolamento della tabella ASPNETUSERROLES {ex.Message}");
				return false;
			}
		}

		// quando un utente viene creato specificare che tipo di permessi possiede (id (PK) , userid , claimtype
		// ogni volta che registro un utente "standard" dalla pagina di registrazione questo avraà claimtype "role" value "user"
		//type "permission" value "basic" (ha accesso a funzionalità base)
		private async Task<bool> Popolate_User_Claims_table(IdentityUser user, OracleConnection conn)
		{
			try
			{
				using (var command = conn.CreateCommand())
				{
					for (var i = 0; i < 2; i++)
					{
						command.CommandType = CommandType.StoredProcedure;
						command.CommandText = "POPULATE_ASPNETUSERCLAIMS";

						command.Parameters.Clear();

						command.Parameters.Add("user_id_param", OracleDbType.NVarchar2).Value = user.Id;


						if (i == 0)
						{
							//PARAMETRI INPUT
							command.Parameters.Add("claim_type_param", OracleDbType.NVarchar2).Value = "role";
							command.Parameters.Add("claim_value_param", OracleDbType.NVarchar2).Value = "user";

							var righe_inserite = new OracleParameter("righe_inserite", OracleDbType.Int32)
							{
								Direction = ParameterDirection.Output
							};

							command.Parameters.Add(righe_inserite);

							await command.ExecuteNonQueryAsync();
							if (righe_inserite.Value != DBNull.Value)
							{

								int RigheInserite = ((OracleDecimal)righe_inserite.Value).ToInt32();

								if (RigheInserite == 1)
								{
									Console.WriteLine("primo record userclaims popolato correttamente.");
									continue;
								}

								if (RigheInserite == 0)
								{
									throw new Exception("CICLO 2 -- Errore durante il popolamento della tabella ASP NET USER CLAIMS");

								}


							}
						}

						if (i == 1)
						{

							command.Parameters.Add("claim_type_param", OracleDbType.NVarchar2).Value = "permission";
							command.Parameters.Add("claim_value_param", OracleDbType.NVarchar2).Value = "basic";
							var righe_inserite = new OracleParameter("righe_inserite", OracleDbType.Int32)
							{
								Direction = ParameterDirection.Output
							};

							command.Parameters.Add(righe_inserite);

							await command.ExecuteNonQueryAsync();
							if (righe_inserite.Value != DBNull.Value)
							{

								int RigheInserite = ((OracleDecimal)righe_inserite.Value).ToInt32();

								if (RigheInserite == 1)
								{
									Console.WriteLine("secondo record userclaims popolato correttamente.");
									continue;
								}

								if (RigheInserite == 0)
								{
									throw new Exception("CICLO 2 -- Errore durante il popolamento della tabella ASP NET USER CLAIMS");

								}


							}

						}
					}

					Console.WriteLine("tabella aspnetUserClaims correttamente popolata");
					return true;
				}
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Errore durante il popolamento della tabella ASPNETUSERCLAIMS : {ex.Message}");
				return false;
			}
		}

		public async Task<bool> confermaEMail()
		{
			var (result, conn) = OpenConnectionDb();

			if (!result) throw new Exception("errore connessione al db");

			try
			{
				using (var command = conn.CreateCommand())
				{
					command.CommandType = CommandType.StoredProcedure;
					command.CommandText = "ASPNETUSER_CONFERMA_EMAIL";

					//inserisco parametro di output 
					var righe_inserite = new OracleParameter("righe_aggiornate", OracleDbType.Int32)
					{
						Direction = ParameterDirection.Output
					};
					command.Parameters.Add(righe_inserite);

					await command.ExecuteNonQueryAsync();

					if (righe_inserite.Value != DBNull.Value)
					{
						int RigheInserite = ((OracleDecimal)righe_inserite.Value).ToInt32();

						if (RigheInserite == 1)
						{
							Console.WriteLine("campo EMAILCONFIRMED correttamente aggiornato.");
							return true;
						}
						else
						{
							throw new Exception("impossibile aggiornare il campo EMAILCONFIRMED della tabella ASPNETUSERS.");

						}
					}
					throw new Exception("valore null nel parametro di output della store procedure.");

				}
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Errore durante la chiamata al db per confermare la mail dell'utente: {ex.Message}.");
				return false;
			}
			finally
			{
				ClosingConnection(conn);
			}

		}

		public Task<IdentityResult> DeleteAsync(IdentityUser user, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();

		}
		public Task<IdentityUser?> FindByIdAsync(string userId, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task<IdentityUser?> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task<string?> GetNormalizedUserNameAsync(IdentityUser user, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task<string?> GetPasswordHashAsync(IdentityUser user, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task<string> GetUserIdAsync(IdentityUser user, CancellationToken cancellationToken)
		{
			//throw new NotImplementedException();
			try
			{

				if (user == null)
				{
					throw new ArgumentNullException("user");
				}

				// uso reflection per controllare che user sia correttamente formato.
				if (user != null)
				{
					var type = user.GetType();
					var properties = type.GetProperties();

					foreach (var prop in properties)
					{
						var value = prop.GetValue(user);

						if (value == null)
						{
							throw new NullReferenceException(" un value all'interno dello user Identity User è null.") { };
						}


					};
					return Task.FromResult(user.Id);
				}
				throw new Exception($"lo user IdentityUser, all interno del login, è null.");

			}
			catch (Exception ex)
			{
				throw new Exception($"errore durante il reperimento id utente: {ex.Message}");
			}
		}

		public Task<string?> GetUserNameAsync(IdentityUser user, CancellationToken cancellationToken)
		{

			try
			{
				return Task.FromResult(user.UserName);
			}
			catch (Exception ex)
			{
				throw new Exception($"errore durante il reperimento nome utente: {ex.Message}");
			}
		}

		public Task<bool> HasPasswordAsync(IdentityUser user, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task SetNormalizedUserNameAsync(IdentityUser user, string? normalizedName, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task SetPasswordHashAsync(IdentityUser user, string? passwordHash, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task SetUserNameAsync(IdentityUser user, string? userName, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task<IdentityResult> UpdateAsync(IdentityUser user, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task SetEmailAsync(IdentityUser user, string? email, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task<string?> GetEmailAsync(IdentityUser user, CancellationToken cancellationToken)
		{

			try
			{
				return Task.FromResult(user.Email);
			}
			catch (Exception ex)
			{
				throw new Exception($"errore durante il reperimento email utente : {ex.Message}");
			}
		}

		public Task<bool> GetEmailConfirmedAsync(IdentityUser user, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task SetEmailConfirmedAsync(IdentityUser user, bool confirmed, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task<IdentityUser?> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task<string?> GetNormalizedEmailAsync(IdentityUser user, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task SetNormalizedEmailAsync(IdentityUser user, string? normalizedEmail, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public void Dispose()
		{
			GC.SuppressFinalize(this);
		}
	}

}
