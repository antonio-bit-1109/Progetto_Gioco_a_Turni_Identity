using Oracle.ManagedDataAccess.Client;
using Oracle.ManagedDataAccess.Types;
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
                        command.Parameters.Add("DATA_ORA_COMPLETAMENTO_p", OracleDbType.Date).Value = (data.oraComplet);
                        //command.Parameters.Add("DATA_ORA_COMPLETAMENTO_p", OracleDbType.Date).Value = DateTime.ParseExact(data.oraComplet, "dd-MM-yyyy", CultureInfo.InvariantCulture);


                        //inserisco parametro di output
                        var righeInserite = new OracleParameter("righeInserite", OracleDbType.Int32)
                        {
                            Direction = ParameterDirection.Output
                        };

                        command.Parameters.Add(righeInserite);
                        await command.ExecuteNonQueryAsync();

                        if (righeInserite.Value != DBNull.Value)
                        {


                            int RigheInserite = ((OracleDecimal)righeInserite.Value).ToInt32();

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
                        throw new Exception("nessuna riga inserita nel db.");

                    }

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Errore durante il salvataggio a db della partita vinta: {ex.Message}");
                return false;
            }
        }
    }
}
