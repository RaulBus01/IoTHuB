namespace IoTHubBackend.Interfaces
{
    public interface ISensorReadings
    {
        public string id { get; set; }
        public double Gas { get; set; }
        public double Co2 { get; set; }
        public double Tvoc { get; set; }
        public double Humidity { get; set; }
        public double Temperature { get; set; }
        public double Timestamp { get; set; }
    }
}
