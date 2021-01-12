using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace unipark.api.DTOs
{
    public class ReportCreateDTO
    {
        public string UserId { get; set; }
        public string UserEmail { get; set; }
        public string UserName { get; set; }
        public string IssueType { get; set; }
        public string Description { get; set; }
        public DateTime ReportingTime { get; set; }
        public bool isDone { get; set; }
    }
}
