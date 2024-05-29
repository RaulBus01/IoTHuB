using IoTHubBackend.Interfaces;

namespace IoTHubBackend.Services
{
    public class SensorReadings : ISensorReadings
    {
        public string id { get; set; }
        public double Gas { get; set; }
        public double Co2 { get; set; }
        public double Tvoc { get; set; }
        public double Humidity {get; set; }
        public double Temperature { get; set; }
        public double Timestamp { get; set; }

        public SensorReadings(double gas, double co2, double tvoc, double humidity, double temperature, double timestamp)
        {
            id = Guid.NewGuid().ToString();
            Gas = gas;
            Co2 = co2;
            Tvoc = tvoc;
            Humidity = humidity;
            Temperature = temperature;
            Timestamp = timestamp;
        }
    }
}
