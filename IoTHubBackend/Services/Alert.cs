namespace IoTHubBackend
{
    public class Alert
    {
        private string v;
        private object cO2;
        private double timestamp;

        public Alert(string v, object cO2, double timestamp)
        {
            this.v = v;
            this.cO2 = cO2;
            this.timestamp = timestamp;
        }
    }
}