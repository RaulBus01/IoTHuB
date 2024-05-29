using Azure.Messaging.EventHubs.Consumer;
using Azure.Messaging.ServiceBus;
using IoTHubBackend.Services;
using System.Text;

namespace IoTHubBackend
{
    public interface IIotHubService
    {
        public Task Setup();
    }
    public class IotHubService : BackgroundService, IIotHubService
    {
        private EventHubConsumerClient consumer = null;
        private IStorageService storageService;
        private readonly IDirectMethodService methodService;
        private readonly IConfigurationService configurationService;
        private readonly ILogger<IotHubService> logger;
        private ServiceBusClient serviceBusClient;
        private ServiceBusSender sender;
        public IotHubService(IStorageService storageService, IDirectMethodService methodService, IConfigurationService configurationService, ILogger<IotHubService> logger)
        {
            this.storageService = storageService;
            this.methodService = methodService;
            this.configurationService = configurationService;
            this.logger = logger;
        }

        public async Task Start()
        {
            if (consumer == null)
            {
                Setup();
            }
            var tasks = new List<Task>();
            var partitions = await consumer.GetPartitionIdsAsync();
            foreach (string partition in partitions)
            {
                tasks.Add(ReceiveMessagesFromDeviceAsync(partition));
            }
        }

        public async Task Setup()
        {
            try
            {
                await storageService.Setup();
                serviceBusClient = new ServiceBusClient(configurationService.serviceBusConnectionString);
                sender = serviceBusClient.CreateSender(configurationService.queueName);
                consumer = new EventHubConsumerClient(configurationService.consumerGroup, configurationService.eventHubCompatibleEndpoint);
            }
            catch (Exception e)
            {
                logger.LogError($"ERROR in {nameof(Setup)}: {e.Message}", e);
                throw;
            }
        }

        private async Task ReceiveMessagesFromDeviceAsync(string partitionId)
        {
            Console.WriteLine($"Starting listener thread for partition: {partitionId}");
            try
            {
                while (true)
                {
                    await foreach (PartitionEvent receivedEvent in consumer.ReadEventsFromPartitionAsync(partitionId, EventPosition.Latest))
                    {
                        string msgSource;
                        string body = Encoding.UTF8.GetString(receivedEvent.Data.Body.ToArray());
                        if (receivedEvent.Data.SystemProperties.ContainsKey("iothub-message-source"))
                        {
                            msgSource = receivedEvent.Data.SystemProperties["iothub-message-source"].ToString();
                            Console.WriteLine($"{partitionId} {msgSource} {body}");

                            await ProcessEvent(body);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                logger.LogError($"ERROR in {nameof(ReceiveMessagesFromDeviceAsync)}: {e.Message}", e);
                throw;
            }
        }
        public async Task ProcessEvent(string message)
        {
            try
            {
                var parsedValues = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, double>>(message);
                var reading = new SensorReadings(parsedValues["gas"], parsedValues["co2"], parsedValues["tvoc"], parsedValues["hum"], parsedValues["temp"], parsedValues["timestamp"]);
                if (reading.Co2 > configurationService.co2Threshold)
                {
                    logger.LogInformation($"CO2 Alert: {reading.Co2}");
                    await storageService.StoreAlert(new Alert("CO2", reading.Co2, reading.Timestamp));
                }
                if (reading.Gas > configurationService.gasThreshold)
                {
                    logger.LogInformation($"Gas Alert: {reading.Gas}");
                    await storageService.StoreAlert(new Alert("Gas", reading.Gas, reading.Timestamp));
                }
                if (reading.Tvoc > configurationService.tvocThreshold)
                {
                    logger.LogInformation($"TVOC Alert: {reading.Tvoc}");
                    await storageService.StoreAlert(new Alert("TVOC", reading.Tvoc, reading.Timestamp));
                }
                if (reading.Temperature > configurationService.tempThreshold)
                {
                    logger.LogInformation($"Temp Alert: {reading.Temperature}");
                    await storageService.StoreAlert(new Alert("Temp", reading.Temperature, reading.Timestamp));
                }
                if (reading.Humidity > configurationService.humThreshold)
                {
                    logger.LogInformation($"Hum Alert: {reading.Humidity}");
                    await storageService.StoreAlert(new Alert("Hum", reading.Humidity, reading.Timestamp));
                }

                ServiceBusMessage msg = new ServiceBusMessage(Encoding.UTF8.GetBytes(message));
                await sender.SendMessageAsync(msg);
            }
            catch (Exception e)
            {
                logger.LogError($"ERROR in {nameof(ProcessEvent)}: {e.Message}", e);
                throw;
            }
        }

        protected async override Task ExecuteAsync(CancellationToken stoppingToken)
        {   
            while (!configurationService.gotConfig)
            {
                await Task.Delay(1000);
            }
            Start();
        }
    }
}
