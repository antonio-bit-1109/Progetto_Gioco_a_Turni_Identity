using Oracle.ManagedDataAccess.Client;
using Progetto_Gioco_a_Turni_Identity.Interfaces;
using Progetto_Gioco_a_Turni_Identity.Models;
using System.Data;

namespace Progetto_Gioco_a_Turni_Identity.Repository
{
    public class UserSaveGamesRepository : IUserSaveGameRepository
    {
        private readonly string _connectionString;

        public UserSaveGamesRepository(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("OracleDbContext") ?? throw new InvalidOperationException("Connection string not found.");
            _connectionString = connectionString;
        }

        public async Task<bool> SaveGameIntoDb(dataVictoryMemoryDTO data, string idUtente)
        {
            try
            {
                using (var conn = new OracleConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    using (var command = conn.CreateCommand())
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.CommandText = "INSERT_DATA_GAME_WON";


                        command.Parameters.Add("id_p", OracleDbType.NVarchar2).Value = Guid.NewGuid();
                        command.Parameters.Add("IDUTENTE_p", OracleDbType.NVarchar2).Value = idUtente;
                        command.Parameters.Add("GIOCO_p", OracleDbType.NVarchar2).Value = data.game;
                        command.Parameters.Add("TEMPO_COMPLETAMENTO_p", OracleDbType.NVarchar2).Value = data.tempoCompletamento;
                        command.Parameters.Add("DATA_ORA_COMPLETAMENTO_p", OracleDbType.NVarchar2).Value = Convert.ToDateTime(data.oraComplet);

                        //inserisco parametro di output
                        var righeInserite = new OracleParameter("righeInserite", OracleDbType.Int32)
                        {
                            Direction = ParameterDirection.Output
                        };

                        command.Parameters.Add(righeInserite);
                        await command.ExecuteNonQueryAsync();
                        //using (var reader = await command.ExecuteReaderAsync())
                        //{
                        //    if (await reader.ReadAsync())
                        //    {
                        //        var user = new IdentityUser
                        //        {
                        //            Id = reader["ID"]?.ToString() ?? "null",
                        //            UserName = reader["USERNAME"]?.ToString() ?? "null",
                        //            NormalizedUserName = reader["NORMALIZEDUSERNAME"]?.ToString() ?? "null",
                        //            Email = reader["EMAIL"]?.ToString() ?? "null",
                        //            NormalizedEmail = reader["NORMALIZEDEMAIL"]?.ToString() ?? "null",
                        //            EmailConfirmed = Convert.ToBoolean(reader["EMAILCONFIRMED"]),
                        //            PasswordHash = reader["PASSWORDHASH"]?.ToString() ?? "null",
                        //            SecurityStamp = reader["SECURITYSTAMP"]?.ToString() ?? "null",
                        //            ConcurrencyStamp = reader["CONCURRENCYSTAMP"]?.ToString() ?? "null",
                        //            PhoneNumber = reader["PHONENUMBER"]?.ToString() ?? "null",
                        //            PhoneNumberConfirmed = Convert.ToBoolean(reader["PHONENUMBERCONFIRMED"]),
                        //            TwoFactorEnabled = Convert.ToBoolean(reader["TWOFACTORENABLED"]),
                        //            LockoutEnd = reader["LOCKOUTEND"] != DBNull.Value ? Convert.ToDateTime(reader["LOCKOUTEND"]) : DateTime.Now.AddYears(-100),
                        //            LockoutEnabled = Convert.ToBoolean(reader["LOCKOUTENABLED"]),
                        //            AccessFailedCount = Convert.ToInt32(reader["ACCESSFAILEDCOUNT"])
                        //        };

                        //        return user;
                        //    }

                        //    IdentityUser userFail = new IdentityUser();
                        //    return userFail;
                        //}


                    }

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Errore durante il login dell'utente: {ex.Message}");
                //IdentityUser userFail = new IdentityUser();
                //return userFail;
            }
        }
    }
}
