using System.ComponentModel.DataAnnotations;

namespace Progetto_Gioco_a_Turni_Identity.Models
{
    public class dataVictoryMemoryDTO
    {
        [Required]
        public string tempoCompletamento { get; set; }

        [Required]
        public string oraComplet { get; set; }

        [Required]
        public string game { get; set; }
    }
}
