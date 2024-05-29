namespace IoTHubBackend.Services
{
    public class DeviceConfig
    {
        public string serviceClientConnectionString { get; set; }
        public string serviceBusConnectionString { get; set; }
        public string queueName { get; set; }
        public string eventHubCompatibleEndpoint { get; set; }
        public string eventHubName { get; set; }
        public string dbConnectionString { get; set; }
        public string dbName { get; set; }
        public string dbContainerName { get; set; }
        public string consumerGroup { get; set; }
        public bool gotConfig { get; set; }
    }
    public interface IConfigurationService
    {
        public void SetConfig(
            string serviceClientConnectionString,
            string serviceBusConnectionString,
            string queueName,
            string eventHubCompatibleEndpoint,
            string eventHubName,
            string dbConnectionString,
            string dbName,
            string dbContainerName,
            string consumerGroup);
        void SetCo2Threshold(double co2Threshold);
        void SetTvocThreshold(double threshold);
        void SetGasThreshold(double threshold);
        void SetHumThreshold(double threshold);
        void SetTempThreshold(double threshold);

        public string serviceClientConnectionString { get; set; }
        public string serviceBusConnectionString { get; set; }
        public string queueName { get; set; }
        public string eventHubCompatibleEndpoint { get; set; }
        public string eventHubName { get; set; }
        public string dbConnectionString { get; set; }
        public string dbName { get; set; }
        public string dbContainerName { get; set; }
        public string consumerGroup { get; set; }
        public bool gotConfig { get; set; }
        double co2Threshold { get; }
        double tempThreshold { get; }
        double humThreshold { get; }
        double gasThreshold { get; }
        double tvocThreshold { get; }
    }
    public class ConfigurationService : IConfigurationService
    {
        public string serviceClientConnectionString { get; set; }
        public string serviceBusConnectionString { get; set; }
        public string queueName { get; set; }
        public string eventHubCompatibleEndpoint { get; set; }
        public string eventHubName { get; set; }
        public string dbConnectionString { get; set; }
        public string dbName { get; set; }
        public string dbContainerName { get; set; }
        public string consumerGroup { get; set; }
        public bool gotConfig { get; set; }
        public double co2Threshold { get; private set; }
        public double tempThreshold { get; private set; }
        public double humThreshold { get; private set; }
        public double gasThreshold { get; private set; }
        public double tvocThreshold { get; private set; }

        public ConfigurationService()
        {
            gotConfig = false;
            co2Threshold = 500;
            tempThreshold = 30;
            humThreshold = 70;
            gasThreshold = 1000;
            tvocThreshold = 200;
        }

        public void SetConfig(
            string serviceClientConnectionString,
            string serviceBusConnectionString,
            string queueName,
            string eventHubCompatibleEndpoint,
            string eventHubName,
            string dbConnectionString,
            string dbName,
            string dbContainerName,
            string consumerGroup)
        {
            this.serviceClientConnectionString = serviceClientConnectionString;
            this.serviceBusConnectionString = serviceBusConnectionString;
            this.queueName = queueName;
            this.eventHubCompatibleEndpoint = eventHubCompatibleEndpoint;
            this.eventHubName = eventHubName;
            this.dbConnectionString = dbConnectionString;
            this.dbName = dbName;
            this.dbContainerName = dbContainerName;
            this.consumerGroup = consumerGroup;
            gotConfig = true;
        }

        public void SetCo2Threshold(double co2Threshold)
        {
            this.co2Threshold = co2Threshold;
        }

        public void SetTempThreshold(double threshold)
        {
            this.tempThreshold = threshold;
        }

        public void SetHumThreshold(double threshold)
        {
            this.humThreshold = threshold;
        }

        public void SetGasThreshold(double threshold)
        {
            this.gasThreshold = threshold;
        }

        public void SetTvocThreshold(double threshold)
        {
            this.tvocThreshold = threshold;
        }
    }
}
