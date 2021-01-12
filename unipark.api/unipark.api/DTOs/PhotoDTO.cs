namespace unipark.api.DTOs
{
    public class PhotoDTO
    {
        public int Id { get; set; }
        public int ParkingLotId { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
    }
}
